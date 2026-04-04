"use client";

import { Button } from "@/components/ui/button";
import Image from "next/image";
import { Path, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  CreateRoomSchema,
  UpdateRoomSchema,
  UpdateRoomType,
} from "@/zod-schemas/room";
import { InputWithLabel } from "@/components/inputs/InputWithLabel";
import { Form } from "@/components/ui/form";
import { SelectWithLabel } from "@/components/inputs/SelectWithLabel";
import { CheckboxWithLabel } from "@/components/inputs/CheckboxWithLabel";
import { LoaderCircle } from "lucide-react";
import { useTransition } from "react";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { Routes } from "@/constants/enums";
import { roomAction } from "@/server/actions/room";
import { Room } from "@prisma/client";
import { z } from "zod";

const RoomForm = ({ room }: { room?: Room }) => {
  const router = useRouter();
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();

  const isUpdate = Boolean(room);

  const schema = isUpdate
    ? UpdateRoomSchema
    : (CreateRoomSchema as unknown as typeof UpdateRoomSchema);

  type SchemaType = z.infer<typeof schema>;

  const roomTypes = [
    { id: "Single Bed", name: "Single Bed" },
    { id: "Double Bed", name: "Double Bed" },
    { id: "Luxury Room", name: "Luxury Room" },
    { id: "Family Suite", name: "Family Suite" },
  ];

  const defaultValues: Partial<UpdateRoomType> = {
    id: room?.id,
    images: room
      ? [...room.images, null, null, null, null].slice(0, 4)
      : [null, null, null, null],
    roomType: room?.roomType ?? "",
    pricePerNight: room?.pricePerNight ?? 0,
    rate: room?.rate ?? 1,
    amenities: {
      "Free WiFi": room?.amenities?.includes("Free WiFi") ?? false,
      "Free Breakfast": room?.amenities?.includes("Free Breakfast") ?? false,
      "Room Service": room?.amenities?.includes("Room Service") ?? false,
      "Mountain View": room?.amenities?.includes("Mountain View") ?? false,
      "Pool Access": room?.amenities?.includes("Pool Access") ?? false,
    },
  };

  const form = useForm<SchemaType>({
    resolver: zodResolver(schema),
    mode: "onBlur",
    defaultValues,
  });

  const {
    watch,
    setValue,
    formState: { errors },
    setError,
    handleSubmit,
  } = form;

  const images = watch("images");
  const amenities = watch("amenities");

  const submitForm = (data: SchemaType) => {
    startTransition(async () => {
      try {
        const res = await roomAction(data, isUpdate ? "update" : "create");

        if (res.status === 200 || res.status === 201) {
          toast({
            title: "Success! 🎉",
            description: res.message,
            className: "bg-green-100 text-green-600",
          });

          router.push(`${Routes.LISTROOMS}?pageNumber=1`);
          scrollTo(0, 0);
        } else if (res.status === 400 && res.error) {
          Object.entries(res.error).forEach(([field, message]) => {
            setError(field as keyof SchemaType, {
              type: "server",
              message,
            });
          });

          toast({
            title: "Form Errors",
            description: "Please fix the highlighted fields.",
            className: "bg-red-100 text-red-600",
          });
        } else {
          toast({
            title: "Error",
            description: res.message,
            className: "bg-red-100 text-red-600",
          });
        }
      } catch {
        toast({
          title: "Error",
          description: "Unexpected error occurred",
          className: "bg-red-100 text-red-600",
        });
      }
    });
  };

  return (
    <Form {...form}>
      <form
        onSubmit={handleSubmit(submitForm)}
        className="flex flex-col gap-5 mt-5 pb-10"
      >
        <p className="font-medium">Images</p>

        <div className="grid grid-cols-2 sm:flex flex-wrap gap-4">
          {images.map((img, index) => (
            <label key={index}>
              <Image
                src={
                  img instanceof File
                    ? URL.createObjectURL(img)
                    : (img ?? "/uploadArea.svg")
                }
                alt={`roomImage-${index + 1}`}
                width={300}
                height={300}
                className="sm:max-w-32 h-20 object-cover cursor-pointer"
              />

              <input
                type="file"
                accept="image/*"
                hidden
                onChange={(e) =>
                  setValue(
                    `images.${index}` as Path<SchemaType>,
                    e.target.files?.[0] ?? null,
                  )
                }
              />
            </label>
          ))}
        </div>

        {errors.images && (
          <p className="text-red-500 text-sm">{errors.images.message}</p>
        )}

        <div className="flex max-sm:flex-col sm:items-center gap-4 mt-4">
          <div className="sm:max-w-48 w-full">
            <SelectWithLabel<SchemaType>
              fieldTitle="Room Type"
              nameInSchema="roomType"
              data={roomTypes}
            />
          </div>

          <div className="sm:max-w-40 w-full">
            <InputWithLabel<SchemaType>
              fieldTitle="Price / Night"
              nameInSchema="pricePerNight"
              type="number"
              placeholder="0"
              min={0}
              showCurrency
            />
          </div>

          <div className="sm:max-w-32 w-full">
            <InputWithLabel<SchemaType>
              fieldTitle="Rating"
              nameInSchema="rate"
              type="number"
              placeholder="1-5"
              min={1}
              max={5}
            />
          </div>
        </div>

        <p className="mt-4 font-medium">Amenities</p>

        <div className="flex flex-col gap-2 max-w-sm">
          {(Object.keys(amenities) as (keyof typeof amenities)[]).map(
            (amenity) => (
              <CheckboxWithLabel<SchemaType>
                key={amenity}
                fieldTitle={amenity}
                nameInSchema={`amenities.${amenity}` as Path<SchemaType>}
              />
            ),
          )}
        </div>

        {errors.amenities && (
          <p className="text-red-500 text-sm">{errors.amenities.message}</p>
        )}

        <Button
          size="lg"
          disabled={isPending}
          type="submit"
          className="mt-8 w-fit"
        >
          {isPending ? (
            <>
              {isUpdate ? "Updating..." : "Adding..."}
              <LoaderCircle className="ml-2 animate-spin" size={18} />
            </>
          ) : isUpdate ? (
            "Update Room"
          ) : (
            "Add Room"
          )}
        </Button>
      </form>
    </Form>
  );
};

export default RoomForm;
