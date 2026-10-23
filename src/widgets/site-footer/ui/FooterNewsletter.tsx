import { NewsletterForm } from '@/features/newsletter-subscribe'

export function FooterNewsletter() {
  return (
    <div className="xl:pl-4">
      <h3 className="text-body-lg/[1.1] font-bold">Antecipe-se ao próximo lançamento</h3>
      <div className="mt-4">
        <NewsletterForm />
      </div>
      <p className="mt-4 text-caption text-text-secondary">
        Receba lançamentos selecionados, histórias de criadores e novidades do mercado.
      </p>
    </div>
  )
}
