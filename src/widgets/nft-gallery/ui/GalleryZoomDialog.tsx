import type { NftImageDto } from '@/shared/contracts'
import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/shared/ui'

interface GalleryZoomDialogProps {
  image: NftImageDto
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function GalleryZoomDialog({ image, open, onOpenChange }: GalleryZoomDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[min(90vw,820px)] bg-surface-card p-3 sm:max-w-[min(90vw,820px)]">
        <DialogTitle className="sr-only">Imagem ampliada</DialogTitle>
        <DialogDescription className="sr-only">{image.alt}</DialogDescription>
        <img src={image.large} alt={image.alt} width={960} height={960} className="aspect-square w-full rounded-[12px] object-cover" />
      </DialogContent>
    </Dialog>
  )
}
