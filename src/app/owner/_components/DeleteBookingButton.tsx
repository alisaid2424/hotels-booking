"use client";

import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { confirmDelete } from "@/lib/swal";
import { deleteBooking } from "@/server/actions/booking";
import { Trash2 } from "lucide-react";

interface Props {
  bookingId: string;
  onSuccess?: () => void;
}
const DeleteBookingButton = ({ bookingId, onSuccess }: Props) => {
  const { toast } = useToast();

  const handleDelete = async () => {
    try {
      const confirmed = await confirmDelete(
        "Delete Booking?",
        "Are you sure you want to delete this Booking?",
      );

      if (!confirmed) return;

      const res = await deleteBooking(bookingId);

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
      variant="destructive"
      size="icon"
      onClick={handleDelete}
      className="ms-3.5"
    >
      <Trash2 size={17} />
    </Button>
  );
};

export default DeleteBookingButton;
