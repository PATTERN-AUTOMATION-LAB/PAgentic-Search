import React from 'react'

interface FeatureRowProps {
  title: string
  description: string
  imgSrc?: string
  reverse?: boolean
}

export function FeatureRow({ title, description, imgSrc, reverse }: FeatureRowProps) {
  return (
    <div className={`flex items-center gap-8 py-8 ${reverse ? 'flex-row-reverse' : ''}`}>
      <div className="flex-1">
        <h3 className="text-2xl font-medium text-foreground mb-3">{title}</h3>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
      {imgSrc && (
        <div className="w-1/2">
          <img src={imgSrc} alt={title} className="w-full rounded-lg shadow-md object-cover" />
        </div>
      )}
    </div>
  )
}
