"use client";

import { useTransition } from "react";
import { Switch } from "@/components/ui/switch";
import { toggleRoomAvailabilityAction } from "@/server/actions/room";
import { useToast } from "@/hooks/use-toast";

type Props = {
  checked: boolean;
  roomId: string;
  isBooked: boolean;
};

const RoomAvailabilitySwitch = ({ checked, roomId, isBooked }: Props) => {
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();

  const handleToggle = () => {
    if (!roomId) return;

    startTransition(async () => {
      const res = await toggleRoomAvailabilityAction(roomId);

      if (res.status === 200) {
        toast({
          title: "Success! 🎉",
          description: res.message,
          className: "bg-green-100 text-green-600",
        });
      } else {
        toast({
          title: "Error",
          description: res.message,
          className: "bg-red-100 text-red-600",
        });
      }
    });
  };

  return (
    <Switch
      checked={checked}
      disabled={isPending || isBooked}
      onCheckedChange={handleToggle}
    />
  );
};

export default RoomAvailabilitySwitch;
