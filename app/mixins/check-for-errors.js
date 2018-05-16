<<<<<<< HEAD
import Ember from 'ember';

const {
  get,
  Mixin,
  RSVP
} = Ember;

export default Mixin.create({
  _checkForErrors(callPromise) {
    return new RSVP.Promise((resolve, reject) => {
      callPromise.then(resolve, (err) => {
        let database = get(this, 'database');
        reject(database.handleErrorResponse(err));
      });
    });
  }
});
=======
import { get } from '@ember/object';
import Mixin from '@ember/object/mixin';
import RSVP from 'rsvp';

export default Mixin.create({
  _checkForErrors(callPromise) {
    return new RSVP.Promise((resolve, reject) => {
      callPromise.then(resolve, (err) => {
        let database = get(this, 'database');
        reject(database.handleErrorResponse(err));
      });
    });
  }
});
>>>>>>> 04412e25eaea300a172007bb9619752ed10be2ea
