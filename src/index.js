/* eslint-disable import/extensions */
import dotenv from 'dotenv';
import lodash from 'lodash';
import BlackDuckAPI from './blackDuck.js';
import Reporter from './reporter.js';

dotenv.config();
const apiToken = process.env.API_TOKEN;
const blackDuckUrl = process.env.BLACKDUCK_URL;
const searchString = process.env.SEARCH_STRING;
const prefix = process.env.PREFIX;
let exit = false;
// eslint-disable-next-line no-console
const printError = console.error;
if (!apiToken) {
  printError('Please put a API_TOKEN');
  exit = true;
}
if (!blackDuckUrl) {
  printError('Please put a BLACKDUCK_URL');
  exit = true;
}
if (!searchString) {
  printError('Please put a SEARCH_STRING');
  exit = true;
}
if (!prefix) {
  printError('Please put a prefix');
  exit = true;
}
if (exit) {
  exit(1);
}

const bd = new BlackDuckAPI(blackDuckUrl, apiToken);
const allProject = [];
const promiseAll = [];
bd.getBearer().then(() => {
  bd.getProjects(`name:${searchString}`).then((projects) => {
    projects.forEach((_project) => {
      promiseAll.push(bd.getVersions(_project, 'phase:RELEASED').then((versions) => {
        const version = versions[0];
        const newObject = {
          name: _project.name,
          date: _project.updatedAt,
          // eslint-disable-next-line no-underscore-dangle
          url: version._meta.href
        };
        const security = version.securityRiskProfile;
        security.counts.forEach((_element) => {
          newObject[`Security_${_element.countType}`] = _element.count;
        });
        const operational = version.operationalRiskProfile;
        operational.counts.forEach((_element) => {
          newObject[`Operational_${_element.countType}`] = _element.count;
        });
        allProject.push(newObject);
        return Promise.resolve(newObject);
      }));
    });
    Promise.allSettled(promiseAll).then(() => {
      const sorted = lodash.sortBy(allProject, ['Security_CRITICAL', 'Security_HIGH']);
      Reporter.reportProjectSecurity(sorted.reverse(), prefix);
    });
  });
});
