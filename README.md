# ¿Te alcanza?

Calculadora chilena, gratuita y anónima para descubrir hasta qué día alcanza el sueldo y cuántas horas de trabajo cuestan los gastos mensuales.

## Desarrollo local

Requiere Node.js 24 o superior.

```bash
npm install
npm run dev
```

La aplicación estará disponible en `http://localhost:3000`.

## Qué calcula

- El día estimado en que el saldo mensual llega a cero.
- El porcentaje del sueldo destinado a gastos.
- El valor aproximado de una hora de trabajo.
- Las horas de trabajo necesarias para pagar los gastos y la vivienda.

Los montos se procesan en el navegador. No se envían ni se almacenan.

## Google AdSense

La integración está inactiva mientras no existan credenciales reales. Crea dos bloques de anuncios responsivos en AdSense y configura:

```env
NEXT_PUBLIC_ADSENSE_CLIENT_ID=ca-pub-XXXXXXXXXXXXXXXX
NEXT_PUBLIC_ADSENSE_SLOT_TOP=XXXXXXXXXX
NEXT_PUBLIC_ADSENSE_SLOT_INLINE=XXXXXXXXXX
```

Con el client ID configurado, `/ads.txt` se genera automáticamente. La gestión de consentimiento para visitantes del EEE, Reino Unido y Suiza debe activarse desde **AdSense → Privacidad y mensajes** antes de monetizar tráfico de esas regiones.

## Aportes y medición

```env
NEXT_PUBLIC_DONATION_URL=https://...
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
CONTACT_EMAIL=hola@tu-dominio.cl
SITE_URL=https://tu-dominio.cl
```

Si no existe `NEXT_PUBLIC_DONATION_URL`, la interfaz muestra “Aportes próximamente”. Analytics tampoco se carga si no se configura un ID.

## SEO y GEO

La portada contiene contenido explicativo indexable, preguntas frecuentes, metodología pública, metadata social y datos estructurados `WebApplication`. El sitemap incluye únicamente la herramienta y sus páginas de confianza. Las rutas públicas del antiguo ranking redirigen permanentemente a la portada.

## Aviso

El resultado es educativo y aproximado; no constituye asesoría financiera, tributaria, laboral ni legal.
