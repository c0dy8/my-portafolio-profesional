import React from 'react'
import { type LucideIcon } from 'lucide-react'

interface MenuItem {
  title: string
  href: string
  icon: LucideIcon
  gradientFrom: string
  gradientTo: string
}

interface GradientMenuProps {
  items: MenuItem[]
  active?: string
}

export function GradientMenu({ items, active }: GradientMenuProps) {
  return (
    <ul className="flex gap-3 md:gap-4">
      {items.map(({ title, href, icon: Icon, gradientFrom, gradientTo }) => (
        <li
          key={title}
          style={{ '--gf': gradientFrom, '--gt': gradientTo } as React.CSSProperties}
          className="relative w-[44px] h-[44px] transition-all duration-500 hover:w-[130px] group"
        >
          <a
            href={href}
            className="relative flex w-full h-full items-center justify-center bg-zinc-900 border border-zinc-700/60 rounded-full hover:border-transparent transition-all duration-500 cursor-pointer"
          >
            {/* Gradient background on hover */}
            <span className="absolute inset-0 rounded-full bg-[linear-gradient(45deg,var(--gf),var(--gt))] opacity-0 transition-all duration-500 group-hover:opacity-100" />

            {/* Glow */}
            <span className="absolute top-[8px] inset-x-0 h-full rounded-full bg-[linear-gradient(45deg,var(--gf),var(--gt))] blur-[14px] opacity-0 -z-10 transition-all duration-500 group-hover:opacity-40" />

            {/* Active dot */}
            {active === href.slice(1) && (
              <span className="absolute bottom-[6px] left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-white group-hover:opacity-0 transition-opacity duration-200" />
            )}

            {/* Icon */}
            <span className="relative z-10 transition-all duration-300 group-hover:scale-0 group-hover:opacity-0">
              <Icon
                size={17}
                className={active === href.slice(1) ? 'text-white' : 'text-zinc-400'}
              />
            </span>

            {/* Title */}
            <span className="absolute z-10 text-white text-xs font-semibold tracking-wider uppercase whitespace-nowrap scale-0 opacity-0 group-hover:scale-100 group-hover:opacity-100 transition-all duration-300 delay-100">
              {title}
            </span>
          </a>
        </li>
      ))}
    </ul>
  )
}
