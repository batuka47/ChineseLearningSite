"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import SearchBar from "@/components/search-bar"
import { words } from "@/lib/words-data"

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("")

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
      const hanziMatch = word.hanzi.includes(searchQuery)
      const englishMatch = word.meaningEn.toLowerCase().includes(queryLower)
      const pinyinNoTones = removeToneMarks(word.pinyin.toLowerCase())
      const pinyinMatch = pinyinNoTones.includes(queryNoTones)

      return hanziMatch || englishMatch || pinyinMatch
    })
  }, [searchQuery])

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="border-b border-border">
        <div className="max-w-7xl mx-auto px-6 py-8 w-full">
          <h1 className="text-4xl font-bold text-foreground tracking-tight">Learn Hanzi</h1>
          <p className="text-base text-muted-foreground mt-2">Master Chinese characters with animation and practice</p>
        </div>
      </header>

      {/* Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="w-full border-b border-border p-6 overflow-y-auto">
          <SearchBar query={searchQuery} onQueryChange={setSearchQuery} />

          {/* Word List */}
          <div className="mt-8">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-widest mb-4">
              {filteredWords.length === 0 ? "No words found" : `Words (${filteredWords.length})`}
            </h3>
            <div className="space-y-2">
              {filteredWords.map((word) => (
                <Link
                  key={word.id}
                  href={`/word/${word.id}`}
                  className="group flex items-center gap-4 px-4 py-3 rounded-lg transition-all bg-secondary/40 hover:bg-accent/10 hover:border-accent/30 border border-transparent"
                >
                  <div className="flex-1">
                    <div className="font-semibold text-lg text-foreground group-hover:text-accent transition-colors">
                      {word.hanzi}
                    </div>
                    <div className="text-sm text-muted-foreground mt-0.5">{word.pinyin}</div>
                  </div>
                  <div className="text-muted-foreground group-hover:text-accent transition-colors opacity-0 group-hover:opacity-100">
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
