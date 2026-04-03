import Link from 'next/link';

export default function CreatePage() {
  return (
    <div>
      <h1
        className="text-2xl font-bold text-foreground mb-4"
        style={{ fontFamily: 'var(--font-heading)' }}
      >
        Slide Creator
      </h1>
      <div className="bg-card border border-border rounded-lg p-8 text-center">
        <p className="text-muted mb-4">
          The slide creator is coming soon. Make sure you have a brand set up first.
        </p>
        <Link
          href="/brands"
          className="inline-block px-4 py-2 bg-accent text-white rounded hover:bg-accent-hover transition-colors"
        >
          Manage Brands
        </Link>
      </div>
    </div>
  );
}
