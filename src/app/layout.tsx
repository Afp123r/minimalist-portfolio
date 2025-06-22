import type { Metadata } from 'next';
import { useEffect, useState } from 'react';

export const metadata: Metadata = {
  title: 'Portfolio',
  description: 'Deep Learning Engineer & Data Scientist Portfolio',
};

function ViewCounter() {
  const [views, setViews] = useState<number | null>(null);
  useEffect(() => {
    // Replace 'minimalist-portfolio' with a unique key for your site
    fetch('https://api.countapi.xyz/hit/minimalist-portfolio/visits')
      .then(res => res.json())
      .then(data => setViews(data.value));
  }, []);
  return (
    <div style={{ textAlign: 'center', marginTop: '2rem', color: '#888', fontSize: '0.95rem' }}>
      {views !== null ? `👁️ ${views} page views` : 'Loading views...'}
    </div>
  );
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        {children}
        <ViewCounter />
      </body>
    </html>
  );
}
