'use client'
import React from 'react'

export const Title = ({ children, size = "xl", className }: { children: React.ReactNode, size?: string, className?: string }) => {
  return (
    <h1 className={`font-semibold text-${size} mb-2 ${className}`}>{children}</h1>
  )
}
