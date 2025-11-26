'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Share2, Facebook, Twitter, Copy, Check, MessageCircle } from 'lucide-react'
import { trackShare } from '@/lib/analytics'

interface ShareButtonProps {
  reference: string
  content: string
  className?: string
  variant?: 'default' | 'outline' | 'ghost'
  size?: 'default' | 'sm' | 'lg' | 'icon'
}

/**
 * Composant de partage de versets
 * Supporte le Web Share API natif et les réseaux sociaux
 */
export function ShareButton({ reference, content, className, variant = 'ghost', size = 'sm' }: ShareButtonProps) {
  const [copied, setCopied] = useState(false)
  const [showNativeShare, setShowNativeShare] = useState(false)

  // Vérifier si le Web Share API est disponible
  useEffect(() => {
    setShowNativeShare(typeof navigator !== 'undefined' && 'share' in navigator)
  }, [])

  /**
   * Partage natif (Web Share API)
   */
  const handleNativeShare = async () => {
    if (!navigator.share) return

    trackShare('native', reference)
    const shareText = `"${content}"\n— ${reference}\n\nPartagé via Psaumes365`
    const shareUrl = typeof window !== 'undefined' ? window.location.origin : ''

    try {
      await navigator.share({
        title: `Verset biblique : ${reference}`,
        text: shareText,
        url: shareUrl,
      })
    } catch (error: any) {
      // L'utilisateur a annulé le partage
      if (error.name !== 'AbortError') {
        console.error('Erreur partage:', error)
      }
    }
  }

  /**
   * Copie dans le presse-papiers
   */
  const handleCopy = async () => {
    trackShare('copy', reference)
    const text = `"${content}"\n— ${reference}\n\nPartagé via Psaumes365`
    
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      console.error('Erreur copie:', error)
    }
  }

  /**
   * Partage sur Facebook
   */
  const handleFacebookShare = () => {
    trackShare('facebook', reference)
    const text = encodeURIComponent(`"${content}" — ${reference}`)
    const url = encodeURIComponent(typeof window !== 'undefined' ? window.location.origin : '')
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}&quote=${text}`, '_blank', 'width=600,height=400')
  }

  /**
   * Partage sur Twitter/X
   */
  const handleTwitterShare = () => {
    trackShare('twitter', reference)
    const text = encodeURIComponent(`"${content}" — ${reference}`)
    const url = encodeURIComponent(typeof window !== 'undefined' ? window.location.origin : '')
    window.open(`https://twitter.com/intent/tweet?text=${text}&url=${url}`, '_blank', 'width=600,height=400')
  }

  /**
   * Partage par WhatsApp
   */
  const handleWhatsAppShare = () => {
    trackShare('whatsapp', reference)
    const text = encodeURIComponent(`"${content}"\n— ${reference}\n\nPartagé via Psaumes365`)
    window.open(`https://wa.me/?text=${text}`, '_blank')
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant={variant} size={size} className={className}>
          <Share2 className="w-4 h-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        {showNativeShare && (
          <DropdownMenuItem onClick={handleNativeShare}>
            <Share2 className="w-4 h-4 mr-2" />
            Partager
          </DropdownMenuItem>
        )}
        <DropdownMenuItem onClick={handleCopy}>
          {copied ? (
            <>
              <Check className="w-4 h-4 mr-2 text-green-500" />
              Copié !
            </>
          ) : (
            <>
              <Copy className="w-4 h-4 mr-2" />
              Copier
            </>
          )}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleFacebookShare}>
          <Facebook className="w-4 h-4 mr-2" />
          Facebook
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleTwitterShare}>
          <Twitter className="w-4 h-4 mr-2" />
          Twitter/X
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleWhatsAppShare}>
          <MessageCircle className="w-4 h-4 mr-2" />
          WhatsApp
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

