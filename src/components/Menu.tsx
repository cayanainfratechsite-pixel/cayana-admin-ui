"use client";

import Link from "next/link";
import React, { useState } from "react";
import Image from "next/image";
import { usePathname } from "next/navigation";

const role = "ADMIN";
const menuItems = [
  {
    title: "MENU",
    items: [
      {
        icon: "/images/icons/Projects.png",
        label: "Projects",
        href: "/projects",
        visible: ["ADMIN"],
      },
      {
        icon: "/images/icons/Blogs.png",
        label: "Blog",
        href: "/blogs",
        visible: ["ADMIN"],
      },

      {
        icon: "/images/icons/ContactUs.png",
        label: "Job Posts",
        href: "/jobPosts",
        visible: ["ADMIN"],
      },
      {
        icon: "/images/icons/Applications.png",
        label: "Applications",
        href: "/applications",
        visible: ["ADMIN"],
      },
      {
        icon: "/images/icons/Gallery.png",
        label: "Gallery",
        href: "/gallery",
        visible: ["ADMIN"],
      },
      {
        icon: "/images/icons/ProjectEnquiry.png",
        label: "Project Enquiry",
        href: "/projectEnquiry",
        visible: ["ADMIN"],
      },
      {
        icon: "/images/icons/ContactUs.png",
        label: "Contact",
        href: "/contact",
        visible: ["ADMIN"],
      },
    ],
  },
];

const Menu = () => {
  const pathname = usePathname();

  const isActive = (href: string) => {
    return pathname.startsWith(href) ? "bg-lamaSkyLight text-zinc-900" : "";
  };

  return (
    <div className="mt-4 text-sm">
      {menuItems.map((section) => (
        <div className="flex flex-col gap-3 mt-10" key={section.title}>
          {section.items.map((item) => {
            if (item.visible.includes(role)) {
              return (
                <Link
                  href={item.href}
                  key={item.label}
                  className={`group flex items-center justify-center lg:justify-start gap-4 text-zinc-100 font-bold py-2 md:px-2 rounded-md hover:bg-lamaSkyLight ${isActive(
                    item.href
                  )} hover:text-black`}
                >
                   <Image
                    src={item.icon}
                    alt="Icons By CAYANA"
                    width={20}
                    height={20}
                    className={`transition-colors duration-300 filter invert group-hover:filter-none ${isActive(
                      item.href
                    ) && "invert-0"}`}
                  /> 
                  <span className="hidden lg:block hover:text-black">
                    {item.label}
                  </span>
                </Link>
              );
            }
          })}
        </div>
      ))}
    </div>
  );
};

export default Menu;

