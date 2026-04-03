import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { BrandCard } from '@/components/brands/brand-card';
import type { Brand } from '@/types';

export default async function BrandsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const { data: brands } = await supabase
    .from('brands')
    .select('*')
    .eq('user_id', user!.id)
    .order('created_at', { ascending: false });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1
          className="text-2xl font-bold text-foreground"
          style={{ fontFamily: 'var(--font-heading)' }}
        >
          Brands
        </h1>
        <Link
          href="/brands/new"
          className="px-4 py-2 bg-accent text-white rounded hover:bg-accent-hover transition-colors"
        >
          Create Brand
        </Link>
      </div>

      {(!brands || brands.length === 0) ? (
        <div className="bg-card border border-border rounded-lg p-8 text-center">
          <p className="text-muted mb-4">No brands yet. Create your first brand to get started.</p>
          <Link
            href="/brands/new"
            className="inline-block px-4 py-2 bg-accent text-white rounded hover:bg-accent-hover transition-colors"
          >
            Create Brand
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {brands.map((brand: Brand) => (
            <BrandCard key={brand.id} brand={brand} />
          ))}
        </div>
      )}
    </div>
  );
}
