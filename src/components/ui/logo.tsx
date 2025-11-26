'use client'

import { usePathname } from 'next/navigation'
import Image from 'next/image'
import { getLogoByPage, getLogoPath, type LogoVariant } from '@/lib/logo-rotation'
import { useState, useEffect } from 'react'

interface LogoProps {
  variant?: LogoVariant
  size?: number
  className?: string
  showText?: boolean
}

/**
 * Composant Logo avec rotation automatique
 * Alterne entre les 3 logos selon la page ou la semaine
 */
export function Logo({ variant, size = 40, className = '', showText = true }: LogoProps) {
  const pathname = usePathname()
  const [logoVariant, setLogoVariant] = useState<LogoVariant>(variant || getLogoByPage(pathname))

  // Mettre à jour le logo si le pathname change
  useEffect(() => {
    if (!variant) {
      setLogoVariant(getLogoByPage(pathname))
    }
  }, [pathname, variant])

  const logoPath = getLogoPath(variant || logoVariant)

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className="relative flex-shrink-0" style={{ width: size, height: size, maxWidth: size, maxHeight: size }}>
        <Image
          src={logoPath}
          alt="Psaumes365"
          width={size}
          height={size}
          className="object-contain"
          style={{ width: `${size}px`, height: `${size}px`, maxWidth: `${size}px`, maxHeight: `${size}px` }}
          priority
          unoptimized
        />
      </div>
      {showText && (
        <span className="font-serif font-semibold text-base sm:text-lg hidden sm:block">
          Psaumes365
        </span>
      )}
    </div>
  )
}

