"use client";

import SearchBar from "@/components/SearchBar";
import { INSTAGRAM_DM } from "@/lib/constants";

interface HeaderProps {
  onMenuToggle: () => void;
  searchValue: string;
  onSearchChange: (value: string) => void;
  itemCount: number;
}

export default function Header({
  onMenuToggle,
  searchValue,
  onSearchChange,
  itemCount,
}: HeaderProps) {
  return (
    <header className="sticky top-0 z-30 border-b border-zinc-800/80 bg-black/80 backdrop-blur-xl">
      <div className="flex items-center gap-3 px-4 py-3 lg:px-6">
        <button
          type="button"
          onClick={onMenuToggle}
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-zinc-800 text-zinc-400 transition-all duration-200 hover:border-zinc-600 hover:text-white lg:hidden"
          aria-label="Open menu"
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" d="M4 7h16M4 12h16M4 17h16" />
          </svg>
        </button>

        <div className="min-w-0 flex-1 lg:flex-none">
          <h1 className="truncate text-lg font-bold tracking-tight lg:text-xl">
            DaPlugTay
          </h1>
          <p className="hidden text-xs text-zinc-500 sm:block">
            {itemCount} items · Tap to view · DM @daplugtay
          </p>
        </div>

        <div className="hidden flex-1 px-4 lg:block">
          <SearchBar value={searchValue} onChange={onSearchChange} />
        </div>

        <a
          href={INSTAGRAM_DM}
          target="_blank"
          rel="noopener noreferrer"
          className="shrink-0 rounded-full bg-white px-4 py-2 text-xs font-bold text-black transition-all duration-200 hover:bg-zinc-200 active:scale-95 sm:px-5 sm:py-2.5 sm:text-sm"
        >
          DM
        </a>
      </div>

      <div className="border-t border-zinc-800/50 px-4 pb-3 pt-2 lg:hidden">
        <SearchBar value={searchValue} onChange={onSearchChange} />
      </div>
    </header>
  );
}
