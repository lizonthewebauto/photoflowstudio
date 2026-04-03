'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Globe, Sparkles, Loader2, Check, Target, Palette,
  Type, Quote, User, Zap,
} from 'lucide-react';
import type { Brand, BrandExtraction } from '@/types';

const HEADING_FONTS = [
  'Playfair Display', 'Cormorant Garamond', 'Libre Baskerville', 'EB Garamond',
  'Crimson Text', 'DM Serif Display', 'Inter', 'Montserrat', 'Bebas Neue',
  'Poppins', 'Raleway', 'Oswald',
];

const BODY_FONTS = [
  'Lora', 'Cormorant', 'Libre Baskerville', 'Source Serif Pro', 'Merriweather',
  'Inter', 'Open Sans', 'Roboto', 'Nunito', 'Work Sans',
];

interface BrandFormProps {
  mode: 'create' | 'edit';
  brand?: Brand;
}

export function BrandForm({ mode, brand }: BrandFormProps) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [extracting, setExtracting] = useState(false);
  const [extracted, setExtracted] = useState(false);
  const [error, setError] = useState('');

  // Website URL for extraction
  const [websiteUrl, setWebsiteUrl] = useState(brand?.website_url || '');

  // Identity
  const [name, setName] = useState(brand?.name || '');
  const [instagramHandle, setInstagramHandle] = useState(brand?.instagram_handle || '');
  const [tagline, setTagline] = useState(brand?.tagline || '');
  const [niche, setNiche] = useState(brand?.niche || '');
  const [serviceArea, setServiceArea] = useState(brand?.service_area || '');
  const [websiteTagline, setWebsiteTagline] = useState(brand?.website_tagline || '');

  // Voice & Personality
  const [voiceDescription, setVoiceDescription] = useState(brand?.voice_description || '');
  const [brandPersonality, setBrandPersonality] = useState(brand?.brand_personality || '');
  const [styleKeywords, setStyleKeywords] = useState(brand?.style_keywords?.join(', ') || '');
  const [tonePresets, setTonePresets] = useState(brand?.tone_presets?.join(', ') || '');
  const [pricePositioning, setPricePositioning] = useState(brand?.price_positioning || '');
  const [differentiator, setDifferentiator] = useState(brand?.differentiator || '');

  // ICP
  const [targetAudience, setTargetAudience] = useState(brand?.target_audience || '');
  const [icpDescription, setIcpDescription] = useState(brand?.icp_description || '');
  const [painPoints, setPainPoints] = useState(brand?.audience_pain_points?.join('\n') || '');
  const [desires, setDesires] = useState(brand?.audience_desires?.join('\n') || '');

  // Colors
  const [colorPrimary, setColorPrimary] = useState(brand?.color_primary || '#2d2d2d');
  const [colorSecondary, setColorSecondary] = useState(brand?.color_secondary || '#faf8f5');
  const [colorAccent, setColorAccent] = useState(brand?.color_accent || '');
  const [colorBackground, setColorBackground] = useState(brand?.color_background || '');
  const [colorText, setColorText] = useState(brand?.color_text || '');

  // Typography
  const [fontHeading, setFontHeading] = useState(brand?.font_heading || 'Playfair Display');
  const [fontBody, setFontBody] = useState(brand?.font_body || 'Lora');
  const [fontAccent, setFontAccent] = useState(brand?.font_accent || '');

  // Social Proof
  const [reviewCount, setReviewCount] = useState(brand?.review_count || '');
  const [reviewTagline, setReviewTagline] = useState(brand?.review_tagline || '');

  // Social Links (extracted, read-only)
  const [socialLinks, setSocialLinks] = useState<Record<string, string>>(brand?.social_links || {});
  const [logoUrl, setLogoUrl] = useState(brand?.logo_url || '');

  async function handleExtract() {
    if (!websiteUrl) return;
    setExtracting(true);
    setError('');

    try {
      const res = await fetch('/api/brands/extract', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: websiteUrl }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Extraction failed');
      }

      const data: BrandExtraction = await res.json();

      // Fill form fields from extraction
      if (data.name) setName(data.name);
      if (data.tagline) setTagline(data.tagline);
      if (data.voice_description) setVoiceDescription(data.voice_description);
      if (data.brand_personality) setBrandPersonality(data.brand_personality);
      if (data.style_keywords?.length) setStyleKeywords(data.style_keywords.join(', '));
      if (data.tone_presets?.length) setTonePresets(data.tone_presets.join(', '));
      if (data.icp_description) setIcpDescription(data.icp_description);
      if (data.target_audience) setTargetAudience(data.target_audience);
      if (data.audience_pain_points?.length) setPainPoints(data.audience_pain_points.join('\n'));
      if (data.audience_desires?.length) setDesires(data.audience_desires.join('\n'));
      if (data.niche) setNiche(data.niche);
      if (data.service_area) setServiceArea(data.service_area);
      if (data.price_positioning) setPricePositioning(data.price_positioning);
      if (data.differentiator) setDifferentiator(data.differentiator);
      if (data.color_primary) setColorPrimary(data.color_primary);
      if (data.color_secondary) setColorSecondary(data.color_secondary);
      if (data.color_accent) setColorAccent(data.color_accent);
      if (data.color_background) setColorBackground(data.color_background);
      if (data.color_text) setColorText(data.color_text);
      if (data.font_heading) setFontHeading(data.font_heading);
      if (data.font_body) setFontBody(data.font_body);
      if (data.font_accent) setFontAccent(data.font_accent);
      if (data.review_count) setReviewCount(data.review_count);
      if (data.review_tagline) setReviewTagline(data.review_tagline);
      if (data.instagram_handle) setInstagramHandle(data.instagram_handle);
      if (data.website_tagline) setWebsiteTagline(data.website_tagline);
      if (data.social_links) setSocialLinks(data.social_links);
      if (data.logo_url) setLogoUrl(data.logo_url);

      setExtracted(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Extraction failed');
    } finally {
      setExtracting(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError('');

    const body = {
      name,
      website_url: websiteUrl || null,
      logo_url: logoUrl || null,
      tagline: tagline || null,
      voice_description: voiceDescription || null,
      brand_personality: brandPersonality || null,
      style_keywords: styleKeywords ? styleKeywords.split(',').map((s) => s.trim()).filter(Boolean) : [],
      tone_presets: tonePresets ? tonePresets.split(',').map((s) => s.trim()).filter(Boolean) : [],
      icp_description: icpDescription || null,
      target_audience: targetAudience || null,
      audience_pain_points: painPoints ? painPoints.split('\n').map((s) => s.trim()).filter(Boolean) : [],
      audience_desires: desires ? desires.split('\n').map((s) => s.trim()).filter(Boolean) : [],
      niche: niche || null,
      service_area: serviceArea || null,
      price_positioning: pricePositioning || null,
      differentiator: differentiator || null,
      color_primary: colorPrimary,
      color_secondary: colorSecondary,
      color_accent: colorAccent || null,
      color_background: colorBackground || null,
      color_text: colorText || null,
      font_heading: fontHeading,
      font_body: fontBody,
      font_accent: fontAccent || null,
      review_count: reviewCount || null,
      review_tagline: reviewTagline || null,
      instagram_handle: instagramHandle || null,
      website_tagline: websiteTagline || null,
      social_links: socialLinks,
      extracted_from_url: extracted || (brand?.extracted_from_url ?? false),
    };

    try {
      const url = mode === 'create' ? '/api/brands' : `/api/brands/${brand!.id}`;
      const method = mode === 'create' ? 'POST' : 'PATCH';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Save failed');
      }

      router.push('/brands');
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Save failed');
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-3xl space-y-8">
      {error && (
        <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded text-sm">
          {error}
        </div>
      )}

      {/* Website Extraction */}
      <section className="bg-card border border-border rounded-lg p-6">
        <div className="flex items-center gap-2 mb-4">
          <Globe size={20} className="text-accent" />
          <h2 className="text-lg font-semibold text-foreground">Extract from Website</h2>
        </div>
        <p className="text-muted text-sm mb-4">
          Enter your website URL and we&apos;ll extract your brand identity automatically.
        </p>
        <div className="flex gap-3">
          <input
            type="url"
            value={websiteUrl}
            onChange={(e) => setWebsiteUrl(e.target.value)}
            placeholder="https://yourwebsite.com"
            className="flex-1 px-3 py-2 border border-border rounded bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
          />
          <button
            type="button"
            onClick={handleExtract}
            disabled={extracting || !websiteUrl}
            className="flex items-center gap-2 px-4 py-2 bg-accent text-white rounded hover:bg-accent-hover transition-colors disabled:opacity-50"
          >
            {extracting ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                Extracting...
              </>
            ) : extracted ? (
              <>
                <Check size={16} />
                Extracted
              </>
            ) : (
              <>
                <Sparkles size={16} />
                Extract Brand
              </>
            )}
          </button>
        </div>
      </section>

      {/* Identity */}
      <section className="bg-card border border-border rounded-lg p-6">
        <div className="flex items-center gap-2 mb-4">
          <User size={20} className="text-accent" />
          <h2 className="text-lg font-semibold text-foreground">Identity</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Brand Name *</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full px-3 py-2 border border-border rounded bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Instagram Handle</label>
            <input
              type="text"
              value={instagramHandle}
              onChange={(e) => setInstagramHandle(e.target.value)}
              placeholder="@yourhandle"
              className="w-full px-3 py-2 border border-border rounded bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-foreground mb-1">Tagline</label>
            <input
              type="text"
              value={tagline}
              onChange={(e) => setTagline(e.target.value)}
              className="w-full px-3 py-2 border border-border rounded bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Niche</label>
            <input
              type="text"
              value={niche}
              onChange={(e) => setNiche(e.target.value)}
              placeholder="e.g., Wedding Photography"
              className="w-full px-3 py-2 border border-border rounded bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Service Area</label>
            <input
              type="text"
              value={serviceArea}
              onChange={(e) => setServiceArea(e.target.value)}
              placeholder="e.g., New York, NY"
              className="w-full px-3 py-2 border border-border rounded bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-foreground mb-1">Website Hero Text</label>
            <input
              type="text"
              value={websiteTagline}
              onChange={(e) => setWebsiteTagline(e.target.value)}
              className="w-full px-3 py-2 border border-border rounded bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
            />
          </div>
        </div>
      </section>

      {/* Voice & Personality */}
      <section className="bg-card border border-border rounded-lg p-6">
        <div className="flex items-center gap-2 mb-4">
          <Zap size={20} className="text-accent" />
          <h2 className="text-lg font-semibold text-foreground">Voice & Personality</h2>
        </div>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Voice Description</label>
            <textarea
              value={voiceDescription}
              onChange={(e) => setVoiceDescription(e.target.value)}
              rows={3}
              placeholder="How does your brand speak? e.g., warm, professional, poetic"
              className="w-full px-3 py-2 border border-border rounded bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Brand Personality</label>
            <textarea
              value={brandPersonality}
              onChange={(e) => setBrandPersonality(e.target.value)}
              rows={2}
              placeholder="If your brand were a person, how would you describe them?"
              className="w-full px-3 py-2 border border-border rounded bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Style Keywords (comma-separated)</label>
              <input
                type="text"
                value={styleKeywords}
                onChange={(e) => setStyleKeywords(e.target.value)}
                placeholder="e.g., timeless, editorial, romantic"
                className="w-full px-3 py-2 border border-border rounded bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Tone Presets (comma-separated)</label>
              <input
                type="text"
                value={tonePresets}
                onChange={(e) => setTonePresets(e.target.value)}
                placeholder="e.g., warm, inviting, authentic"
                className="w-full px-3 py-2 border border-border rounded bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Price Positioning</label>
              <input
                type="text"
                value={pricePositioning}
                onChange={(e) => setPricePositioning(e.target.value)}
                placeholder="e.g., premium, luxury, mid-range, accessible"
                className="w-full px-3 py-2 border border-border rounded bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Differentiator</label>
              <input
                type="text"
                value={differentiator}
                onChange={(e) => setDifferentiator(e.target.value)}
                placeholder="What makes your brand unique?"
                className="w-full px-3 py-2 border border-border rounded bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ICP */}
      <section className="bg-card border border-border rounded-lg p-6">
        <div className="flex items-center gap-2 mb-4">
          <Target size={20} className="text-accent" />
          <h2 className="text-lg font-semibold text-foreground">Ideal Customer Profile</h2>
        </div>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Target Audience</label>
            <input
              type="text"
              value={targetAudience}
              onChange={(e) => setTargetAudience(e.target.value)}
              placeholder="e.g., engaged couples planning luxury weddings"
              className="w-full px-3 py-2 border border-border rounded bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">ICP Description</label>
            <textarea
              value={icpDescription}
              onChange={(e) => setIcpDescription(e.target.value)}
              rows={3}
              placeholder="Describe your ideal customer in detail"
              className="w-full px-3 py-2 border border-border rounded bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Pain Points (one per line)</label>
            <textarea
              value={painPoints}
              onChange={(e) => setPainPoints(e.target.value)}
              rows={4}
              placeholder={"Worried about finding the right photographer\nOverwhelmed by planning decisions\nWant photos that feel authentic"}
              className="w-full px-3 py-2 border border-border rounded bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Desires (one per line)</label>
            <textarea
              value={desires}
              onChange={(e) => setDesires(e.target.value)}
              rows={4}
              placeholder={"Timeless photos they'll cherish forever\nA photographer who gets their vision\nA stress-free experience"}
              className="w-full px-3 py-2 border border-border rounded bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
            />
          </div>
        </div>
      </section>

      {/* Colors */}
      <section className="bg-card border border-border rounded-lg p-6">
        <div className="flex items-center gap-2 mb-4">
          <Palette size={20} className="text-accent" />
          <h2 className="text-lg font-semibold text-foreground">Colors</h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-4">
          {[
            { label: 'Primary *', value: colorPrimary, setter: setColorPrimary },
            { label: 'Secondary *', value: colorSecondary, setter: setColorSecondary },
            { label: 'Accent', value: colorAccent, setter: setColorAccent },
            { label: 'Background', value: colorBackground, setter: setColorBackground },
            { label: 'Text', value: colorText, setter: setColorText },
          ].map((color) => (
            <div key={color.label}>
              <label className="block text-sm font-medium text-foreground mb-1">{color.label}</label>
              <div className="flex gap-2 items-center">
                <input
                  type="color"
                  value={color.value || '#000000'}
                  onChange={(e) => color.setter(e.target.value)}
                  className="w-8 h-8 rounded border border-border cursor-pointer"
                />
                <input
                  type="text"
                  value={color.value}
                  onChange={(e) => color.setter(e.target.value)}
                  placeholder="#000000"
                  className="flex-1 px-2 py-1 text-sm border border-border rounded bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
                />
              </div>
            </div>
          ))}
        </div>
        {/* Color preview strip */}
        <div className="flex gap-1 h-8 rounded overflow-hidden">
          <div className="flex-1" style={{ backgroundColor: colorPrimary }} />
          <div className="flex-1" style={{ backgroundColor: colorSecondary }} />
          {colorAccent && <div className="flex-1" style={{ backgroundColor: colorAccent }} />}
          {colorBackground && <div className="flex-1" style={{ backgroundColor: colorBackground }} />}
          {colorText && <div className="flex-1" style={{ backgroundColor: colorText }} />}
        </div>
      </section>

      {/* Typography */}
      <section className="bg-card border border-border rounded-lg p-6">
        <div className="flex items-center gap-2 mb-4">
          <Type size={20} className="text-accent" />
          <h2 className="text-lg font-semibold text-foreground">Typography</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Heading Font *</label>
            <select
              value={fontHeading}
              onChange={(e) => setFontHeading(e.target.value)}
              className="w-full px-3 py-2 border border-border rounded bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
            >
              {HEADING_FONTS.map((font) => (
                <option key={font} value={font}>{font}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Body Font *</label>
            <select
              value={fontBody}
              onChange={(e) => setFontBody(e.target.value)}
              className="w-full px-3 py-2 border border-border rounded bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
            >
              {BODY_FONTS.map((font) => (
                <option key={font} value={font}>{font}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Accent Font</label>
            <input
              type="text"
              value={fontAccent}
              onChange={(e) => setFontAccent(e.target.value)}
              placeholder="Optional accent font"
              className="w-full px-3 py-2 border border-border rounded bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
            />
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="bg-card border border-border rounded-lg p-6">
        <div className="flex items-center gap-2 mb-4">
          <Quote size={20} className="text-accent" />
          <h2 className="text-lg font-semibold text-foreground">Social Proof</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Review Count</label>
            <input
              type="text"
              value={reviewCount}
              onChange={(e) => setReviewCount(e.target.value)}
              placeholder="e.g., 200+ five-star reviews"
              className="w-full px-3 py-2 border border-border rounded bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Testimonial Tagline</label>
            <input
              type="text"
              value={reviewTagline}
              onChange={(e) => setReviewTagline(e.target.value)}
              placeholder="e.g., Best photographer we ever hired!"
              className="w-full px-3 py-2 border border-border rounded bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
            />
          </div>
        </div>
      </section>

      {/* Social Links (if extracted) */}
      {Object.keys(socialLinks).length > 0 && (
        <section className="bg-card border border-border rounded-lg p-6">
          <div className="flex items-center gap-2 mb-4">
            <Globe size={20} className="text-accent" />
            <h2 className="text-lg font-semibold text-foreground">Social Links</h2>
            <span className="text-xs text-muted">(extracted, read-only)</span>
          </div>
          <div className="space-y-2">
            {Object.entries(socialLinks).map(([platform, url]) => (
              <div key={platform} className="flex items-center gap-3 text-sm">
                <span className="text-muted capitalize w-24">{platform}</span>
                <a href={url} target="_blank" rel="noopener noreferrer" className="text-accent hover:underline truncate">
                  {url}
                </a>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Submit */}
      <div className="flex gap-4">
        <button
          type="submit"
          disabled={saving || !name}
          className="flex items-center gap-2 px-6 py-3 bg-accent text-white rounded hover:bg-accent-hover transition-colors disabled:opacity-50"
        >
          {saving ? (
            <>
              <Loader2 size={16} className="animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Check size={16} />
              {mode === 'create' ? 'Create Brand' : 'Save Changes'}
            </>
          )}
        </button>
        <button
          type="button"
          onClick={() => router.push('/brands')}
          className="px-6 py-3 border border-border text-foreground rounded hover:bg-card-hover transition-colors"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
