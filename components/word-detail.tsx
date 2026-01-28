"use client"

import { useEffect, useRef, useState, useCallback } from "react"
import HanziWriter from "hanzi-writer"
import { Volume2 } from "lucide-react"

interface Word {
  id: string
  hanzi: string
  pinyin: string
  hskLevel: number
  meaningEn: string
  meaningMn: string
  audioUrl: string
}

interface WordDetailProps {
  word: Word
}

export default function WordDetail({ word }: WordDetailProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const writersRef = useRef<(HanziWriter | null)[]>([])
  const charRefs = useRef<(HTMLDivElement | null)[]>([])
  const [canvasSize, setCanvasSize] = useState(200)
  const [activeChar, setActiveChar] = useState<number | null>(null)
  const [writersReady, setWritersReady] = useState(false)

  const characters = word.hanzi.split("")

  // Responsive canvas size based on screen and number of characters
  useEffect(() => {
    const updateSize = () => {
      const width = window.innerWidth
      const charCount = characters.length

      if (width < 640) {
        // Mobile - vertical layout, fixed reasonable size
        const size = Math.min(width - 48, 250)
        setCanvasSize(size)
      } else if (width < 1024) {
        // Tablet - horizontal layout
        const maxSize = Math.min((width - 80) / charCount - 16, 280)
        setCanvasSize(Math.max(180, maxSize))
      } else {
        // Desktop - horizontal layout
        const maxSize = Math.min((width - 120) / charCount - 24, 350)
        setCanvasSize(Math.max(220, maxSize))
      }
    }
    updateSize()
    window.addEventListener("resize", updateSize)
    return () => window.removeEventListener("resize", updateSize)
  }, [characters.length])

  // Initialize all HanziWriter instances
  useEffect(() => {
    // Clean up previous writers
    writersRef.current.forEach((writer) => {
      if (writer && typeof writer.destroy === "function") {
        writer.destroy()
      }
    })
    writersRef.current = []
    setWritersReady(false)

    // Create new writers for each character
    const newWriters: (HanziWriter | null)[] = []

    characters.forEach((char, index) => {
      const el = charRefs.current[index]
      if (!el) {
        newWriters.push(null)
        return
      }

      el.innerHTML = ""

      try {
        const writer = HanziWriter.create(el, char, {
          width: canvasSize,
          height: canvasSize,
          padding: 15,
          strokeAnimationSpeed: 1,
          strokeHighlightSpeed: 2,
          delayBetweenStrokes: 100,
        })
        newWriters.push(writer)
      } catch {
        newWriters.push(null)
      }
    })

    writersRef.current = newWriters
    setWritersReady(true)

    return () => {
      writersRef.current.forEach((writer) => {
        if (writer && typeof writer.destroy === "function") {
          writer.destroy()
        }
      })
    }
  }, [characters.join(""), canvasSize])

  const handlePlayAnimation = useCallback((index: number) => {
    const writer = writersRef.current[index]
    if (writer) {
      setActiveChar(index)
      writer.animateCharacter({
        onComplete: () => setActiveChar(null),
      })
    }
  }, [])

  const handlePlayAllAnimation = useCallback(() => {
    // Animate characters one by one
    let currentIndex = 0

    const animateNext = () => {
      if (currentIndex >= writersRef.current.length) {
        setActiveChar(null)
        return
      }

      const writer = writersRef.current[currentIndex]
      if (writer) {
        setActiveChar(currentIndex)
        writer.animateCharacter({
          onComplete: () => {
            currentIndex++
            animateNext()
          },
        })
      } else {
        currentIndex++
        animateNext()
      }
    }

    animateNext()
  }, [])

  const handleStartQuiz = useCallback((index: number) => {
    const writer = writersRef.current[index]
    if (writer) {
      setActiveChar(index)
      writer.quiz({
        onComplete: () => setActiveChar(null),
      })
    }
  }, [])

  const playAudio = () => {
    const audio = new Audio(word.audioUrl)
    audio.play()
  }

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* Character Display - Main Content */}
      <div
        ref={containerRef}
        className="flex-1 flex flex-col sm:flex-row items-center justify-start sm:justify-center gap-6 sm:gap-8 lg:gap-10 bg-gradient-to-br from-background to-secondary/20 p-4 sm:p-6 overflow-y-auto"
      >
        {characters.map((char, index) => (
          <div key={`${char}-${index}`} className="flex flex-col items-center">
            {/* Character label */}
            <p
              className={`text-3xl sm:text-4xl lg:text-5xl font-bold mb-2 transition-colors ${
                activeChar === index ? "text-accent" : "text-foreground"
              }`}
            >
              {char}
            </p>

            {/* HanziWriter canvas */}
            <div
              ref={(el) => {
                charRefs.current[index] = el
              }}
              className={`bg-background rounded-lg shadow-lg border-2 transition-colors ${
                activeChar === index ? "border-accent" : "border-transparent"
              }`}
            />

            {/* Per-character buttons */}
            <div className="flex gap-2 mt-3">
              <button
                onClick={() => handlePlayAnimation(index)}
                disabled={!writersReady || !writersRef.current[index]}
                className="px-3 py-1.5 text-xs sm:text-sm rounded-md bg-secondary border border-border text-foreground hover:bg-border transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Animate
              </button>
              <button
                onClick={() => handleStartQuiz(index)}
                disabled={!writersReady || !writersRef.current[index]}
                className="px-3 py-1.5 text-xs sm:text-sm rounded-md bg-secondary border border-border text-foreground hover:bg-border transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Practice
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Bottom Info Bar */}
      <div className="flex-shrink-0 bg-secondary border-t border-border p-3 sm:p-4 lg:p-6">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-2 gap-2 sm:gap-3 lg:grid-cols-4 lg:gap-4 mb-3 sm:mb-4">
            {/* Pinyin */}
            <div>
              <p className="text-[10px] sm:text-xs text-muted-foreground uppercase tracking-wide mb-0.5 sm:mb-1">Pinyin</p>
              <p className="text-sm sm:text-lg font-semibold text-foreground">{word.pinyin}</p>
            </div>

            {/* English */}
            <div>
              <p className="text-[10px] sm:text-xs text-muted-foreground uppercase tracking-wide mb-0.5 sm:mb-1">English</p>
              <p className="text-xs sm:text-base text-foreground truncate">{word.meaningEn}</p>
            </div>

            {/* Mongolian */}
            <div>
              <p className="text-[10px] sm:text-xs text-muted-foreground uppercase tracking-wide mb-0.5 sm:mb-1">Mongolian</p>
              <p className="text-xs sm:text-base text-foreground truncate">{word.meaningMn}</p>
            </div>

            {/* HSK Level */}
            <div>
              <p className="text-[10px] sm:text-xs text-muted-foreground uppercase tracking-wide mb-0.5 sm:mb-1">HSK</p>
              <p className="text-sm sm:text-lg font-semibold text-accent">Lvl {word.hskLevel}</p>
            </div>
          </div>

          {/* Global Action Buttons */}
          <div className="flex gap-2 sm:gap-3">
            <button
              onClick={playAudio}
              className="flex items-center justify-center gap-1.5 sm:gap-2 px-3 sm:px-5 py-2 sm:py-2.5 rounded-md bg-accent text-accent-foreground hover:opacity-90 transition-opacity font-medium text-sm sm:text-base"
            >
              <Volume2 size={16} />
              <span>Audio</span>
            </button>

            {characters.length > 1 && (
              <button
                onClick={handlePlayAllAnimation}
                disabled={!writersReady}
                className="px-3 sm:px-5 py-2 sm:py-2.5 rounded-md bg-background border border-border text-foreground hover:bg-border transition-colors font-medium text-sm sm:text-base disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Animate All
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
