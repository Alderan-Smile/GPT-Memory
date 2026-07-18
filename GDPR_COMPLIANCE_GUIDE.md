# Guía de Cumplimiento GDPR

**Última actualización: 18 de julio de 2026**

## 1. Introducción

Esta guía ayuda a desarrolladores y empresas que integran esta API a cumplir con el Reglamento General de Protección de Datos (GDPR) de la Unión Europea.

**Nota**: Esta es una guía general. Consulta con un abogado especializado en privacidad para tu caso específico.

## 2. Principios Clave del GDPR

### 2.1 Los 6 Principios

| Principio | Descripción |
|-----------|-------------|
| Licitud, Lealtad, Transparencia | Los datos deben procesarse legalmente y de forma justa |
| Limitación de Propósito | Solo procesar para propósitos específicos, explícitos y legítimos |
| Minimización de Datos | Recopilar solo datos necesarios |
| Exactitud | Mantener datos precisos y actualizados |
| Limitación de Almacenamiento | Retener solo el tiempo necesario |
| Integridad y Confidencialidad | Proteger contra procesamiento no autorizado o ilícito |

## 3. Base Legal para el Procesamiento

La API permite procesamiento bajo estas bases:

### 3.1 Consentimiento
- Usuario da permiso explícito
- Debe ser: específico, informado, revocable fácilmente

### 3.2 Contrato
- Procesamiento necesario para ejecutar contrato
- Ej: autenticación, facturación

### 3.3 Obligación Legal
- Cumplimiento con ley
- Ej: registros de impuestos, requisitos de auditoría

### 3.4 Intereses Vitales
- Proteger vida de la persona
- Situaciones excepcionales (emergencias)

### 3.5 Tarea Pública
- Ejercer función oficial
- Gobierno o autoridades públicas

### 3.6 Intereses Legítimos
- Interés legítimo del controlador
- Si no entra en conflicto con derechos del individuo
- Ejemplos: prevención de fraude, seguridad

## 4. Roles y Responsabilidades

### 4.1 ¿Eres Controlador o Procesador?

**Controlador** determina:
- Propósito del procesamiento
- Medios del procesamiento
- Datos a procesar

**Procesador** procesa en nombre del controlador

**Si usas la API**:
- Eres probablemente **Controlador**
- La API es **Procesador** (por contrato DPA)
- Tú eres responsable de: consentimiento, base legal, cumplimiento

### 4.2 Responsabilidades del Controlador

- Determinar base legal antes de procesar
- Obtener consentimiento cuando sea necesario
- Documentar base legal (Registro de Actividades)
- Comunicar privacidad a usuarios
- Responder a solicitudes de derechos
- Notificar brechas de seguridad
- Realizar Evaluación de Impacto (DPIA) si aplica
- Designar DPO si es requerido

## 5. Consentimiento

### 5.1 Cuándo es Requerido

Consentimiento es necesario cuando procesas datos **sin** otra base legal.

Consentimiento **NO** es necesario para:
- Autenticación (Contrato)
- Prevención de fraude (Interés Legítimo)
- Cumplimiento legal
- Protección de vidas

### 5.2 Requisitos de Consentimiento

El consentimiento válido debe ser:

- **Específico**: Para cada propósito claramente definido
- **Informado**: Explicar qué datos y por qué
- **Voluntario**: Sin presión o coerción
- **Activo**: Opt-in (no opt-out)
- **Revocable**: Fácil de retirar en cualquier momento
- **Documentado**: Guardar prueba de consentimiento

### 5.3 Cómo Obtener Consentimiento

**Ejemplo de lenguaje**:

```
"Consiento que [Tu Empresa] procese mis datos personales 
(nombre, correo, datos de campaña) para proporcionar el Servicio, 
mejorar características, y enviar actualizaciones importantes.

Puedo revocar este consentimiento en cualquier momento contactando 
a privacy@tuempresa.com

He leído la Política de Privacidad: [Link]"
```

**No usar**:

- ❌ "Hacemos clic en continuar constituye consentimiento"
- ❌ Cajas pre-marcadas (debe estar vacía)
- ❌ Solicitar más que lo necesario
- ❌ Lenguaje vago o confuso

## 6. Evaluación de Impacto en la Privacidad (DPIA)

### 6.1 Cuándo es Requerida

