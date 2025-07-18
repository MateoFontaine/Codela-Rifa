# 💳📧 Setup de Pagos y Emails - Guía Completa

## 🚀 Funcionalidades Implementadas

### ✅ Sistema de Pagos MercadoPago (Servidor)
- API Routes para crear preferencias de pago
- Webhook para procesar pagos automáticamente
- Validación y seguridad en el servidor
- Sin exposición de credenciales en el cliente

### ✅ Sistema de Notificaciones Email
- API Route para envío de emails
- Integración con Resend
- Templates HTML profesionales
- Confirmación automática de compras

### ✅ Información del Sorteo
- **Premio:** Camiseta Argentina firmada
- **Fecha:** 31 de Diciembre 2024
- **Modalidad:** Un solo ganador
- **Total números:** 50,000

## 🔧 Variables de Entorno (Solo Servidor)

### En Vercel Dashboard:
\`\`\`env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...

# MercadoPago (SERVIDOR ÚNICAMENTE)
MERCADOPAGO_ACCESS_TOKEN=APP_USR-tu-access-token
MERCADOPAGO_WEBHOOK_SECRET=tu-webhook-secret

# Resend
RESEND_API_KEY=re_tu-api-key

# App URL
NEXT_PUBLIC_APP_URL=https://tu-proyecto.vercel.app
\`\`\`

## 📋 Flujo de Compra Seguro

1. **Usuario selecciona números** → Carrito
2. **Hace clic en "Comprar"** → Modal de confirmación
3. **Confirma detalles** → POST a `/api/payments/create-preference`
4. **Servidor crea preferencia** → Redirige a MercadoPago
5. **Usuario paga** → MercadoPago envía webhook
6. **Webhook procesa** → Actualiza DB y envía email

## 🔒 Seguridad Implementada

### ✅ Credenciales Protegidas:
- **Access Token** solo en servidor
- **Webhook Secret** para validar notificaciones
- **API Keys** nunca expuestas al cliente

### ✅ Validaciones:
- Números disponibles antes del pago
- Usuario autenticado
- Transacciones atómicas en DB

## 🧪 Testing

### Desarrollo:
- Simula pagos exitosos
- Logs detallados en consola
- Emails de prueba

### Producción:
- Credenciales reales de MercadoPago
- Webhook funcional
- Emails reales enviados

## 🚀 Deploy a Vercel

1. **Deploy desde v0** → Botón "Deploy"
2. **Configurar variables** → Settings > Environment Variables
3. **Verificar endpoints** → `/api/payments/create-preference`
4. **Configurar webhook** → URL de producción

¡Ahora el sistema es 100% seguro y cumple con las mejores prácticas!
