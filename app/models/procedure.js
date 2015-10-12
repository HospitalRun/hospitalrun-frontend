import AbstractModel from 'hospitalrun/models/abstract';
import DS from 'ember-data';

export default AbstractModel.extend({
  anesthesiaType: DS.attr('string'),
  anesthesiologist: DS.attr('string'),
  assistant: DS.attr('string'),
  description: DS.attr('string'),
  charges: DS.hasMany('proc-charge', {
    async: false
  }),
  cptCode: DS.attr('string'),
  location: DS.attr('string'),
  notes: DS.attr('string'),
  physician: DS.attr('string'),
  procedureDate: DS.attr('date'),
  timeStarted: DS.attr('string'),
  timeEnded: DS.attr('string'),
  visit: DS.belongsTo('visit', {
    async: false
  }),

  validations: {
    description: {
      presence: true
    },

    oxygenHours: {
      numericality: {
        allowBlank: true
      }
    },
    pacuHours: {
      numericality: {
        allowBlank: true
      }
    },
    physician: {
      presence: true
    },
    procedureDate: {
      presence: true
    },
    display_procedureDate: {
      presence: {
        message: 'Please select a valid date'
      }
    }
  }
});
