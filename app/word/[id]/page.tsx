"use client"

import { useParams, useRouter } from "next/navigation"
import WordDetail from "@/components/word-detail"
import { words } from "@/lib/words-data"
import { ChevronLeft } from "lucide-react"
import { Suspense } from "react"

export default function WordPage() {
  const params = useParams()
  const router = useRouter()
  const wordId = params.id as string

  const word = words.find((w) => w.id === wordId)

  if (!word) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <p className="text-muted-foreground mb-4">Word not found</p>
          <button
            onClick={() => router.back()}
            className="px-4 py-2 rounded-md bg-accent text-accent-foreground hover:opacity-90 transition-opacity"
          >
            Go Back
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Back Button */}
      <button
        onClick={() => router.back()}
        className="absolute top-4 left-4 flex items-center gap-2 px-4 py-2 rounded-md bg-background border border-border text-foreground hover:bg-secondary transition-colors z-10"
      >
        <ChevronLeft size={20} />
        Back
      </button>

      <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
        <WordDetail word={word} />
      </Suspense>
    </div>
  )
}
