interface SectionLabelProps {
  text: string
  light?: boolean
  centered?: boolean
}

export default function SectionLabel({ text, light, centered }: SectionLabelProps) {
  return (
    <span
      className={`font-body text-[14px] font-medium tracking-[0.1em] uppercase ${centered ? 'text-center block' : ''}`}
      style={{ color: light ? 'var(--orange)' : 'var(--orange)' }}
    >
      {text}
    </span>
  )
}
