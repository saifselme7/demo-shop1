import { supabase } from '../lib/supabase'

export interface PaymentSettings {
  cod_enabled: boolean
  cod_label: string
  cod_instructions: string

  instapay_enabled: boolean
  instapay_label: string
  instapay_account: string
  instapay_account_name: string
  instapay_instructions: string

  vodafone_enabled: boolean
  vodafone_label: string
  vodafone_number: string
  vodafone_account_name: string
  vodafone_instructions: string
}

// Sensible fallback defaults (mirror the seeded row in migration 008).
// Used when Supabase is unreachable or settings table is missing.
export const DEFAULT_PAYMENT_SETTINGS: PaymentSettings = {
  cod_enabled: true,
  cod_label: 'Cash on Delivery',
  cod_instructions: 'Pay in cash when your order arrives. No payment proof is required.',

  instapay_enabled: true,
  instapay_label: 'InstaPay',
  instapay_account: 'saifstore@instapay',
  instapay_account_name: 'SAIF STORE',
  instapay_instructions:
    'This is a manual InstaPay transfer. Send the exact order amount to the InstaPay address above, take a screenshot of the completed transfer, then upload it as payment proof.',

  vodafone_enabled: true,
  vodafone_label: 'Vodafone Cash',
  vodafone_number: '01040324811',
  vodafone_account_name: 'SAIF STORE',
  vodafone_instructions:
    'This is a manual Vodafone Cash transfer. Transfer the exact order amount to the Vodafone Cash number above from your Vodafone Cash wallet, take a screenshot of the confirmation screen, then upload it as payment proof.',
}

let cached: PaymentSettings | null = null
let inflight: Promise<PaymentSettings> | null = null

export async function getPaymentSettings(force = false): Promise<PaymentSettings> {
  if (!force && cached) return cached
  if (!force && inflight) return inflight

  inflight = (async () => {
    try {
      const { data, error } = await supabase
        .from('payment_settings')
        .select('*')
        .eq('id', 'default')
        .maybeSingle()

      if (error || !data) {
        if (error) console.warn('payment_settings fetch failed, using defaults:', error.message)
        cached = { ...DEFAULT_PAYMENT_SETTINGS }
        return cached
      }

      cached = { ...DEFAULT_PAYMENT_SETTINGS, ...(data as Partial<PaymentSettings>) }
      return cached
    } finally {
      inflight = null
    }
  })()

  return inflight
}

export async function adminUpdatePaymentSettings(patch: Partial<PaymentSettings>): Promise<PaymentSettings> {
  const { data, error } = await supabase
    .from('payment_settings')
    .update({ ...patch, updated_at: new Date().toISOString() })
    .eq('id', 'default')
    .select()
    .single()

  if (error) throw error
  cached = { ...DEFAULT_PAYMENT_SETTINGS, ...(data as Partial<PaymentSettings>) }
  return cached
}
