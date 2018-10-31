import { inject as service } from '@ember/service';
import { computed } from '@ember/object';
import { isEmpty } from '@ember/utils';
import AbstractIndexRoute from 'hospitalrun/routes/abstract-index-route';
import DateFormat from 'hospitalrun/mixins/date-format';
import moment from 'moment';
import { translationMacro as t } from 'ember-intl';

export default AbstractIndexRoute.extend(DateFormat, {
  database: service(),
  itemsPerPage: null, // Fetch all outpatient visits as one page
  modelName: 'visit',
  newButtonAction: 'patientCheckIn',
  newButtonText: t('patients.buttons.patientCheckIn'),
  selectedVisitDate: null,
  showingTodaysPatients: true,
  pageTitle: computed('showingTodaysPatients', 'selectedVisitDate', function() {
    let intl = this.get('intl');
    let showingTodaysPatients = this.get('showingTodaysPatients');
    if (showingTodaysPatients) {
      return intl.t('patients.titles.todaysOutpatients');
    } else {
      let selectedVisitDate = this._dateFormat(this.get('selectedVisitDate'));
      return intl.t('patients.titles.outpatientsForDate', { visitDate: selectedVisitDate });
    }
  }),

  queryParams: {
    visitDate: { refreshModel: true },
    visitLocation: { refreshModel: false }
  },

  _getStartKeyFromItem(item) {
    let displayPatientId = item.get('displayPatientId');
    return [displayPatientId, `patient_${item.get('id')}`];
  },

  _modelQueryParams(params) {
    let database = this.get('database');
    let maxId = database.getMaxPouchId('visit');
    let minId = database.getMinPouchId('visit');
    let { visitDate } = params;
    if (isEmpty(visitDate)) {
      visitDate = moment();
    } else {
      visitDate = moment(parseInt(visitDate));
    }
    if (visitDate.isSame(moment(), 'day')) {
      this.set('showingTodaysPatients', true);
    } else {
      this.set('showingTodaysPatients', false);
      this.set('selectedVisitDate', visitDate.toDate());
    }
    let endOfDay = visitDate.endOf('day').valueOf();
    let startOfDay = visitDate.startOf('day').valueOf();
    return {
      mapReduce: 'visit_by_date',
      options: {
        endkey: [endOfDay, endOfDay, maxId],
        startkey: [startOfDay, null, minId]
      }
    };
  },

  model(params) {
    return this._super(params).then((model) => {
      let visitDate = new Date();
      if (!isEmpty(params.visitDate)) {
        visitDate.setTime(params.visitDate);
      }
      model.set('selectedVisitDate', visitDate);
      model.set('display_selectedVisitDate', this._dateFormat(visitDate));
      model.set('selectedLocation', params.visitLocation);
      return model;
    });
  },

  actions: {
    finishCheckOut(visit) {
      this.controller.send('finishCheckOut', visit);
    },

    patientCheckIn() {
      this.controller.send('patientCheckIn');
    }
  }

});
