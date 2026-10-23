import { Search } from 'lucide-react'
import { useState } from 'react'
import type { NftImageDto } from '@/shared/contracts'
import { cn } from '@/shared/lib'
import { GalleryZoomDialog } from './GalleryZoomDialog'

interface NftGalleryProps {
  images: NftImageDto[]
  name: string
  className?: string
}

export function NftGallery({ images, name, className }: NftGalleryProps) {
  const [selected, setSelected] = useState(0)
  const [zoomOpen, setZoomOpen] = useState(false)
  const current = images[selected] ?? images[0]

  return (
    <div className={cn('md:grid md:grid-cols-[minmax(0,100px)_minmax(0,444px)] md:gap-7', className)}>
      <ul aria-label={`Imagens de ${name}`} className="hidden md:flex md:flex-col md:gap-4">
        {images.map((image, index) => (
          <li key={image.alt}>
            <button
              type="button"
              aria-label={`Ver imagem ${index + 1} de ${images.length}`}
              aria-current={index === selected ? 'true' : undefined}
              onClick={() => setSelected(index)}
              className={cn(
                'block aspect-square w-full overflow-hidden rounded-[6px] border-2 transition-colors',
                index === selected ? 'border-brand' : 'border-transparent hover:border-border-soft',
              )}
            >
              <img src={image.small} alt="" width={100} height={100} loading="lazy" className="size-full object-cover" />
            </button>
          </li>
        ))}
      </ul>

      <div className="relative bg-surface-card p-0 max-md:rounded-b-[32px] md:aspect-square md:p-5">
        <img
          src={current.large}
          srcSet={`${current.small} 480w, ${current.large} 960w`}
          sizes="(min-width: 768px) 404px, 100vw"
          width={404}
          height={404}
          alt={current.alt}
          fetchPriority="high"
          className="aspect-square w-full object-cover max-md:aspect-[414/392] md:rounded-[12px]"
        />
        <button
          type="button"
          onClick={() => setZoomOpen(true)}
          aria-label="Ampliar imagem"
          className="absolute top-2 right-2 hidden size-9 place-items-center rounded-full bg-ink/70 text-foreground transition-colors hover:text-text-accent md:grid"
        >
          <Search className="size-5" aria-hidden="true" />
        </button>
      </div>

      <GalleryZoomDialog image={current} open={zoomOpen} onOpenChange={setZoomOpen} />
    </div>
  )
}
