import { Outlet } from '@tanstack/react-router'
import { SkipLink, Toaster } from '@/shared/ui'
import { MobileTabBar } from '@/widgets/mobile-tab-bar'
import { SiteFooter } from '@/widgets/site-footer'
import { SiteHeader } from '@/widgets/site-header'
import { DevTools } from './DevTools'

const MAIN_ID = 'conteudo'

export function RootLayout() {
  return (
    <>
      <SkipLink href={`#${MAIN_ID}`}>Pular para o conteúdo</SkipLink>
      <SiteHeader />
      <main id={MAIN_ID} tabIndex={-1} className="outline-none">
        <Outlet />
      </main>
      <SiteFooter />
      <MobileTabBar />
      <Toaster position="top-center" />
      <DevTools />
    </>
  )
}
