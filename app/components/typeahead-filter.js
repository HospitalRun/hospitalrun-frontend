import Ember from 'ember';
import TypeAhead from 'hospitalrun/mixins/typeahead';
export default Ember.Component.extend(TypeAhead, {
  classNames: ['form-group'],
  selectedAction: 'filter',
  setOnBlur: false
});
