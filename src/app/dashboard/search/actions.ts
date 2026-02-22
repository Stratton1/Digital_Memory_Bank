'use server';

import { createClient } from "@/lib/supabase/server";

export async function searchMemories(query: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return [];

  const trimmedQuery = query.trim();
  if (!trimmedQuery) return [];

  // 1. Search by text (title, content, location)
  const { data: textMatches } = await supabase
    .from("memories")
    .select(`
      id,
      title,
      content,
      memory_date,
      location,
      created_at,
      memory_tags (
        tags (
          id,
          name
        )
      )
    `)
    .eq("user_id", user.id)
    .or(`title.ilike.%${trimmedQuery}%,content.ilike.%${trimmedQuery}%,location.ilike.%${trimmedQuery}%`)
    .order("created_at", { ascending: false })
    .limit(50);

  // 2. Search by tag name
  const { data: tagMatches } = await supabase
    .from("tags")
    .select("id")
    .ilike("name", `%${trimmedQuery}%`);

  let tagMemoryIds: string[] = [];
  if (tagMatches && tagMatches.length > 0) {
    const tagIds = tagMatches.map((t) => t.id);
    const { data: tagged } = await supabase
      .from("memory_tags")
      .select("memory_id")
      .in("tag_id", tagIds);
    
    if (tagged) {
      tagMemoryIds = tagged.map(t => t.memory_id);
    }
  }

  // 3. Fetch memories for tag matches (if not already in textMatches)
  let tagMemories: any[] = [];
  if (tagMemoryIds.length > 0) {
    const existingIds = new Set((textMatches || []).map(m => m.id));
    const newIds = tagMemoryIds.filter(id => !existingIds.has(id));

    if (newIds.length > 0) {
      const { data } = await supabase
        .from("memories")
        .select(`
          id,
          title,
          content,
          memory_date,
          location,
          created_at,
          memory_tags (
            tags (
              id,
              name
            )
          )
        `)
        .eq("user_id", user.id)
        .in("id", newIds)
        .order("created_at", { ascending: false });
      
      tagMemories = data || [];
    }
  }

  return [...(textMatches || []), ...tagMemories];
}
