"use client";

import { Pages, Routes } from "@/constants/enums";
import { MenuIcon, Search, TicketPlus, XIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { usePathname, useRouter } from "next/navigation";
import { useClerk, UserButton, useUser } from "@clerk/nextjs";
import { UserRole } from "@prisma/client";
import HotelReg from "./HotelReg";

const Navbar = () => {
  const router = useRouter();
  const pathName = usePathname();
  const { openSignIn } = useClerk();
  const { user } = useUser();

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Hotels", path: Pages.ROOMS },
    { name: "Contact", path: Pages.CONTACT },
    { name: "About", path: Pages.ABOUT },
  ];

  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showHotelReg, setShowHotelReg] = useState(false);
  const isOwner = user?.publicMetadata.role === UserRole.HOTELOWNER;

  const NavLinks = ({
    isScrolled,
    onClick,
  }: {
    isScrolled: boolean;
    onClick?: () => void;
  }) =>
    navLinks.map((link) => (
      <Link
        key={link.path}
        href={link.path}
        onClick={onClick}
        className={`group flex flex-col gap-0.5 ${
          isScrolled ? "text-gray-700" : "text-white"
        }`}
      >
        {link.name}
        <div
          className={`${
            isScrolled ? "bg-gray-700" : "bg-white"
          } h-0.5 w-0 group-hover:w-full transition-all duration-300`}
        />
      </Link>
    ));

  const handleHotelAction = () => {
    if (isOwner) {
      router.push(`${Routes.OWNER}?pageNumber=1`);
    } else {
      setShowHotelReg(true);
    }
  };

  const HotelActionButton = ({ onClick }: { onClick?: () => void }) => {
    if (!user) return null;

    return (
      <Button
        variant="outline"
        onClick={onClick || handleHotelAction}
        className="text-sm font-light rounded-full"
      >
        {isOwner ? "Dashboard" : "List Your Hotel"}
      </Button>
    );
  };

  const UserMenu = () => (
    <UserButton>
      <UserButton.MenuItems>
        <UserButton.Action
          label="My Bookings"
          labelIcon={<TicketPlus className="w-4 h-4 text-gray-600" />}
          onClick={() => router.push(Pages.MYBOOKINGS)}
        />
      </UserButton.MenuItems>
    </UserButton>
  );

  const LoginButton = ({ onClick }: { onClick?: () => void }) => (
    <Button
      onClick={onClick || (() => openSignIn())}
      className="px-6 rounded-full"
    >
      Login
    </Button>
  );

  useEffect(() => {
    if (pathName !== Routes.ROOT) {
      setIsScrolled(true);
      return;
    }

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, [pathName]);

  return (
    !pathName.startsWith(Routes.OWNER) && (
      <>
        <nav
          className={`fixed top-0 left-0 w-full h-16 flex items-center justify-between padding-x transition-all duration-500 z-50 ${
            isScrolled
              ? "bg-white/80 shadow-md text-gray-700 backdrop-blur-lg py-3 md:py-4"
              : "py-4 md:py-6"
          }`}
        >
          {/* Logo */}
          <Link href={Routes.ROOT}>
            <Image
              src="/logo.svg"
              alt="logo"
              width={150}
              height={150}
              className={`h-9 ${isScrolled && "invert opacity-80"}`}
              priority
            />
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-4 lg:gap-8">
            <NavLinks isScrolled={isScrolled} />

            <HotelActionButton />
          </div>

          {/* Desktop Right */}
          <div className="hidden md:flex items-center gap-10">
            <Search
              className={`h-7 ${
                isScrolled ? "text-black" : "text-white"
              } transition-all duration-300`}
            />

            {user ? <UserMenu /> : <LoginButton />}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center gap-3 md:hidden">
            {user && <UserMenu />}

            <MenuIcon
              onClick={() => setIsMenuOpen((prev) => !prev)}
              className={`!w-8 !h-8 cursor-pointer ${
                isScrolled ? "text-black" : "text-white"
              }`}
            />
          </div>

          {/* Mobile Menu */}
          <div
            className={`fixed top-0 left-0 w-full h-screen bg-white text-base flex flex-col md:hidden items-center justify-center gap-6 font-medium text-gray-800 transition-all duration-500 ${
              isMenuOpen ? "translate-x-0" : "-translate-x-full"
            }`}
          >
            <Button
              variant="outline"
              className="absolute top-4 right-4"
              onClick={() => setIsMenuOpen(false)}
            >
              <XIcon className="h-6" />
            </Button>

            <NavLinks isScrolled={true} onClick={() => setIsMenuOpen(false)} />

            <HotelActionButton
              onClick={() => {
                handleHotelAction();
                setIsMenuOpen(false);
              }}
            />

            {!user && (
              <LoginButton
                onClick={() => {
                  openSignIn();
                  setIsMenuOpen(false);
                }}
              />
            )}
          </div>
        </nav>
        {showHotelReg && <HotelReg setShowHotelReg={setShowHotelReg} />}
      </>
    )
  );
};

export default Navbar;
