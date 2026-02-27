"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ImagePlus, X, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";

interface UploadedPhoto {
  path: string;
  url: string;
}

interface PhotoUploadProps {
  memoryId?: string;
  photos: UploadedPhoto[];
  onPhotosChange: (photos: UploadedPhoto[]) => void;
}

export function PhotoUpload({ photos, onPhotosChange }: PhotoUploadProps) {
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  async function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      toast.error("You must be logged in to upload photos.");
      setUploading(false);
      return;
    }

    const newPhotos: UploadedPhoto[] = [];

    for (const file of Array.from(files)) {
      if (!file.type.startsWith("image/")) {
        toast.error(`${file.name} is not an image.`);
        continue;
      }

      // Compress if over 1MB
      let uploadFile: File | Blob = file;
      if (file.size > 1024 * 1024) {
        uploadFile = await compressImage(file);
      }

      const ext = file.name.split(".").pop() ?? "jpg";
      const path = `${user.id}/${crypto.randomUUID()}.${ext}`;

      const { error } = await supabase.storage
        .from("memory-photos")
        .upload(path, uploadFile, {
          contentType: file.type,
          upsert: false,
        });

      if (error) {
        console.error("Upload error:", error);
        toast.error(`Failed to upload ${file.name}.`);
        continue;
      }

      const {
        data: { publicUrl },
      } = supabase.storage.from("memory-photos").getPublicUrl(path);

      newPhotos.push({ path, url: publicUrl });
    }

    onPhotosChange([...photos, ...newPhotos]);
    setUploading(false);

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }

  async function handleRemove(index: number) {
    const photo = photos[index];
    const supabase = createClient();

    await supabase.storage.from("memory-photos").remove([photo.path]);

    const updated = photos.filter((_, i) => i !== index);
    onPhotosChange(updated);
  }

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
        {photos.map((photo, i) => (
          <div
            key={photo.path}
            className="relative aspect-square overflow-hidden rounded-lg border border-amber-200"
          >
            <Image
              src={photo.url}
              alt={`Upload ${i + 1}`}
              fill
              className="object-cover"
              sizes="(max-width: 640px) 33vw, 25vw"
            />
            <button
              type="button"
              onClick={() => handleRemove(i)}
              className="absolute right-1 top-1 rounded-full bg-black/60 p-1 text-white hover:bg-black/80"
            >
              <X className="h-3 w-3" />
            </button>
          </div>
        ))}

        {/* Upload button */}
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          className="flex aspect-square flex-col items-center justify-center gap-1 rounded-lg border-2 border-dashed border-amber-200 text-muted-foreground transition-colors hover:border-amber-400 hover:text-amber-600 disabled:opacity-50"
        >
          {uploading ? (
            <Loader2 className="h-6 w-6 animate-spin" />
          ) : (
            <>
              <ImagePlus className="h-6 w-6" />
              <span className="text-xs">Add photo</span>
            </>
          )}
        </button>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        onChange={handleFileSelect}
        className="hidden"
      />
    </div>
  );
}

/**
 * Compresses an image to max 2000px wide and ~0.8 quality JPEG.
 */
function compressImage(file: File): Promise<Blob> {
  return new Promise((resolve) => {
    const img = document.createElement("img");
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d")!;

    img.onload = () => {
      const maxWidth = 2000;
      let { width, height } = img;

      if (width > maxWidth) {
        height = (height * maxWidth) / width;
        width = maxWidth;
      }

      canvas.width = width;
      canvas.height = height;
      ctx.drawImage(img, 0, 0, width, height);

      canvas.toBlob(
        (blob) => resolve(blob ?? file),
        "image/jpeg",
        0.8
      );
    };

    img.src = URL.createObjectURL(file);
  });
}
