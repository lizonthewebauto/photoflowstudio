import type { Metadata } from 'next';
import { Playfair_Display, Lora } from 'next/font/google';
import './globals.css';

const playfair = Playfair_Display({ subsets: ['latin'], variable: '--font-heading' });
const lora = Lora({ subsets: ['latin'], variable: '--font-body' });

export const metadata: Metadata = {
  title: 'PhotoFlow Studio',
  description: 'AI-powered social content for photographers',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${playfair.variable} ${lora.variable}`}>
      <body>{children}</body>
    </html>
  );
}
