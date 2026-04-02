import { BackButton } from "@/components/BackButton";
import { Routes } from "@/constants/enums";
import Image from "next/image";
import Link from "next/link";

const AdminNavbar = () => {
  return (
    <div className="flex items-center justify-between py-3 px-4 md:px-8 border-b border-gray-300 bg-white transition-all duration-300">
      <Link href={Routes.ROOT}>
        <Image
          src="/logo.svg"
          alt="logo"
          width={150}
          height={150}
          className="h-9 invert opacity-80"
          priority
        />
      </Link>

      <BackButton
        href={Routes.ROOT}
        title="Go Back"
        variant="default"
        className="rounded-full"
      />
    </div>
  );
};

export default AdminNavbar;
