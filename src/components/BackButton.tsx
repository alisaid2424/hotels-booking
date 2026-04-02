"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ButtonHTMLAttributes } from "react";

type Props = {
  title: string;
  className?: string;
  variant?:
    | "default"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost"
    | "link"
    | null
    | undefined;
  href?: string;
} & ButtonHTMLAttributes<HTMLButtonElement>;

export function BackButton({
  title,
  variant,
  className,
  href,
  ...props
}: Props) {
  const router = useRouter();
  const handleClick = () => {
    if (href) {
      router.push(href);
    } else {
      router.back();
    }
  };
  return (
    <Button
      variant={variant}
      className={className}
      onClick={handleClick}
      title={title}
      {...props}
    >
      {title}
    </Button>
  );
}
