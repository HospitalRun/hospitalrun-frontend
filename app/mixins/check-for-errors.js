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
