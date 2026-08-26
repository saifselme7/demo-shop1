import { supabase } from '../../lib/supabase'
import { HeroContent } from '../hero'

export async function adminGetHeroes(): Promise<HeroContent[]> {
  const { data, error } = await supabase.from('hero_content').select('*').order('updated_at', { ascending: false })
  if (error) throw error
  return data as HeroContent[]
}

export async function adminGetActiveHero(): Promise<HeroContent | null> {
  const { data, error } = await supabase.from('hero_content').select('*').eq('is_active', true).maybeSingle()
  if (error) throw error
  return data as HeroContent | null
}

export async function adminCreateHero(hero: Partial<HeroContent>) {
  const { data, error } = await supabase.from('hero_content').insert({
    eyebrow: hero.eyebrow || 'THE ATELIER',
    title: hero.title || 'Garments for\nthe considered\nlife.',
    description: hero.description || '',
    primary_button_text: hero.primary_button_text || 'BROWSE THE COLLECTION',
    primary_button_link: hero.primary_button_link || '/shop',
    secondary_button_text: hero.secondary_button_text || 'THE ATELIER',
    secondary_button_link: hero.secondary_button_link || '/about',
    background_image_url: hero.background_image_url || '',
    background_image_alt: hero.background_image_alt || '',
    is_active: hero.is_active ?? true,
  }).select().single()
  if (error) throw error
  return data
}

export async function adminUpdateHero(id: string, updates: Partial<HeroContent>) {
  const { data, error } = await supabase.from('hero_content').update({ ...updates, updated_at: new Date().toISOString() }).eq('id', id).select().single()
  if (error) throw error
  return data
}

export async function adminDeleteHero(id: string) {
  const { error } = await supabase.from('hero_content').delete().eq('id', id)
  if (error) throw error
}

// Storage for hero images
export async function uploadHeroImage(file: File): Promise<string> {
  const MAX_SIZE = 5 * 1024 * 1024
  const ALLOWED = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
  if (file.size > MAX_SIZE) throw new Error('Max 5MB')
  if (!ALLOWED.includes(file.type)) throw new Error('Only JPG/PNG/WEBP allowed')

  const ext = file.name.split('.').pop()?.toLowerCase() || 'webp'
  const path = `hero/${Date.now()}.${ext}`

  const { error } = await supabase.storage.from('hero-images').upload(path, file, { upsert: true, cacheControl: '3600', contentType: file.type })
  if (error) throw error

  const { data } = supabase.storage.from('hero-images').getPublicUrl(path)
  return data.publicUrl
}
