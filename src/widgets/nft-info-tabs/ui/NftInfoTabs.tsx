import type { NftDetailDto } from '@/shared/contracts'
import { cn } from '@/shared/lib'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/ui'
import { NftDetailsTab } from './NftDetailsTab'
import { NftReviewsTab } from './NftReviewsTab'

const triggerClass =
  'h-auto flex-none rounded-none border-0 px-0 pb-1.5 text-body-md font-normal text-foreground hover:text-text-accent data-active:font-bold data-active:text-text-accent md:text-body-lg dark:data-active:bg-transparent dark:text-foreground group-data-horizontal/tabs:after:bottom-[-1px] group-data-horizontal/tabs:after:h-[3px] after:bg-brand'

export function NftInfoTabs({ nft, className }: { nft: NftDetailDto; className?: string }) {
  return (
    <Tabs defaultValue="details" className={cn('gap-0', className)}>
      <TabsList variant="line" className="h-auto w-full max-w-full justify-start gap-6 overflow-x-auto border-b border-border p-0 [scrollbar-width:none] md:gap-8">
        <TabsTrigger value="details" className={triggerClass}>
          Detalhes do NFT
        </TabsTrigger>
        <TabsTrigger value="reviews" className={triggerClass}>
          <span className="md:hidden">Avaliações ({nft.rating.count})</span>
          <span className="hidden md:inline">Avaliações de colecionadores ({nft.rating.count})</span>
        </TabsTrigger>
      </TabsList>
      <TabsContent value="details" className="pt-3">
        <NftDetailsTab nft={nft} />
      </TabsContent>
      <TabsContent value="reviews" className="pt-4">
        <NftReviewsTab nft={nft} />
      </TabsContent>
    </Tabs>
  )
}
