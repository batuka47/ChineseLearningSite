"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import SearchBar from "@/components/search-bar"
import { ThemeToggle } from "@/components/theme-toggle"
import { words } from "@/lib/words-data"

const ALL_UNITS = Array.from(new Set(words.map((w) => w.unit))).sort((a, b) => a - b)

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedUnit, setSelectedUnit] = useState<number | null>(null)

  const removeToneMarks = (str: string) => {
    const toneMap: { [key: string]: string } = {
      ā: "a",
      á: "a",
      ǎ: "a",
      à: "a",
      ē: "e",
      é: "e",
      ě: "e",
      è: "e",
      ī: "i",
      í: "i",
      ǐ: "i",
      ì: "i",
      ō: "o",
      ó: "o",
      ǒ: "o",
      ò: "o",
      ū: "u",
      ú: "u",
      ǔ: "u",
      ù: "u",
      ǖ: "v",
      ǘ: "v",
      ǚ: "v",
      ǜ: "v",
      ń: "n",
      ň: "n",
      ǹ: "n",
      ê̄: "e",
      ế: "e",
      ê̌: "e",
      ề: "e",
    }
    return str.replace(/./g, (char) => toneMap[char] || char)
  }

  const filteredWords = useMemo(() => {
    const queryLower = searchQuery.toLowerCase()
    const queryNoTones = removeToneMarks(queryLower)

    return words.filter((word) => {
      if (selectedUnit !== null && word.unit !== selectedUnit) return false

      const hanziMatch = word.hanzi.includes(searchQuery)
      const englishMatch = word.meaningEn.toLowerCase().includes(queryLower)
      const pinyinNoTones = removeToneMarks(word.pinyin.toLowerCase())
      const pinyinMatch = pinyinNoTones.includes(queryNoTones)

      return hanziMatch || englishMatch || pinyinMatch
    })
  }, [searchQuery, selectedUnit])

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8 w-full">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-4xl font-bold text-foreground tracking-tight">Learn Hanzi</h1>
              <p className="text-sm sm:text-base text-muted-foreground mt-1 sm:mt-2">Master Chinese characters with animation and practice</p>
            </div>
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="w-full p-4 sm:p-6">
          <SearchBar query={searchQuery} onQueryChange={setSearchQuery} />

          {/* Unit Filter */}
          <div className="mt-4 flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedUnit(null)}
              className={`px-3 py-1.5 text-xs font-medium rounded-full border transition-colors ${
                selectedUnit === null
                  ? "bg-accent text-accent-foreground border-accent"
                  : "bg-secondary border-border text-muted-foreground hover:bg-border"
              }`}
            >
              All
            </button>
            {ALL_UNITS.map((unit) => (
              <button
                key={unit}
                onClick={() => setSelectedUnit(selectedUnit === unit ? null : unit)}
                className={`px-3 py-1.5 text-xs font-medium rounded-full border transition-colors ${
                  selectedUnit === unit
                    ? "bg-accent text-accent-foreground border-accent"
                    : "bg-secondary border-border text-muted-foreground hover:bg-border"
                }`}
              >
                Unit {unit}
              </button>
            ))}
          </div>

          {/* Word List */}
          <div className="mt-6 sm:mt-8">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-widest mb-3 sm:mb-4">
              {filteredWords.length === 0 ? "No words found" : `Words (${filteredWords.length})`}
            </h3>
            <div className="space-y-2">
              {filteredWords.map((word) => (
                <Link
                  key={word.id}
                  href={`/word/${word.id}`}
                  className="group flex items-center gap-3 sm:gap-4 px-3 sm:px-4 py-3 rounded-lg transition-all bg-secondary/40 hover:bg-accent/10 hover:border-accent/30 border border-transparent"
                >
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-lg text-foreground group-hover:text-accent transition-colors">
                      {word.hanzi}
                    </div>
                    <div className="text-sm text-muted-foreground mt-0.5 truncate">{word.pinyin}</div>
                  </div>
                  <div className="text-muted-foreground group-hover:text-accent transition-colors opacity-0 group-hover:opacity-100 flex-shrink-0">
                    →
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
