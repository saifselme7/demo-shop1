-- SAIF STORE — Seed Data from static catalog (English-only, SAIF STORE branding)
-- Categories
insert into categories (id, name, slug, description, image_url) values
  ('outerwear', 'Outerwear', 'outerwear', 'Structured outerwear and coats', 'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=1200&q=80'),
  ('knitwear', 'Knitwear', 'knitwear', 'Cashmere and merino knitwear', 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?auto=format&fit=crop&w=1200&q=80'),
  ('trousers', 'Trousers', 'trousers', 'Tailored trousers and chinos', 'https://images.unsplash.com/photo-1584302058527-2e90841a2227?auto=format&fit=crop&w=1200&q=80'),
  ('dresses', 'Dresses', 'dresses', 'Silk and wool dresses', 'https://images.unsplash.com/photo-1571513808435-6d0d1c7d7a24?auto=format&fit=crop&w=1200&q=80'),
  ('accessories', 'Accessories', 'accessories', 'Bags, scarves and essentials', 'https://images.unsplash.com/photo-1547949003-97960816d757?auto=format&fit=crop&w=1200&q=80')
on conflict (id) do update set
  name = excluded.name,
  slug = excluded.slug,
  description = excluded.description,
  image_url = excluded.image_url,
  updated_at = now();

-- Collections
insert into collections (id, name, slug, subtitle, description, image_url, pieces) values
  ('aw-reserve', 'AW — Reserve', 'aw-reserve', 'Cold-weather essentials', 'Brushed wools, cashmere, and structured outerwear. The considered cold-weather wardrobe.', 'https://images.unsplash.com/premium_photo-1723651300444-c663962dcb92b?auto=format&fit=crop&w=1800&q=80', 24),
  ('spring-reserve', 'Spring — Reserve', 'spring-reserve', 'Linen, poplin and silk', 'Lightweight tailoring in Irish linen, sandwashed silk, and crisp cotton poplin.', 'https://images.unsplash.com/premium_photo-1664300166849-dc66a719ee0f?auto=format&fit=crop&w=1800&q=80', 18),
  ('atelier-archive', 'Atelier — Archive', 'atelier-archive', 'Foundational pieces', 'A studied archive of foundational pieces — patterns refined, never replaced.', 'https://images.unsplash.com/premium_photo-1663045469848-7df171d1fe04?auto=format&fit=crop&w=1800&q=80', 12)
on conflict (id) do update set
  name = excluded.name,
  slug = excluded.slug,
  subtitle = excluded.subtitle,
  description = excluded.description,
  image_url = excluded.image_url,
  pieces = excluded.pieces,
  updated_at = now();

-- Products
insert into products (id, slug, name, subtitle, description, price, compare_at_price, currency, category_id, collection_id, featured, is_new, details, sizes, colors) values
  ('p01', 'oversized-wool-coat', 'Oversized Wool Coat', 'Brushed merino, mid-length', 'A loose, architectural coat cut from brushed merino. Raglan sleeves, concealed placket, and a weighted hem that falls without resistance.', 685, 850, '€', 'outerwear', 'aw-reserve', true, true,
   '["100% Italian merino wool", "Concealed horn-button placket", "Bemberg cupro lining", "Made in Portugal"]'::jsonb,
   '["XS", "S", "M", "L", "XL"]'::jsonb,
   '[{"name": "Charcoal", "hex": "#3A3A38"}, {"name": "Camel", "hex": "#A88B66"}]'::jsonb),
  ('p02', 'cashmere-mock-neck', 'Cashmere Mock Neck', '8-gauge, undyed fibre', 'A relaxed mock-neck pullover knitted from undyed Mongolian cashmere. Boxy through the body, with a ribbed funnel collar.', 320, 400, '€', 'knitwear', 'aw-reserve', true, true,
   '["100% grade-A Mongolian cashmere", "8-gauge plain knit", "Ribbed funnel collar and cuffs", "Made in Scotland"]'::jsonb,
   '["XS", "S", "M", "L"]'::jsonb,
   '[{"name": "Oat", "hex": "#D9CDB6"}, {"name": "Stone", "hex": "#A39782"}]'::jsonb),
  ('p03', 'wide-pleated-trouser', 'Wide Pleated Trouser', 'Tropical wool, double-pleat', 'High-rise, double-pleated trouser in pressed tropical wool. Full through the leg, gently tapered at the hem.', 295, 350, '€', 'trousers', 'aw-reserve', true, false,
   '["96% virgin wool, 4% elastane", "Double front pleats", "Hook-and-eye closure", "Made in Italy"]'::jsonb,
   '["28", "30", "32", "34", "36"]'::jsonb,
   '[{"name": "Anthracite", "hex": "#2F2F2D"}, {"name": "Sand", "hex": "#C7B79A"}]'::jsonb),
  ('p04', 'bias-cut-silk-slip', 'Bias-Cut Silk Slip', 'Sandwashed silk, floor-length', 'A floor-length bias-cut slip in sandwashed silk. Cowl neckline, thin adjustable straps, and a fluid, weighted fall.', 380, 480, '€', 'dresses', 'aw-reserve', true, false,
   '["100% sandwashed silk", "Bias cut", "Adjustable straps", "Made in France"]'::jsonb,
   '["XS", "S", "M", "L"]'::jsonb,
   '[{"name": "Bone", "hex": "#E5DCC7"}, {"name": "Ink", "hex": "#1B1B1B"}]'::jsonb),
  ('p05', 'structured-linen-blazer', 'Structured Linen Blazer', 'Irish linen, half-canvas', 'A half-canvas single-breasted blazer in dry-finish Irish linen. Soft shoulder, notch lapel, and patch pockets.', 410, 520, '€', 'outerwear', 'spring-reserve', true, false,
   '["100% Irish linen", "Half-canvas construction", "Patch pockets", "Made in Portugal"]'::jsonb,
   '["XS", "S", "M", "L", "XL"]'::jsonb,
   '[{"name": "Ecru", "hex": "#E8E0D3"}, {"name": "Coal", "hex": "#232323"}]'::jsonb),
  ('p06', 'merino-roll-neck', 'Merino Roll Neck', 'Extra-fine, second-skin', 'A long-sleeve roll neck in extra-fine 18.5-micron merino. Slim through the body, layered or alone.', 180, 220, '€', 'knitwear', 'spring-reserve', true, false,
   '["100% extra-fine merino", "18.5 micron", "Fully fashioned", "Made in Italy"]'::jsonb,
   '["XS", "S", "M", "L"]'::jsonb,
   '[{"name": "Ivory", "hex": "#EDE5D3"}, {"name": "Slate", "hex": "#444444"}]'::jsonb),
  ('p07', 'cotton-twill-chino', 'Cotton Twill Chino', 'Garment-dyed, straight-leg', 'A straight-leg chino in 8-oz garment-dyed cotton twill. Mid-rise, slanted front pockets, clean unbroken hem.', 220, 280, '€', 'trousers', 'spring-reserve', true, false,
   '["8-oz cotton twill", "Garment-dyed", "Slanted front pockets", "Made in Portugal"]'::jsonb,
   '["28", "30", "32", "34", "36"]'::jsonb,
   '[{"name": "Faded Olive", "hex": "#6A6F4D"}, {"name": "Washed Black", "hex": "#2C2C2C"}]'::jsonb),
  ('p08', 'wrap-wool-dress', 'Wrap Wool Dress', 'Crispa crepe, ankle-length', 'An ankle-length wrap dress in matte Crispa crepe. Soft collar, self-tie waist, and a deep inverted pleat.', 440, 550, '€', 'dresses', 'spring-reserve', true, false,
   '["Crispa crepe, 96% wool", "Self-tie waist", "Inverted centre pleat", "Made in Italy"]'::jsonb,
   '["XS", "S", "M", "L"]'::jsonb,
   '[{"name": "Clay", "hex": "#A4715A"}, {"name": "Black", "hex": "#0E0E0E"}]'::jsonb),
  ('p09', 'leather-shoulder-bag', 'Leather Shoulder Bag', 'Vegetable-tanned, structured', 'A structured shoulder bag in vegetable-tanned bovine leather. Magnetic flap, single interior pocket, brass hardware.', 510, 650, '€', 'accessories', 'aw-reserve', true, true,
   '["Vegetable-tanned bovine leather", "Brass hardware", "Suede lining", "Made in Italy"]'::jsonb,
   '["One size"]'::jsonb,
   '[{"name": "Tan", "hex": "#9B6E3F"}, {"name": "Black", "hex": "#0E0E0E"}]'::jsonb),
  ('p10', 'cashmere-scarf', 'Cashmere Scarf', 'Fringed, double-ply', 'A double-ply cashmere scarf with hand-knotted fringe. Generous proportions, woven on traditional looms.', 165, 200, '€', 'accessories', 'aw-reserve', true, false,
   '["100% cashmere", "Double-ply", "Hand-knotted fringe", "Made in Scotland"]'::jsonb,
   '["One size"]'::jsonb,
   '[{"name": "Oat", "hex": "#D9CDB6"}, {"name": "Graphite", "hex": "#3A3A3A"}]'::jsonb),
  ('p11', 'cotton-poplin-shirt', 'Cotton Poplin Shirt', 'Tight weave, relaxed fit', 'A relaxed-fit shirt in dense cotton poplin. Soft camp collar, mother-of-pearl buttons, curved hem.', 195, 240, '€', 'outerwear', 'spring-reserve', true, false,
   '["100% cotton poplin", "Mother-of-pearl buttons", "Camp collar", "Made in Portugal"]'::jsonb,
   '["XS", "S", "M", "L", "XL"]'::jsonb,
   '[{"name": "Optic White", "hex": "#F4F1EA"}, {"name": "Sky", "hex": "#9FB3C8"}]'::jsonb),
  ('p12', 'ribbed-cotton-sock', 'Ribbed Cotton Sock', 'Long-staple, ribbed', 'A mid-calf ribbed sock in long-staple Egyptian cotton. Reinforced heel and toe, seamless toe closure.', 35, 45, '€', 'accessories', 'spring-reserve', true, false,
   '["88% Egyptian cotton", "10% polyamide, 2% elastane", "Seamless toe", "Made in Italy"]'::jsonb,
   '["S", "M", "L"]'::jsonb,
   '[{"name": "Bone", "hex": "#E5DCC7"}, {"name": "Soot", "hex": "#2A2A2A"}]'::jsonb)
on conflict (id) do update set
  slug = excluded.slug,
  name = excluded.name,
  subtitle = excluded.subtitle,
  description = excluded.description,
  price = excluded.price,
  compare_at_price = excluded.compare_at_price,
  currency = excluded.currency,
  category_id = excluded.category_id,
  collection_id = excluded.collection_id,
  featured = excluded.featured,
  is_new = excluded.is_new,
  details = excluded.details,
  sizes = excluded.sizes,
  colors = excluded.colors,
  updated_at = now();

-- Product Images
insert into product_images (product_id, image_url, alt_text, sort_order) values
  ('p01', 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1400&q=80', 'Oversized Wool Coat', 0),
  ('p01', 'https://images.unsplash.com/photo-1485230895905-ec40ba36b9bc?auto=format&fit=crop&w=1400&q=80', 'Oversized Wool Coat detail', 1),
  ('p02', 'https://images.unsplash.com/photo-1608748010899-18f300247112?auto=format&fit=crop&w=1400&q=80', 'Cashmere Mock Neck', 0),
  ('p02', 'https://images.unsplash.com/photo-1621190595987-0d5f9b449233?auto=format&fit=crop&w=1400&q=80', 'Cashmere Mock Neck detail', 1),
  ('p03', 'https://images.unsplash.com/photo-1594633312687-16307288dd64?auto=format&fit=crop&w=1400&q=80', 'Wide Pleated Trouser', 0),
  ('p03', 'https://images.unsplash.com/photo-1506629082955-21b7767d54a1?auto=format&fit=crop&w=1400&q=80', 'Wide Pleated Trouser detail', 1),
  ('p04', 'https://images.unsplash.com/photo-1518570305330-b4e045569e53?auto=format&fit=crop&w=1400&q=80', 'Bias-Cut Silk Slip', 0),
  ('p04', 'https://images.unsplash.com/premium_photo-1661657720305-ec3a988c8763?auto=format&fit=crop&w=1400&q=80', 'Bias-Cut Silk Slip detail', 1),
  ('p05', 'https://images.unsplash.com/photo-1485231183945-8c42f0d6e7a1?auto=format&fit=crop&w=1400&q=80', 'Structured Linen Blazer', 0),
  ('p05', 'https://images.unsplash.com/photo-1515882315439-5a6cbf8b7c8c?auto=format&fit=crop&w=1400&q=80', 'Structured Linen Blazer detail', 1),
  ('p06', 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?auto=format&fit=crop&w=1400&q=80', 'Merino Roll Neck', 0),
  ('p06', 'https://images.unsplash.com/photo-1758537698215-af1e35acb911?auto=format&fit=crop&w=1400&q=80', 'Merino Roll Neck detail', 1),
  ('p07', 'https://images.unsplash.com/photo-1594631252845-29fc4cc8cde9?auto=format&fit=crop&w=1400&q=80', 'Cotton Twill Chino', 0),
  ('p07', 'https://images.unsplash.com/photo-1507680434567-5739c80be1e1?auto=format&fit=crop&w=1400&q=80', 'Cotton Twill Chino detail', 1),
  ('p08', 'https://images.unsplash.com/photo-1485968579580-b6d095142e6f?auto=format&fit=crop&w=1400&q=80', 'Wrap Wool Dress', 0),
  ('p08', 'https://images.unsplash.com/photo-1496747613729-02e3241d429f?auto=format&fit=crop&w=1400&q=80', 'Wrap Wool Dress detail', 1),
  ('p09', 'https://images.unsplash.com/photo-1547949003-97960816d757?auto=format&fit=crop&w=1400&q=80', 'Leather Shoulder Bag', 0),
  ('p09', 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=1400&q=80', 'Leather Shoulder Bag detail', 1),
  ('p10', 'https://images.unsplash.com/photo-1523779105320-d1cd346ff52b?auto=format&fit=crop&w=1400&q=80', 'Cashmere Scarf', 0),
  ('p10', 'https://images.unsplash.com/photo-1601758228045-3c1a6c43c9b0?auto=format&fit=crop&w=1400&q=80', 'Cashmere Scarf detail', 1),
  ('p11', 'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=1400&q=80', 'Cotton Poplin Shirt', 0),
  ('p11', 'https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&w=1400&q=80', 'Cotton Poplin Shirt detail', 1),
  ('p12', 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&w=1400&q=80', 'Ribbed Cotton Sock', 0),
  ('p12', 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=1400&q=80', 'Ribbed Cotton Sock detail', 1);

-- Product Variants — generate for each color*size
-- p01: 2 colors * 5 sizes = 10
insert into product_variants (product_id, color_name, color_hex, size, sku, stock) values
  ('p01', 'Charcoal', '#3A3A38', 'XS', 'p01-charcoal-xs', 12),
  ('p01', 'Charcoal', '#3A3A38', 'S', 'p01-charcoal-s', 8),
  ('p01', 'Charcoal', '#3A3A38', 'M', 'p01-charcoal-m', 15),
  ('p01', 'Charcoal', '#3A3A38', 'L', 'p01-charcoal-l', 6),
  ('p01', 'Charcoal', '#3A3A38', 'XL', 'p01-charcoal-xl', 4),
  ('p01', 'Camel', '#A88B66', 'XS', 'p01-camel-xs', 10),
  ('p01', 'Camel', '#A88B66', 'S', 'p01-camel-s', 9),
  ('p01', 'Camel', '#A88B66', 'M', 'p01-camel-m', 7),
  ('p01', 'Camel', '#A88B66', 'L', 'p01-camel-l', 5),
  ('p01', 'Camel', '#A88B66', 'XL', 'p01-camel-xl', 3)
on conflict (product_id, color_name, size) do update set sku = excluded.sku, stock = excluded.stock, updated_at = now();

-- p02: 2*4=8
insert into product_variants (product_id, color_name, color_hex, size, sku, stock) values
  ('p02', 'Oat', '#D9CDB6', 'XS', 'p02-oat-xs', 14),
  ('p02', 'Oat', '#D9CDB6', 'S', 'p02-oat-s', 12),
  ('p02', 'Oat', '#D9CDB6', 'M', 'p02-oat-m', 10),
  ('p02', 'Oat', '#D9CDB6', 'L', 'p02-oat-l', 6),
  ('p02', 'Stone', '#A39782', 'XS', 'p02-stone-xs', 11),
  ('p02', 'Stone', '#A39782', 'S', 'p02-stone-s', 9),
  ('p02', 'Stone', '#A39782', 'M', 'p02-stone-m', 8),
  ('p02', 'Stone', '#A39782', 'L', 'p02-stone-l', 5)
on conflict (product_id, color_name, size) do update set sku = excluded.sku, stock = excluded.stock, updated_at = now();

-- p03: 2*5=10
insert into product_variants (product_id, color_name, color_hex, size, sku, stock) values
  ('p03', 'Anthracite', '#2F2F2D', '28', 'p03-anthracite-28', 7),
  ('p03', 'Anthracite', '#2F2F2D', '30', 'p03-anthracite-30', 9),
  ('p03', 'Anthracite', '#2F2F2D', '32', 'p03-anthracite-32', 12),
  ('p03', 'Anthracite', '#2F2F2D', '34', 'p03-anthracite-34', 6),
  ('p03', 'Anthracite', '#2F2F2D', '36', 'p03-anthracite-36', 4),
  ('p03', 'Sand', '#C7B79A', '28', 'p03-sand-28', 8),
  ('p03', 'Sand', '#C7B79A', '30', 'p03-sand-30', 10),
  ('p03', 'Sand', '#C7B79A', '32', 'p03-sand-32', 11),
  ('p03', 'Sand', '#C7B79A', '34', 'p03-sand-34', 5),
  ('p03', 'Sand', '#C7B79A', '36', 'p03-sand-36', 3)
on conflict (product_id, color_name, size) do update set sku = excluded.sku, stock = excluded.stock, updated_at = now();

-- p04: 2*4=8
insert into product_variants (product_id, color_name, color_hex, size, sku, stock) values
  ('p04', 'Bone', '#E5DCC7', 'XS', 'p04-bone-xs', 6),
  ('p04', 'Bone', '#E5DCC7', 'S', 'p04-bone-s', 8),
  ('p04', 'Bone', '#E5DCC7', 'M', 'p04-bone-m', 10),
  ('p04', 'Bone', '#E5DCC7', 'L', 'p04-bone-l', 4),
  ('p04', 'Ink', '#1B1B1B', 'XS', 'p04-ink-xs', 5),
  ('p04', 'Ink', '#1B1B1B', 'S', 'p04-ink-s', 7),
  ('p04', 'Ink', '#1B1B1B', 'M', 'p04-ink-m', 9),
  ('p04', 'Ink', '#1B1B1B', 'L', 'p04-ink-l', 3)
on conflict (product_id, color_name, size) do update set sku = excluded.sku, stock = excluded.stock, updated_at = now();

-- p05: 2*5=10
insert into product_variants (product_id, color_name, color_hex, size, sku, stock) values
  ('p05', 'Ecru', '#E8E0D3', 'XS', 'p05-ecru-xs', 9),
  ('p05', 'Ecru', '#E8E0D3', 'S', 'p05-ecru-s', 11),
  ('p05', 'Ecru', '#E8E0D3', 'M', 'p05-ecru-m', 13),
  ('p05', 'Ecru', '#E8E0D3', 'L', 'p05-ecru-l', 7),
  ('p05', 'Ecru', '#E8E0D3', 'XL', 'p05-ecru-xl', 5),
  ('p05', 'Coal', '#232323', 'XS', 'p05-coal-xs', 8),
  ('p05', 'Coal', '#232323', 'S', 'p05-coal-s', 10),
  ('p05', 'Coal', '#232323', 'M', 'p05-coal-m', 12),
  ('p05', 'Coal', '#232323', 'L', 'p05-coal-l', 6),
  ('p05', 'Coal', '#232323', 'XL', 'p05-coal-xl', 4)
on conflict (product_id, color_name, size) do update set sku = excluded.sku, stock = excluded.stock, updated_at = now();

-- p06: 2*4=8
insert into product_variants (product_id, color_name, color_hex, size, sku, stock) values
  ('p06', 'Ivory', '#EDE5D3', 'XS', 'p06-ivory-xs', 15),
  ('p06', 'Ivory', '#EDE5D3', 'S', 'p06-ivory-s', 13),
  ('p06', 'Ivory', '#EDE5D3', 'M', 'p06-ivory-m', 11),
  ('p06', 'Ivory', '#EDE5D3', 'L', 'p06-ivory-l', 7),
  ('p06', 'Slate', '#444444', 'XS', 'p06-slate-xs', 12),
  ('p06', 'Slate', '#444444', 'S', 'p06-slate-s', 10),
  ('p06', 'Slate', '#444444', 'M', 'p06-slate-m', 8),
  ('p06', 'Slate', '#444444', 'L', 'p06-slate-l', 5)
on conflict (product_id, color_name, size) do update set sku = excluded.sku, stock = excluded.stock, updated_at = now();

-- p07: 2*5=10
insert into product_variants (product_id, color_name, color_hex, size, sku, stock) values
  ('p07', 'Faded Olive', '#6A6F4D', '28', 'p07-olive-28', 9),
  ('p07', 'Faded Olive', '#6A6F4D', '30', 'p07-olive-30', 11),
  ('p07', 'Faded Olive', '#6A6F4D', '32', 'p07-olive-32', 14),
  ('p07', 'Faded Olive', '#6A6F4D', '34', 'p07-olive-34', 7),
  ('p07', 'Faded Olive', '#6A6F4D', '36', 'p07-olive-36', 4),
  ('p07', 'Washed Black', '#2C2C2C', '28', 'p07-black-28', 8),
  ('p07', 'Washed Black', '#2C2C2C', '30', 'p07-black-30', 10),
  ('p07', 'Washed Black', '#2C2C2C', '32', 'p07-black-32', 12),
  ('p07', 'Washed Black', '#2C2C2C', '34', 'p07-black-34', 6),
  ('p07', 'Washed Black', '#2C2C2C', '36', 'p07-black-36', 3)
on conflict (product_id, color_name, size) do update set sku = excluded.sku, stock = excluded.stock, updated_at = now();

-- p08: 2*4=8
insert into product_variants (product_id, color_name, color_hex, size, sku, stock) values
  ('p08', 'Clay', '#A4715A', 'XS', 'p08-clay-xs', 6),
  ('p08', 'Clay', '#A4715A', 'S', 'p08-clay-s', 8),
  ('p08', 'Clay', '#A4715A', 'M', 'p08-clay-m', 10),
  ('p08', 'Clay', '#A4715A', 'L', 'p08-clay-l', 4),
  ('p08', 'Black', '#0E0E0E', 'XS', 'p08-black-xs', 5),
  ('p08', 'Black', '#0E0E0E', 'S', 'p08-black-s', 7),
  ('p08', 'Black', '#0E0E0E', 'M', 'p08-black-m', 9),
  ('p08', 'Black', '#0E0E0E', 'L', 'p08-black-l', 3)
on conflict (product_id, color_name, size) do update set sku = excluded.sku, stock = excluded.stock, updated_at = now();

-- p09: 2*1=2
insert into product_variants (product_id, color_name, color_hex, size, sku, stock) values
  ('p09', 'Tan', '#9B6E3F', 'One size', 'p09-tan-os', 12),
  ('p09', 'Black', '#0E0E0E', 'One size', 'p09-black-os', 8)
on conflict (product_id, color_name, size) do update set sku = excluded.sku, stock = excluded.stock, updated_at = now();

-- p10: 2*1=2
insert into product_variants (product_id, color_name, color_hex, size, sku, stock) values
  ('p10', 'Oat', '#D9CDB6', 'One size', 'p10-oat-os', 20),
  ('p10', 'Graphite', '#3A3A3A', 'One size', 'p10-graphite-os', 15)
on conflict (product_id, color_name, size) do update set sku = excluded.sku, stock = excluded.stock, updated_at = now();

-- p11: 2*5=10
insert into product_variants (product_id, color_name, color_hex, size, sku, stock) values
  ('p11', 'Optic White', '#F4F1EA', 'XS', 'p11-white-xs', 10),
  ('p11', 'Optic White', '#F4F1EA', 'S', 'p11-white-s', 12),
  ('p11', 'Optic White', '#F4F1EA', 'M', 'p11-white-m', 14),
  ('p11', 'Optic White', '#F4F1EA', 'L', 'p11-white-l', 8),
  ('p11', 'Optic White', '#F4F1EA', 'XL', 'p11-white-xl', 5),
  ('p11', 'Sky', '#9FB3C8', 'XS', 'p11-sky-xs', 9),
  ('p11', 'Sky', '#9FB3C8', 'S', 'p11-sky-s', 11),
  ('p11', 'Sky', '#9FB3C8', 'M', 'p11-sky-m', 13),
  ('p11', 'Sky', '#9FB3C8', 'L', 'p11-sky-l', 7),
  ('p11', 'Sky', '#9FB3C8', 'XL', 'p11-sky-xl', 4)
on conflict (product_id, color_name, size) do update set sku = excluded.sku, stock = excluded.stock, updated_at = now();

-- p12: 2*3=6
insert into product_variants (product_id, color_name, color_hex, size, sku, stock) values
  ('p12', 'Bone', '#E5DCC7', 'S', 'p12-bone-s', 25),
  ('p12', 'Bone', '#E5DCC7', 'M', 'p12-bone-m', 30),
  ('p12', 'Bone', '#E5DCC7', 'L', 'p12-bone-l', 20),
  ('p12', 'Soot', '#2A2A2A', 'S', 'p12-soot-s', 22),
  ('p12', 'Soot', '#2A2A2A', 'M', 'p12-soot-m', 28),
  ('p12', 'Soot', '#2A2A2A', 'L', 'p12-soot-l', 18)
on conflict (product_id, color_name, size) do update set sku = excluded.sku, stock = excluded.stock, updated_at = now();
