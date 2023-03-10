import debug from 'debug';
import lodash from 'lodash';
import got from 'got';

const log = debug('index.js');

log('loading...');

export default class BlackDuckAPI {
  constructor(api, token) {
    this.api = api;
    this.token = token;
    this.bearer = '';
  }

  async getBearer() {
    try {
      const result = await got.post(`${this.api}/tokens/authenticate`, {
        headers: {
          Authorization: `token ${this.token}`,
          Accept: 'application/vnd.blackducksoftware.user-4+json',
        },
        https: {
          rejectUnauthorized: false,
        },
      });

      const json = JSON.parse(result.body);

      log('bearer', json);
      this.bearer = json.bearerToken;

      return json;
    } catch (error) {
      log('error', error);
      return null;
    }
  }

  async getProjects(query, filter) {
    const url = `${this.api}/projects`;
    log('url', url);

    try {
      const result = await got.get(`${url}?limit=1000&q=${query}&filter=${filter}`, {
        headers: {
          Authorization: `Bearer ${this.bearer}`,
          Accept: 'application/vnd.blackducksoftware.project-detail-4+json',
        },
        https: {
          rejectUnauthorized: false,
        },
      });

      const json = JSON.parse(result.body);
      if (json === undefined) {
        log('projects', 0);
        return [];
      }
      log('projects', json.totalCount);
      return json.items;
    } catch (error) {
      log('error', error);
      return null;
    }
  }

  /*
     * PROJECT NODES
     */
  async getVersions(projectObject, query, filter) {
    // eslint-disable-next-line no-underscore-dangle
    const url = lodash.filter(projectObject._meta.links, (x) => x.rel === 'versions')[0].href;
    log('url', url);

    try {
      const result = await got.get(`${url}?limit=1000&q=${query}&filter=${filter}`, {
        headers: {
          Authorization: `Bearer ${this.bearer}`,
          Accept: '*/*',
          'Content-Type': 'application/vnd.blackducksoftware.project-detail-4+json',
        },
        https: {
          rejectUnauthorized: false,
        },
      });

      const json = JSON.parse(result.body);
      if (json === undefined) {
        log('versions', 0);
        return [];
      }
      log('versions', json.totalCount);
      return json.items;
    } catch (error) {
      log('error', error);
      return null;
    }
  }
}
