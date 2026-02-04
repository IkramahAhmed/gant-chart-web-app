import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Gantt Chart App',
  description: 'Interactive Gantt chart for project management',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
