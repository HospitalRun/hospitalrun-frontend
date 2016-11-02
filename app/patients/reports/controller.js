import Ember from 'ember';
import AbstractReportController from 'hospitalrun/controllers/abstract-report-controller';
import PatientDiagnosis from 'hospitalrun/mixins/patient-diagnosis';
import PatientVisits from 'hospitalrun/mixins/patient-visits';
import SelectValues from 'hospitalrun/utils/select-values';
import VisitTypes from 'hospitalrun/mixins/visit-types';

export default AbstractReportController.extend(PatientDiagnosis, PatientVisits, VisitTypes, {
  patientsController: Ember.inject.controller('patients'),

  clinicList: Ember.computed.map('patientsController.clinicList.value', SelectValues.selectValuesMap),
  diagnosisList: Ember.computed.alias('patientsController.diagnosisList'),
  physicianList: Ember.computed.map('patientsController.physicianList.value', SelectValues.selectValuesMap),
  locationList: Ember.computed.map('patientsController.locationList.value', SelectValues.selectValuesMap),
  statusList: Ember.computed.map('patientsController.statusList.value', SelectValues.selectValuesMap),
  visitTypesList: Ember.computed.alias('patientsController.visitTypesList'),
  reportType: 'detailedAdmissions',
  patientDetails: {},

  admissionReportColumns: Ember.computed(function() {
    let i18n = this.get('i18n');
    return {
      sex: {
        label: i18n.t('labels.sex'),
        include: true,
        property: 'sex'
      },
      total: {
        label: i18n.t('labels.total'),
        include: true,
        property: 'total',
        format: '_numberFormat'
      }
    };
  }),
  admissionDetailReportColumns: Ember.computed(function() {
    let i18n = this.get('i18n');
    return {
      id: {
        label: i18n.t('labels.id'),
        include: true,
        property: 'patientId'
      },
      name: {
        label: i18n.t('labels.name'),
        include: true,
        property: 'patientName'
      },
      admissionDate: {
        label: i18n.t('patients.labels.admissionDate'),
        include: true,
        property: 'admissionDate',
        format: '_dateTimeFormat'
      },
      dischargeDate: {
        label: i18n.t('patients.labels.dischargeDate'),
        include: false,
        property: 'dischargeDate',
        format: '_dateTimeFormat'
      },
      patientDays: {
        label: i18n.t('patients.labels.patientDays'),
        include: false,
        property: 'patientDays',
        format: '_numberFormat'
      }
    };
  }),
  diagnosticReportColumns: Ember.computed(function() {
    let i18n = this.get('i18n');
    return {
      type: {
        label: i18n.t('labels.type'),
        include: true,
        property: 'type'
      },
      total: {
        label: i18n.t('labels.total'),
        include: true,
        property: 'total',
        format: '_numberFormat'
      }
    };
  }),
  procedureDetailReportColumns: Ember.computed(function() {
    let i18n = this.get('i18n');
    return {
      id: {
        label: i18n.t('labels.id'),
        include: true,
        property: 'patient.displayPatientId'
      },
      name: {
        label: i18n.t('labels.name'),
        include: true,
        property: 'patient.displayName'
      },
      procedure: {
        label: i18n.t('visits.labels.procedure'),
        include: true,
        property: 'procedure'
      },
      procedureDate: {
        label: i18n.t('visits.labels.procedureDate'),
        include: true,
        property: 'procedureDate',
        format: '_dateTimeFormat'
      }
    };
  }),
  reportColumns: Ember.computed(function() {
    let i18n = this.get('i18n');
    return {
      visitDate: {
        label: i18n.t('visits.labels.visitDate'),
        include: true,
        property: 'visitDate'
      },
      visitType: {
        label: i18n.t('visits.labels.visitType'),
        include: true,
        property: 'visitType'
      },
      visitLocation: {
        label: i18n.t('labels.location'),
        include: false,
        property: 'location'
      },
      examiner: {
        label: i18n.t('visits.labels.examiner'),
        include: true,
        property: 'examiner'
      },
      name: {
        label: i18n.t('labels.name'),
        include: true,
        property: 'patient.displayName'
      },
      id: {
        label: i18n.t('labels.id'),
        include: true,
        property: 'patient.displayPatientId'
      },
      sex: {
        label: i18n.t('patients.labels.sex'),
        include: true,
        property: 'patient.sex'
      },
      dateOfBirth: {
        label: i18n.t('patients.labels.dateOfBirth'),
        include: true,
        property: 'patient.dateOfBirth',
        format: '_dateFormat'
      },
      age: {
        label: i18n.t('labels.age'),
        include: false,
        property: 'patient.age'
      },
      primaryDiagnosis: {
        label: i18n.t('patients.labels.primaryDiagnosis'),
        include: false,
        property: 'primaryDiagnosis'
      },
      secondaryDiagnoses: {
        label: i18n.t('patients.labels.secondaryDiagnosis'),
        include: false,
        property: 'additionalDiagnoses',
        format: '_diagnosisListToString'
      },
      procedures: {
        label: i18n.t('labels.procedures'),
        include: false,
        property: 'resolvedProcedures',
        format: '_procedureListToString'
      },
      contacts: {
        label: i18n.t('patients.labels.contacts'),
        include: false,
        property: 'patient',
        format: '_contactListToString'
      },
      referredBy: {
        label: i18n.t('patients.labels.referredBy'),
        include: false,
        property: 'patient.referredBy'
      },
      referredDate: {
        label: i18n.t('patients.labels.referredDate'),
        include: false,
        property: 'patient.referredDate',
        format: '_dateFormat'
      }
    };
  }),
  statusReportColumns: Ember.computed(function() {
    let i18n = this.get('i18n');
    return {
      id: {
        label: i18n.t('labels.id'),
        include: true,
        property: 'patient.displayPatientId'
      },
      name: {
        label: i18n.t('labels.name'),
        include: true,
        property: 'patient.displayName'
      },
      status: {
        label: i18n.t('labels.status'),
        include: true,
        property: 'patient.status'
      },
      primaryDiagnosis: {
        label: i18n.t('patients.labels.primaryDiagnosis'),
        include: true,
        property: 'patient.visits',
        format: '_formatPrimaryDiagnosis'
      },
      secondaryDiagnoses: {
        label: i18n.t('patients.labels.secondaryDiagnosis'),
        include: true,
        property: 'patient.visits',
        format: '_formatSecondaryDiagnosis'
      }
    };
  }),
  reportTypes: Ember.computed(function() {
    let i18n = this.get('i18n');
    return [{
      name: i18n.t('patients.titles.admissionsDetail'),
      value: 'detailedAdmissions'
    }, {
      name: i18n.t('patients.titles.admissionsSummary'),
      value: 'admissions'
    }, {
      name: i18n.t('patients.titles.diagnosticTesting'),
      value: 'diagnostic'
    }, {
      name: i18n.t('patients.titles.dischargesDetail'),
      value: 'detailedDischarges'
    }, {
      name: i18n.t('patients.titles.dischargesSummary'),
      value: 'discharges'
    }, {
      name: i18n.t('patients.titles.proceduresDetail'),
      value: 'detailedProcedures'
    }, {
      name: i18n.t('patients.titles.proceduresSummary'),
      value: 'procedures'
    }, {
      name: i18n.t('patients.titles.patientStatus'),
      value: 'status'
    }, {
      name: i18n.t('patients.titles.totalPatientDays'),
      value: 'patientDays'
    }, {
      name: i18n.t('patients.titles.totalPatientDaysDetailed'),
      value: 'detailedPatientDays'
    }, {
      name: i18n.t('patients.titles.visit'),
      value: 'visit'
    }];
  }),

  isDischargeReport: function() {
    let reportType = this.get('reportType');
    return (reportType.toLowerCase().indexOf('discharges') > -1);
  }.property('reportType'),

  isStatusReport: function() {
    let reportType = this.get('reportType');
    return reportType === 'status';
  }.property('reportType'),

  isVisitReport: function() {
    let reportType = this.get('reportType');
    return (reportType === 'visit');
  }.property('reportType'),

  _addContactToList: function(phone, email, prefix, contactList) {
    let contactArray = [];
    if (!Ember.isEmpty(email) || !Ember.isEmpty(phone)) {
      if (!Ember.isEmpty(phone)) {
        contactArray.push(phone);
      }
      if (!Ember.isEmpty(email)) {
        contactArray.push(email);
      }
      contactList.push(prefix + contactArray.join(', '));
    }
  },

  _addReportRow: function(row, skipFormatting, reportColumns, rowAction) {
    if (Ember.isEmpty(rowAction) && !Ember.isEmpty(row.patient)) {
      let patientId = null;
      if (row.get) {
        patientId = row.get('patient.id');
      } else {
        patientId = row.patient.get('id');
      }
      if (!Ember.isEmpty(patientId)) {
        rowAction = {
          action: 'viewPatient',
          model: patientId
        };
      }
    }
    this._super(row, skipFormatting, reportColumns, rowAction);
  },

  /**
   * Given a list of records, organize and total by them by type and then add them to the report.
   * @param records {Array} list of records to total.
   * @param typeField {String} the field in the records containing the type.
   * @param totalLabel {String} the label for the grand total.
   * @param reportColumns
   */
  _addRowsByType: function(records, typeField, totalLabel, reportColumns) {
    let types = this._totalByType(records, typeField, totalLabel);
    types.forEach(function(type) {
      this._addReportRow(type, true, reportColumns);
    }.bind(this));
  },

  _addPatientProcedureRows: function(procedureTotals, reportColumns) {
    procedureTotals.forEach(function(procedureTotal) {
      if (!Ember.isEmpty(procedureTotal.records)) {
        procedureTotal.records.forEach(function(patientProcedure, index) {
          this._addReportRow({
            patient: patientProcedure.get('patient'),
            procedure: patientProcedure.get('description'),
            procedureDate: patientProcedure.get('procedureDate')
          }, false, reportColumns);
          if (index + 1 === procedureTotal.records.length) {
            this._addReportRow({
              procedure: `Total for ${procedureTotal.type}: ${procedureTotal.total}`
            }, true, reportColumns);
          }
        }.bind(this));
      } else {
        this._addReportRow({
          procedure: `Total for ${procedureTotal.type}: ${procedureTotal.total}`
        }, true, reportColumns);
      }
    }.bind(this));
  },

  _contactListToString: function(patient) {
    let additionalContacts = patient.get('additionalContacts');
    let contactDesc;
    let contactList = [];
    let email = patient.get('email');
    let phone = patient.get('phone');
    this._addContactToList(phone, email, 'Primary: ', contactList);
    if (!Ember.isEmpty(additionalContacts)) {
      additionalContacts.forEach(function(contact) {
        contactDesc = '';
        if (!Ember.isEmpty(contact.name) && !Ember.isEmpty(contact.relationship)) {
          if (!Ember.isEmpty(contact.name)) {
            contactDesc += contact.name;
          }
          if (!Ember.isEmpty(contact.relationship)) {
            if (!Ember.isEmpty(contactDesc)) {
              contactDesc += ' - ';
            }
            contactDesc += contact.relationship;
          }
          contactDesc += ': ';
        }
        this._addContactToList(contact.phone, contact.email, contactDesc, contactList);
      }.bind(this));
    }
    return contactList.join(';\n');
  },

  _dateTimeFormat: function(value) {
    return this._dateFormat(value, 'l h:mm A');
  },

  _diagnosisListToString: function(diagnoses) {
    return this._listToString(diagnoses, 'description', 'date');
  },
  /**
     * Find diagnostics by the specified dates and the record's start and (optional) end dates.
     */
  _findDiagnosticsByDate: function() {
    let filterEndDate = this.get('endDate');
    let filterStartDate = this.get('startDate');
    let findParams = {
      options: {},
      mapReduce: 'imaging_by_status'
    };
    let maxValue = this.get('maxValue');
    return new Ember.RSVP.Promise(function(resolve, reject) {
      findParams.options.startkey = ['Completed', null, filterStartDate.getTime(), null];

      if (!Ember.isEmpty(filterEndDate)) {
        filterEndDate = moment(filterEndDate).endOf('day').toDate();
        findParams.options.endkey = ['Completed', maxValue, filterEndDate.getTime(), maxValue];
      }
      this.store.query('imaging', findParams).then(function(imagingRecords) {
        let returnRecords = {
          imaging: imagingRecords
        };
        findParams.mapReduce = 'lab_by_status';
        this.store.query('lab', findParams).then(function(labRecords) {
          returnRecords.labs = labRecords;
          resolve(returnRecords);
        }, reject);
      }.bind(this), reject);

    }.bind(this));
  },

  /**
   * Find procedures by the specified dates and the record's start and (optional) end dates.
   */
  _findPatientsByStatus: function() {
    let status = this.get('status');
    let findParams = {
      options: {
        key: status
      },
      mapReduce: 'patient_by_status'
    };
    return new Ember.RSVP.Promise(function(resolve, reject) {
      this.store.query('patient', findParams).then(resolve, reject);
    }.bind(this));
  },

  /**
   * Find procedures by the specified dates and the record's start and (optional) end dates.
   */
  _findProceduresByDate: function() {
    let filterEndDate = this.get('endDate');
    let filterStartDate = this.get('startDate');
    let findParams = {
      options: {},
      mapReduce: 'procedure_by_date'
    };
    let maxValue = this.get('maxValue');
    return new Ember.RSVP.Promise(function(resolve, reject) {
      findParams.options.startkey = [filterStartDate.getTime(), null];

      if (!Ember.isEmpty(filterEndDate)) {
        filterEndDate = moment(filterEndDate).endOf('day').toDate();
        findParams.options.endkey = [filterEndDate.getTime(), maxValue];
      }
      this.store.query('procedure', findParams).then(resolve, reject);
    }.bind(this));
  },

  /**
   * Find visits by the specified dates and the record's start and (optional) end dates.
   * @param {String} reportType the type of report to find visits for.
   */
  _findVisitsByDate: function() {
    let filterEndDate = this.get('endDate');
    let filterStartDate = this.get('startDate');
    let findParams = {
      options: {},
      mapReduce: 'visit_by_date'
    };
    let isDischargeReport = this.get('isDischargeReport');
    let maxValue = this.get('maxValue');
    if (isDischargeReport) {
      findParams.mapReduce = 'visit_by_discharge_date';
    }

    /**
     * Admissions - start date between start and end date
     * Discharge end date between start and end date
     */
    return new Ember.RSVP.Promise(function(resolve, reject) {
      let isDischargeReport = this.get('isDischargeReport');
      findParams.options.startkey = [filterStartDate.getTime(), null];
      if (!Ember.isEmpty(filterEndDate)) {
        filterEndDate = moment(filterEndDate).endOf('day').toDate();
        if (isDischargeReport) {
          findParams.options.endkey = [filterEndDate.getTime(), maxValue];
        } else {
          findParams.options.endkey = [filterEndDate.getTime(), maxValue, maxValue];
        }
      }
      this.store.query('visit', findParams).then(resolve, reject);

    }.bind(this));
  },

  _filterByLike: function(records, field, likeCondition) {
    return records.filter(function(record) {
      let fieldValue = record.get('field');
      if (Ember.isEmpty(fieldValue)) {
        return false;
      } else {
        if (Ember.isArray(fieldValue)) {
          let foundValue = fieldValue.find(function(value) {
            return this._haveLikeValue(value, likeCondition);
          }.bind(this));
          return !Ember.isEmpty(foundValue);
        } else {
          return this._haveLikeValue(fieldValue, likeCondition);
        }
      }
    });
  },

  _filterInPatientVisit: function(visit) {
    let outPatient = visit.get('outPatient');
    let status = visit.get('status');
    return !outPatient && !Ember.isEmpty(status);
  },

  _finishVisitReport: function(visits) {
    let visitTypes = this._totalByType(visits, 'visitType', 'total');
    visitTypes.forEach(function(visitType) {
      if (visitType.type === 'total') {
        this._addReportRow({
          visitDate: `Total visits: ${visitType.total}`
        });
      } else {
        visitType.records.forEach(function(visit) {
          this._addReportRow(visit);
        }.bind(this));
        this._addReportRow({
          visitDate: `Total for ${visitType.type}: ${visitType.total}`
        });
      }
    }.bind(this));
    this._finishReport();
  },
  _formatPrimaryDiagnosis: function(visits) {
    let primaryDiagnoses = this.getPrimaryDiagnoses(visits);
    return this._diagnosisListToString(primaryDiagnoses);
  },

  _formatSecondaryDiagnosis: function(visits) {
    let secondaryDiagnoses = this.getSecondaryDiagnoses(visits);
    return this._diagnosisListToString(secondaryDiagnoses);
  },

  _generateAdmissionOrDischargeReport: function(visits, reportType) {
    let detailedReport = false;
    let reportColumns;
    let patientBySex = {};
    let sexNotEnteredLabel = this.get('i18n').t('patients.labels.sexNotEntered');

    if (reportType.indexOf('detailed') > -1) {
      detailedReport = true;
      reportColumns = this.get('admissionDetailReportColumns');
      reportColumns.patientDays.include = false;
      if (reportType === 'detailedDischarges') {
        reportColumns.dischargeDate.include = true;
      } else {
        reportColumns.dischargeDate.include = false;
      }
    } else {
      reportColumns = this.get('admissionReportColumns');
    }
    visits = visits.filter(this._filterInPatientVisit);
    visits.forEach(function(visit) {
      if (!this.get('isDischargeReport') || !Ember.isEmpty(visit.get('endDate'))) {
        let reportRow = {
          patient: visit.get('patient'),
          patientId: visit.get('patient.displayPatientId'),
          patientName: visit.get('patient.displayName'),
          admissionDate: visit.get('startDate'),
          dischargeDate: visit.get('endDate')
        };
        let sex = visit.get('patient.sex');
        if (!sex) {
          sex = sexNotEnteredLabel;
        }
        let sexGrouping = patientBySex[sex];
        if (!sexGrouping) {
          sexGrouping = {
            count: 0,
            rows: []
          };
          patientBySex[sex] = sexGrouping;
        }
        sexGrouping.count++;
        sexGrouping.rows.push(reportRow);
      }
    }.bind(this));
    let sexTotal = 0;
    let addPatientBySexRows = (reportRow) =>  {
      this._addReportRow(reportRow, false, reportColumns);
    };
    for (let sex in patientBySex) {
      if (detailedReport) {
        patientBySex[sex].rows.forEach(addPatientBySexRows);
        this._addReportRow({ patientId: `${sex} Total: ${patientBySex[sex].count}` }, true, reportColumns);
      } else {
        this._addReportRow({ sex: sex, total: patientBySex[sex].count }, true, reportColumns);
      }
      sexTotal += patientBySex[sex].count;
    }
    this._addReportRow({ patientId: `Grand Total: ${sexTotal}` }, true, reportColumns);
    this._finishReport(reportColumns);
  },

  _generateDiagnosticReport: function() {
    this._findDiagnosticsByDate().then(function(diagnostics) {
      let reportColumns = this.get('diagnosticReportColumns');
      this._addRowsByType(diagnostics.imaging, 'imagingType.name', 'Total for imaging: ', reportColumns);
      this._addRowsByType(diagnostics.labs, 'labType.name', 'Total for labs: ', reportColumns);
      this._finishReport(reportColumns);
    }.bind(this), function(err) {
      this._notifyReportError(`Error in _generateDiagnosticReport: ${err}`);
    }.bind(this));
  },

  _generatePatientDaysReport: function(visits, reportType) {
    visits = visits.filter(this._filterInPatientVisit);
    let detailed = (reportType.indexOf('detailed') === 0);
    let reportEndDate = this.get('endDate');
    let reportColumns;
    let reportStartDate = moment(this.get('startDate')).startOf('day');
    if (detailed) {
      reportColumns = this.get('admissionDetailReportColumns');
      reportColumns.patientDays.include = true;
      reportColumns.dischargeDate.include = true;
    } else {
      reportColumns = {
        total: {
          label: 'Total',
          include: true,
          property: 'total',
          format: '_numberFormat'
        }
      };
    }
    if (Ember.isEmpty(reportEndDate)) {
      reportEndDate = moment().endOf('day');
    } else {
      reportEndDate = moment(reportEndDate).endOf('day');
    }
    let patientDays = visits.reduce(function(previousValue, visit) {
      let calcEndDate = visit.get('endDate');
      let calcStartDate = moment(visit.get('startDate')).startOf('day');
      if (Ember.isEmpty(calcEndDate)) {
        calcEndDate = moment().endOf('day');
      } else {
        calcEndDate = moment(calcEndDate).endOf('day');
      }
      if (calcStartDate.isBefore(reportStartDate)) {
        calcStartDate = reportStartDate;
      }
      if (calcEndDate.isAfter(reportEndDate)) {
        calcEndDate = reportEndDate;
      }
      let daysDiff = calcEndDate.diff(calcStartDate, 'days', true);
      if (detailed) {
        this._addReportRow({
          patient: visit.get('patient'),
          patientId: visit.get('patient.displayPatientId'),
          patientName: visit.get('patient.displayName'),
          admissionDate: visit.get('startDate'),
          dischargeDate: visit.get('endDate'),
          patientDays: daysDiff
        }, false, reportColumns);
      }
      return previousValue += daysDiff;
    }.bind(this), 0);
    if (detailed) {
      this._addReportRow({ patientDays: `Total: ${this._numberFormat(patientDays)}` }, true, reportColumns);

    } else {
      this._addReportRow({ total: patientDays }, false, reportColumns);
    }
    this._finishReport(reportColumns);
  },

  _generateProcedureReport: function(reportType) {
    this._findProceduresByDate().then(function(procedures) {
      let reportColumns;
      procedures = procedures.filter(function(procedure) {
        let visit = procedure.get('visit');
        if (Ember.isEmpty(visit) || Ember.isEmpty(visit.get('patient.id')) || visit.get('patient.archived') === true) {
          return false;
        } else {
          return true;
        }
      });
      if (reportType.indexOf('detailed') === 0) {
        reportColumns = this.get('procedureDetailReportColumns');
        procedures.forEach(function(procedure) {
          procedure.set('patient', procedure.get('visit.patient'));
        });
        let procedureTotals = this._totalByType(procedures, 'description', 'all procedures');
        this._addPatientProcedureRows(procedureTotals, reportColumns);
        this._finishReport(reportColumns);
      } else {
        reportColumns = this.get('diagnosticReportColumns');
        this._addRowsByType(procedures, 'description', 'Total procedures: ', reportColumns);
        this._finishReport(reportColumns);
      }
    }.bind(this), function(err) {
      this._notifyReportError(`Error in _generateProcedureReport: ${err}`);
    }.bind(this));
  },

  _generateStatusReport: function() {
    this._findPatientsByStatus().then(function(patients) {
      let reportColumns = this.get('statusReportColumns');
      let sortedPatients = patients.sortBy('lastName', 'firstName');
      this._getPatientVisits(sortedPatients).then(function(resolvedPatients) {
        resolvedPatients.forEach(function(patient) {
          this._addReportRow({ patient: patient }, false, reportColumns);
        }.bind(this));
        this._finishReport(reportColumns);
      }.bind(this)).catch(function(err) {
        this._notifyReportError(`Error in _generateStatusReport: ${err}`);
      }.bind(this));
    }.bind(this)).catch(function(err) {
      this._notifyReportError(`Error in _generateStatusReport: ${err}`);
    }.bind(this));
  },

  _generateVisitReport: function(visits) {
    let reportColumns = this.get('reportColumns');
    let visitFilters = this.getProperties(
      'examiner', 'visitDate', 'visitType', 'location', 'clinic',
      'primaryDiagnosis', 'secondaryDiagnosis'
    );
    for (let filter in visitFilters) {
      if (!Ember.isEmpty(visitFilters[filter])) {
        switch (filter) {
          case 'diagnosis': {
            visits = this._filterByLike(visits, 'diagnosisList', visitFilters[filter]);
            break;
          }
          default: {
            visits = visits.filterBy(filter, visitFilters[filter]);
            break;
          }
        }
      }
    }
    if (reportColumns.procedures.include) {
      let promisesMap = {};
      visits.forEach(function(visit) {
        promisesMap[visit.get('id')] = visit.get('procedures');
      });
      Ember.RSVP.hash(promisesMap).then(function(resolutionHash) {
        visits.forEach(function(visit) {
          visit.set('resolvedProcedures', resolutionHash[visit.get('id')]);
        });
        this._finishVisitReport(visits);
      }.bind(this));
    } else {
      this._finishVisitReport(visits);
    }
  },

  _getPatientVisits: function(patients) {
    return new Ember.RSVP.Promise(function(resolve, reject) {
      let visitHash = {
      };
      patients.forEach(function(patient) {
        visitHash[patient.get('id')] = this.getPatientVisits(patient);
      }.bind(this));
      Ember.RSVP.hash(visitHash).then(function(resolvedHash) {
        patients.forEach(function(patient) {
          patient.set('visits', resolvedHash[patient.get('id')]);
        });
        resolve(patients);
      }, reject);
    }.bind(this));
  },

  _haveLikeValue: function(valueToCompare, likeCondition) {
    return (valueToCompare.toLowerCase().indexOf(likeCondition.toLowerCase()) > -1);
  },

  _listToString: function(items, descField, dateField) {
    let itemList = [];
    if (!Ember.isEmpty(items)) {
      itemList = items.map(function(item) {
        return `${Ember.get(item, descField)} ( ${this._dateFormat(Ember.get(item, dateField))})`;
      }.bind(this));
    }
    return itemList.join(',\n');
  },

  /**
   * Given a list of records, total them by type and also add a grand total.
   * @param records {Array} list of records to total.
   * @param typeField {String} the field in the records containing the type.
   * @param totalLabel {String} the label for the grand total.
   * @param reportColumns
   */
  _totalByType: function(records, typeField, totalLabel) {
    let total = 0;
    let types = [];
    records.forEach(function(record) {
      let type = record.get(typeField);
      let typeObject;
      if (!Ember.isEmpty(type)) {
        typeObject = types.find(function(item) {
          let itemType = item.type;
          return itemType.trim().toLowerCase() === type.toLowerCase();
        });
        if (Ember.isEmpty(typeObject)) {
          typeObject = {
            type: type.trim(),
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
    types.push({ type: totalLabel, total: total });
    return types;
  },

  _procedureListToString: function(procedures) {
    return this._listToString(procedures, 'description', 'procedureDate');
  },

  _validateDates: function() {
    let alertMessage;
    let endDate = this.get('endDate');
    let isValid = true;
    let reportType = this.get('reportType');
    let startDate = this.get('startDate');
    if (reportType === 'status') {
      return true;
    }
    if (Ember.isEmpty(startDate)) {
      alertMessage = 'Please enter a start date.';
      isValid = false;
    } else if (!Ember.isEmpty(endDate) && endDate.getTime() < startDate.getTime()) {
      alertMessage = 'Please enter an end date after the start date.';
      isValid = false;
    }
    if (!isValid) {
      this.displayAlert('Error Generating Report', alertMessage);
    }
    return isValid;
  },

  actions: {
    generateReport: function() {
      if (this._validateDates()) {
        let reportRows = this.get('reportRows');
        let reportType = this.get('reportType');
        reportRows.clear();
        this.showProgressModal();
        switch (reportType) {
          case 'diagnostic': {
            this._generateDiagnosticReport();
            break;
          }
          case 'detailedProcedures':
          case 'procedures': {
            this._generateProcedureReport(reportType);
            break;
          }
          case 'admissions':
          case 'discharges':
          case 'detailedAdmissions':
          case 'detailedDischarges':
          case 'detailedPatientDays':
          case 'patientDays':
          case 'visit': {
            this._findVisitsByDate().then(function(visits) {
              switch (reportType) {
                case 'admissions':
                case 'detailedAdmissions':
                case 'detailedDischarges':
                case 'discharges': {
                  this._generateAdmissionOrDischargeReport(visits, reportType);
                  break;
                }
                case 'detailedPatientDays':
                case 'patientDays': {
                  this._generatePatientDaysReport(visits, reportType);
                  break;
                }
                case 'visit': {
                  this._generateVisitReport(visits);
                  break;
                }
              }
            }.bind(this), function(err) {
              this._notifyReportError(`Error in _findVisitsByDate: ${err}`);
            }.bind(this));
            break;
          }
          case 'status': {
            this._generateStatusReport();
            break;
          }
        }
      }
    },
    viewPatient: function(id) {
      this.store.find('patient', id).then(function(item) {
        item.set('returnTo', 'patients.reports');
        this.transitionToRoute('patients.edit', item);
      }.bind(this));
    }

  }
});
