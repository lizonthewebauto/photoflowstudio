export function buildVoicePrompt(brand: {
  name: string;
  voice_description: string | null;
  tone_presets: string[];
  brand_personality: string | null;
}): string {
  const parts: string[] = [];
  parts.push(`You are writing for ${brand.name}.`);
  if (brand.voice_description) parts.push(`Brand voice: ${brand.voice_description}`);
  if (brand.brand_personality) parts.push(`Brand personality: ${brand.brand_personality}`);
  if (brand.tone_presets.length) parts.push(`Tone: ${brand.tone_presets.join(', ')}`);
  return parts.join('\n');
}
