import AbstractModel from 'hospitalrun/models/abstract';
import DS from 'ember-data';

export default AbstractModel.extend({
  //if the note was written by one person but dictated / given on behalf of another, otherwise, this and createdBy are the same
  attribution: DS.attr('string'),  
  content: DS.attr('string'),
  createdBy: DS.attr('string'),
  date: DS.attr('date'),
  /*
  //linkedObjectType is a shortcut to the name of the model (lab, visit, phisio, etc)
  linkedObjectType: DS.attr('string'),
  //linkedObjectId is a id of the model (lab, visit, phisio, etc)
  linkedObjectId: DS.attr('string'),
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