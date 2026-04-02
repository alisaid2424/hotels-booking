"use client";

import { Path, useFormContext } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";

type Props<S> = {
  fieldTitle: string;
  nameInSchema?: Path<S>;
  disabled?: boolean;
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
};

export function CheckboxWithLabel<S>({
  fieldTitle,
  nameInSchema,
  disabled = false,
  checked,
  onCheckedChange,
}: Props<S>) {
  const form = useFormContext?.();

  if (!nameInSchema || !form) {
    return (
      <div className="flex items-center gap-3">
        <Checkbox
          id={fieldTitle}
          disabled={disabled}
          checked={checked ?? false}
          onCheckedChange={(value) => onCheckedChange?.(value === true)}
        />
        <label
          htmlFor={fieldTitle}
          className="text-sm cursor-pointer text-gray-700"
        >
          {fieldTitle}
        </label>
      </div>
    );
  }

  return (
    <FormField
      control={form.control}
      name={nameInSchema}
      render={({ field }) => (
        <FormItem>
          <div className="flex items-center gap-3">
            <FormControl>
              <Checkbox
                id={nameInSchema}
                disabled={disabled}
                checked={
                  typeof checked === "boolean"
                    ? checked
                    : (field.value ?? false)
                }
                onCheckedChange={(value) => {
                  const checkedValue = value === true;
                  field.onChange(checkedValue);
                  onCheckedChange?.(checkedValue);
                }}
              />
            </FormControl>

            <FormLabel
              htmlFor={nameInSchema}
              className="text-sm cursor-pointer text-gray-700"
            >
              {fieldTitle}
            </FormLabel>
          </div>
        </FormItem>
      )}
    />
  );
}
