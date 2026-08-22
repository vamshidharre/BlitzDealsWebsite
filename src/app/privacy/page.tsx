import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, Shield, CheckCircle } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Datenschutzerklärung & Privacy Policy',
  description: 'Datenschutzerklärung und Affiliate-Offenlegung von BlitzDeals.de gemäß DSGVO.',
};

export default function PrivacyPage() {
  return (
    <div className="max-w-4xl mx-auto py-8 text-zinc-700">
      <div className="mb-6">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-zinc-500 hover:text-zinc-900 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Zurück zur Startseite</span>
        </Link>
      </div>

      <div className="bg-white rounded-2xl border border-zinc-200/80 p-6 sm:p-10 shadow-sm space-y-8">
        <div className="border-b border-zinc-100 pb-6">
          <div className="flex items-center gap-2 text-emerald-600 mb-2">
            <Shield className="w-5 h-5" />
            <span className="text-xs font-bold uppercase tracking-wider">Rechtliches & Datenschutz</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 tracking-tight">
            Datenschutzerklärung / Privacy Policy
          </h1>
          <p className="text-xs text-zinc-400 mt-2">Letzte Aktualisierung: Februar 2026</p>
        </div>

        {/* 1. Datenschutz auf einen Blick */}
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-zinc-900">1. Datenschutz auf einen Blick</h2>
          <p className="text-sm leading-relaxed text-zinc-600">
            Der Schutz Ihrer persönlichen Daten ist uns ein wichtiges Anliegen. Wir behandeln Ihre personenbezogenen Daten vertraulich und entsprechend den gesetzlichen Datenschutzvorschriften der Europäischen Datenschutz-Grundverordnung (DSGVO) sowie dieser Datenschutzerklärung.
          </p>
        </section>

        {/* 2. Amazon Partnerprogramm */}
        <section className="space-y-3 p-4 sm:p-5 rounded-xl bg-amber-50/60 border border-amber-200/60">
          <h2 className="text-lg font-bold text-zinc-900 flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-amber-600" />
            <span>2. Amazon Partnerprogramm (Affiliate-Offenlegung)</span>
          </h2>
          <p className="text-sm leading-relaxed text-zinc-700">
            BlitzDeals.de ist Teilnehmer des Partnerprogramms von Amazon EU (Amazon Associates). Als Amazon-Partner verdienen wir an qualifizierten Verkäufen.
          </p>
          <p className="text-sm leading-relaxed text-zinc-700">
            Beim Klick auf Produktlinks werden Sie zu Amazon.de weitergeleitet. Amazon verwendet Cookies, um die Herkunft der Bestellungen nachzuvollziehen (z. B. unser Tracking-Tag). Dadurch erhält Amazon die Information, dass Sie über unsere Website auf das entsprechende Angebot zugegriffen haben.
          </p>
        </section>

        {/* 3. Pinterest API & Social Media */}
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-zinc-900">3. Pinterest API & Social-Media-Schnittstellen</h2>
          <p className="text-sm leading-relaxed text-zinc-600">
            Unsere automatisierten Veröffentlichungs-Dienste (einschließlich Pinterest API, Telegram API, Discord Webhooks) teilen ausschließlich öffentlich zugängliche Deal-Informationen, Produktbilder und Amazon-Affiliate-Links.
          </p>
          <p className="text-sm leading-relaxed text-zinc-600">
            Es werden über diese Schnittstellen zu keinem Zeitpunkt personenbezogene Daten von Webseitenbesuchern erfasst, gespeichert oder an Dritte übertragen.
          </p>
        </section>

        {/* 4. Hosting & Server Logs */}
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-zinc-900">4. Hosting und Server-Log-Dateien</h2>
          <p className="text-sm leading-relaxed text-zinc-600">
            Diese Website wird über Vercel Inc. gehostet. Der Hostinganbieter erhebt in Server-Log-Dateien automatisch technische Informationen (z. B. Browsertyp, Betriebssystem, Referrer URL, Hostname des zugreifenden Rechners, Uhrzeit der Serveranfrage). Dies erfolgt auf Grundlage von Art. 6 Abs. 1 lit. f DSGVO zur Gewährleistung eines sicheren und stabilen Betriebs.
          </p>
        </section>

        {/* 5. Ihre Rechte */}
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-zinc-900">5. Ihre Rechte</h2>
          <p className="text-sm leading-relaxed text-zinc-600">
            Sie haben jederzeit das Recht auf unentgeltliche Auskunft über Ihre gespeicherten personenbezogenen Daten, deren Herkunft und Empfänger und den Zweck der Datenverarbeitung sowie ein Recht auf Berichtigung oder Löschung dieser Daten.
          </p>
        </section>

        {/* 6. Kontakt */}
        <section className="space-y-2 pt-4 border-t border-zinc-100">
          <h2 className="text-base font-bold text-zinc-900">Kontakt</h2>
          <p className="text-xs text-zinc-500">
            Bei Fragen zum Datenschutz erreichen Sie uns jederzeit über unsere offiziellen Community-Kanäle (Telegram, Discord) oder per E-Mail.
          </p>
        </section>
      </div>
    </div>
  );
}