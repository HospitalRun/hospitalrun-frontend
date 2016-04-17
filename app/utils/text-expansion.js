export default {
  findExpansionSubjects: function(text) {
    const search = /(^|\s+)(#\S+)/g;
    var match = true;

    const subjects = [];
    while (match != null) {

      match = search.exec(text);
      if (match && match.length > 2) {
        subjects.push(match[2]);
      }
    }

    return subjects.filter(onlyUnique);
  },

  findExpansionSites: function(text, subjects) {

    return subjects
      .map(findAllIndices(text))
      .reduce((a,b) => { // flatmap
        return a.concat(b);
      }, []);
  }
};

function findAllIndices(text) {
  return function(value) {
    const result = [];
    var keepMatching = true;
    var matchPoint = 0;
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
