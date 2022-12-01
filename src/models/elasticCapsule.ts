import elasticClient from '../db/elastic-client';

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
}
