import { createFileRoute } from '@tanstack/react-router'
import { AccountLayout } from '@/widgets/account-layout'

export const Route = createFileRoute('/_authenticated/_account')({
  component: AccountLayout,
})
