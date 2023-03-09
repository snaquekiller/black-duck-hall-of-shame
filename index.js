import { BlackDuckAPI, BlackDuckReports } from './blackDuck.js';
import dotenv from "dotenv";
import lodash from "lodash";
dotenv.config();
const apiToken = process.env.API_TOKEN;
const blackDuckUrl = process.env.BLACKDUCK_URL;
const searchString = process.env.SEARCH_STRING;
const prefix = process.env.PREFIX;
if(!apiToken){
    console.error("Please put a API_TOKEN");
    exit(1);
}
if(!blackDuckUrl){
    console.error("Please put a BLACKDUCK_URL");
    exit(1);
}
if(!searchString){
    console.error("Please put a SEARCH_STRING");
    exit(1);
}
if(!prefix){
    console.error("Please put a prefix");
    exit(1);
}

const bd = new BlackDuckAPI(blackDuckUrl, apiToken);
const allProject = [];
const promiseAll = [];
bd.getBearer().then((bearer) => {
    bd.getProjects(`name:${searchString}`).then((projects) => {
        projects.forEach((_project) => {
            promiseAll.push(bd.getVersions(_project, 'phase:RELEASED').then((versions) => {
                const version = versions[0];
                const newObject = {name: _project.name, date: _project.updatedAt, url: version._meta.href};
                const security = version.securityRiskProfile;
                security.counts.forEach(_element => {
                    newObject[`Security_${_element.countType}`]=_element.count;
                });
                const operational = version.operationalRiskProfile;
                operational.counts.forEach(_element => {
                    newObject[`Operational_${_element.countType}`]=_element.count;
                });
                allProject.push(newObject);
                return Promise.resolve(newObject);
            }));
        });
        Promise.allSettled(promiseAll).then(() => {
            const sorted = lodash.sortBy(allProject, ["Security_CRITICAL", "Security_HIGH"]);
            BlackDuckReports.reportProjectSecurity(sorted.reverse(), prefix);
        });
    });
});
