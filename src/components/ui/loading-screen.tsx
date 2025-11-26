'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'

interface LoadingScreenProps {
  isLoading: boolean
  message?: string
}

/**
 * Écran de chargement personnalisé avec animation
 * Affiche un indicateur de chargement élégant pendant le chargement de l'application
 */
export function LoadingScreen({ isLoading, message = 'Chargement...' }: LoadingScreenProps) {
  const [show, setShow] = useState(isLoading)

  useEffect(() => {
    if (!isLoading) {
      // Délai pour permettre l'animation de sortie
      const timer = setTimeout(() => setShow(false), 500)
      return () => clearTimeout(timer)
    } else {
      setShow(true)
    }
  }, [isLoading])

  if (!show) return null

  return (
    <motion.div
      initial={{ opacity: 1 }}
      animate={{ opacity: isLoading ? 1 : 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-background"
    >
      <div className="flex flex-col items-center gap-4">
        {/* Logo/icône animée */}
        <motion.div
          animate={{
            scale: [1, 1.1, 1],
            rotate: [0, 5, -5, 0],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="w-16 h-16 rounded-2xl bg-gradient-to-br from-olive-500 to-ciel-500 flex items-center justify-center shadow-lg"
        >
          <span className="text-3xl">📖</span>
        </motion.div>

        {/* Texte de chargement */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-muted-foreground text-sm font-medium"
        >
          {message}
        </motion.p>

        {/* Barre de progression animée */}
        <div className="w-48 h-1 bg-muted rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-olive-500 to-ciel-500"
            initial={{ width: '0%' }}
            animate={{ width: '100%' }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        </div>
      </div>
    </motion.div>
  )
}

