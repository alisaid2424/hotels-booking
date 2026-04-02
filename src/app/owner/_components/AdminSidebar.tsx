"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { LayoutDashboardIcon, Grid, HousePlus } from "lucide-react";
import { Routes } from "@/constants/enums";

const AdminSidebar = () => {
  const pathname = usePathname();

  const tabs = [
    { title: "Dashboard", href: Routes.OWNER, icon: LayoutDashboardIcon },
    { title: "Add Room", href: Routes.ADDROOM, icon: HousePlus },
    { title: "List Rooms", href: Routes.LISTROOMS, icon: Grid },
  ];

  const isActiveTab = (href: string) => {
    const hrefArray = href.split("/");
    return hrefArray.length > 2 ? pathname.startsWith(href) : pathname === href;
  };

  return (
    <div className="md:w-64 w-16 border-r min-h-screen text-base border-gray-300 pt-4 flex flex-col">
      {tabs.map(({ title, href, icon: Icon }) => {
        const isActive = isActiveTab(href);

        return (
          <Link
            href={href === Routes.ADDROOM ? href : `${href}?pageNumber=1`}
            key={title}
          >
            <div
              className={`flex items-center text-gray-700 py-3 px-4 md:px-8 gap-3 transition-all ${
                isActive
                  ? "border-r-4 md:border-r-[6px] bg-primary/15 text-primary border-primary/90"
                  : " hover:bg-primary/15 hover:text-primary"
              }`}
            >
              <Icon className="w-5 h-5" />
              <p className="md:block hidden">{title}</p>
            </div>
          </Link>
        );
      })}
    </div>
  );
};

export default AdminSidebar;
