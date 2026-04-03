import { notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { BrandForm } from '@/components/brands/brand-form';

export default async function EditBrandPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const { data: brand } = await supabase
    .from('brands')
    .select('*')
    .eq('id', id)
    .eq('user_id', user!.id)
    .single();

  if (!brand) {
    notFound();
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-foreground mb-6" style={{ fontFamily: 'var(--font-heading)' }}>
        Edit Brand
      </h1>
      <BrandForm mode="edit" brand={brand} />
    </div>
  );
}
