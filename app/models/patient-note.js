import AbstractModel from 'hospitalrun/models/abstract';
import DS from 'ember-data';

export default AbstractModel.extend({
  //if this note is related to an appointment, make sure it's noted.
  appointment: DS.belongsTo('appointment', {
    async: false
  }),
  //if the note was written by one person but dictated / given on behalf of another, otherwise, this and createdBy are the same
  attribution: DS.attr('string'),  
  content: DS.attr('string'),
  createdBy: DS.attr('string'),
  date: DS.attr('date'),
  //if this note is related to an imaging request, make sure it's noted.
  imaging: DS.belongsTo('imaging', {
    async: false
  }),
  //if this note is related to a lab, make sure it's noted.
  lab: DS.belongsTo('lab', {
    async: false
  }),
  //if this note is related to a medication request, make sure it's noted.
  medication: DS.belongsTo('medication', {
    async: false
  }),
  //custom list of noteTypes of mixins/patient-note-types
  noteType: DS.attr(),
  //who is this note about?
  patient: DS.belongsTo('patient', {
    async: false
  }),  
  //if this note is related to a procedure, make sure it's noted.
  procedure: DS.belongsTo('procedure', {
    async: false
  }),
  //if this note is related to a visit, make sure it's noted.
  visit: DS.belongsTo('visit', {
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