'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useDebounce } from 'use-debounce';

interface SearchFormProps {
  initialQuery?: string;
}

export function SearchForm({ initialQuery = '' }: SearchFormProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(initialQuery);
  const [debouncedQuery] = useDebounce(query, 500);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    
    if (debouncedQuery) {
      params.set('q', debouncedQuery);
    } else {
      params.delete('q');
    }
    
    router.push(`/dashboard/search?${params.toString()}`);
  }, [debouncedQuery, router]);

  return (
    <div className="relative flex-1 max-w-lg">
      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        type="search"
        placeholder="Search memories, tags, or locations..."
        className="pl-10 pr-4 w-full border-amber-200 focus-visible:ring-amber-500"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
    </div>
  );
}
