# Política de Cookies

**Última actualización: 18 de julio de 2026**

## 1. ¿Qué son las Cookies?

Las cookies son pequeños archivos de texto almacenados en tu dispositivo (navegador o cliente) que contienen información identificativa. Se utilizan para recordar preferencias, sesiones y otros datos.

## 2. Tipos de Cookies que Utilizamos

### 2.1 Cookies Técnicas (Necesarias)

**¿Qué son?**
Cookies requeridas para que el Servicio funcione correctamente. No pueden ser deshabilitadas sin romper el Servicio.

**Cookies específicas**:

| Nombre | Propósito | Duración | Tipo |
|--------|-----------|----------|------|
| `session_id` | Identificar sesión de usuario | Sesión activa | Sesión |
| `auth_token` | Autenticación y autorización | Según config | Persistente |
| `csrf_token` | Protección CSRF | Sesión | Sesión |
| `preferences` | Preferencias de usuario | 1 año | Persistente |

**Datos contenidos**:
- Identificador de sesión único
- Información básica de autenticación
- Timestamp de creación

### 2.2 Cookies de Rendimiento (Analytics)

**¿Qué son?**
Cookies que rastrean cómo usas el Servicio para mejorar rendimiento. Son anónimas.

**Información recopilada**:
- Páginas visitadas
- Errores encontrados
- Velocidad de carga
- Funcionalidades utilizadas

**Duración**: 90 días

**Proveedores**: Cloudflare Analytics

### 2.3 Tokens JWT

**¿Qué son?**
No son exactamente cookies, pero son tokens similares almacenados localmente.

**Contenido**:
- ID de usuario
- Permisos
- Timestamp de expiración
- Firma criptográfica

**Duración**: Configurable (por defecto 24 horas)

### 2.4 Cookies de Marketing/Publicidad

**Utilizamos**: No utilizamos cookies de publicidad terceros por defecto.

Si tenemos campañas de marketing, podremos utilizar:
- Google Analytics para conversiones
- Facebook Pixel (solo con consentimiento)

Te notificaremos antes de implementar estas.

## 3. Cookies de Terceros

### 3.1 Cloudflare

Cloudflare (proveedor de infraestructura) puede establecer:

| Cookie | Propósito |
|--------|-----------|
| `__cfduid` | Identificación de usuario para Cloudflare |
| `__cfruid` | Rastreo de sesión |
| `cf_clearance` | Verificación de seguridad |

[Ver política Cloudflare](https://www.cloudflare.com/cookie-policy/)

### 3.2 Servicios Integrados

Si integras servicios de terceros (si aplica):

- Pueden establecer sus propias cookies
- Te notificaremos de cambios

## 4. Control de Cookies

### 4.1 Navegador

Puedes controlar cookies en tu navegador:

**Chrome**:
- Menú > Configuración > Privacidad y Seguridad > Cookies

**Firefox**:
- Menú > Opciones > Privacidad > Cookies

**Safari**:
- Preferencias > Privacidad > Gestionar datos de sitios web

**Edge**:
- Configuración > Privacidad > Borrar datos de exploración

### 4.2 Herramientas de Terceros

Puedes usar:

- [Your Online Choices](http://www.youronlinechoices.com/) - Europa
- [DAA Tool](http://optout.aboutads.info/) - Estados Unidos
- [EDAA Tool](http://www.edaa.eu/) - Europa

### 4.3 Do Not Track

Algunos navegadores envían señal "Do Not Track". Respetamos esta preferencia.

## 5. Cookies Esenciales vs Opcionales

### 5.1 Esenciales (Siempre Activas)

Estas cookies se almacenan automáticamente porque son necesarias:

- Autenticación
- Seguridad
- Funcionalidad básica

**No puedes deshabilitarlas** sin romper el Servicio.

### 5.2 Opcionales (Requieren Consentimiento)

Para cookies opcionales (analytics, marketing), implementamos:

- Banner de consentimiento (si es necesario por ley)
- Opción para consentir o rechazar
- Capacidad de cambiar preferencias

**Aún no implementado si es aplicable en tu jurisdicción.

## 6. Datos Recopilados por Cookies

### 6.1 Información Técnica

- ID de sesión único
- Dirección IP (desde logs del servidor)
- Tipo de navegador/cliente
- Sistema operativo
- Timestamp

### 6.2 Información de Uso

- Endpoints accedidos
- Métodos HTTP utilizados
- Duración de sesión
- Errores/excepciones

### 6.3 Lo que NO recopilamos en cookies

- Contraseñas o tokens de autenticación completos
- Datos financieros sensibles
- Información médica
- Información de terceros sin consentimiento

## 7. Duración de Cookies

| Tipo | Duración | Notas |
|------|----------|-------|
| Sesión | Hasta cerrar navegador | Se elimina al cerrar |
| Short-lived | 24 horas | Requiere renovación |
| Standard | 30 - 90 días | Período típico |
| Long-lived | 1 año | Para preferencias |

## 8. Seguridad de Cookies

Implementamos:

- **Flag Secure**: Cookies solo se transmiten por HTTPS
- **Flag HttpOnly**: JavaScript no puede acceder (previene XSS)
- **Flag SameSite**: Protección contra CSRF
- **Encriptación**: Datos sensibles encriptados

## 9. Actualizaciones a Esta Política

Podemos cambiar qué cookies utilizamos:

- Actualizando esta política
- Avisando cambios sustanciales con 30 días de anticipación
- Requiriendo consentimiento nuevo si es necesario

## 10. Derechos Relacionados con Cookies

### 10.1 Acceso

Puedes solicitar:

- Lista de cookies que almacenamos
- Propósito de cada cookie
- Duración

### 10.2 Eliminación

Puedes solicitar:

- Eliminación de cookies específicas
- Cambio de preferencias de consentimiento

**Enviamos solicitudes a**: privacy@gptmemory.dev

## 11. FAQ

**¿Es legal usar cookies?**
Sí, si informas claramente sobre su uso (como hacemos aquí).

**¿Rastrean mi identidad las cookies?**
Las técnicas no pueden identificarte personalmente. Pueden identificar sesiones.

**¿Puedo bloquear todas las cookies?**
Puedes bloquear la mayoría, pero el Servicio puede no funcionar correctamente.

**¿Vender datos de cookies?**
No. Solo utilizamos datos internamente para mejorar el Servicio.

**¿Qué pasa si borro mis cookies?**
Tu sesión se cerrará. Tendrás que autenticarte nuevamente.

## 12. Contacto

Para preguntas sobre cookies:

**Email**: privacy@gptmemory.dev  
**Sitio Web**: https://gptmemory.dev

---

**Esta Política de Cookies es efectiva desde el 18 de julio de 2026**
