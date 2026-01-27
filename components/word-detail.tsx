"use client"

import { useEffect, useRef, useState } from "react"
import HanziWriter from "hanzi-writer"
import { Volume2, ChevronLeft, ChevronRight } from "lucide-react"

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
  const writerRef = useRef<HTMLDivElement>(null)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const [writer, setWriter] = useState<HanziWriter | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [audioError, setAudioError] = useState<string | null>(null)
  const [charIndex, setCharIndex] = useState(0)

  const characters = word.hanzi.split("")
  const currentChar = characters[charIndex]

  useEffect(() => {
    if (!writerRef.current) return

    writerRef.current.innerHTML = ""

    // Clear previous writer if it exists
    if (writer && typeof writer.destroy === "function") {
      writer.destroy()
    }

    try {
      const newWriter = HanziWriter.create(writerRef.current, currentChar, {
        width: 500,
        height: 500,
        padding: 40,
        strokeAnimationSpeed: 1,
        strokeHighlightSpeed: 2,
        delayBetweenStrokes: 100,
      })

      setWriter(newWriter)
      setError(null)
    } catch (err) {
      setError(`Could not load animation for ${currentChar}`)
      setWriter(null)
    }

    return () => {
      if (writer && typeof writer.destroy === "function") {
        writer.destroy()
      }
    }
  }, [currentChar])

  const handlePlayAnimation = () => {
    if (writer) {
      writer.animateCharacter()
    }
  }

  const handleStartQuiz = () => {
    if (writer) {
      writer.quiz()
    }
  }

  const playAudio = async () => {
    try {
      // Clean up previous audio if it exists
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current = null
      }

      setAudioError(null)
      const audio = new Audio(word.audioUrl)
      audioRef.current = audio

      // Handle errors
      audio.addEventListener("error", (e) => {
        const error = audio.error
        if (error) {
          let errorMessage = "Failed to load audio"
          switch (error.code) {
            case error.MEDIA_ERR_ABORTED:
              errorMessage = "Audio loading was aborted"
              break
            case error.MEDIA_ERR_NETWORK:
              errorMessage = "Network error while loading audio"
              break
            case error.MEDIA_ERR_DECODE:
              errorMessage = "Audio decoding error"
              break
            case error.MEDIA_ERR_SRC_NOT_SUPPORTED:
              errorMessage = "Audio format not supported or file not found"
              break
          }
          setAudioError(errorMessage)
          console.error("Audio error:", errorMessage, word.audioUrl)
        }
      })

      // Clean up on ended
      audio.addEventListener("ended", () => {
        audioRef.current = null
      })

      await audio.play()
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to play audio"
      setAudioError(errorMessage)
      console.error("Audio play error:", errorMessage, word.audioUrl)
    }
  }

  // Cleanup audio on unmount
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current = null
      }
    }
  }, [])

  const handlePrevChar = () => {
    setCharIndex((prev) => (prev === 0 ? characters.length - 1 : prev - 1))
  }

  const handleNextChar = () => {
    setCharIndex((prev) => (prev === characters.length - 1 ? 0 : prev + 1))
  }

  return (
    <div className="h-screen w-full flex flex-col">
      {/* Character Display - Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center bg-gradient-to-br from-background to-secondary/20 p-8">
        <div className="mb-8 text-center">
          <p className="text-5xl font-bold text-foreground mb-2">
            {characters.map((char, idx) => (
              <span key={idx} className={idx === charIndex ? "text-accent" : "text-muted-foreground"}>
                {char}
              </span>
            ))}
          </p>
          {characters.length > 1 && (
            <p className="text-sm text-muted-foreground">
              Character {charIndex + 1} of {characters.length}
            </p>
          )}
        </div>

        {error ? (
          <div className="text-center text-muted-foreground">
            <p className="text-lg mb-2">{currentChar}</p>
            <p className="text-sm">{error}</p>
          </div>
        ) : (
          <div ref={writerRef} className="bg-background rounded-lg shadow-lg" />
        )}
      </div>

      {/* Bottom Info Bar */}
      <div className="bg-secondary border-t border-border p-8">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-6">
            {/* Pinyin */}
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Pinyin</p>
              <p className="text-xl font-semibold text-foreground">{word.pinyin}</p>
            </div>

            {/* English */}
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">English</p>
              <p className="text-base text-foreground">{word.meaningEn}</p>
            </div>

            {/* Mongolian */}
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Mongolian</p>
              <p className="text-base text-foreground">{word.meaningMn}</p>
            </div>

            {/* HSK Level */}
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">HSK Level</p>
              <p className="text-xl font-semibold text-accent">Level {word.hskLevel}</p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 flex-wrap items-center">
            <div className="flex flex-col">
              <button
                onClick={playAudio}
                className="flex items-center gap-2 px-6 py-3 rounded-md bg-accent text-accent-foreground hover:opacity-90 transition-opacity font-medium"
              >
                <Volume2 size={20} />
                Play Audio
              </button>
              {audioError && (
                <p className="text-xs text-destructive mt-1">{audioError}</p>
              )}
            </div>
            <button
              onClick={handlePlayAnimation}
              disabled={!writer}
              className="flex-1 min-w-[200px] px-6 py-3 rounded-md bg-background border border-border text-foreground hover:bg-border transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Play Animation
            </button>
            <button
              onClick={handleStartQuiz}
              disabled={!writer}
              className="flex-1 min-w-[200px] px-6 py-3 rounded-md bg-background border border-border text-foreground hover:bg-border transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Practice Strokes
            </button>

            {characters.length > 1 && (
              <div className="flex gap-2 ml-auto">
                <button
                  onClick={handlePrevChar}
                  className="px-4 py-3 rounded-md bg-background border border-border text-foreground hover:bg-border transition-colors"
                >
                  <ChevronLeft size={20} />
                </button>
                <button
                  onClick={handleNextChar}
                  className="px-4 py-3 rounded-md bg-background border border-border text-foreground hover:bg-border transition-colors"
                >
                  <ChevronRight size={20} />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
