import Ember from 'ember';
export default Ember.Mixin.create({
  validations: {
    result: {
      acceptance: {
        accept: true,
        if: function(object) {
          if (!object.get('hasDirtyAttributes')) {
            return false;
          }
          var status = object.get('status'),
            result = object.get('result');
          if (status === 'Completed' && Ember.isEmpty(result)) {
            // force validation to fail
            return true;
          }
          return false;
        },
        message: 'Please enter a result before completing'
      }
    }
  }
});
