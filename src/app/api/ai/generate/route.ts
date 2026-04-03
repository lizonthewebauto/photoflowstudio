import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { chatCompletion } from '@/lib/ai/client';
import { buildVoicePrompt } from '@/lib/ai/prompts';

export async function POST(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { brand_id, vibe, context } = await request.json();

  if (!brand_id || !vibe) {
    return NextResponse.json({ error: 'brand_id and vibe required' }, { status: 400 });
  }

  // Fetch brand
  const { data: brand } = await supabase
    .from('brands')
    .select('*')
    .eq('id', brand_id)
    .eq('user_id', user.id)
    .single();

  if (!brand) return NextResponse.json({ error: 'Brand not found' }, { status: 404 });

  const voicePrompt = buildVoicePrompt(brand);

  const systemPrompt = `${voicePrompt}

You are writing social media slide content for a photographer/creative brand.

The vibe is: ${vibe}

Generate a headline (short, punchy, max 8 words) and body text (1-2 sentences, max 30 words) for a social media slide/carousel.

The content should match the vibe and brand voice. It should be engaging and make people want to save or share the post.

Return ONLY valid JSON:
{"headline": "...", "body_text": "..."}`;

  try {
    const result = await chatCompletion(systemPrompt, context || 'Generate content for a social media slide.');

    let cleaned = result.trim();
    if (cleaned.startsWith('```json')) cleaned = cleaned.slice(7);
    if (cleaned.startsWith('```')) cleaned = cleaned.slice(3);
    if (cleaned.endsWith('```')) cleaned = cleaned.slice(0, -3);
    cleaned = cleaned.trim();

    const generated = JSON.parse(cleaned);
    return NextResponse.json(generated);
  } catch (err) {
    console.error('AI generation error:', err);
    return NextResponse.json({ error: 'Content generation failed. Please try again.' }, { status: 500 });
  }
}
