export default {
  // Find words with expansion prefix
  // '#abc abc #cd' -> ['#abc', '#cd']
  findExpansionSubjects(text) {
    let search = /(^|\s+)(#\S+)/g;
    let match = true;

    let subjects = [];
    while (match != null) {

      match = search.exec(text);
      if (match && match.length > 2) {
        subjects.push(match[2]);
      }
    }

    return subjects.filter(onlyUnique);
  },

  // Find all detected expandable sites by index
  // 'abc #abc cd', ['#abc'] -> [{ index: 4, match: '#abc', term: 'abc'}]
  findExpansionSites(text, subjects) {

    return subjects
      .map(findAllIndices(text))
      .reduce((a, b) => { // flatmap
        return a.concat(b);
      }, []);
  }
};

function findAllIndices(text) {
  return function(value) {
    let result = [];
    let keepMatching = true;
    let matchPoint = 0;
    while (keepMatching) {
      matchPoint = text.indexOf(value, matchPoint);
      if (matchPoint > -1) {
        result.push({
          index: matchPoint,
          match: value,
          term: value.slice(1)
        });
      } else {
        keepMatching = false;
      }

      matchPoint += 1;
    }

    return result;
  };
}

function onlyUnique(value, index, self) {
  return self.indexOf(value) === index;
}
