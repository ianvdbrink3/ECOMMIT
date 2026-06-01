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
      className={cn(
        'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-150',
        isActive
          ? 'bg-blue-600/10 text-blue-400 border border-blue-500/20'
          : 'text-[#737373] hover:text-[#f5f5f5] hover:bg-[#1a1a1a]',
        collapsed && 'justify-center px-2'
      )}
      title={collapsed ? label : undefined}
    >
      <Icon className={cn('shrink-0', isActive ? 'text-blue-400' : 'text-[#737373]')} size={18} />
      {!collapsed && <span>{label}</span>}
    </Link>
  )
}
