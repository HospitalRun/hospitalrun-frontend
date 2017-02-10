import AbstractReportController from 'hospitalrun/controllers/abstract-report-controller';
import Ember from 'ember';
import NumberFormat from 'hospitalrun/mixins/number-format';
import UserSession from 'hospitalrun/mixins/user-session';
import moment from 'moment';
export default AbstractReportController.extend(UserSession, NumberFormat, {

  canGenerateReport: function() {
    return this.currentUserCan('generate_incident_report');
  }.property(),

  departmentReportColumns: {
    department: {
      label: 'Department',
      include: true,
      property: 'type' // property type because in _addReportRow function looks for column name with value as type
    },
    total: {
      label: 'Total',
      include: true,
      property: 'total',
      format: '_numberFormat'
    }
  },
  incidentTypeReportColumns: {
    incidentType: {
      label: 'Incident Type',
      include: true,
      property: 'type'
    },
    total: {
      label: 'Total',
      include: true,
      property: 'total',
      format: '_numberFormat'
    }
  },
  reportTypes: [{
    name: 'Incidents by Department',
    value: 'department'
  }, {
    name: 'Incidents by Type of Incident',
    value: 'incidentType'
  }],

  reportType: 'department',
  /**
   * Find Incidents by the specified dates and the incidents's date.
   */
  _findIncidentsByDate() {
    let filterEndDate = this.get('endDate');
    let filterStartDate = this.get('startDate');
    let findParams = {
      options: {},
      mapReduce: 'incident_by_date'
    };
    let maxValue = this.get('maxValue');
    return new Ember.RSVP.Promise(function(resolve, reject) {
      if (Ember.isEmpty(filterStartDate)) {
        reject();
      }
      findParams.options.startkey =  [filterStartDate.getTime(), null];

      if (!Ember.isEmpty(filterEndDate)) {
        filterEndDate = moment(filterEndDate).endOf('day').toDate();
        findParams.options.endkey =  [filterEndDate.getTime(), maxValue];
      }
      return this.store.query('incident', findParams).then(resolve, reject);
    }.bind(this));
  },

  _generateByDepartmentOrByIncidentTypeReport(incidents, reportType) {
    let reportColumns, reportProperty;
    if (reportType === 'department') {
      reportColumns = this.get('departmentReportColumns');
      reportProperty = 'department';

    }    else {
      reportColumns = this.get('incidentTypeReportColumns');
      reportProperty = 'categoryName';
    }
    this._addRowsByType(incidents, reportProperty, 'Total incidents: ', reportColumns);
    this._finishReport(reportColumns);
  },

  /**
   * Given a list of records, organize and total by them by type and then add them to the report.
   * @param records {Array} list of records to total.
   * @param typeField {String} the field in the records containing the type.
   * @param totalLabel {String} the label for the grand total.
   * @param reportColumns
   */
  _addRowsByType(records, typeField, totalLabel, reportColumns) {
    let types = this._totalByType(records, typeField, totalLabel);
    types.forEach(function(type) {
      this._addReportRow(type, true, reportColumns);
    }.bind(this));
  },

  /**
   * Given a list of records, total them by type and also add a grand total.
   * @param records {Array} list of records to total.
   * @param typeField {String} the field in the records containing the type.
   * @param totalLabel {String} the label for the grand total.
   * @param reportColumns
   */
  _totalByType(records, typeField, totalLabel) {
    let total = 0;
    let types = [];
    records.forEach(function(record) {
      let type = record.get(typeField);
      let typeObject;
      if (!Ember.isEmpty(type)) {
        typeObject = types.findBy('type', type);
        if (Ember.isEmpty(typeObject)) {
          typeObject = {
            type,
            total: 0,
            records: []
          };
          types.push(typeObject);
        }
        typeObject.total++;
        typeObject.records.push(record);
        total++;
      }
    });
    types = types.sortBy('type');
    types.push({ type: totalLabel, total });
    return types;
  },

  actions: {
    generateReport() {
      let reportRows = this.get('reportRows');
      let reportType = this.get('reportType');
      reportRows.clear();
      this.showProgressModal();
      switch (reportType) {
        case 'department':
        case 'incidentType': {
          this._findIncidentsByDate().then((incidents) => {
            this._generateByDepartmentOrByIncidentTypeReport(incidents, reportType);
          }).catch((ex) => {
            console.log('Error:', ex);
            this.closeProgressModal();
          });
          break;
        }
      }
    }
  }
});
