// @polsia:user-owned — client boundary for the WebGL homepage backdrop. `(setup)/page.tsx`
// is a Server Component, and `next/dynamic(..., { ssr: false })` is only allowed inside a
// Client Component, so that call lives here instead of at the call site.
'use client';

import dynamic from 'next/dynamic';

const CyberNetworkCanvas = dynamic(
  () => import('./cyber-network-canvas').then((mod) => mod.CyberNetworkCanvas),
  { ssr: false },
);

export function CyberCanvasMount() {
  return <CyberNetworkCanvas />;
}
