'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";
import { PhotoUpload } from "@/components/memories/photo-upload";

interface UploadedPhoto {
  path: string;
  url: string;
}

interface MemoryFormProps {
  mode?: 'create' | 'edit';
  memoryId?: string;
  initialData?: {
    title: string;
    content: string;
    memory_date: string;
    location: string;
    is_private: boolean;
    tags?: string[];
    photos?: UploadedPhoto[];
  };
}

export function MemoryForm({ mode = 'create', memoryId, initialData }: MemoryFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: initialData?.title ?? '',
    content: initialData?.content ?? '',
    memory_date: initialData?.memory_date ?? new Date().toISOString().split('T')[0],
    location: initialData?.location ?? '',
    is_private: initialData?.is_private ?? true,
  });
  const [tags, setTags] = useState<string[]>(initialData?.tags ?? []);
  const [tagInput, setTagInput] = useState('');
  const [photos, setPhotos] = useState<UploadedPhoto[]>(initialData?.photos ?? []);

  const isEdit = mode === 'edit';

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePrivacyChange = (checked: boolean) => {
    setFormData(prev => ({ ...prev, is_private: checked }));
  };

  const addTag = useCallback(() => {
    const cleaned = tagInput.trim().toLowerCase().replace(/^#/, '');
    if (cleaned && !tags.includes(cleaned)) {
      setTags(prev => [...prev, cleaned]);
    }
    setTagInput('');
  }, [tagInput, tags]);

  const handleTagKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addTag();
    }
    if (e.key === 'Backspace' && !tagInput && tags.length > 0) {
      setTags(prev => prev.slice(0, -1));
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(prev => prev.filter(t => t !== tagToRemove));
  };

  async function getOrCreateTagId(supabase: ReturnType<typeof createClient>, tagName: string): Promise<string> {
    const { data: existing } = await supabase
      .from('tags')
      .select('id')
      .eq('name', tagName)
      .single();

    if (existing) return existing.id;

    const { data: created, error } = await supabase
      .from('tags')
      .insert({ name: tagName })
      .select('id')
      .single();

    if (error) throw error;
    return created!.id;
  }

  async function syncTags(supabase: ReturnType<typeof createClient>, targetMemoryId: string) {
    if (tags.length === 0 && !isEdit) return;

    if (isEdit) {
      await supabase.from('memory_tags').delete().eq('memory_id', targetMemoryId);
    }

    if (tags.length === 0) return;

    const tagIds = await Promise.all(
      tags.map(tagName => getOrCreateTagId(supabase, tagName))
    );

    const joinRows = tagIds.map(tagId => ({
      memory_id: targetMemoryId,
      tag_id: tagId,
    }));

    const { error } = await supabase.from('memory_tags').insert(joinRows);
    if (error) throw error;
  }

  async function syncPhotos(supabase: ReturnType<typeof createClient>, targetMemoryId: string) {
    if (photos.length === 0 && !isEdit) return;

    if (isEdit) {
      await supabase.from('memory_media').delete().eq('memory_id', targetMemoryId);
    }

    if (photos.length === 0) return;

    const mediaRows = photos.map((photo, index) => ({
      memory_id: targetMemoryId,
      storage_path: photo.path,
      file_type: 'image',
      mime_type: 'image/jpeg',
      file_size: 0,
      display_order: index,
    }));

    const { error } = await supabase.from('memory_media').insert(mediaRows);
    if (error) throw error;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) throw new Error("You must be logged in.");

      const payload = {
        title: formData.title,
        content: formData.content,
        memory_date: formData.memory_date,
        location: formData.location || null,
        is_private: formData.is_private,
      };

      if (isEdit && memoryId) {
        const { error } = await supabase
          .from('memories')
          .update(payload)
          .eq('id', memoryId)
          .eq('user_id', user.id);

        if (error) throw error;

        await syncTags(supabase, memoryId);
        await syncPhotos(supabase, memoryId);

        toast.success("Memory updated successfully!");
        router.push(`/dashboard/memories/${memoryId}`);
      } else {
        const { data: newMemory, error } = await supabase
          .from('memories')
          .insert({ ...payload, user_id: user.id })
          .select('id')
          .single();

        if (error) throw error;

        await syncTags(supabase, newMemory!.id);
        await syncPhotos(supabase, newMemory!.id);

        toast.success("Memory created successfully!");
        router.push('/dashboard/memories');
      }

      router.refresh();
    } catch (error) {
      console.error(error);
      toast.error(isEdit ? "Failed to update memory." : "Failed to create memory.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto border-amber-200 shadow-sm">
      <CardHeader>
        <CardTitle className="text-2xl font-serif text-slate-800">
          {isEdit ? 'Edit Memory' : 'New Memory'}
        </CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              name="title"
              placeholder="Give your memory a name"
              value={formData.title}
              onChange={handleChange}
              required
              className="border-amber-200 focus-visible:ring-amber-500"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="memory_date">Date of Memory</Label>
            <Input
              id="memory_date"
              name="memory_date"
              type="date"
              value={formData.memory_date}
              onChange={handleChange}
              className="border-amber-200 focus-visible:ring-amber-500 w-full sm:w-auto"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              name="location"
              placeholder="Where did this happen?"
              value={formData.location}
              onChange={handleChange}
              className="border-amber-200 focus-visible:ring-amber-500"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="content">Story</Label>
            <Textarea
              id="content"
              name="content"
              placeholder="What happened? How did it feel?"
              value={formData.content}
              onChange={handleChange}
              required
              className="min-h-[200px] border-amber-200 focus-visible:ring-amber-500 font-serif leading-relaxed"
            />
          </div>

          <div className="space-y-2">
            <Label>Photos</Label>
            <PhotoUpload
              memoryId={memoryId}
              photos={photos}
              onPhotosChange={setPhotos}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="tags">Tags</Label>
            <div className="flex flex-wrap items-center gap-2 rounded-md border border-amber-200 px-3 py-2 focus-within:ring-2 focus-within:ring-amber-500 focus-within:ring-offset-1">
              {tags.map(tag => (
                <Badge key={tag} variant="secondary" className="gap-1 pl-2">
                  #{tag}
                  <button
                    type="button"
                    onClick={() => removeTag(tag)}
                    className="ml-0.5 rounded-full p-0.5 hover:bg-muted-foreground/20"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
              <input
                id="tags"
                type="text"
                placeholder={tags.length === 0 ? "Add tags (press Enter or comma)" : ""}
                value={tagInput}
                onChange={e => setTagInput(e.target.value)}
                onKeyDown={handleTagKeyDown}
                onBlur={addTag}
                className="flex-1 min-w-[120px] border-0 bg-transparent p-1 text-sm outline-none placeholder:text-muted-foreground"
              />
            </div>
            <p className="text-xs text-muted-foreground">
              Separate tags with Enter or comma
            </p>
          </div>

          <div className="flex items-center space-x-2 pt-2">
            <Switch
              id="is_private"
              checked={formData.is_private}
              onCheckedChange={handlePrivacyChange}
            />
            <Label htmlFor="is_private" className="font-normal cursor-pointer">
              {formData.is_private ? 'Private (Only you can see this)' : 'Shared (Visible to family)'}
            </Label>
          </div>
        </CardContent>
        <CardFooter className="flex justify-end space-x-2">
          <Button
            variant="ghost"
            type="button"
            onClick={() => router.back()}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={loading}
            className="bg-amber-600 hover:bg-amber-700 text-white"
          >
            {loading
              ? (isEdit ? 'Saving...' : 'Creating...')
              : (isEdit ? 'Save Changes' : 'Create Memory')}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
