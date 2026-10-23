import type { UserDto, WalletDto } from '@/shared/contracts'
import { useCheckout } from '../model'
import { CheckoutMobileConfirm, CheckoutMobilePayment } from './CheckoutMobile'
import { CheckoutSidePanel } from './CheckoutSidePanel'
import { CollectorForm } from './CollectorForm'
import { ReviewOrderDialog } from './ReviewOrderDialog'

interface CheckoutViewProps {
  wallets: WalletDto[]
  profile: UserDto
}

export function CheckoutView({ wallets, profile }: CheckoutViewProps) {
  const checkout = useCheckout(wallets, profile)

  return (
    <>
      <div className="flex flex-col gap-8 max-md:pb-[120px] md:grid md:gap-10 lg:grid-cols-[minmax(0,763px)_405px] lg:justify-between">
        <CheckoutMobilePayment checkout={checkout} />
        <CollectorForm checkout={checkout} />
        <div className="hidden md:block">
          <CheckoutSidePanel checkout={checkout} />
        </div>
      </div>
      <CheckoutMobileConfirm checkout={checkout} />
      <ReviewOrderDialog checkout={checkout} />
    </>
  )
}
