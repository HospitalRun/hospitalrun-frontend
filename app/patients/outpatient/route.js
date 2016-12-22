import AbstractIndexRoute from 'hospitalrun/routes/abstract-index-route';
import { translationMacro as t } from 'ember-i18n';
import PatientVisits from 'hospitalrun/mixins/patient-visits';
import Ember from 'ember';

export default AbstractIndexRoute.extend(PatientVisits, {
  modelName: 'visit',
  pageTitle: t('navigation.subnav.outpatient'),

  setupController: function(controller, model) {
    this._super(controller, model);

    Promise.all([
       this.getNonDischargedVisitsByType('Admission'),
       this.getNonDischargedVisitsByType('Followup')
    ]).then(function(values) {
      let visits = Ember.A();
      visits.pushObjects(values[0].toArray());
      visits.pushObjects(values[1].toArray());

      model.set('visits', visits);
      return visits;
    });
  }
});
