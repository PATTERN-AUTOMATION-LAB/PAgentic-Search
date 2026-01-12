import React from 'react'
import { Hero } from '../components/Hero'
import { FeatureRow } from '../components/FeatureRow'

export default function PAgentSearch() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <Hero />
      <div className="max-w-4xl mx-auto px-4">
        <FeatureRow
          title="Deep Research Like A Pro"
          description="Search your history, bookmarks and notes with semantic search powered by PAgent intelligence."
          imgSrc="/assets/pagentic-marketing/feature1.png"
        />
        <FeatureRow
          title="Find Content That Matters"
          description="Let PAgent surface the pages, snippets and highlights that matter most to you."
          imgSrc="/assets/pagentic-marketing/feature2.png"
          reverse
        />
      </div>
    </main>
  )
}
