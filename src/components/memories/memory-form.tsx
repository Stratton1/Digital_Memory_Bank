'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";

export function MemoryForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    memory_date: new Date().toISOString().split('T')[0],
    is_private: true,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePrivacyChange = (checked: boolean) => {
    setFormData(prev => ({ ...prev, is_private: checked }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) throw new Error("You must be logged in to create a memory.");

      const { error } = await supabase
        .from('memories')
        .insert({
          user_id: user.id,
          title: formData.title,
          content: formData.content,
          memory_date: formData.memory_date,
          is_private: formData.is_private,
        });

      if (error) throw error;

      toast.success("Memory created successfully!");
      router.push('/dashboard/memories');
      router.refresh();
    } catch (error) {
      console.error(error);
      toast.error("Failed to create memory. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto border-amber-200 shadow-sm">
      <CardHeader>
        <CardTitle className="text-2xl font-serif text-slate-800">New Memory</CardTitle>
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
            {loading ? 'Creating...' : 'Create Memory'}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
