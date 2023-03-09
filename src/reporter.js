/**
 * Format string to force a string to be a size
 * @param {String} str String that need to be format
 * @param {Number} length length maximum of the string
 * @returns {String} Format string
 */
function format(str, length) {
  if (str.length > length) {
    return `${str.substring(0, length - 3)}...`;
  }

  return String(str).padEnd(length);
}

export default class Reporter {
  static reportProjectSecurity(projects, prefix) {
    const head = '-------------';
    const { log } = console;
    let urls = '';
    const projects0 = projects[0];
    let firstLine = ' | ';
    let headLine = ' | ';
    Object.keys(projects0).forEach((key) => {
      if (key !== 'url') {
        if (key === 'name') {
          firstLine += format(key, 40);
          headLine += format(head, 30);
        } else {
          firstLine += format(key, 20);
          headLine += format(head, 20);
        }
        firstLine += '|';
        headLine += '|';
      }
    });
    log(firstLine);
    log(headLine);

    projects.forEach((_project) => {
      let newLine = ' | ';
      const { url } = _project;
      Object.keys(_project).forEach((key) => {
        if (key !== 'url') {
          let value = _project[key];
          if (key === 'name') {
            value = value.replace(prefix, '');
            value = value.replace('[', '_');
            value = value.replace(']', '_');
            value = `[${value}]`;
            newLine += format(value, 40);
            urls += `\n${value}: ${url}`;
          } else if (key === 'date') {
            newLine += format(value, 40);
          } else {
            newLine += format(value, 20);
          }
          newLine += '|';
        }
      });
      log(newLine);
    });
    log(urls);
  }
}
