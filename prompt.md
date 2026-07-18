Eres un Arquitecto de Software Senior especializado en Cloudflare Workers, Node.js, TypeScript y SQLite (Cloudflare D1).

Tu única tarea es construir un Cloudflare Worker que funcione como un servicio REST de memoria persistente.

NO construyas una IA.

NO construyas un chatbot.

NO construyas un GPT.

NO construyas un Game Master.

NO implementes OpenAI.

NO implementes búsqueda web.

NO implementes lógica narrativa.

NO tomes decisiones.

El Worker únicamente almacena, modifica, busca y devuelve información.

Todo el proyecto debe estar listo para producción.

========================================

STACK

Cloudflare Workers

Node.js

TypeScript

Cloudflare D1 (SQLite)

Hono

Drizzle ORM

Zod

Vitest

========================================

OBJETIVO

Crear una API REST para administrar la memoria persistente de campañas de rol.

Debe soportar miles de campañas independientes.

Toda la información pertenece a una campaña mediante campaignId.

Nunca mezclar campañas.

========================================

ESTRUCTURA

src/

config/

database/

routes/

controllers/

services/

repositories/

middleware/

validators/

schemas/

types/

utils/

========================================

BASE DE DATOS

Diseñar correctamente el esquema relacional.

Usar claves foráneas.

Usar índices.

Optimizar consultas.

Usar UUID como clave primaria.

Todas las tablas deben tener

id

campaignId

createdAt

updatedAt

deletedAt

version

metadata JSON

Soft Delete obligatorio.

Nunca borrar físicamente registros.

========================================

TABLAS

Campaigns

Characters

Species

Organizations

Locations

Planets

StarSystems

Ships

Vehicles

Objects

Inventory

Relationships

Events

Timeline

Secrets

PlayerKnowledge

WorldKnowledge

Quotes

Notes

Tags

Sessions

========================================

CAMPAIGNS

id

name

description

createdAt

updatedAt

metadata

========================================

CHARACTERS

id

campaignId

name

aliases

species

gender

birth

death

status

organization

rank

currentPlanet

currentLocation

description

metadata

Estado emocional

trust

respect

friendship

fear

curiosity

anger

love

hate

debt

lastInteraction

========================================

LOCATIONS

id

campaignId

name

planet

sector

region

coordinates

description

metadata

========================================

PLANETS

id

campaignId

name

sector

region

system

description

metadata

========================================

OBJECTS

id

campaignId

name

type

owner

currentLocation

state

description

metadata

========================================

SHIPS

id

campaignId

name

class

captain

crew

currentLocation

state

metadata

========================================

ORGANIZATIONS

id

campaignId

name

description

leader

metadata

========================================

EVENTS

id

campaignId

date

era

planet

location

summary

importance

canon

alternateCanon

metadata

========================================

TIMELINE

id

campaignId

date

eventId

order

========================================

RELATIONSHIPS

id

campaignId

characterA

characterB

relationshipType

strength

history

metadata

========================================

SECRETS

id

campaignId

title

content

revealed

visibleToPlayer

conditions

importance

metadata

========================================

PLAYER KNOWLEDGE

Información conocida por los personajes controlados por el jugador.

========================================

WORLD KNOWLEDGE

Información existente en el mundo.

Nunca mezclar PlayerKnowledge con WorldKnowledge.

========================================

QUOTES

id

campaignId

author

target

location

date

text

importance

========================================

NOTES

Notas libres.

========================================

TAGS

Etiquetas reutilizables para cualquier entidad.

========================================

SESSIONS

Registrar sesiones de juego.

========================================

API

GET /health

GET /campaigns

POST /campaigns

GET /campaigns/:id

PATCH /campaigns/:id

DELETE /campaigns/:id

GET /characters

GET /characters/:id

POST /characters

PATCH /characters/:id

DELETE /characters/:id

GET /locations

POST /locations

PATCH /locations/:id

DELETE /locations/:id

GET /planets

POST /planets

PATCH /planets/:id

DELETE /planets/:id

GET /ships

POST /ships

PATCH /ships/:id

DELETE /ships/:id

GET /objects

POST /objects

PATCH /objects/:id

DELETE /objects/:id

GET /organizations

POST /organizations

PATCH /organizations/:id

DELETE /organizations/:id

GET /events

POST /events

PATCH /events/:id

DELETE /events/:id

GET /timeline

POST /timeline

PATCH /timeline/:id

GET /relationships

POST /relationships

PATCH /relationships/:id

DELETE /relationships/:id

GET /quotes

POST /quotes

PATCH /quotes/:id

DELETE /quotes/:id

GET /notes

POST /notes

PATCH /notes/:id

DELETE /notes/:id

GET /knowledge/player

POST /knowledge/player

PATCH /knowledge/player/:id

DELETE /knowledge/player/:id

GET /knowledge/world

POST /knowledge/world

PATCH /knowledge/world/:id

DELETE /knowledge/world/:id

GET /secrets

POST /secrets

PATCH /secrets/:id

DELETE /secrets/:id

========================================

BUSCADOR

Implementar

GET /search

Debe buscar simultáneamente en

Characters

Locations

Planets

Ships

Objects

Events

Timeline

Relationships

Quotes

Notes

Secrets

PlayerKnowledge

WorldKnowledge

Usar SQLite FTS5.

Permitir filtros por campaña.

Permitir filtros por tipo.

Permitir filtros por fechas.

Permitir filtros por etiquetas.

========================================

CONTEXT BUILDER

Crear

GET /context

Recibe

campaignId

planet

location

date

characters[]

radius

limit

Debe devolver únicamente la información relevante para esa escena.

Personajes relacionados.

Eventos recientes.

Relaciones relevantes.

Objetos presentes.

Secretos visibles.

Conocimiento del jugador.

Lugares relacionados.

Cronología cercana.

========================================

REQUISITOS

Toda respuesta JSON.

Validación completa con Zod.

Transacciones cuando corresponda.

Repository Pattern.

Service Layer.

Código modular.

Sin duplicación.

SOLID.

Paginación.

Ordenamiento.

Filtros.

Manejo centralizado de errores.

Logs.

Migraciones.

Seeds.

Tests.

README.

Documentación OpenAPI.

========================================

ORDEN DE IMPLEMENTACIÓN

1 Crear estructura del proyecto.

2 Configurar Cloudflare Worker.

3 Configurar D1.

4 Crear esquema Drizzle.

5 Crear migraciones.

6 Crear modelos.

7 Crear repositorios.

8 Crear servicios.

9 Crear controladores.

10 Crear rutas.

11 Crear middleware.

12 Crear validaciones.

13 Crear documentación OpenAPI.

14 Crear tests.

No omitir pasos.

No generar código de ejemplo.

Todo el código debe quedar listo para desplegar en producción.
```