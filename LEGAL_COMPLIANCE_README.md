# Documentación Legal y Cumplimiento

Esta carpeta contiene toda la documentación legal necesaria para operar la API en cumplimiento con regulaciones de privacidad y protección de datos internacionales.

## 📋 Documentos Incluidos

### 1. **PRIVACY_POLICY.md**
**Política de Privacidad - Pública**

Qué incluye:
- Qué información se recopila
- Cómo se usa la información
- Almacenamiento y seguridad
- Retención de datos
- Derechos de usuarios
- Transferencias internacionales
- Cumplimiento con GDPR, CCPA, LGPD, PIPL

**Cuándo usar**:
- Publicar en tu sitio web
- Proporcionar a usuarios
- Incrustar en ToS
- Referencia en onboarding

**Formato recomendado**:
- Publicar en: `https://tudominio.com/privacy`
- Incluir en: README, documentación API
- Mantener accesible siempre

---

### 2. **TERMS_OF_SERVICE.md**
**Términos de Servicio - Pública**

Qué incluye:
- Aceptación de términos
- Descripción del servicio
- Uso aceptable y prohibido
- Rate limiting y cuotas
- Responsabilidades del usuario
- Limitaciones de responsabilidad
- Propiedad intelectual
- Indemnización
- Terminación

**Cuándo usar**:
- Publicar en tu sitio web (pública)
- Requieren aceptación antes de usar API
- Establecer expectativas legales
- Proteger tu empresa

**Formato recomendado**:
- Publicar en: `https://tudominio.com/terms`
- Incluir checkbox: "Acepto los Términos de Servicio"
- Versionar con fecha
- Notificar cambios

---

### 3. **COOKIE_POLICY.md**
**Política de Cookies - Pública**

Qué incluye:
- Tipos de cookies (técnicas, analytics, marketing)
- Cookies específicas y su propósito
- Duración de cookies
- Control de cookies
- Cookies de terceros
- Datos recopilados
- Seguridad

**Cuándo usar**:
- Publicar en sitio web
- Cumplimiento GDPR (Cookie Law)
- Responder preguntas de usuarios
- Implementar banner de consentimiento

**Requisitos legales**:
- Requerido en UE por ePrivacy Directive
- Requerido en muchos países
- Debe ser fácilmente accesible

**Formato recomendado**:
- Publicar en: `https://tudominio.com/cookies`
- Implementar banner de consentimiento
- Permitir aceptar/rechazar
- Guardar preferencias

---

### 4. **GDPR_COMPLIANCE_GUIDE.md**
**Guía de Cumplimiento GDPR - Interna**

Qué incluye:
- Principios clave de GDPR
- Bases legales para procesamiento
- Roles (Controlador vs Procesador)
- Cómo obtener consentimiento
- Evaluación de Impacto en Privacidad (DPIA)
- Derechos del interesado
- Notificación de brechas
- Contrato de Procesamiento (DPA)
- Designación de DPO
- Checklist de cumplimiento

**Cuándo usar**:
- Para desarrolladores internos
- Para legal/compliance
- Para implementar características
- Para auditorías de cumplimiento

**Este es un documento interno** - No publiques completamente.

---

## 🚀 Primeros Pasos

### Paso 1: Personaliza los Documentos
En cada archivo, busca y reemplaza:

```
[Tu Empresa]           → Tu nombre de empresa
[Tu Jurisdicción]      → Tu país/estado
[Tu dirección legal]   → Tu dirección completa
privacy@gptmemory.dev  → Tu email de privacidad
legal@gptmemory.dev    → Tu email legal
dpo@gptmemory.dev      → Tu DPO email (si aplica)
https://gptmemory.dev  → Tu dominio
[Tu teléfono]          → Tu número
```

### Paso 2: Publica Públicamente

Sube estos a tu sitio web:
- `PRIVACY_POLICY.md` → `/privacy`
- `TERMS_OF_SERVICE.md` → `/terms`
- `COOKIE_POLICY.md` → `/cookies`

### Paso 3: Implementa Legalmente

```html
<!-- En tu página principal -->
<footer>
  <a href="/privacy">Política de Privacidad</a>
  <a href="/terms">Términos de Servicio</a>
  <a href="/cookies">Política de Cookies</a>
</footer>
```

### Paso 4: Requiere Aceptación

```javascript
// En signup/login
if (!user.acceptedTerms) {
  // Mostrar modal con términos
  // Requerir checkbox
  // Guardar timestamp de aceptación
}
```

### Paso 5: Crea DPA

Para usuarios en la UE:
- Proporciona Acuerdo de Procesamiento de Datos
- Basado en GDPR_COMPLIANCE_GUIDE
- Firmar antes de procesar datos de la UE

---

## 📊 Matriz de Regulaciones

