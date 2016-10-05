import Ember from 'ember';
import Base from 'ember-validations/validators/base';

export default Base.extend({
  _validate: Ember.on('init', function() {
    return this.call();
  }),

  call() {
    return new Ember.RSVP.Promise((resolve) => {
      Ember.run.debounce(this, () => {
        this._check(resolve);
      }, 150);
    });
  },

  _check(resolve) {
    const database = this.get('database');
    const id = this.get(this.property);
    const maxValue = this.get('maxValue');
    const query = {
      startkey: [id, null],
      endkey: [id, maxValue]
    };

    this.set('isValidating', true);
    database.queryMainDB(query, 'patient_by_display_id')
      .then((found) => {
        const others = found.rows.filter((row) =>
          this.get('id') !== database.getEmberId(row.id)
        );
        if (Ember.isEmpty(others)) {
          this.errors.clear();
          resolve(true);
        } else {
          this.errors.clear();
          this.errors.pushObject('is taken');
          resolve(false);
        }
      })
      .finally(() => {
        this.set('isValidating', false);
      });
  }
});
