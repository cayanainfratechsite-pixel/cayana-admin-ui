import Menu from "@/components/Menu";
import UserProfile from "@/components/UserProfile";
import Image from "next/image";
import Link from "next/link";

export default function DashboardLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="h-screen flex">
      {/* LEFT SIDEBAR */}
      <div className="w-[14%] md:w-[8%] lg:w-[16%] xl:w-[16%] p-4 bg-zinc-900 flex flex-col justify-between">

        <div>
        <Link
          href="/projects"
          className="flex items-center justify-center lg:justify-start gap-2"
        >
          <Image
            src="/images/CAYANA.png"
            alt="logo"
            width={1000}
            height={200}
          />
        </Link>
        <Menu />
        </div>
        <UserProfile />
      </div>
      {/* RIGHT CONTENT AREA */}
      <div className="w-[86%] md:w-[92%] lg:w-[84%] xl:w-[86%] bg-[#F7F8FA] overflow-scroll flex flex-col">
        {children}
      </div>
    </div>
  );
}