Una DPIA es requerida si:

- Procesamiento automatizado que afecta decisiones
- Procesamiento a escala de categorías especiales de datos
- Monitoreo sistemático
- Datos de menores o vulnerables
- Datos genéticos, biométricos, salud
- Procesamiento innovador o de alto riesgo

### 6.2 Qué Incluir

Una DPIA debe documentar:

1. **Descripción del procesamiento**
   - Qué datos se procesan
   - Quién tiene acceso
   - Propósito exacto

2. **Evaluación de necesidad y proporcionalidad**
   - ¿Es el procesamiento necesario?
   - ¿Hay alternativas menos intrusivas?

3. **Evaluación de riesgos**
   - ¿Qué podría salir mal?
   - Probabilidad e impacto
   - Vulnerabilidades

4. **Medidas mitigantes**
   - Cómo reduces el riesgo
   - Controles técnicos y organizacionales

5. **Consulta con DPO**
   - Si es requerido

### 6.3 Plantilla DPIA Simplificada

```markdown
# DPIA: [Nombre del Procesamiento]

## 1. Descripción
- Qué datos: [especificar]
- Cuánto: [volumen]
- Frecuencia: [cuántas veces]
- Duración: [cuánto tiempo]
- Destinatarios: [quién accede]
- Propósito: [específicamente qué]

## 2. Necesidad y Proporcionalidad
- ¿Por qué es necesario?
- ¿Hay alternativas?
- ¿Es proporcional?

## 3. Riesgos Identificados
- Riesgo 1: [descripción] - Probabilidad: [Alta/Media/Baja] - Impacto: [Alto/Medio/Bajo]
- Riesgo 2: ...

## 4. Medidas Mitigantes
- Técnicas: [encriptación, etc.]
- Organizacionales: [políticas, capacitación]
- Contractuales: [DPA, etc.]

## 5. Conclusión
- Riesgo residual aceptable: [Sí/No]
```

## 7. Derechos del Interesado

La API permite responder a estos derechos:

### 7.1 Derecho de Acceso
- Usuario puede solicitar copia de sus datos
- Debe proporcionarse dentro de 30 días
- En formato legible y estructurado

**Cómo implementar**:
```
GET /api/me/data?campaignId=xxxx
Devuelve todos los datos del usuario en JSON
```

### 7.2 Derecho de Rectificación
- Usuario puede corregir datos inexactos
- Debes actualizar dentro de 30 días

**Cómo implementar**:
```
PATCH /api/campaigns/{id}
{
  "name": "Nombre Corregido"
}
```

### 7.3 Derecho al Olvido (Eliminación)
- Usuario puede solicitar eliminación
- Aplican excepciones (requisitos legales, backups)
- Debe completarse dentro de 30 días

**Cómo implementar**:
```
DELETE /api/campaigns/{id}
Marca como soft-deleted
Purificado en 90 días
```

### 7.4 Derecho a Limitar Procesamiento
- Usuario puede restringir uso de datos
- Debes detener procesamiento excepto almacenamiento

### 7.5 Derecho a Portabilidad
- Usuario obtiene datos en formato estructurado
- Para transferir a otro servicio

**Cómo implementar**:
```
GET /api/me/export?campaignId=xxxx&format=json
Devuelve todos los datos en formato portable
```

### 7.6 Derecho a Oposición
- Usuario puede oponerse a procesamiento
- Para propósitos de marketing/ventas

### 7.7 Derechos Relacionados a Decisiones Automatizadas
- Usuario tiene derecho a no ser sujeto solo a decisiones automatizadas
- Si resulta en efectos legales o igualmente significativos

## 8. Notificación de Brechas

### 8.1 Cuándo Notificar

- Acceso no autorizado a datos personales
- Pérdida de datos
- Corrupción de datos
- Que pone en riesgo derechos/libertades

### 8.2 A Quién Notificar

1. **Autoridad de Protección de Datos**
   - Sin retraso injustificado
   - Dentro de 72 horas si es posible

2. **Afectados**
   - Si hay riesgo alto
   - En lenguaje simple
   - Medidas tomadas/disponibles

### 8.3 Qué Incluir en Notificación

- Naturaleza de la brecha
- Datos afectados
- Probabilidad de riesgo
- Medidas tomadas/propuestas
- Contacto DPO/Responsable
- Datos aproximados afectados

