'use client';

import { CursorArrowRippleIcon } from "@heroicons/react/24/outline";
import {
  BookmarkSquareIcon,
  ChartBarIcon,
  HomeIcon,
  PercentBadgeIcon,
  ShoppingBagIcon,
  UserIcon,
} from "@heroicons/react/24/solid";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navigation = [
  { name: "Home", href: "/dashboard", icon: HomeIcon },
  { name: "Orders", href: "/dashboard/orders", icon: ShoppingBagIcon },
  { name: "Products", href: "/dashboard/products", icon: BookmarkSquareIcon },
  { name: "Customers", href: "/dashboard/customers", icon: UserIcon },
  { name: "Analytics", href: "/dashboard/analytics", icon: ChartBarIcon },
  { name: "Marketing", href: "/dashboard/marketing", icon: CursorArrowRippleIcon },
  { name: "Discounts", href: "/dashboard/discount", icon: PercentBadgeIcon },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <nav className="flex-1 space-y-1 px-2">
      {navigation.map((item) => {
        const isActive = pathname === item.href;
        return (
          <Link
            key={item.name}
            href={item.href}
            className={`group flex items-center px-2 py-2 text-sm font-medium rounded-lg transition-colors duration-150 ease-in-out ${
              isActive
                ? "bg-blue-50 text-blue-600"
                : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
            }`}
          >
            <item.icon
              className={`mr-3 h-5 w-5 flex-shrink-0 ${
                isActive ? "text-blue-600" : "text-gray-400 group-hover:text-gray-500"
              }`}
              aria-hidden="true"
            />
            {item.name}
          </Link>
        );
      })}
    </nav>
  );
}
