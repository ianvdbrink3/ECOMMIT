'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { type LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

interface NavItemProps {
  href: string
  icon: LucideIcon
  label: string
  collapsed?: boolean
}

export function NavItem({ href, icon: Icon, label, collapsed }: NavItemProps) {
  const pathname = usePathname()
  const isActive = pathname === href || pathname.startsWith(href + '/')

  return (
    <Link
      href={href}
      title={collapsed ? label : undefined}
      className={cn(
        'relative flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm transition-all duration-150',
        isActive
          ? 'bg-[#1a1a1a] text-[#efefef] font-medium'
          : 'text-[#666666] hover:text-[#cccccc] hover:bg-[#141414] font-normal',
        collapsed && 'justify-center px-0 w-10 mx-auto'
      )}
    >
      {isActive && (
        <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-4 rounded-r-full bg-blue-500" />
      )}
      <Icon
        size={16}
        className={cn(
          'shrink-0 transition-colors',
          isActive ? 'text-blue-400' : 'text-[#555555]'
        )}
      />
      {!collapsed && <span className="leading-none">{label}</span>}
    </Link>
  )
}
