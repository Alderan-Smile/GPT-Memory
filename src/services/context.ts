import { CharacterRepository } from '../repositories/character.js';
import { EventRepository } from '../repositories/events.js';
import { RelationshipRepository } from '../repositories/events.js';
import { SecretRepository } from '../repositories/knowledge.js';
import { PlayerKnowledgeRepository } from '../repositories/knowledge.js';
import { NoteRepository } from '../repositories/misc.js';
import type { ContextQuery } from '../validators/search.js';
import type { Character } from '../database/schema/characters.js';
import type { Event, Relationship } from '../database/schema/events.js';
import type { Secret, PlayerKnowledge } from '../database/schema/knowledge.js';
import type { Note } from '../database/schema/misc.js';

export type SceneContext = {
  characters: Character[];
  events: Event[];
  relationships: Relationship[];
  secrets: Secret[];
  playerKnowledge: PlayerKnowledge[];
  notes: Note[];
};

export class ContextService {
  private characters: CharacterRepository;
  private events: EventRepository;
  private relationships: RelationshipRepository;
  private secrets: SecretRepository;
  private playerKnowledge: PlayerKnowledgeRepository;
  private notes: NoteRepository;

  constructor(d1: D1Database) {
    this.characters = new CharacterRepository(d1);
    this.events = new EventRepository(d1);
    this.relationships = new RelationshipRepository(d1);
    this.secrets = new SecretRepository(d1);
    this.playerKnowledge = new PlayerKnowledgeRepository(d1);
    this.notes = new NoteRepository(d1);
  }

  async buildContext(query: ContextQuery): Promise<SceneContext> {
    const { campaignId, planet, location, date, characters: charIds = [], limit = 20 } = query;
    const pagination = { page: 1, limit, offset: 0 };

    // Gather relevant characters at this location/planet
    const sceneCharacters = await this.characters.findByLocation(campaignId, location, planet);

    // Additional characters explicitly mentioned
    const explicitCharacters = charIds.length > 0
      ? await Promise.all(charIds.map((id) => this.characters.findById(id, campaignId)))
      : [];

    const allCharacterIds = [
      ...new Set([
        ...sceneCharacters.map((c) => c.id),
        ...explicitCharacters.filter(Boolean).map((c) => c!.id),
      ]),
    ];

    // Gather relationships between the characters
    const allRelationships = await Promise.all(
      allCharacterIds.map((id) => this.relationships.findByCharacter(campaignId, id)),
    );
    const uniqueRelationships = Object.values(
      Object.fromEntries(
        allRelationships.flat().map((r) => [r.id, r]),
      ),
    );

    // Recent events at this location/planet
    const recentEvents = date
      ? await this.events.findNearDate(campaignId, date, limit)
      : (await this.events.findAll(campaignId, pagination, { planet })).data;

    // Visible secrets
    const visibleSecrets = (
      await this.secrets.findAll(campaignId, pagination, { visibleToPlayer: true })
    ).data;

    // Player knowledge for these characters
    const playerKnowledgeEntries = (
      await Promise.all(
        allCharacterIds.map((id) =>
          this.playerKnowledge.findAll(campaignId, pagination, { characterId: id }),
        ),
      )
    ).flatMap((r) => r.data);

    // Notes related to the scene
    const locationNotes = location
      ? (await this.notes.findAll(campaignId, pagination, { entityId: location, entityType: 'location' })).data
      : [];

    const allCharacters = [
      ...sceneCharacters,
      ...explicitCharacters.filter((c): c is Character => c !== undefined),
    ];
    const uniqueCharacters = Object.values(
      Object.fromEntries(allCharacters.map((c) => [c.id, c])),
    );

    return {
      characters: uniqueCharacters,
      events: recentEvents,
      relationships: uniqueRelationships,
      secrets: visibleSecrets,
      playerKnowledge: playerKnowledgeEntries,
      notes: locationNotes,
    };
  }
}
