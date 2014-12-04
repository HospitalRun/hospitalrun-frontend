import VisitTypes from 'hospitalrun/mixins/visit-types';
import AbstractReportController from 'hospitalrun/controllers/abstract-report-controller';
export default AbstractReportController.extend(VisitTypes, {
    needs: ['patients'],
    
    clinicList: Ember.computed.alias('controllers.patients.clinicList'),
    physicianList: Ember.computed.alias('controllers.patients.physicianList'),
    locationList: Ember.computed.alias('controllers.patients.locationList'),
    
    reportColumns: {
        age: {
            label: 'Age',
            include: false,
            property: 'patient.age'            
        },
        contacts: {
            label: 'Contacts',
            include: false,
            property: 'patient',
            format: '_contactListToString'
        },
        dateOfBirth: {
            label: 'Date Of Birth',
            include: true,
            property: 'patient.dateOfBirth',
            format: '_dateFormat'
        },
        examiner: {
            label: 'Examiner',
            include: true,
            property: 'examiner'    
        },
        gender: {
            label: 'Gender',
            include: true,
            property: 'patient.gender'
        },
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
        primaryDiagnosis: {
            label: 'Primary Diagnosis',
            include: false,
            property: 'primaryDiagnosis'
        },
        procedures: {
            label: 'Procedures',
            include: false,
            property: 'procedures',
            format: '_procedureListToString'
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
        },
        secondaryDiagnoses: {
            label: 'Secondary Diagnoses',
            include: false,
            property: 'additionalDiagnoses',
            format: '_diagnosisListToString'
        },
        visitDate: {
            label: 'Visit Date',
            include: true,
            property: 'visitDate'
        },
        visitLocation: {
            label: 'Visit Location',
            include: false,
            property: 'location'
        },
        visitType: {
            label: 'Visit Type',
            include: true,
            property: 'visitType'
        },
    },
    reportTypes: [{
        name: 'Visit',
        value: 'visit'
    }],    

    _addTotalsRow: function(label, summaryCost, summaryQuantity) {
        if (summaryQuantity > 0) {
            this._addReportRow({
                totalCost: label +  this.numberFormat(summaryCost),
                quantity: label + this.numberFormat(summaryQuantity),
                unitCost: label + this.numberFormat(summaryCost/summaryQuantity)
            }, true);
        }        
    },
    
    _contactListToString: function(patient) {
        var additionalContacts = patient.get('additionalContacts'),
            contactArray = [],
            contactDesc,
            contactList = [],
            email = patient.get('email'),
            phone = patient.get('phone');            
            if (!Ember.isEmpty(email) || !Ember.isEmpty(phone)) {
                if (!Ember.isEmpty(phone)) {
                    contactArray.push(phone);
                }                
                if (!Ember.isEmpty(email)) {
                    contactArray.push(email);
                }
                contactList.push('Primary: '+contactArray.join(' , '));
            }
            if (!Ember.isEmpty(additionalContacts)) {
                additionalContacts.forEach(function(contact) {
                    contactArray = [];
                    contactDesc = '';
                    if (!Ember.isEmpty(contact.phone)) {
                        contactArray.push(contact.phone);
                    }
                    if (!Ember.isEmpty(contact.email)) {
                        contactArray.push(contact.email);
                    }                    
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
                    contactList.push(contactDesc+contactArray.join(' , '));
                });
            }
        return contactList.join(';\n');
    },
    
    _diagnosisListToString: function(diagnoses) {
        var diagnosisList = '';
        if (!Ember.isEmpty(diagnoses)) {
            diagnoses.forEach(function(diagnosis, idx) {
                if(idx > 0) {
                    diagnosisList += ', ';
                }
                diagnosisList += diagnosis.description + '('+this._dateFormat(diagnosis.date)+')';
            }.bind(this));
        }
        return diagnosisList;
    },

    /**
     * Filter the records by the specified date and the record's start and (optional) end dates.
     * @param {Array} records to filter.
     * @param {Date} the date to filter by.
     */
    _filterByDate: function(records, dateToFilterBy) {
        return records.filter(function(record) {
            var endDate = record.get('endDate'),
            startDate = record.get('startDate');        
            var compareDate = moment(dateToFilterBy);
            return ((Ember.isEmpty(endDate) || compareDate.isSame(endDate, 'day') || 
                     compareDate.isBefore(endDate, 'day')) &&
                    (Ember.isEmpty(startDate) || compareDate.isSame(startDate, 'day') || compareDate.isAfter(startDate, 'day')));
        });
    },
    
    _filterByLike: function(records, field, likeCondition) {
        return records.filter(function(record) {
            var fieldValue = record.get('field');
            if (Ember.isEmpty(fieldValue)) {
                return false;
            } else {
                if (Ember.isArray(fieldValue)) {
                    var foundValue = fieldValue.find(function(value) {
                        return this._haveLikeValue(value, likeCondition);
                    }.bind(this));
                    return !Ember.isEmpty(foundValue);
                } else {
                    return this._haveLikeValue(fieldValue, likeCondition);
                }
            }
        });
    },
    
    _finishVisitReport: function(visits) {
        visits.forEach(function(visit) {
            this._addReportRow(visit);
        }.bind(this));
        this.set('showReportResults', true);
        this._setReportHeaders();
        this._setReportTitle();
    },
    
    _generateVisitReport: function() {
        var reportColumns = this.get('reportColumns'),
            visitFilters = this.getProperties(
                'examiner','visitDate','visitType','location','clinic',
                'primaryDiagnosis','secondaryDiagnosis'
            ),
            visits = this.get('model');
        for (var filter in visitFilters) {
            if (!Ember.isEmpty(visitFilters[filter])) {
                switch (filter) {
                    case 'visitDate': {
                        //filter by visit date
                        visits = this._filterByDate(visits, visitFilters[filter]);
                        break;                    
                    }
                    case 'diagnosis': {
                        visits = this._filterByLike(visits, 'diagnosisList',  visitFilters[filter]);
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
            var promises = [];
            visits.forEach(function(visit) {
                promises.push(visit.get('procedures'));
            });
            Ember.RSVP.all(promises).then(function() {
                this._finishVisitReport(visits);    
            }.bind(this));
        } else {
            this._finishVisitReport(visits);
        }

    },
    
    _haveLikeValue: function(valueToCompare, likeCondition) {
         return (valueToCompare.toLowerCase().indexOf(likeCondition.toLowerCase()) > -1);
    },
    
    _procedureListToString: function(procedures) {
        var procedureList = '';
        if (!Ember.isEmpty(procedures)) {
            procedures.forEach(function(procedure, idx) {
                if(idx > 0) {
                    procedureList += ', ';
                }
                procedureList += procedure.get('description') + '('+this._dateFormat(procedure.get('procedureDate'))+')';
            }.bind(this));
        }
        return procedureList;        
    },
    
    _setReportTitle: function() {
        var endDate = this.get('endDate'),
            formattedEndDate = '',
            formattedStartDate = '',
            reportType = this.get('reportType'),
            reportTypes = this.get('reportTypes'),
            startDate = this.get('startDate');
        if (!Ember.isEmpty(endDate)) {
            formattedEndDate = moment(endDate).format('l');
        }
        
        var reportDesc = reportTypes.findBy('value', reportType);
        if (Ember.isEmpty(startDate)) {
            this.set('reportTitle', '%@ Report %@'.fmt(reportDesc.name, formattedEndDate));
        } else {
            formattedStartDate = moment(startDate).format('l');
            this.set('reportTitle', '%@ Report %@ - %@'.fmt(reportDesc.name, formattedStartDate, formattedEndDate));
        }
    },
    
    actions: {
        generateReport: function() {
            var reportRows = this.get('reportRows'),
                reportType = this.get('reportType');
            reportRows.clear();            
            switch (reportType) {
                case 'visit': {
                    this._generateVisitReport();
                    break;                    
                }
            }
        }
    }
});