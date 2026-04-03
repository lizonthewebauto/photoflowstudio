import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { slugify } from '@/lib/utils';

export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { data: brands, error } = await supabase
    .from('brands')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(brands);
}

export async function POST(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await request.json();

  // Check if this is the user's first brand
  const { count } = await supabase
    .from('brands')
    .select('id', { count: 'exact', head: true })
    .eq('user_id', user.id);

  const isFirst = (count ?? 0) === 0;

  const slug = slugify(body.name);

  const { data: brand, error } = await supabase
    .from('brands')
    .insert({
      user_id: user.id,
      name: body.name,
      slug,
      website_url: body.website_url,
      logo_url: body.logo_url,
      tagline: body.tagline,
      voice_description: body.voice_description,
      brand_personality: body.brand_personality,
      style_keywords: body.style_keywords || [],
      tone_presets: body.tone_presets || [],
      icp_description: body.icp_description,
      target_audience: body.target_audience,
      audience_pain_points: body.audience_pain_points || [],
      audience_desires: body.audience_desires || [],
      niche: body.niche,
      service_area: body.service_area,
      price_positioning: body.price_positioning,
      differentiator: body.differentiator,
      color_primary: body.color_primary || '#2d2d2d',
      color_secondary: body.color_secondary || '#faf8f5',
      color_accent: body.color_accent,
      color_background: body.color_background,
      color_text: body.color_text,
      font_heading: body.font_heading || 'Playfair Display',
      font_body: body.font_body || 'Lora',
      font_accent: body.font_accent,
      review_count: body.review_count,
      review_tagline: body.review_tagline,
      instagram_handle: body.instagram_handle,
      website_tagline: body.website_tagline,
      social_links: body.social_links || {},
      extracted_from_url: body.extracted_from_url || false,
      is_default: isFirst,
    })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  // Try to create Bundle Social team in background (non-blocking)
  if (process.env.BUNDLE_SOCIAL_API_KEY) {
    try {
      const { createTeam } = await import('@/lib/bundle-social/client');
      const team = await createTeam(body.name);
      if (team?.id) {
        await supabase
          .from('brands')
          .update({ bundle_social_team_id: team.id })
          .eq('id', brand.id);
      }
    } catch {
      // Non-critical, continue
    }
  }

  return NextResponse.json(brand, { status: 201 });
}
