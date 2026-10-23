import { Linkedin, Mail, Twitter } from 'lucide-react'

export function NftShareLinks({ name, url }: { name: string; url: string }) {
  const text = encodeURIComponent(`Confira ${name} na Kurio`)
  const encodedUrl = encodeURIComponent(url)
  const links = [
    { label: 'LinkedIn', href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`, Icon: Linkedin },
    { label: 'e-mail', href: `mailto:?subject=${text}&body=${encodedUrl}`, Icon: Mail },
    { label: 'Twitter', href: `https://twitter.com/intent/tweet?text=${text}&url=${encodedUrl}`, Icon: Twitter },
  ]

  return (
    <div className="flex items-center gap-2 text-body font-bold text-foreground">
      <span>Compartilhar este NFT:</span>
      <ul className="flex items-center gap-1">
        {links.map(({ label, href, Icon }) => (
          <li key={label}>
            <a
              href={href}
              target={href.startsWith('http') ? '_blank' : undefined}
              rel="noopener noreferrer"
              aria-label={`Compartilhar no ${label}${href.startsWith('http') ? ' (abre em nova aba)' : ''}`}
              className="grid size-7 place-items-center text-foreground hover:text-text-accent"
            >
              <Icon className="size-4" aria-hidden="true" />
            </a>
          </li>
        ))}
      </ul>
    </div>
  )
}
