import elasticClient from '../db/elastic-client';

export type capsuleDocument = {
  id: number;
  creator: string;
  created_at: Date;
  deleted_at: Date | null;
  data: object;
};

export default class elasticCapsule {
  private static index = 'capsules';
  private static schema = {
    id: {
      type: 'integer'
    },
    creator: {
      type: 'text'
    },
    created_at: {
      type: 'date'
    },
    deleted_at: {
      type: 'date'
    },
    data: {
      properties: {
        reuse_count: {
          type: 'integer'
        },
        water_landings: {
          type: 'integer'
        },
        land_landings: {
          type: 'integer'
        },
        last_update: {
          type: 'text'
        },
        launches: {
          type: 'text'
        },
        serial: {
          type: 'text'
        },
        status: {
          type: 'text'
        },
        type: {
          type: 'text'
        },
        id: {
          type: 'text'
        }
      }
    }
  };

  static getIndex() {
    return this.index;
  }

  static getSchema() {
    return this.schema;
  }

  static async syncCapsules(capsules: capsuleDocument[]) {
    const index = this.index;
    return await elasticClient.helpers.bulk({
      datasource: capsules,
      refresh: true,
      onDocument(doc: capsuleDocument) {
        return [
          { update: { _index: index, _id: doc.id.toString() } },
          { doc_as_upsert: true }
        ];
      }
    });
  }
}
