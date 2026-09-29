// @polsia:user-owned
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import HomePage from '@/app/(setup)/page';
import { siteDescription, siteName } from '@/lib/brand';

describe('inicio de Sirius Cyber Security', () => {
  it('presenta la propuesta para pymes y una sola acción de diagnóstico a /contacto', () => {
    const container = document.createElement('div');
    container.innerHTML = renderToStaticMarkup(<HomePage />);

    expect(siteName).toBe('Sirius Cyber Security');
    expect(siteDescription).toContain('pymes de Medellín y Colombia');
    expect(container.querySelector('h1')?.textContent).toContain('Crece con protección digital');
    expect(container.textContent).toContain('Medellín · Colombia');
    expect(container.textContent).toContain('pymes de Medellín y Colombia');

    const actions = [...container.querySelectorAll('a[href="/contacto"]')];
    expect(actions).toHaveLength(1);
    expect(actions[0]?.textContent).toContain('Solicitar un diagnóstico');
    expect(container.querySelector('a[href^="mailto:"]')).toBeNull();
    expect(container.textContent?.toLowerCase()).not.toContain('cifralumbre');
  });
});
