"use client";

import { CheckboxWithLabel } from "@/components/inputs/CheckboxWithLabel";
import { InputWithLabel } from "@/components/inputs/InputWithLabel";
import { TextAreaWithLabel } from "@/components/inputs/TextAreaWithLabel";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { ContactType, schemaContact } from "@/zod-schemas/contact";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoaderCircle, Send } from "lucide-react";
import { useTransition } from "react";
import { useForm } from "react-hook-form";

const ContactForm = () => {
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();

  const form = useForm<ContactType>({
    resolver: zodResolver(schemaContact),
    mode: "onBlur",
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      message: "",
      agreed: true,
    },
  });

  const { handleSubmit, watch, reset } = form;

  const agreed = watch("agreed");

  const onSubmit = (data: ContactType) => {
    startTransition(async () => {
      try {
        console.log(data);
        await new Promise((res) => setTimeout(res, 3000));

        toast({
          title: "Message Sent 🎉",
          description: "We’ll get back to you within 24 hours.",
          className: "bg-green-100 text-green-700",
        });

        reset();
      } catch (error) {
        toast({
          title: "Error",
          description:
            error instanceof Error ? error.message : "Unknown error occurred",
          className: "bg-red-100 text-red-600",
        });
      }
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div className="grid grid-cols-2 gap-4">
          <InputWithLabel<ContactType>
            fieldTitle="First Name"
            nameInSchema="firstName"
            placeholder="Jane"
            autoComplete="off"
            className="h-10"
          />

          <InputWithLabel<ContactType>
            fieldTitle="Last Name"
            nameInSchema="lastName"
            placeholder="Doe"
            autoComplete="off"
            className="h-10"
          />
        </div>

        <InputWithLabel<ContactType>
          fieldTitle="Email"
          nameInSchema="email"
          type="email"
          placeholder="jane@email.com"
          autoComplete="off"
          className="h-10"
        />

        <TextAreaWithLabel<ContactType>
          fieldTitle="Message"
          nameInSchema="message"
          placeholder="Your message..."
        />

        <CheckboxWithLabel<ContactType>
          fieldTitle="I agree to privacy policy"
          nameInSchema="agreed"
        />

        <Button
          type="submit"
          disabled={!agreed || isPending}
          className="w-full h-10 flex gap-2 items-center justify-center"
        >
          {isPending ? (
            <LoaderCircle className="animate-spin" />
          ) : (
            <>
              Send Message <Send size={18} />
            </>
          )}
        </Button>
      </form>
    </Form>
  );
};

export default ContactForm;
