"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTransition } from "react";
import { LoaderCircle, XIcon } from "lucide-react";
import Image from "next/image";
import { Button } from "./ui/button";
import { HotelRegType, schemaHotelReg } from "@/zod-schemas/hotel";
import { Form } from "./ui/form";
import { InputWithLabel } from "./inputs/InputWithLabel";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { useUser } from "@clerk/nextjs";
import { Routes } from "@/constants/enums";
import { hotelAction } from "@/server/actions/hotel";

const HotelReg = ({
  setShowHotelReg,
}: {
  setShowHotelReg: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const router = useRouter();
  const { toast } = useToast();
  const { user } = useUser();
  const [isPending, startTransition] = useTransition();

  const form = useForm<HotelRegType>({
    mode: "onBlur",
    resolver: zodResolver(schemaHotelReg),
    defaultValues: {
      name: "",
      phone: "",
      address: "",
      city: "",
    },
  });

  const { handleSubmit } = form;

  const submitForm = (data: HotelRegType) => {
    startTransition(async () => {
      const res = await hotelAction(data, user?.id as string);

      if (res.status === 201) {
        toast({
          title: "Success! 🎉",
          description: res.message,
          className: "bg-green-100 text-green-600",
        });

        setShowHotelReg(false);
        router.push(`${Routes.OWNER}?pageNumber=1`);
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
    <div
      onClick={() => setShowHotelReg(false)}
      className="fixed inset-0 z-50 element-center bg-black/70"
    >
      <Form {...form}>
        <form
          onSubmit={handleSubmit(submitForm)}
          onClick={(e) => e.stopPropagation()}
          className="flex bg-white rounded-xl w-[90%] md:w-full max-w-3xl max-md:mx-2"
        >
          <Image
            src="/regImage.png"
            alt="reg-image"
            width={500}
            height={700}
            className="w-1/2 rounded-xl hidden md:block"
            priority
          />

          <div className="relative flex flex-col items-center w-full md:w-1/2 p-8 md:p-10">
            <XIcon
              onClick={() => setShowHotelReg(false)}
              className="absolute top-4 right-4 h-5 w-5 cursor-pointer hover:text-primary hover:scale-105 hover:rotate-180 transition-all duration-300"
            />
            <p className="text-2xl font-semibold mt-6">Register Your Hotel</p>

            {/* Hotel Name */}
            <div className="w-full mt-4">
              <InputWithLabel<HotelRegType>
                fieldTitle="Hotel Name"
                nameInSchema="name"
                placeholder="Enter Name"
                autoComplete="off"
              />
            </div>

            {/* Phone */}
            <div className="w-full mt-4">
              <InputWithLabel<HotelRegType>
                fieldTitle="Phone"
                nameInSchema="phone"
                placeholder="Enter Phone"
                autoComplete="off"
              />
            </div>

            {/* Address */}
            <div className="w-full mt-4">
              <InputWithLabel<HotelRegType>
                fieldTitle="Address"
                nameInSchema="address"
                placeholder="Enter Address"
                autoComplete="off"
              />
            </div>

            {/* City */}
            <div className="w-full mt-4">
              <InputWithLabel<HotelRegType>
                fieldTitle="City"
                nameInSchema="city"
                placeholder="Enter City"
              />
            </div>

            <Button
              type="submit"
              title="Save"
              disabled={isPending}
              className="me-auto mt-6"
            >
              {isPending ? (
                <LoaderCircle className="animate-spin" />
              ) : (
                "Register"
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default HotelReg;
