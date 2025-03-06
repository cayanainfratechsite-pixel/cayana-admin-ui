"use client";
import React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import LogoutIcon from "@mui/icons-material/Logout";

const UserProfile: React.FC = () => {
  // Replace with dynamic user data in production
  const user = {
    name: "Surya Pratap Sahu",
    role: "Administrator",
    imageUrl: "/images/user.png",
  };

  const router = useRouter();

  const handleLogout = () => {
    Cookies.remove("access-token");
    router.push("/");
  };

  return (
    <div className="bg-gray-800 p-4 rounded-lg shadow-md flex flex-col items-center text-white w-full max-w-sm mx-auto">
      {/* <div className="flex items-center w-full">
        <div className="hidden xl:block xl:w-10 xl:h-10   rounded-full overflow-hidden">
          <Image
            src={user.imageUrl}
            alt="User Profile"
            width={48}
            height={48}
            className="object-cover"
          />
        </div>
        <div className="ml-3">
          <h2 className="hidden sm:text-sm lg:text-xs xl:text-sm lg:block font-medium text-zinc-100">
            {user.name}
          </h2>
          <p className="hidden sm:text-[10px] lg:text-xs lg:block text-zinc-300">{user.role}</p>
        </div>
      </div> */}
      <button
        onClick={handleLogout}
        className=" w-full py-2 lg:border border-red-500 text-red-500 rounded hover:bg-red-500 hover:text-white transition-colors duration-200 flex items-center justify-center gap-2 "
      >
        <LogoutIcon fontSize="small" />
        <span className="hidden  lg:block"> Logout</span>
      </button>
    </div>
  );
};

export default UserProfile;
