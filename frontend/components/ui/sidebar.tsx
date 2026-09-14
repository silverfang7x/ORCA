"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

export interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {
  collapsible?: boolean
}

const Sidebar = React.forwardRef<HTMLDivElement, SidebarProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <aside
        ref={ref}
        className={cn(
          "flex h-screen flex-col border-r border-slate-800 bg-slate-950 text-slate-200 w-64 shrink-0 transition-all",
          className
        )}
        {...props}
      >
        {children}
      </aside>
    )
  }
)
Sidebar.displayName = "Sidebar"

const SidebarHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex h-16 items-center px-6 border-b border-slate-800 font-bold", className)}
    {...props}
  />
))
SidebarHeader.displayName = "SidebarHeader"

const SidebarContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex-1 overflow-y-auto p-4 space-y-1", className)}
    {...props}
  />
))
SidebarContent.displayName = "SidebarContent"

const SidebarFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("p-4 border-t border-slate-800", className)}
    {...props}
  />
))
SidebarFooter.displayName = "SidebarFooter"

export { Sidebar, SidebarHeader, SidebarContent, SidebarFooter }
