"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex min-h-[50vh] items-center justify-center">
      <Card className="mx-auto max-w-md border-border/50">
        <CardContent className="flex flex-col items-center py-12 text-center">
          <AlertCircle className="mb-4 h-12 w-12 text-red-500/70" />
          <h2 className="font-serif text-xl font-semibold">
            Something went wrong
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            {error.message || "An unexpected error occurred. Please try again."}
          </p>
          <Button onClick={reset} className="mt-6">
            Try again
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
