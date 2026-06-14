"use client";

import { Show, UserButton, SignInButton } from "@clerk/nextjs";
import Link from "next/link";

const Header = () => {
  const menuOptions = [
    { name: "Home", path: "/" },
    { name: "Dashboard", path: "/dashboard" },
    { name: "Trips", path: "/trips" },
    { name: "Create Trip", path: "/builder" },
  ];

  return (
    <nav className="bg-black">
      {/* Logo */}
      <div className="flex justify-between items-center w-full p-6 gap-4">
        <h2 className="text-white text-2xl">WanderAI</h2>
        <div className="flex gap-5 items-center">
          {menuOptions.map((menu, index) => (
            <h2 key={index}>
              <Link href={menu.path}>
                <h2 className="text-lg hover:scale-105 transition-all text-white">
                  {menu.name}
                </h2>
              </Link>
            </h2>
          ))}
        </div>
        <div className="flex items-center gap-4">
          {/* Get Started Button with Clerk */}
          <Show when="signed-out">
            <SignInButton mode="modal">
              <button className="bg-purple-700 text-white rounded-full font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 cursor-pointer">
                Get Started
              </button>
            </SignInButton>
          </Show>
          <Show when="signed-in">
            <UserButton />
          </Show>
        </div>
      </div>
    </nav>
  );
};

export default Header;
