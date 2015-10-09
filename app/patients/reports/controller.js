import AbstractReportController from 'hospitalrun/controllers/abstract-report-controller';
import Ember from 'ember';
import PatientDiagnosis from 'hospitalrun/mixins/patient-diagnosis';
import PatientVisits from 'hospitalrun/mixins/patient-visits';
import SelectValues from 'hospitalrun/utils/select-values';
import VisitTypes from 'hospitalrun/mixins/visit-types';
export default AbstractReportController.extend(PatientDiagnosis, PatientVisits, VisitTypes, {
  needs: ['patients'],

  clinicList: Ember.computed.map('controllers.patients.clinicList.value', SelectValues.selectValuesMap),
  diagnosisList: Ember.computed.alias('controllers.patients.diagnosisList'),
  physicianList: Ember.computed.map('controllers.patients.physicianList.value', SelectValues.selectValuesMap),
  locationList: Ember.computed.map('controllers.patients.locationList.value', SelectValues.selectValuesMap),
  statusList: Ember.computed.map('controllers.patients.statusList.value', SelectValues.selectValuesMap),
  visitTypesList: Ember.computed.alias('controllers.patients.visitTypeList'),
  patientDetails: {},

  admissionReportColumns: {
    gender: {
      label: 'Gender',
      include: true,
      property: 'gender'
    },
    total: {
      label: 'Total',
      include: true,
      property: 'total',
      format: '_numberFormat'
    }
  },
  admissionDetailReportColumns: {
    id: {
      label: 'Id',
      include: true,
      property: 'patientId'
    },
    name: {
      label: 'Name',
      include: true,
      property: 'patientName'
    },
    admissionDate: {
      label: 'Admission Date',
      include: true,
      property: 'admissionDate',
      format: '_dateTimeFormat'
    },
    dischargeDate: {
      label: 'Discharge Date',
      include: false,
      property: 'dischargeDate',
      format: '_dateTimeFormat'
    },
    patientDays: {
      label: 'Patient Days',
      include: false,
      property: 'patientDays',
      format: '_numberFormat'
    }
  },
  diagnosticReportColumns: {
    type: {
      label: 'Type',
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

  procedureDetailReportColumns: {
    id: {
      label: 'Id',
      include: true,
      property: 'patient.displayPatientId'
    },
    name: {
      label: 'Name',
      include: true,
      property: 'patient.displayName'
    },
    procedure: {
      label: 'Procedure',
      include: true,
      property: 'procedure'
    },
    procedureDate: {
      label: 'Procedure Date',
      include: true,
      property: 'procedureDate',
      format: '_dateTimeFormat'
    }
  },
  reportColumns: {
    visitDate: {
      label: 'Visit Date',
      include: true,
      property: 'visitDate'
    },
    visitType: {
      label: 'Visit Type',
      include: true,
      property: 'visitType'
    },
    visitLocation: {
      label: 'Location',
      include: false,
      property: 'location'
    },
    examiner: {
      label: 'Examiner',
      include: true,
      property: 'examiner'
    },
    name: {
      label: 'Name',
      include: true,
      property: 'patient.displayName'
    },
    id: {
      label: 'Id',
      include: true,
      property: 'patient.displayPatientId'
    },
    gender: {
      label: 'Gender',
      include: true,
      property: 'patient.gender'
    },
    dateOfBirth: {
      label: 'Date Of Birth',
      include: true,
      property: 'patient.dateOfBirth',
      format: '_dateFormat'
    },
    age: {
      label: 'Age',
      include: false,
      property: 'patient.age'
    },
    primaryDiagnosis: {
      label: 'Primary Diagnosis',
      include: false,
      property: 'primaryDiagnosis'
    },
    secondaryDiagnoses: {
      label: 'Secondary Diagnoses',
      include: false,
      property: 'additionalDiagnoses',
      format: '_diagnosisListToString'
    },
    procedures: {
      label: 'Procedures',
      include: false,
      property: 'resolvedProcedures',
      format: '_procedureListToString'
    },
    contacts: {
      label: 'Contacts',
      include: false,
      property: 'patient',
      format: '_contactListToString'
    },
    referredBy: {
      label: 'Referred By',
      include: false,
      property: 'patient.referredBy'
    },
    referredDate: {
      label: 'Referred Date',
      include: false,
      property: 'patient.referredDate',
      format: '_dateFormat'
    }
  },
  statusReportColumns: {
    id: {
      label: 'Id',
      include: true,
      property: 'patient.displayPatientId'
    },
    name: {
      label: 'Name',
      include: true,
      property: 'patient.displayName'
    },
    status: {
      label: 'Status',
      include: true,
      property: 'patient.status'
    },
    primaryDiagnosis: {
      label: 'Primary Diagnoses',
      include: true,
      property: 'patient.visits',
      format: '_formatPrimaryDiagnosis'
    },
    secondaryDiagnoses: {
      label: 'Secondary Diagnoses',
      include: true,
      property: 'patient.visits',
      format: '_formatSecondaryDiagnosis'
    }
  },
  reportTypes: [{
    name: 'Admissions Detail',
    value: 'detailedAdmissions'
  }, {
    name: 'Admissions Summary',
    value: 'admissions'
  }, {
    name: 'Diagnostic Testing',
    value: 'diagnostic'
  }, {
    name: 'Discharges Detail',
    value: 'detailedDischarges'
  }, {
    name: 'Discharges Summary',
    value: 'discharges'
  }, {
    name: 'Procedures Detail',
    value: 'detailedProcedures'
  }, {
    name: 'Procedures Summary',
    value: 'procedures'
  }, {
    name: 'Patient Status',
    value: 'status'
  }, {
    name: 'Total Patient Days',
    value: 'patientDays'
  }, {
    name: 'Total Patient Days (Detailed)',
    value: 'detailedPatientDays'
  }, {
    name: 'Visit',
    value: 'visit'
  }],

  isDischargeReport: function () {
    var reportType = this.get('reportType');
    return (reportType.toLowerCase().indexOf('discharges') > -1);
  }.property('reportType'),

  isStatusReport: function () {
    var reportType = this.get('reportType');
    return reportType === 'status';
  }.property('reportType'),

  isVisitReport: function () {
    var reportType = this.get('reportType');
    return (reportType === 'visit');
  }.property('reportType'),

  _addContactToList: function (phone, email, prefix, contactList) {
    var contactArray = [];
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

  _addReportRow: function (row, skipFormatting, reportColumns, rowAction) {
    if (Ember.isEmpty(rowAction) && !Ember.isEmpty(row.patient)) {
      var patientId = null;
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
  _addRowsByType: function (records, typeField, totalLabel, reportColumns) {
    var types = this._totalByType(records, typeField, totalLabel);
    types.forEach(function (type) {
      this._addReportRow(type, true, reportColumns);
    }.bind(this));
  },

  _addPatientProcedureRows: function (procedureTotals, reportColumns) {
    procedureTotals.forEach(function (procedureTotal) {
      if (!Ember.isEmpty(procedureTotal.records)) {
        procedureTotal.records.forEach(function (patientProcedure, index) {
          this._addReportRow({
            patient: patientProcedure.get('patient'),
            procedure: patientProcedure.get('description'),
            procedureDate: patientProcedure.get('procedureDate'),
          }, false, reportColumns);
          if (index + 1 === procedureTotal.records.length) {
            this._addReportRow({
              procedure: 'Total for %@: %@'.fmt(procedureTotal.type, procedureTotal.total)
            }, true, reportColumns);
          }
        }.bind(this));
      } else {
        this._addReportRow({
          procedure: 'Total for %@: %@'.fmt(procedureTotal.type, procedureTotal.total)
        }, true, reportColumns);
      }
    }.bind(this));
  },

  _contactListToString: function (patient) {
    var additionalContacts = patient.get('additionalContacts'),
      contactArray = [],
      contactDesc,
      contactList = [],
      email = patient.get('email'),
      phone = patient.get('phone');
    this._addContactToList(phone, email, 'Primary: ', contactList);
    if (!Ember.isEmpty(additionalContacts)) {
      additionalContacts.forEach(function (contact) {
        contactArray = [];
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

  _dateTimeFormat: function (value) {
    return this._dateFormat(value, 'l h:mm A');
  },

  _diagnosisListToString: function (diagnoses) {
    return this._listToString(diagnoses, 'description', 'date');
  },
  /**
     * Find diagnostics by the specified dates and the record's start and (optional) end dates.
     */
  _findDiagnosticsByDate: function () {
    var filterEndDate = this.get('endDate'),
      filterStartDate = this.get('startDate'),
      findParams = {
        options: {},
        mapReduce: 'imaging_by_status'
      },
      maxValue = this.get('maxValue');
    return new Ember.RSVP.Promise(function (resolve, reject) {
      findParams.options.startkey = ['Completed', null, filterStartDate.getTime(), null];

      if (!Ember.isEmpty(filterEndDate)) {
        filterEndDate = moment(filterEndDate).endOf('day').toDate();
        findParams.options.endkey = ['Completed', maxValue, filterEndDate.getTime(), maxValue];
      }
      this.store.find('imaging', findParams).then(function (imagingRecords) {
        var returnRecords = {
          imaging: imagingRecords
        };
        findParams.mapReduce = 'lab_by_status';
        this.store.find('lab', findParams).then(function (labRecords) {
          returnRecords.labs = labRecords;
          resolve(returnRecords);
        }, reject);
      }.bind(this), reject);

    }.bind(this));
  },


  /**
   * Find procedures by the specified dates and the record's start and (optional) end dates.
   */
  _findPatientsByStatus: function () {
    var status = this.get('status'),
      findParams = {
        options: {
          key: status
        },
        mapReduce: 'patient_by_status'
      };
    return new Ember.RSVP.Promise(function (resolve, reject) {
      this.store.find('patient', findParams).then(resolve, reject);
    }.bind(this));
  },

  /**
   * Find procedures by the specified dates and the record's start and (optional) end dates.
   */
  _findProceduresByDate: function () {
    var filterEndDate = this.get('endDate'),
      filterStartDate = this.get('startDate'),
      findParams = {
        options: {},
        mapReduce: 'procedure_by_date'
      },
      maxValue = this.get('maxValue');
    return new Ember.RSVP.Promise(function (resolve, reject) {
      findParams.options.startkey = [filterStartDate.getTime(), null];

      if (!Ember.isEmpty(filterEndDate)) {
        filterEndDate = moment(filterEndDate).endOf('day').toDate();
        findParams.options.endkey = [filterEndDate.getTime(), maxValue];
      }
      this.store.find('procedure', findParams).then(resolve, reject);
    }.bind(this));
  },

  /**
   * Find visits by the specified dates and the record's start and (optional) end dates.
   * @param {String} reportType the type of report to find visits for.
   */
  _findVisitsByDate: function () {
    var filterEndDate = this.get('endDate'),
      filterStartDate = this.get('startDate'),
      findParams = {
        options: {},
        mapReduce: 'visit_by_date'
      },
      isDischargeReport = this.get('isDischargeReport'),
      maxValue = this.get('maxValue');
    if (isDischargeReport) {
      findParams.mapReduce = 'visit_by_discharge_date';
    }

    /**
     * Admissions - start date between start and end date
     * Discharge end date between start and end date
     */
    return new Ember.RSVP.Promise(function (resolve, reject) {
      var isDischargeReport = this.get('isDischargeReport');
      findParams.options.startkey = [filterStartDate.getTime(), null];
      if (!Ember.isEmpty(filterEndDate)) {
        filterEndDate = moment(filterEndDate).endOf('day').toDate();
        if (isDischargeReport) {
          findParams.options.endkey = [filterEndDate.getTime(), maxValue];
        } else {
          findParams.options.endkey = [filterEndDate.getTime(), maxValue, maxValue];
        }
      }
      this.store.find('visit', findParams).then(resolve, reject);

    }.bind(this));
  },

  _filterByLike: function (records, field, likeCondition) {
    return records.filter(function (record) {
      var fieldValue = record.get('field');
      if (Ember.isEmpty(fieldValue)) {
        return false;
      } else {
        if (Ember.isArray(fieldValue)) {
          var foundValue = fieldValue.find(function (value) {
            return this._haveLikeValue(value, likeCondition);
          }.bind(this));
          return !Ember.isEmpty(foundValue);
        } else {
          return this._haveLikeValue(fieldValue, likeCondition);
        }
      }
    });
  },

  _filterInPatientVisit: function (visit) {
    var outPatient = visit.get('outPatient'),
      status = visit.get('status');
    return !outPatient && !Ember.isEmpty(status);
  },

  _finishVisitReport: function (visits) {
    var visitTypes = this._totalByType(visits, 'visitType', 'total');
    visitTypes.forEach(function (visitType) {
      if (visitType.type === 'total') {
        this._addReportRow({
          visitDate: 'Total visits: ' + visitType.total
        });
      } else {
        visitType.records.forEach(function (visit) {
          this._addReportRow(visit);
        }.bind(this));
        this._addReportRow({
          visitDate: 'Total for %@: %@'.fmt(visitType.type, visitType.total)
        });
      }
    }.bind(this));
    this._finishReport();
  },
  _formatPrimaryDiagnosis: function (visits) {
    var primaryDiagnoses = this.getPrimaryDiagnoses(visits);
    return this._diagnosisListToString(primaryDiagnoses);
  },

  _formatSecondaryDiagnosis: function (visits) {
    var secondaryDiagnoses = this.getSecondaryDiagnoses(visits);
    return this._diagnosisListToString(secondaryDiagnoses);
  },

  _generateAdmissionOrDischargeReport: function (visits, reportType) {
    var detailedReport = false,
      femaleCount = 0,
      femaleRows = [],
      maleCount = 0,
      maleRows = [],
      reportColumns;
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
    visits.forEach(function (visit) {
      if (!this.get('isDischargeReport') || !Ember.isEmpty(visit.get('endDate'))) {
        var reportRow = {
          patient: visit.get('patient'),
          patientId: visit.get('patient.displayPatientId'),
          patientName: visit.get('patient.displayName'),
          admissionDate: visit.get('startDate'),
          dischargeDate: visit.get('endDate')
        };
        if (visit.get('patient.gender') === 'F') {
          femaleCount++;
          femaleRows.push(reportRow);
        } else {
          maleCount++;
          maleRows.push(reportRow);
        }
      }
    }.bind(this));
    if (detailedReport) {
      femaleRows.forEach(function (reportRow) {
        this._addReportRow(reportRow, false, reportColumns);
      }.bind(this));
      this._addReportRow({patientId: 'Female Total: ' + femaleCount}, true, reportColumns);
      maleRows.forEach(function (reportRow) {
        this._addReportRow(reportRow, false, reportColumns);
      }.bind(this));
      this._addReportRow({patientId: 'Male Total: ' + maleCount}, true, reportColumns);
      this._addReportRow({patientId: 'Grand Total: ' + (femaleCount + maleCount)}, true, reportColumns);
    } else {
      this._addReportRow({gender: 'Female',total: femaleCount}, true, reportColumns);
      this._addReportRow({gender: 'Male',total: maleCount}, true, reportColumns);
      this._addReportRow({gender: 'Total: ',total: femaleCount + maleCount}, true, reportColumns);
    }
    this._finishReport(reportColumns);
  },

  _generateDiagnosticReport: function () {
    this._findDiagnosticsByDate().then(function (diagnostics) {
      var reportColumns = this.get('diagnosticReportColumns');
      this._addRowsByType(diagnostics.imaging, 'imagingType.name', 'Total for imaging: ', reportColumns);
      this._addRowsByType(diagnostics.labs, 'labType.name', 'Total for labs: ', reportColumns);
      this._finishReport(reportColumns);
    }.bind(this), function (err) {
      this._notifyReportError('Error in _generateDiagnosticReport:' + err);
    }.bind(this));
  },

  _generatePatientDaysReport: function (visits, reportType) {
    visits = visits.filter(this._filterInPatientVisit);
    var detailed = (reportType.indexOf('detailed') === 0),
      reportEndDate = this.get('endDate'),
      reportColumns,
      reportStartDate = moment(this.get('startDate')).startOf('day');
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
    var patientDays = visits.reduce(function (previousValue, visit) {
      var calcEndDate = visit.get('endDate'),
        calcStartDate = moment(visit.get('startDate')).startOf('day');
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
      var daysDiff = calcEndDate.diff(calcStartDate, 'days', true);
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
      this._addReportRow({patientDays: 'Total: ' + this._numberFormat(patientDays)}, true, reportColumns);

    } else {
      this._addReportRow({total: patientDays}, false, reportColumns);
    }
    this._finishReport(reportColumns);
  },

  _generateProcedureReport: function (reportType) {
    this._findProceduresByDate().then(function (procedures) {
      var reportColumns;
      procedures = procedures.filter(function (procedure) {
        var visit = procedure.get('visit');
        if (Ember.isEmpty(visit) || Ember.isEmpty(visit.get('patient.id'))) {
          return false;
        } else {
          return true;
        }
      });
      if (reportType.indexOf('detailed') === 0) {
        reportColumns = this.get('procedureDetailReportColumns');
        var patientPromises = {};
        procedures.forEach(function (procedure) {
          var visit = procedure.get('visit');
          if (!Ember.isEmpty(visit)) {
            patientPromises[procedure.get('id')] = this._getPatientDetails(visit.get('patient.id'));
          }
        }.bind(this));

        Ember.RSVP.hash(patientPromises).then(function (resolutionHash) {
          procedures.forEach(function (procedure) {
            procedure.set('patient', resolutionHash[procedure.get('id')]);
          });
          var procedureTotals = this._totalByType(procedures, 'description', 'Total procedures');
          this._addPatientProcedureRows(procedureTotals, reportColumns);
          this._finishReport(reportColumns);
        }.bind(this), function (err) {
          this._notifyReportError('Error in  _generateProcedureReport:' + err);
        }.bind(this));
      } else {
        reportColumns = this.get('diagnosticReportColumns');
        this._addRowsByType(procedures, 'description', 'Total procedures: ', reportColumns);
        this._finishReport(reportColumns);
      }
    }.bind(this), function (err) {
      this._notifyReportError('Error in _generateProcedureReport:' + err);
    }.bind(this));
  },

  _generateStatusReport: function () {
    this._findPatientsByStatus().then(function (patients) {
      var reportColumns = this.get('statusReportColumns'),
        sortedPatients = patients.sortBy('lastName', 'firstName');
      this._getPatientVisits(sortedPatients).then(function (resolvedPatients) {
        resolvedPatients.forEach(function (patient) {
          this._addReportRow({patient: patient}, false, reportColumns);
        }.bind(this));
        this._finishReport(reportColumns);
      }.bind(this)).catch(function (err) {
        this._notifyReportError('Error in _generateStatusReport:' + err);
      }.bind(this));
    }.bind(this)).catch(function (err) {
      this._notifyReportError('Error in _generateStatusReport:' + err);
    }.bind(this));
  },

  _generateVisitReport: function (visits) {
    var reportColumns = this.get('reportColumns'),
      visitFilters = this.getProperties(
        'examiner', 'visitDate', 'visitType', 'location', 'clinic',
        'primaryDiagnosis', 'secondaryDiagnosis'
      );
    for (var filter in visitFilters) {
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
      var promisesMap = {};
      visits.forEach(function (visit) {
        promisesMap[visit.get('id')] = visit.get('procedures');
      });
      Ember.RSVP.hash(promisesMap).then(function (resolutionHash) {
        visits.forEach(function (visit) {
          visit.set('resolvedProcedures', resolutionHash[visit.get('id')]);
        });
        this._finishVisitReport(visits);
      }.bind(this));
    } else {
      this._finishVisitReport(visits);
    }
  },

  _getPatientDetails: function (patientId) {
    var patientDetails = this.get('patientDetails');
    if (!Ember.isEmpty(patientDetails[patientId])) {
      return Ember.RSVP.resolve(patientDetails[patientId]);
    } else {
      return this.store.find('patient', patientId);
    }
  },

  _getPatientVisits: function (patients) {
    return new Ember.RSVP.Promise(function (resolve, reject) {
      var visitHash = {
      };
      patients.forEach(function (patient) {
        visitHash[patient.get('id')] = this.getPatientVisits(patient);
      }.bind(this));
      Ember.RSVP.hash(visitHash).then(function (resolvedHash) {
        patients.forEach(function (patient) {
          patient.set('visits', resolvedHash[patient.get('id')]);
        });
        resolve(patients);
      }, reject);
    }.bind(this));
  },

  _haveLikeValue: function (valueToCompare, likeCondition) {
    return (valueToCompare.toLowerCase().indexOf(likeCondition.toLowerCase()) > -1);
  },

  _listToString: function (items, descField, dateField) {
    var itemList = [];
    if (!Ember.isEmpty(items)) {
      itemList = items.map(function (item) {
        return Ember.get(item, descField) + '(' + this._dateFormat(Ember.get(item, dateField)) + ')';
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
  _totalByType: function (records, typeField, totalLabel) {
    var total = 0,
      types = [];
    records.forEach(function (record) {
      var type = record.get(typeField),
        typeObject;
      if (!Ember.isEmpty(type)) {
        typeObject = types.find(function (item) {
          var itemType = item.type;
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
    types.push({type: totalLabel,total: total});
    return types;
  },

  _procedureListToString: function (procedures) {
    return this._listToString(procedures, 'description', 'procedureDate');
  },

  _validateDates: function () {
    var alertMessage,
      endDate = this.get('endDate'),
      isValid = true,
      reportType = this.get('reportType'),
      startDate = this.get('startDate');
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
    generateReport: function () {
      if (this._validateDates()) {
        var reportRows = this.get('reportRows'),
          reportType = this.get('reportType');
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
            this._findVisitsByDate().then(function (visits) {
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
            }.bind(this), function (err) {
              this._notifyReportError('Error in _findVisitsByDate:' + err);
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
    viewPatient: function (id) {
      this.store.find('patient', id).then(function (item) {
        item.set('returnTo', 'patients.reports');
        this.transitionToRoute('patients.edit', item);
      }.bind(this));
    }

  }
});
