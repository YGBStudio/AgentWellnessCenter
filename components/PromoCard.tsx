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
    <article className="promo-card">
      <h4>{title}</h4>
      <p>{description}</p>
    </article>
  )
}

export default function PromoSection({ items }: PromoSectionProps) {
  return (
    <section className="promo-section content-section content-section--center">
      <div className="card-grid">
        {items.map((item, index) => (
          <PromoCard key={item.title || index} {...item} />
        ))}
      </div>
    </section>
  )
}
