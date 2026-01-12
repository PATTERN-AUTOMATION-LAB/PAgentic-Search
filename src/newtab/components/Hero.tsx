import React from 'react'

export function Hero() {
  return (
    <section className="w-full bg-transparent py-12">
      <div className="max-w-4xl mx-auto px-4 text-center">
        <h1 className="text-5xl font-extralight text-foreground mb-4">PAgentic Browser</h1>
        <p className="text-lg text-muted-foreground mb-8">
          Automate the boring stuff, research like an expert, and boost your productivity — directly in your browser.
        </p>
        <div className="flex items-center justify-center gap-4">
          <button className="px-6 py-3 rounded-lg bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] font-medium">Get Started</button>
          <button className="px-4 py-3 rounded-lg border border-border text-foreground">Learn More</button>
        </div>
      </div>
    </section>
  )
}
