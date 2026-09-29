// @polsia:user-owned
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import HomePage from '@/app/(setup)/page';
import { siteDescription, siteName } from '@/lib/brand';

describe('inicio de Sirius Cyber Security', () => {
  it('presenta la propuesta para pymes y enruta el diagnóstico a WhatsApp', () => {
    const container = document.createElement('div');
    container.innerHTML = renderToStaticMarkup(<HomePage />);

    expect(siteName).toBe('Sirius Cyber Security');
    expect(siteDescription).toContain('pymes de Medellín y Colombia');
    expect(container.querySelector('h1')?.textContent).toContain('Crece con protección digital');
    expect(container.textContent).toContain('Medellín · Colombia');
    expect(container.textContent).toContain('pymes de Medellín y Colombia');

    // Every "solicitar diagnóstico" / "cotizar" CTA opens WhatsApp (+57 322 513 0054) instead of
    // an internal page — the contact page still exists (linked from the nav) but isn't where
    // these buttons point anymore.
    const waActions = [...container.querySelectorAll('a[href^="https://wa.me/573225130054"]')];
    expect(waActions.length).toBeGreaterThanOrEqual(1);
    expect(waActions.some((a) => a.textContent?.includes('Solicitar un diagnóstico'))).toBe(true);
    expect(container.querySelector('a[href^="mailto:"]')).toBeNull();
    expect(container.textContent?.toLowerCase()).not.toContain('cifralumbre');
  });
});
