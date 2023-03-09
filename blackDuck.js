import debug from 'debug';
import lodash from 'lodash';
const log = debug('index.js');

log('loading...');

import got from 'got';

export class BlackDuckAPI {

    constructor(api, token) {
        this._api = api;
        this._token = token;
        this._bearer = '';
    }

    async getBearer() {
        try {
            const result = await got.post(this._api + '/tokens/authenticate', {
                headers: {
                    Authorization: 'token ' + this._token,
                    Accept: 'application/vnd.blackducksoftware.user-4+json'
                },
                https: {
                    rejectUnauthorized: false
                }
            });

            const json = JSON.parse(result.body);

            log('bearer', json);
            this._bearer = json.bearerToken;

            return json;
        }
        catch (error) {
            console.log('error', error);
            return null;
        }
    }

    async getProjects(query, filter) {
        let url = this._api + '/projects';
        log('url', url);

        try {
            const result = await got.get(url + '?limit=1000&q=' + query + '&filter=' + filter, {
                headers: {
                    Authorization: 'Bearer ' + this._bearer,
                    Accept: 'application/vnd.blackducksoftware.project-detail-4+json'
                },
                https: {
                    rejectUnauthorized: false
                }
            });

            const json = JSON.parse(result.body);
            if(json === undefined) {
                log('projects', 0);
                return [];
            } else {
                log('projects', json.totalCount);
                return json.items;
            }
        }
        catch (error) {
            console.log('error', error);
            return null;
        }
    }

    /*
     * PROJECT NODES
     */
    async getVersions(project_object, query, filter) {
        let url = lodash.filter(project_object._meta.links, x => x.rel == 'versions')[0].href;
        log('url', url);

        try {
            const result = await got.get(url + '?limit=1000&q=' + query + '&filter=' + filter , {
                headers: {
                    Authorization: 'Bearer ' + this._bearer,
                    Accept: '*/*',
                    'Content-Type': 'application/vnd.blackducksoftware.project-detail-4+json'
                },
                https: {
                    rejectUnauthorized: false
                }
            });

            const json = JSON.parse(result.body);
            if(json === undefined) {
                log('versions', 0);
                return [];
            } else {
                log('versions', json.totalCount);
                return json.items;
            }
        }
        catch (error) {
            console.log('error', error);
            return null;
        }
    }
}

function format(str, length) {
    if(str.length > length) {
        return str.substring(0, length-3) + '...';
    }
    else {
        return String(str).padEnd(length);
    }
}

export class BlackDuckReports {

    static reportProjectSecurity (projects, prefix) {
        const head = "-------------";
        let urls = "";
        const projects0 = projects[0];
        let firstLine = ' | ';
        let headLine = ' | ';
        Object.keys(projects0).forEach((_key) => {
            if(_key !== "url") {
                if(_key === "name") {
                    firstLine += format(_key, 40);
                    headLine += format(head, 30);
                }else{
                    firstLine += format(_key, 20);
                    headLine += format(head, 20);
                }
                firstLine += '|';
                headLine += '|';
            }
        });
        console.log(firstLine);
        console.log(headLine);

        projects.forEach((_project) => {
            let firstLine = ' | ';
            const url = _project["url"];
            Object.keys(_project).forEach((_key) => {
                if(_key !== "url") {
                    let value = _project[_key];
                    if(_key === "name") {
                        value = value.replace(prefix, "");
                        value = value.replace("[", "_");
                        value = value.replace("]", "_");
                        value = `[${value}]`;
                        firstLine += format(value, 40);
                        urls += `\n${value}: ${url}`;
                    }else if(_key === "date") {
                        firstLine += format(value, 40);
                    } else{
                        firstLine += format(value, 20);
                    }
                    firstLine += '|';
                }

            });
            console.log(firstLine);
        });
        console.log(urls)
    }

}