| Regulación | Geografía | Aplica Si | Archivo |
|------------|-----------|----------|---------|
| **GDPR** | Unión Europea | Usuarios o datos en UE | GDPR_COMPLIANCE_GUIDE.md |
| **ePrivacy** | Unión Europea | Cookies/tracking en UE | COOKIE_POLICY.md |
| **CCPA** | California, USA | Usuarios o residentes CA | PRIVACY_POLICY.md |
| **CPRA** | California, USA | Versión mejorada de CCPA | PRIVACY_POLICY.md |
| **LGPD** | Brasil | Usuarios o datos en Brasil | PRIVACY_POLICY.md |
| **PIPL** | China | Usuarios o datos en China | PRIVACY_POLICY.md |
| **PIPEDA** | Canadá | Usuarios o datos en Canadá | PRIVACY_POLICY.md |
| **PDPA** | Tailandia | Usuarios o datos en Tailandia | PRIVACY_POLICY.md |

---

## ⚖️ Responsabilidades Legales

### Como Controlador de Datos

Si usas esta API con datos personales, **eres responsable de**:

1. **Transparencia**
   - ✅ Publicar PRIVACY_POLICY.md
   - ✅ Ser claro sobre qué datos recopila

2. **Consentimiento (donde aplique)**
   - ✅ Obtener consentimiento informado
   - ✅ Documentar consentimiento
   - ✅ Permitir revocación fácil

3. **Seguridad**
   - ✅ Implementar medidas de protección
   - ✅ Usar HTTPS/TLS
   - ✅ Encriptar datos sensibles

4. **Derechos de Interesados**
   - ✅ Responder solicitudes de acceso
   - ✅ Permitir eliminación
   - ✅ Facilitar portabilidad

5. **Notificación de Brechas**
   - ✅ Notificar dentro de 72 horas (GDPR)
   - ✅ Informar a autoridades
   - ✅ Comunicar a afectados

---

## 🛡️ Mejores Prácticas

### 1. Auditoría de Privacidad

**Anualmente**:
- Revisar qué datos recopila
- Verificar base legal
- Actualizar DPIA si es necesario
- Revisar políticas

### 2. Educación del Equipo

- Capacitar a desarrolladores sobre privacidad
- Revisar GDPR_COMPLIANCE_GUIDE
- Implementar security by design

### 3. Documentación

- Mantener registro de procesamiento
- Documentar decisiones legales
- Guardar consentimientos
- Registrar evaluaciones de riesgo

### 4. Contacto Legal

- Consultar abogado especializado en privacidad
- Revisar documentos antes de publicar
- Realizar auditoría legal anual
- Mantener relación con DPA si es requerido

---

## 📞 Recursos de Apoyo

### Autoridades de Protección de Datos

- **UE**: https://edpb.ec.europa.eu/
- **Alemania**: https://www.bfdi.bund.de/
- **Francia (CNIL)**: https://www.cnil.fr/
- **España (AEPD)**: https://www.aepd.es/
- **Brasil (ANPD)**: https://www.gov.br/cidadania/pt-br/acesso-a-informacao/lgpd
- **California**: https://oag.ca.gov/privacy/ccpa
- **Canadá**: https://www.priv.gc.ca/

### Herramientas GDPR

- [GDPR.eu](https://gdpr.eu/) - Portal oficial GDPR
- [IAPP](https://iapp.org/) - Asociación de Profesionales de Privacidad
- [Compliance Labs](https://www.compliancelabs.com/) - Auditoría

### Documentos Modelo

- [EDPB Guidelines](https://edpb.ec.europa.eu/our-work-tools/our-documents_en)
- [Plantillas de Consentimiento](https://www.privacyshield.gov/)
- [DPIA Templates](https://www.cnil.fr/)

---

## ⚠️ Aviso Importante

**Estos documentos son plantillas genéricas.** Debes:

1. **Personalizarlos completamente** con tu información
2. **Revisar legalmente** antes de publicar
3. **Adaptar a tu jurisdicción específica**
4. **Consultar abogado especializado**
5. **Mantenerlos actualizados** con cambios legales

---

## 📝 Control de Versiones

| Versión | Fecha | Cambios |
|---------|-------|---------|
| 1.0 | 2026-07-18 | Creación inicial |
| | | PRIVACY_POLICY |
| | | TERMS_OF_SERVICE |
| | | COOKIE_POLICY |
| | | GDPR_COMPLIANCE_GUIDE |

---

## 📄 Checklist de Cumplimiento

- [ ] Personalizados todos los documentos
- [ ] Revisados por abogado
- [ ] Publicados en sitio web
- [ ] Aceptación requerida en signup
- [ ] Privacidad por diseño implementada
- [ ] Respuesta a derechos de interesados
- [ ] DPA en lugar (si aplica)
- [ ] Plan de respuesta a brechas
- [ ] Auditoría anual programada
- [ ] Equipo capacitado en privacidad

---

Para preguntas o actualizaciones, consulta regularmente regulaciones locales y obtén asesoramiento legal profesional.

**Última actualización**: 18 de julio de 2026
