"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Plane,
  Globe,
  SlidersHorizontal,
  Settings,
  User,
} from "lucide-react";

const navItems = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "My Trips",
    href: "/trips",
    icon: Plane,
  },
  {
    label: "Explore",
    href: "/explore",
    icon: Globe,
  },
  {
    label: "Settings",
    href: "/dashboard/settings",
    icon: Settings,
  },
  {
    label: "Profile",
    href: "/dashboard/profile",
    icon: User,
  },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="h-screen w-64 border-r bg-white p-4 flex flex-col">
      {/* Brand */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-black">WanderAI 🌍</h1>
        <p className="text-xs text-gray-500">Your AI Travel Operator</p>
      </div>

      {/* Nav */}
      <nav className="flex flex-col gap-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-all
                ${
                  isActive
                    ? "bg-black text-white"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
            >
              <Icon size={18} />
              <span className="text-sm font-medium">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Footer (future user section) */}
      <div className="mt-auto pt-6 border-t">
        <p className="text-xs text-gray-400">Phase 1: User System Active</p>
      </div>
    </aside>
  );
}
