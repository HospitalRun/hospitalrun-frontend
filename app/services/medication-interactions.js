import Ember from 'ember';

/**
 * todo
 * 1. Make tty configurable with application wide defaults
 * 2. figure out if this is even what is needed
 * 3. Figure out strategy to persist data locally
 */

export default Ember.Service.extend({
  ajax: Ember.inject.service(),
  interactionResource: 'https://rxnav.nlm.nih.gov/REST/interaction/interaction.json',
  //todo: make configurable
  rxNormTty: 'SCD',
  rxNormResource: 'https://rxnav.nlm.nih.gov/REST/',
  store: Ember.inject.service(),

  init() {
    this._super();
  },

  checkForInteractions(name) {
    return new Promise((resolve, reject) => {
      this._findRxcuiByString(name)
        .then(this._findInteractionsByRxcui)
        .then((results) => {
          resolve(results);
        })
        .catch((err) => {
          reject(err);
        })
    });
  },

  findRelatedMedicationToAllergy(name) {
    return new Promise((resolve, reject) => {
      this._findRxcuiByString(name)
        .then(this._findRelatedRxcuiById)
        .then((results) => {
          resolve(results);
        })
        .catch((err) => {
          reject(err);
        });
    });

  },

  /**
   * Helper to implement search
   * @param name
   * @returns {Promise}
   * @private
   */
  _findRxcuiByString(name) {
    let url = this.get('rxNormResource') + '/rxcui.json';
     return new Promise((resolve, reject) => {
       this.get('ajax').request(url, {
         method: 'GET',
         data: {
           name: name,
           search: 2
         }
       }).then((results) => {
          if (Ember.isEmpty(results.idGroup.rxnormId)) {
            reject('No results found');
          }

          // i couldn't find an example where the api returned more than 1 array
          resolve(results.idGroup.rxnormId[0]);
       }).catch((err) => {
         reject(err);
       })
     });
  },

  /**
   * Get related drug datas
   * @param rxcui
   * @returns {Promise}
   * @private
   */
  _findRelatedRxcuiById(rxcui) {
    let url = this.get('rxNormResource') + `/rxcui/${rxcui}/related.json`;
    return new Promise((resolve, reject) => {
      this.get('ajax').request(url, {
        method: 'GET',
        data: {
          tty: this.get('tty')
        }
      }).then((data) => {
        resolve(data);
      }).catch((err) => {
        reject(err);
      })
    })
  },

  /**
   * Not implemented
   * @param rxcui
   * @returns {Promise}
   * @private
   */
  _findInteractionsByRxcui(rxcui) {
    let url = this.get('interactionResource');
    return new Promise((reject, resolve) => {
      this.get('ajax').request(url, {
        method: 'GET',
        data: {
          rxcui: rxcui
        }
      }).then((results) => {
        resolve(results);
      }).catch((err) => {
        reject(err);
      })
    })
  }
});
