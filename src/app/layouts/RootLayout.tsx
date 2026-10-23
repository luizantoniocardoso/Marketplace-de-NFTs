import { Outlet, useMatches } from '@tanstack/react-router'
import { cn } from '@/shared/lib'
import { SkipLink, Toaster } from '@/shared/ui'
import { MobileTabBar } from '@/widgets/mobile-tab-bar'
import { SiteFooter } from '@/widgets/site-footer'
import { SiteHeader } from '@/widgets/site-header'
import { RealtimeBridge, SessionExpiryHandler } from '../providers'
import { AuthDialogHost } from './AuthDialogHost'
import { DevTools } from './DevTools'

const MAIN_ID = 'conteudo'

export function RootLayout() {
  const immersiveMobile = useMatches({ select: (matches) => matches.some((match) => match.staticData.immersiveMobile) })

  return (
    <>
      <SkipLink href={`#${MAIN_ID}`}>Pular para o conteúdo</SkipLink>
      <SiteHeader />
      <main id={MAIN_ID} tabIndex={-1} className="outline-none">
        <Outlet />
      </main>
      <SiteFooter className={cn(immersiveMobile && 'max-md:hidden')} />
      {!immersiveMobile && <MobileTabBar />}
      <AuthDialogHost />
      <Toaster position="top-center" />
      <RealtimeBridge />
      <SessionExpiryHandler />
      <DevTools />
    </>
  )
}
