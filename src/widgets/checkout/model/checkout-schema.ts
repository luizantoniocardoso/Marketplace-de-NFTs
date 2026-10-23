import { walletDefaults, walletSchema, type WalletValues } from '@/features/manage-wallet'
import type { CollectorDto, UserDto, WalletDto } from '@/shared/contracts'

export const checkoutSchema = walletSchema

export type CheckoutValues = WalletValues

export function checkoutDefaults(wallet: WalletDto | null, profile: UserDto | null | undefined): CheckoutValues {
  return {
    ...walletDefaults(wallet, { email: profile?.email, displayName: profile?.displayName }),
    handle: profile?.username ?? '',
  }
}

export function toCollector(values: CheckoutValues): CollectorDto {
  return {
    displayName: values.displayName,
    username: values.handle,
    profileName: values.profileName,
    email: values.email,
    ensName: `${values.ensLabel}${values.ensSuffix}`,
    referralCode: values.referralCode,
    address: values.address,
    secondaryAddress: values.secondaryAddress || null,
  }
}
