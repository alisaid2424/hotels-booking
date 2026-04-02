"use client";

import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { confirmDelete } from "@/lib/swal";
import { deleteRoom } from "@/server/actions/room";
import { Trash2 } from "lucide-react";

interface DeleteRoomButtonProps {
  roomId: string;
  onSuccess?: () => void;
  isBooked: boolean;
}
const DeleteRoomButton = ({
  roomId,
  onSuccess,
  isBooked,
}: DeleteRoomButtonProps) => {
  const { toast } = useToast();

  const handleDelete = async () => {
    try {
      const confirmed = await confirmDelete(
        "Delete Room?",
        "Are you sure you want to delete this room?",
      );

      if (!confirmed) return;

      const res = await deleteRoom(roomId);

      if (res.success) {
        toast({
          title: "Success! 🎉",
          description: res.message,
          className: "bg-green-100 text-green-600",
        });

        onSuccess?.();
      } else {
        toast({
          title: "Error",
          description: res.message,
          className: "bg-red-100 text-red-600",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Unknown error occurred",
        className: "bg-red-100 text-red-600",
      });
    }
  };

  return (
    <Button
      onClick={handleDelete}
      variant="destructive"
      size="icon"
      disabled={isBooked}
    >
      <Trash2 size={17} />
    </Button>
  );
};

export default DeleteRoomButton;
