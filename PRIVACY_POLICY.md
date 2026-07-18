# Política de Privacidad

**Última actualización: 18 de julio de 2026**

## 1. Introducción

Esta Política de Privacidad describe cómo la API recopila, utiliza, almacena y protege los datos personales e información de usuarios. Nos comprometemos a mantener la confidencialidad y seguridad de tu información.

## 2. Información que Recopilamos

### 2.1 Información Proporcionada Directamente

- **Datos de campaña**: Nombres, descripciones, metadatos de campañas
- **Datos de entidades**: Información sobre personajes, ubicaciones, eventos, relaciones y otros datos ingresados a través de la API
- **Identificadores**: IDs de usuario, IDs de sesión, tokens de autenticación
- **Información de contacto**: Si proporcionas correo electrónico o datos de contacto

### 2.2 Información Recopilada Automáticamente

- **Datos técnicos**: 
  - Dirección IP
  - Tipo y versión del navegador/cliente
  - Sistema operativo
  - Información del dispositivo
  - Logs de acceso y errores

- **Datos de uso**:
  - Endpoints accedidos
  - Método HTTP utilizado
  - Timestamp de solicitudes
  - Duración de las sesiones
  - Patrones de uso

- **Cookies y tecnologías similares**:
  - Identificadores de sesión
  - Tokens de autenticación

## 3. Propósito del Tratamiento

Utilizamos la información recopilada para:

- **Proporcionar y mantener el servicio**
  - Procesar solicitudes API
  - Gestionar cuentas y acceso
  - Almacenar y recuperar datos

- **Mejorar y optimizar**
  - Analizar rendimiento y uso
  - Identificar y solucionar problemas técnicos
  - Mejorar características y funcionalidad

- **Seguridad y cumplimiento**
  - Detectar y prevenir actividades fraudulentas
  - Cumplir con requisitos legales
  - Proteger derechos y propiedad

- **Comunicación**
  - Responder a consultas
  - Enviar notificaciones técnicas importantes
  - Informar sobre cambios en el servicio

## 4. Base Legal

El tratamiento de tus datos se basa en:

- **Ejecución del contrato**: Información necesaria para proporcionar el servicio
- **Consentimiento**: Datos opcionales que has consentido en compartir
- **Obligación legal**: Información requerida por ley
- **Intereses legítimos**: Seguridad, prevención de fraude, mejora del servicio

## 5. Almacenamiento y Seguridad

### 5.1 Donde se Almacenan los Datos

- **Servidor de aplicación**: Cloudflare Workers (ubicación global)
- **Base de datos**: Cloudflare D1 (SQLite, distribuido globalmente)
- **Backups**: Infraestructura de Cloudflare con redundancia geográfica

### 5.2 Medidas de Seguridad

Implementamos:

- **Encriptación en tránsito**: TLS/HTTPS para todas las conexiones
- **Encriptación en reposo**: Encriptación de datos sensibles en la base de datos
- **Control de acceso**: Autenticación y autorización basadas en roles
- **Validación de entrada**: Sanitización y validación de datos
- **Auditoría**: Logs de acceso y cambios
- **Aislamiento de datos**: Datos scoped por campaña/usuario

**Nota**: Aunque implementamos medidas de seguridad robustas, ningún sistema es completamente seguro. Transmites datos bajo tu propio riesgo.

## 6. Retención de Datos

### 6.1 Datos Activos

- Se mantienen mientras tu cuenta está activa
- Se eliminan 30 días después de la eliminación de la cuenta (soft-delete)
- Se purifgan permanentemente después de 90 días

### 6.2 Datos de Log

- Se retienen durante 90 días
- Se comprimen después de 30 días
- Se eliminan automáticamente después de 90 días

### 6.3 Backups

- Se retienen durante 30 días
- Se elimina la información de usuarios eliminados

## 7. Compartir Información

### 7.1 No Vendemos Datos

No vendemos, alquilamos ni compartimos información personal con terceros para propósitos comerciales.

### 7.2 Compartimos Información Con

**Solo en los siguientes casos**:

- **Proveedores de servicio**: 
  - Cloudflare (infraestructura, seguridad, analytics)
  - Solo cuando es necesario para proporcionar el servicio
  - Bajo contratos de confidencialidad estrictos

- **Requisitos legales**:
  - Cumplimiento de leyes, órdenes judiciales, citaciones
  - Protección de derechos legales y seguridad

