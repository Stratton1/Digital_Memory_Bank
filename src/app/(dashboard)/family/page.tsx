import { Card, CardContent } from "@/components/ui/card";
import { Users } from "lucide-react";

export default function FamilyPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-3xl font-bold">Family connections</h1>
        <p className="mt-1 text-muted-foreground">
          Connect with family members to share your memories
        </p>
      </div>

      <Card className="border-border/50 border-dashed">
        <CardContent className="flex flex-col items-center justify-center py-16 text-center">
          <Users className="mb-3 h-12 w-12 text-muted-foreground/50" />
          <h3 className="font-serif text-lg font-medium text-muted-foreground">
            Coming soon
          </h3>
          <p className="mt-1 max-w-sm text-sm text-muted-foreground/70">
            You&apos;ll be able to invite family members by email, manage
            connections, and choose which memories to share. This feature is
            being built next.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
