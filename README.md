# black-duck-hall-of-shame

Create an all of Shame of all your Blackduck scanned repository.

## .env file

Create .env file like this :

```env
API_TOKEN=XXX
BLACKDUCK_URL=https://YOURURL.app.blackduck.com/api
PREFIX=YouPrefix
SEARCH_STRING=NAME
```

## How to use it

```bash
npm i
node src/index.js
```

## Export example

| name                                 | date                     | Security_CRITICAL | Security_HIGH | Security_MEDIUM | Security_LOW | Security_OK | Security_UNKNOWN | Operational_HIGH | Operational_MEDIUM | Operational_LOW | Operational_OK | Operational_UNKNOWN |
|--------------------------------------|--------------------------|-------------------|---------------|-----------------|--------------|-------------|------------------|------------------|--------------------|-----------------|----------------|---------------------|
| [_REPOS_Hall_Of_Shame]                     | 2023-03-09T01:57:48.3sZ | 2                 | 28            | 41              | 1            | 2119        | 0                | 1006             | 219                | 520             | 746            | 46                 |

[_REPOS_Hall_Of_Shame]: https://my-enterprise.app.blackduck.com/api/projects/6c1cf418-04db-4ccb-9d30-e45137cd7e5a/versions/799865d6-ac80-45b5-9354-d3390520d562