## 9. Contrato de Procesamiento de Datos (DPA)

### 9.1 Requerimiento

Si usas la API con datos de la UE, necesitas un DPA que establezca:

- Qué datos se procesan
- Duración del procesamiento
- Naturaleza y propósito
- Tipo de datos personales
- Categorías de interesados
- Obligaciones y derechos del controlador

### 9.2 La API Proporciona

Disponible DPA modelo que cubre:

- Cláusulas de protección estándar de la UE
- Obligaciones de seguridad
- Asistencia con derechos de interesados
- Auditorías y cumplimiento

**Solicita en**: legal@gptmemory.dev

## 10. Transferencias Internacionales

### 10.1 Restricción de la UE

GDPR restringe transferencias de datos fuera de la UE a países sin "adecuación" establecida.

### 10.2 Soluciones

Para transferencias seguras:

- **Cláusulas de Protección Estándar (SCC)**
  - Contratos aprobados por la Comisión Europea
  - Incluidos en nuestro DPA

- **Normas Vinculantes Corporativas (BCR)**
  - Para grupos empresariales

- **Decisión de Adecuación**
  - La UE determina equivalencia (ej: Japón, Corea del Sur)

### 10.3 Estado Actual

La API opera en infraestructura Cloudflare:

- Servidores en múltiples ubicaciones globales
- Incluye UE
- Protegido por SCC en nuestro DPA

## 11. Designación de DPO

### 11.1 Cuándo es Requerido

Debes designar un Delegado de Protección de Datos (DPO) si:

- Eres autoridad pública
- Actividades principales requieren monitoreo sistemático a gran escala
- Actividades principales requieren procesamiento de categorías especiales

### 11.2 Si Requieres DPO

Debe:
- Ser independiente
- Tener pericia en privacidad
- Tener contacto directo con autoridades
- Estar disponible para consulta interna

## 12. Documentación y Registros

### 12.1 Registro de Actividades de Tratamiento

Debes mantener registro de:

- **Controlador**: Tu nombre y datos de contacto
- **Procesador**: Nuestro nombre y datos de contacto (si usas DPA)
- **Propósitos**: Por qué procesas datos
- **Datos**: Tipos de datos personales
- **Interesados**: Categorías de personas
- **Duración**: Cuánto tiempo retienes
- **Seguridad**: Medidas de protección

### 12.2 Documentación de Consentimiento

Guarda:
- Copia de consentimiento
- Fecha y hora
- Método (checkbox, firma, etc.)
- Verificación de consentimiento

## 13. Evaluación de Conformidad

### 13.1 Checklist de Cumplimiento

- ☐ ¿He identificado base legal para cada procesamiento?
- ☐ ¿Tengo consentimiento donde es requerido?
- ☐ ¿He completado DPIA si es necesario?
- ☐ ¿Tengo DPA en lugar?
- ☐ ¿Puedo responder a derechos de interesados?
- ☐ ¿Tengo política de privacidad clara?
- ☐ ¿Tengo medidas de seguridad implementadas?
- ☐ ¿He designado DPO si es requerido?
- ☐ ¿Tengo registro de actividades?
- ☐ ¿Tengo plan de respuesta a brechas?

## 14. Recursos

### 14.1 Oficiales

- [EDPB (Junta Europea)](https://edpb.ec.europa.eu/)
- [GDPR.eu](https://gdpr.eu/)
- [Comisión Europea](https://ec.europa.eu/info/law/law-topic/data-protection_en)

### 14.2 Herramientas

- [DPIA Template](https://www.cnil.fr/sites/default/files/documents/dpia_template_en.docx) - CNIL (Francia)
- [GDPR Compliance Tool](https://www.gdprcompliancetools.com/)
- [Privacy Impact Assessment](https://iapp.org/resources/)

## 15. Contacto para Clarificaciones

**Email**: legal@gptmemory.dev  
**Teléfono**: [Tu teléfono]  
**DPO**: dpo@gptmemory.dev  

---

**Aviso Legal**: Esta guía es informativa solamente. No constituye asesoramiento legal. Consulta con un abogado especializado en privacidad antes de implementar cualquier procesamiento de datos.

**Última actualización**: 18 de julio de 2026
