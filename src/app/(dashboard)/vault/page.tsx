import { Card, CardContent } from "@/components/ui/card";
import { Share2 } from "lucide-react";

export default function VaultPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-3xl font-bold">Shared vault</h1>
        <p className="mt-1 text-muted-foreground">
          Memories shared with you by family and friends
        </p>
      </div>

      <Card className="border-border/50 border-dashed">
        <CardContent className="flex flex-col items-center justify-center py-16 text-center">
          <Share2 className="mb-3 h-12 w-12 text-muted-foreground/50" />
          <h3 className="font-serif text-lg font-medium text-muted-foreground">
            Coming soon
          </h3>
          <p className="mt-1 max-w-sm text-sm text-muted-foreground/70">
            Once you connect with family members, their shared memories will
            appear here. This feature is being built next.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
