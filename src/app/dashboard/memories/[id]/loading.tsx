import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export default function MemoryDetailLoading() {
  return (
    <div className="mx-auto max-w-2xl">
      <Skeleton className="mb-6 h-5 w-32" />

      <div className="mb-6">
        <Skeleton className="h-9 w-3/4" />
        <div className="mt-3 flex gap-3">
          <Skeleton className="h-5 w-32" />
          <Skeleton className="h-5 w-24" />
          <Skeleton className="h-5 w-16" />
        </div>
      </div>

      <Separator className="my-6" />

      <Card className="border-border/50">
        <CardContent className="space-y-3 pt-6">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
        </CardContent>
      </Card>
    </div>
  );
}
