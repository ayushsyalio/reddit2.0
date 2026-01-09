"use client";

import {
  useUser,
  SignedIn,
  SignedOut,
  SignInButton,
  UserButton,
} from "@clerk/nextjs";
import { Button } from "../ui/button";
import Image from "next/image";
import { ChevronLeftIcon, MenuIcon } from "lucide-react";
import { useSidebar } from "../ui/sidebar";
import CreatePost from "../post/CreatePost";

export default function Header() {
  const { user } = useUser();
  const { toggleSidebar, open, isMobile } = useSidebar();
  return (
    <header className="flex h-25 items-center justify-between p-4 border-b border-gray-200">
      {/* {left side} */}
      <div className="h-10 flex items-center">
        {open && !isMobile ? (
          <ChevronLeftIcon onClick={toggleSidebar} />
        ) : (
          <div className="flex items-center gap-2">
            <MenuIcon className="w-6 h-6" onClick={toggleSidebar} />
            <Image
              src="/images/readittextNlogo.png"
              alt="Logo"
              width={90}
              height={90}
              className="hidden md:block"
            />

            <Image
              src="/images/logo.png"
              alt="Logo text"
              width={40}
              height={40}
              className="block md:hidden"
            />
          </div>
        )}
      </div>

      {/* {right side} */}
      <div className="flex items-center gap-2">
        <CreatePost/>
        <SignedIn>
          <UserButton />
        </SignedIn>

        <SignedOut>
          <Button asChild variant="outline">
            <SignInButton mode="modal" />
          </Button>
        </SignedOut>
      </div>
    </header>
  );
}
