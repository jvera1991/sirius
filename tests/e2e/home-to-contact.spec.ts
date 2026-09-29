// @polsia:user-owned
import { randomUUID } from 'node:crypto';
import { expect, test } from '@playwright/test';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const service = 'Pruebas de intrusión';

test.afterAll(async () => {
  await prisma.$disconnect();
});

test('la acción de inicio permite enviar y persistir los datos del diagnóstico', async ({
  page,
}) => {
  const email = `qa-${randomUUID()}@example.test`;
  const company = `Empresa QA ${randomUUID()}`;
  const message = `Servicio de interés: ${service}`;

  try {
    await page.goto('/');
    const action = page.getByRole('link', { name: 'Solicitar un diagnóstico', exact: true });
    await expect(action).toHaveCount(1);
    await expect(action).toHaveAttribute('href', '/contacto');
    await action.click();

    await expect(page).toHaveURL(/\/contacto$/);
    await expect(
      page.getByRole('heading', { name: 'Solicita un diagnóstico de ciberseguridad' }),
    ).toBeVisible();
    const desktopWidths = await page.evaluate(() => ({
      client: document.documentElement.clientWidth,
      scroll: document.documentElement.scrollWidth,
    }));
    expect(desktopWidths.scroll).toBeLessThanOrEqual(desktopWidths.client);
    await page.setViewportSize({ width: 375, height: 812 });
    const mobileWidths = await page.evaluate(() => ({
      client: document.documentElement.clientWidth,
      scroll: document.documentElement.scrollWidth,
    }));
    expect(mobileWidths.scroll).toBeLessThanOrEqual(mobileWidths.client);
    await page.getByLabel('Empresa').focus();
    await expect(page.getByLabel('Empresa')).toBeFocused();
    await page.getByLabel('Empresa').fill(company);
    await page.getByLabel('Correo electrónico').fill(email);
    await page.getByLabel('Servicio de interés').selectOption(service);
    await page.getByRole('button', { name: 'Enviar solicitud' }).click();

    await expect(page.getByRole('status')).toHaveText(
      'Gracias. Recibimos tu solicitud de diagnóstico.',
    );
    await expect
      .poll(() =>
        prisma.contactMessage.findFirst({
          where: { email, message },
          select: { name: true, email: true, message: true },
        }),
      )
      .toEqual({ name: company, email, message });
  } finally {
    await prisma.contactMessage.deleteMany({ where: { email } });
  }
});

test('los datos inválidos muestran errores y no crean solicitudes', async ({ page }) => {
  const email = `qa-${randomUUID()}@example.test`;
  const company = `Empresa QA ${randomUUID()}`;
  const message = `Servicio de interés: ${service}`;

  try {
    await page.goto('/contacto');
    await page.getByLabel('Correo electrónico').fill(email);
    await page.getByLabel('Servicio de interés').selectOption(service);
    await page.getByRole('button', { name: 'Enviar solicitud' }).click();

    await expect(page.locator('form [role="alert"]')).toContainText(
      'Escribe el nombre de tu empresa.',
    );
    await expect(page.getByRole('status')).toHaveCount(0);
    await expect.poll(() => prisma.contactMessage.findFirst({ where: { email } })).toBeNull();

    await page.getByLabel('Empresa').fill(company);
    await page.getByLabel('Correo electrónico').fill('correo-no-valido');
    await page.getByRole('button', { name: 'Enviar solicitud' }).click();
    await expect(page.locator('form [role="alert"]')).toContainText(
      'Escribe un correo electrónico válido.',
    );
    await expect(page.getByRole('status')).toHaveCount(0);
    await expect.poll(() => prisma.contactMessage.findFirst({ where: { email } })).toBeNull();

    await page.getByLabel('Correo electrónico').fill(email);
    await page.getByLabel('Servicio de interés').selectOption('');
    await page.getByRole('button', { name: 'Enviar solicitud' }).click();
    await expect(page.locator('form [role="alert"]')).toContainText(
      'Selecciona un servicio de interés.',
    );
    await expect.poll(() => prisma.contactMessage.findFirst({ where: { email } })).toBeNull();

    await page.getByLabel('Servicio de interés').selectOption(service);
    await page.getByRole('button', { name: 'Enviar solicitud' }).click();
    await expect(page.getByRole('status')).toContainText('Recibimos tu solicitud de diagnóstico.');
    await expect
      .poll(() => prisma.contactMessage.findFirst({ where: { email, message } }))
      .toMatchObject({ name: company, email, message });
  } finally {
    await prisma.contactMessage.deleteMany({ where: { email } });
  }
});

test('un fallo temporal no muestra éxito y permite reintentar', async ({ page }) => {
  const email = `qa-${randomUUID()}@example.test`;
  const company = `Empresa QA ${randomUUID()}`;
  const message = `Servicio de interés: ${service}`;
  let shouldFail = true;

  try {
    await page.route('**/api/contact', async (route) => {
      if (shouldFail) {
        shouldFail = false;
        await new Promise((resolve) => setTimeout(resolve, 250));
        await route.fulfill({
          status: 503,
          contentType: 'application/json',
          body: JSON.stringify({
            errors: { form: 'El servicio no está disponible temporalmente. Intenta de nuevo.' },
          }),
        });
        return;
      }
      await route.continue();
    });

    await page.goto('/contacto');
    await page.getByLabel('Empresa').fill(company);
    await page.getByLabel('Correo electrónico').fill(email);
    await page.getByLabel('Servicio de interés').selectOption(service);
    const submitButton = page.locator('form button[type="submit"]');
    await submitButton.click();
    await expect(submitButton).toBeDisabled();
    await expect(submitButton).toHaveText('Enviando…');

    await expect(page.locator('form [role="alert"]')).toContainText(
      'El servicio no está disponible temporalmente. Intenta de nuevo.',
    );
    await expect(page.getByRole('status')).toHaveCount(0);

    await page.getByRole('button', { name: 'Enviar solicitud' }).click();
    await expect(page.getByRole('status')).toContainText('Recibimos tu solicitud de diagnóstico.');
    await expect
      .poll(() => prisma.contactMessage.findFirst({ where: { email, message } }))
      .toMatchObject({ name: company, email, message });
  } finally {
    await prisma.contactMessage.deleteMany({ where: { email } });
  }
});
