import elasticClient from '../db/elastic-client';

type etagDocument = {
  etag: string;
  date: number;
};

export default class elasticEtag {
  private static index = 'etag';
  private static schema = {
    etag: {
      type: 'text'
    },
    date: {
      type: 'date'
    }
  };

  static async addEtag(etag: string) {
    const etagDoc: etagDocument = {
      etag,
      date: Date.now()
    };

    await elasticClient.index({
      index: this.index,
      document: etagDoc
    });
  }

  static getIndex() {
    return this.index;
  }

  static getSchema() {
    return this.schema;
  }

  static async getCurrentEtag() {
    const etagValueBeforeFirstSync = '0';
    const searchParams = {
      index: this.index,
      body: {
        sort: [{ date: { order: 'desc' } }],
        size: 1,
        query: { match_all: {} }
      }
    };
    const { hits } = await elasticClient.search(searchParams);
    if (hits.hits.length === 0) {
      return etagValueBeforeFirstSync;
    }
    const result = hits.hits[0]._source as etagDocument;
    return result.etag;
  }
}
