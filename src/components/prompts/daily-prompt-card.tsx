'use client';

import { useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";

interface DailyPrompt {
  id: string;
  question_text: string;
  category: string;
}

export function DailyPromptCard({ prompt }: { prompt: DailyPrompt | null }) {
  const [response, setResponse] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  if (!prompt) {
    return (
      <Card className="w-full max-w-2xl mx-auto bg-amber-50/50 border-amber-100">
        <CardContent className="pt-6 text-center text-muted-foreground">
          No daily prompt available today. Check back tomorrow!
        </CardContent>
      </Card>
    );
  }

  const handleSubmit = async () => {
    if (!response.trim()) return;
    
    setIsSubmitting(true);
    const supabase = createClient();
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { error } = await supabase
        .from('prompt_responses')
        .insert({
          user_id: user.id,
          prompt_id: prompt.id,
          response_text: response,
        });

      if (error) throw error;

      toast.success("Response saved to your vault!");
      setResponse('');
      setIsExpanded(false);
    } catch (error) {
      console.error(error);
      toast.error("Failed to save response. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto transition-all duration-300 hover:shadow-md border-amber-200 bg-amber-50/30">
      <CardHeader>
        <div className="text-xs font-medium text-amber-600 uppercase tracking-wider mb-2">
          Daily Prompt • {prompt.category}
        </div>
        <CardTitle className="text-xl md:text-2xl font-serif text-slate-800 leading-tight">
          {prompt.question_text}
        </CardTitle>
      </CardHeader>
      
      <CardContent>
        {isExpanded ? (
          <div className="space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
            <Textarea 
              placeholder="Type your answer here..."
              className="min-h-[120px] bg-white/50 border-amber-200 focus-visible:ring-amber-500"
              value={response}
              onChange={(e) => setResponse(e.target.value)}
            />
          </div>
        ) : (
          <p className="text-muted-foreground italic text-sm">
            Take a moment to reflect and record this memory.
          </p>
        )}
      </CardContent>

      <CardFooter className="flex justify-end gap-2">
        {isExpanded ? (
          <>
            <Button 
              variant="ghost" 
              onClick={() => setIsExpanded(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleSubmit} 
              disabled={!response.trim() || isSubmitting}
              className="bg-amber-600 hover:bg-amber-700 text-white"
            >
              {isSubmitting ? 'Saving...' : 'Save to Vault'}
            </Button>
          </>
        ) : (
          <Button 
            onClick={() => setIsExpanded(true)}
            className="bg-amber-100 hover:bg-amber-200 text-amber-900 border border-amber-200"
            variant="outline"
          >
            Answer This
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
