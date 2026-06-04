import { useRef } from "react";
import { Camera } from "lucide-react";

import { ActionButton } from "@/components/shared/ActionButton";
import { UserAvatar } from "@/components/shared/avatar/UserAvatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function ProfilePicCard() {
  const fileInputRef = useRef<HTMLInputElement>(null);

  return (
    <Card className="rounded-xl border bg-card shadow-sm">
      <CardHeader>
        <CardTitle>Profile Picture</CardTitle>
      </CardHeader>
      <CardContent className="flex items-center gap-6">
        <UserAvatar name="John Doe" className="size-20 text-2xl" />
        <div>
          <ActionButton
            type="button"
            variant="outline"
            startIcon={<Camera className="size-4" />}
            onClick={() => fileInputRef.current?.click()}
          >
            Upload New Photo
          </ActionButton>
          <p className="mt-2 text-xs text-muted-foreground">
            JPG, PNG or GIF. Max size 2MB.
          </p>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/gif"
            className="hidden"
          />
        </div>
      </CardContent>
    </Card>
  );
}
