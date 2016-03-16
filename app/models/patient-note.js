import { translationMacro as t } from 'ember-i18n';
import AbstractModel from 'hospitalrun/models/abstract';
import DS from 'ember-data';

export default AbstractModel.extend({
  authoredBy: function() {
    if (!Ember.isEmpty(this.get('attribution')) {
      return this.get('attribution')+' '+i18n.t('messages.on_behalf_of')+' '+this.get('createdBy');
    } else {
      return this.get('createdBy');
    }
  }.property('attribution', 'createdBy'),
  //if the note was written by one person but dictated / given on behalf of another, otherwise, this and createdBy are the same
  attribution: DS.attr('string'),  
  content: DS.attr('string'),
  createdBy: DS.attr('string'),  
  date: DS.attr('date'),
  //custom list of noteTypes of mixins/patient-note-types
  noteType: DS.attr(),
  //who is this note about?
  patient: DS.belongsTo('patient', {
    async: false
  }),  
  //if this note is related to a visit, make sure it's noted.
  visit: DS.belongsTo('visit', {
    async: false
  }),  
  //if this note is related to an appointment, make sure it's noted.
  appointment: DS.belongsTo('appointment', {
    async: false
  }),
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
  //if this note is related to a procedure, make sure it's noted.
  procedure: DS.belongsTo('procedure', {
    async: false
  }),
  validations: {
    patient: {
      presence: true
    },
    visit: {
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