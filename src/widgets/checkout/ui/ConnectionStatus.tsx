import { Link2, Link2Off } from 'lucide-react'
import { WALLET_PROVIDER_LABELS } from '@/shared/contracts'
import { cn, shortenAddress } from '@/shared/lib'
import type { CheckoutController } from '../model'

export function ConnectionStatus({ checkout, className }: { checkout: CheckoutController; className?: string }) {
  const { connected, connection, connecting, disconnecting, selectedWallet, provider, network } = checkout
  const ready = Boolean(selectedWallet && provider && network)

  return (
    <div role="status" className={cn('flex flex-wrap items-center justify-between gap-2 text-caption', className)}>
      <p className={cn('flex items-center gap-1.5', connected ? 'text-success' : 'text-text-secondary')}>
        {connected ? (
          <Link2 className="size-4" aria-hidden="true" />
        ) : (
          <Link2Off className="size-4" aria-hidden="true" />
        )}
        {connected && connection
          ? `${WALLET_PROVIDER_LABELS[connection.provider]} conectada · ${shortenAddress(connection.address)}`
          : connecting
            ? 'Aguardando aprovação na carteira…'
            : 'Carteira não conectada'}
      </p>
      {connected ? (
        <button
          type="button"
          onClick={checkout.disconnect}
          disabled={disconnecting}
          className="font-bold text-text-accent hover:text-brand-light disabled:opacity-60"
        >
          Desconectar
        </button>
      ) : (
        <button
          type="button"
          onClick={() => void checkout.connectSelected()}
          disabled={!ready || connecting}
          title={ready ? undefined : 'Selecione carteira, rede e tipo de carteira'}
          className="font-bold text-text-accent hover:text-brand-light disabled:cursor-not-allowed disabled:opacity-50"
        >
          {connecting ? 'Conectando…' : 'Conectar carteira'}
        </button>
      )}
    </div>
  )
}
