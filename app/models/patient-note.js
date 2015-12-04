import AbstractModel from 'hospitalrun/models/abstract';
import DS from 'ember-data';

export default AbstractModel.extend({
  //if the note was written by one person but dictated / given on behalf of another, otherwise, this and createdBy are the same
  attribution: DS.attr('string'),  
  content: DS.attr('string'),
  createdBy: DS.attr('string'),
  date: DS.attr('date'),
  /*
  appointment: DS.belongsTo('appointment', {
    async: false
  }),
  lab: DS.belongsTo('lab', {
    async: false
  }),
  procedure: DS.belongsTo('procedure', {
    async: false
  }),
  visit: DS.belongsTo('visit', {
    async: false
  }),
  */
  //custom list of noteTypes of mixins/patient-note-types
  noteType: DS.attr(),
  patient: DS.belongsTo('patient', {
    async: false
  }),
  
  validations: {
    patient: {
      presence: true
    },
    noteType: {
      presence: true
    },
    content: {
      presence: true
    }
  }
});