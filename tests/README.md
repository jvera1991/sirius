# Pruebas de Sirius Cyber Security

Las pruebas de interfaz guardan solicitudes reales en PostgreSQL. Ejecútalas
solo contra la base desechable que proporciona el entorno de QA; nunca uses una
base productiva ni datos de personas reales. El archivo `.env.test` usa una URL,
un destinatario y una llave sintéticos para el proxy; no contiene credenciales
reales.

## Requisitos

- Node.js y dependencias instaladas con `npm install`.
- PostgreSQL desechable en `DATABASE_URL` y el esquema aplicado con
  `npx prisma db push`.
- Para el recorrido Playwright, la aplicación debe estar iniciada y
  `BASE_URL` debe apuntar a esa instancia.

## Comandos

```sh
npm test
BASE_URL=http://localhost:3000 npm run test:e2e
```

En el sandbox de Polsia, `bash .agents/verify.sh` prepara el entorno y ejecuta
lint, build, Vitest y Playwright. El envío se valida contra el handler local;
las notificaciones usan valores sintéticos y no se entregan. La persistencia
local sí se comprueba; la entrega del correo requiere la configuración real del
despliegue.

## Datos de prueba y limpieza

Playwright genera una empresa de prueba, una dirección `@example.test` única y
elige uno de los servicios permitidos: Monitoreo y respuesta gestionada; Marca y
superficie de ataque; Pruebas de intrusión; Acompañamiento ISO; Automatización de
atención y ventas; o Cultura de seguridad. Consulta `ContactMessage` para comprobar
que la empresa queda en `name`, el correo en `email` y el servicio en `message`
como `Servicio de interés: <servicio>`. Elimina las filas al terminar cada
recorrido. Las solicitudes inválidas no crean registros. El caso de fallo
temporal intercepta el primer envío en el navegador y luego permite reintentar
contra la API local.
