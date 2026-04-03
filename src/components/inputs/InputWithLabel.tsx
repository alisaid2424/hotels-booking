"use client";

import { useFormContext } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { Input } from "@/components/ui/input";
import { InputHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type Props<S> = {
  fieldTitle: string;
  nameInSchema: keyof S & string;
  className?: string;
  showCurrency?: boolean;
} & InputHTMLAttributes<HTMLInputElement>;

export function InputWithLabel<S>({
  fieldTitle,
  nameInSchema,
  className,
  showCurrency,
  ...props
}: Props<S>) {
  const form = useFormContext();

  return (
    <FormField
      control={form.control}
      name={nameInSchema}
      render={({ field }) => (
        <FormItem>
          <FormLabel className="text-base" htmlFor={nameInSchema}>
            {fieldTitle}
          </FormLabel>

          <FormControl>
            <div className="relative w-full">
              {showCurrency && props.type === "number" && (
                <span className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                  $
                </span>
              )}

              <Input
                id={nameInSchema}
                className={cn(
                  showCurrency && props.type === "number" && "ps-8",
                  className,
                )}
                {...props}
                value={field.value ?? ""}
                onChange={(e) => {
                  const inputValue = e.target.value;

                  const value =
                    props.type === "number" && inputValue !== ""
                      ? Number(inputValue)
                      : inputValue;

                  field.onChange(value);
                }}
              />
            </div>
          </FormControl>

          <FormMessage />
        </FormItem>
      )}
    />
  );
}