- **Transferencias de negocio**:
  - En caso de fusión, adquisición o venta
  - Con notificación previa cuando sea posible

## 8. Derechos del Usuario

Tienes derecho a (según la legislación aplicable):

### 8.1 Acceso
- Solicitar una copia de tus datos personales
- Respuesta dentro de 30 días

### 8.2 Rectificación
- Corregir datos inexactos
- Completar datos incompletos

### 8.3 Eliminación ("Derecho al Olvido")
- Solicitar la eliminación de tus datos
- Con excepciones por requisitos legales o retención de backups

### 8.4 Portabilidad
- Obtener tus datos en formato estructurado
- Transferir a otro proveedor

### 8.5 Restricción
- Limitar el uso de tus datos
- Durante investigaciones o disputas

### 8.6 Oposición
- Oponerse al tratamiento de datos
- Especialmente para propósitos de marketing

### 8.7 Revocación de Consentimiento
- Retirar consentimiento en cualquier momento
- Sin afectar tratamientos previos

**Para ejercer estos derechos**: Contacta a privacy@gptmemory.dev

## 9. Transferencias Internacionales

Tu información puede transferirse a, procesarse en, y almacenarse en países fuera de tu país de residencia, incluidos países que podrían no tener el mismo nivel de protección de datos.

Nos aseguramos de que cualquier transferencia cumple con:
- Cláusulas de protección contractuales estándar
- Adecuación regulatoria establecida
- Salvaguardas técnicas y organizacionales

## 10. Menores de Edad

Este servicio no está dirigido a menores de 13 años (o la edad mínima en tu jurisdicción). No recopilamos intencionalmente datos de menores. Si descubrimos que hemos recopilado datos de un menor, eliminaremos esa información inmediatamente.

## 11. Cookies y Tecnologías de Rastreo

### 11.1 Cookies de Sesión
- Necesarias para autenticación
- Almacenadas localmente en tu navegador/cliente
- No incluyen tracking

### 11.2 Tokens JWT
- Contienen información de sesión
- Firmados criptográficamente
- No compartidos con terceros

### 11.3 Analytics
- Recopilamos métricas de uso agregadas
- No se rastrean individuos
- Se anonimiza la información

## 12. Terceros y Enlaces Externos

Esta Política de Privacidad solo se aplica a nuestro servicio. No somos responsables de:

- Políticas de privacidad de servicios de terceros
- Enlaces externos desde nuestra documentación
- Servicios integrados (si aplica)

## 13. Cambios en Esta Política

Podemos actualizar esta política en cualquier momento. Los cambios sustanciales se notificarán:

- Por correo electrónico
- En el sitio web/documentación
- Con al menos 30 días de aviso previo

El uso continuo del servicio constituye aceptación de los cambios.

## 14. Cumplimiento Normativo

Cumplimos con:

- **GDPR** (Reglamento General de Protección de Datos - UE)
- **CCPA** (Ley de Privacidad del Consumidor de California - USA)
- **LGPD** (Lei Geral de Proteção de Dados - Brasil)
- **PIPL** (Ley de Protección de Información Personal - China)
- Regulaciones locales aplicables

## 15. Contacto

Para preguntas sobre esta Política de Privacidad o tus derechos:

**Email**: privacy@gptmemory.dev  
**Sitio Web**: https://gptmemory.dev  
**Dirección**: [Tu dirección legal]

### Autoridad de Protección de Datos (si aplica)

Si tienes una queja sobre nuestro tratamiento de datos, también puedes contactar a:

- **UE**: Tu autoridad de protección de datos local
- **USA**: Autoridades estatales de privacidad
- **Brasil**: Autoridade Nacional de Proteção de Dados (ANPD)

## 16. Glosario

- **Datos personales**: Información que puede identificarte directa o indirectamente
- **Tratamiento**: Cualquier operación con datos (recopilación, almacenamiento, uso, eliminación)
- **Controlador**: La entidad que decide cómo se tratan los datos
- **Procesador**: La entidad que trata datos en nombre del controlador
- **Consentimiento**: Aceptación voluntaria e informada
- **Soft-delete**: Marcar como eliminado sin borrar realmente
- **Hard-delete**: Eliminar permanentemente los datos

---

**Esta política es efectiva a partir del 18 de julio de 2026** y se revisará anualmente o cuando cambien las prácticas de privacidad significativamente.
