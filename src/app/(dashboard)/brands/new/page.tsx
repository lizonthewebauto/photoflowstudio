import { BrandForm } from '@/components/brands/brand-form';

export default function NewBrandPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-foreground mb-6" style={{ fontFamily: 'var(--font-heading)' }}>
        Create Brand
      </h1>
      <BrandForm mode="create" />
    </div>
  );
}
