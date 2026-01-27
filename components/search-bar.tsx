"use client"

import { Search } from "lucide-react"

interface SearchBarProps {
  query: string
  onQueryChange: (query: string) => void
}

export default function SearchBar({ query, onQueryChange }: SearchBarProps) {
  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={18} />
      <input
        type="text"
        placeholder="Search by Hanzi, Pinyin, or English..."
        value={query}
        onChange={(e) => onQueryChange(e.target.value)}
        className="w-full pl-10 pr-4 py-2 rounded-md bg-background border border-border text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent text-sm"
      />
    </div>
  )
}
