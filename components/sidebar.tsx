"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { UploadCloud, MessageSquare, PieChart, Search } from "lucide-react"

const navItems = [
  { href: "/", label: "Upload Dataset", icon: UploadCloud },
  { href: "/analyze", label: "Live Analysis", icon: MessageSquare },
  { href: "/dashboard", label: "Dashboard", icon: PieChart },
  { href: "/reviews", label: "Review Explorer", icon: Search },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <div className="w-64 bg-white shadow-md dark:bg-gray-800">
      <div className="p-4">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-200">Review Analysis</h1>
      </div>
      <nav className="mt-8">
        {navItems.map((item) => (
          <Link key={item.href} href={item.href}>
            <Button
              variant="ghost"
              className={`w-full justify-start ${pathname === item.href ? "bg-gray-100 dark:bg-gray-700" : ""}`}
            >
              <item.icon className="mr-2 h-4 w-4" />
              {item.label}
            </Button>
          </Link>
        ))}
      </nav>
    </div>
  )
}

