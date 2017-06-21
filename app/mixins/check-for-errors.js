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
