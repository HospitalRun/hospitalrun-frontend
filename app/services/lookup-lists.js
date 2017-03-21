import Ember from 'ember';

const {
  Service,
  get,
  inject,
  isEmpty,
  RSVP
} = Ember;

export default Service.extend({
  lookupLists: {},
  store: inject.service(),

  /*
   * Get a lookup list by name
   * @param listName String containing the name of the lookup list to retrieve.
   * Usually the id of a lookup object, but the special value of 'incidentCategories'
   * will retrieve incident categories
   */
  getLookupList(listName) {
    return this.getLookupLists([listName]).then((lists) => {
      return lists[listName];
    });
  },

  /*
   * Given a list of lookup names, return the specified lists.
   * @param listName Array containg the names of the lookup lists to retrieve.
   * Can be the ids of lookup objects, and/or the special value of 'incidentCategories'
   * will retrieve incident categories.
   */
  getLookupLists(listNames) {
    let lookupLists = get(this, 'lookupLists');
    let store = get(this, 'store');
    let listsToQuery = listNames.filter((listName) => {
      if (isEmpty(lookupLists[listName])) {
        return true;
      }
    });
    if (isEmpty(listsToQuery)) {
      return Ember.RSVP.resolve(this._getLookupListsFromCache(listNames));
    } else {
      let queryHash = {};
      if (listsToQuery.includes('incidentCategories')) {
        queryHash.incidentCategories = store.findAll('inc-category');
        listsToQuery.removeObject('incidentCategories');
      }
      if (!isEmpty(listsToQuery)) {
        queryHash.lookup = store.query('lookup', {
          options: {
            keys: listsToQuery
          }
        });
      }
      return RSVP.hash(queryHash).then((hash) => {
        if (!isEmpty(hash.incidentCategories)) {
          lookupLists.incidentCategories = hash.incidentCategories.filterBy('archived', false);
        }
        if (!isEmpty(hash.lookup)) {
          listsToQuery.forEach((list) => {
            lookupLists[list] = hash.lookup.findBy('id', list);
          });
        }
        return this._getLookupListsFromCache(listNames);
      });
    }
  },

  resetLookupList(listName) {
    let lookupLists = get(this, 'lookupLists');
    delete lookupLists[listName];
  },

  _getIncidentCategories() {
    let store = get(this, 'store');
    return store.findAll('inc-category');
  },

  _getLookupListsFromCache(listNames) {
    let lookupLists = get(this, 'lookupLists');
    let returnLists = {};
    listNames.forEach((listName) => {
      if (!isEmpty(lookupLists[listName])) {
        returnLists[listName] = lookupLists[listName];
      }
    });
    return returnLists;
  }
});
