import { supabase } from '../lib/supabase'

export interface HeroContent {
  id: string
  eyebrow: string
  title: string
  description: string
  primary_button_text: string
  primary_button_link: string
  secondary_button_text: string
  secondary_button_link: string
  background_image_url: string
  background_image_alt: string | null
  is_active: boolean
  created_at: string
  updated_at: string
}

export async function getActiveHero(): Promise<HeroContent | null> {
  const { data, error } = await supabase
    .from('hero_content')
    .select('*')
    .eq('is_active', true)
    .order('updated_at', { ascending: false })
    .limit(1)
    .maybeSingle()

  if (error) throw error
  return data as HeroContent | null
}

export async function getAllHeroes(): Promise<HeroContent[]> {
  const { data, error } = await supabase
    .from('hero_content')
    .select('*')
    .order('updated_at', { ascending: false })

  if (error) throw error
  return data as HeroContent[]
}
