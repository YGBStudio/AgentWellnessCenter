import React from "react"

export type PromoItem = {
  title: string
  description: string
}

type PromoSectionProps = {
  items: PromoItem[]
}

export function PromoCard({ title, description }: PromoItem) {
  return (
    <article>
      <h4>{title}</h4>
      <p>{description}</p>
    </article>
  )
}

export default function PromoSection({ items }: PromoSectionProps) {
  return (
    <section className="container" style={{ marginTop: '3rem', textAlign: 'center' }}>
      <div className="grid">
        {items.map((item, index) => (
          <PromoCard key={item.title || index} {...item} />
        ))}
      </div>
    </section>
  )
}