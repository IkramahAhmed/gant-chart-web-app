'use client';

import dynamic from 'next/dynamic';

// Dynamically import GanttChart to avoid SSR issues with DndProvider
const GanttChart = dynamic(
  () => import('@/components/gantt/GanttChart').then((mod) => mod.GanttChart),
  {
    ssr: false,
    loading: () => (
      <div
        style={{
          width: '100%',
          height: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#f8fafc',
        }}
      >
        <div style={{ fontSize: '16px', color: '#64748b' }}>
          Loading Gantt Chart...
        </div>
      </div>
    ),
  }
);

/**
 * Main page component
 * Renders the Gantt chart application
 */
export default function Home() {
  return (
    <main>
      <GanttChart />
    </main>
  );
}
