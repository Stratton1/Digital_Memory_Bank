"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";

export default function MemoriesError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex min-h-[50vh] items-center justify-center">
      <Card className="mx-auto max-w-md border-border/50">
        <CardContent className="flex flex-col items-center py-12 text-center">
          <AlertCircle className="mb-4 h-12 w-12 text-amber-500/70" />
          <h2 className="font-serif text-xl font-semibold">
            Couldn&apos;t load your memories
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Something went wrong while fetching your memories. Please try again.
          </p>
          <div className="mt-6 flex gap-3">
            <Button onClick={reset}>Try again</Button>
            <Link href="/dashboard">
              <Button variant="outline">Back to dashboard</Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
