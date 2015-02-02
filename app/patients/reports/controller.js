import AbstractReportController from 'hospitalrun/controllers/abstract-report-controller';
import Ember from "ember";
import VisitTypes from 'hospitalrun/mixins/visit-types';
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
        name: 'Admissions',
        value: 'admissions'

    }, {
        name: 'Average Daily Census',
        value: 'dailyCensus'

    }, {
        name: 'Average Length of Stay',
        value: 'lengthOfStay'

    }, {
        name: 'Average Length of Stay',
        value: 'lengthOfStay'

    }, {
        name: 'Surgeries',
        value: 'surgeries'
    }, {
        name: 'Visit',
        value: 'visit'
    }],
    
    _addContactToList: function(phone, email, prefix, contactList) {
        var contactArray = [];
        if (!Ember.isEmpty(email) || !Ember.isEmpty(phone)) {
            if (!Ember.isEmpty(phone)) {
                contactArray.push(phone);
            }                
            if (!Ember.isEmpty(email)) {
                contactArray.push(email);
            }
            contactList.push(prefix+contactArray.join(', '));
        }
    },
    
    _contactListToString: function(patient) {
        var additionalContacts = patient.get('additionalContacts'),
            contactArray = [],
            contactDesc,
            contactList = [],
            email = patient.get('email'),
            phone = patient.get('phone');
        this._addContactToList(phone, email, 'Primary: ', contactList);
        if (!Ember.isEmpty(additionalContacts)) {
            additionalContacts.forEach(function(contact) {
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
    
    _diagnosisListToString: function(diagnoses) {
        return this._listToString(diagnoses, 'description', 'date');
    },
    
    /**
     * Find visits by the specified dates and the record's start and (optional) end dates.
     * @param {Array} records to filter.
     */
    _findVisitsByDate: function() {        
        var filterEndDate = this.get('endDate'),
            filterStartDate = this.get('startDate'),
            findParams = {
                options: {},
                mapReduce: 'visit_by_date'
            },
            maxValue = '\uffff';
        return new Ember.RSVP.Promise(function(resolve, reject) {
            if (Ember.isEmpty(filterStartDate)) {
                reject();
            }
            findParams.options.startkey =  [filterStartDate.getTime(),];
            if (!Ember.isEmpty(filterEndDate)) {
                findParams.options.endkey =  [filterEndDate.getTime(), maxValue];    
            }
            this.store.find('visit', findParams).then(resolve, reject);
            
        }.bind(this));
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
        this._generateExport();
        this.closeProgressModal();
    },
    
    _generateVisitReport: function() {
        var reportColumns = this.get('reportColumns'),
            visitFilters = this.getProperties(
                'examiner','visitDate','visitType','location','clinic',
                'primaryDiagnosis','secondaryDiagnosis'
            );
        this._findVisitsByDate().then(function(visits) {
            for (var filter in visitFilters) {
                if (!Ember.isEmpty(visitFilters[filter])) {
                    switch (filter) {
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
        }.bind(this), function() {
            this.closeProgressModal();
        }.bind(this));
    },
    
    _haveLikeValue: function(valueToCompare, likeCondition) {
         return (valueToCompare.toLowerCase().indexOf(likeCondition.toLowerCase()) > -1);
    },
    
    _listToString: function(items, descField, dateField) {
        var itemList = [];
        if (!Ember.isEmpty(items)) {
            itemList = items.map(function(item) {
                return Ember.get(item, descField) + '('+this._dateFormat(Ember.get(item, dateField))+')';
            }.bind(this));
        }
        return itemList.join(',\n');
    },
    
    _procedureListToString: function(procedures) {
        return this._listToString(procedures, 'description', 'procedureDate');      
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
            this.showProgressModal();
            switch (reportType) {
                case 'visit': {
                    this._generateVisitReport(reportType);
                    break;                    
                }
            }
        }
    }
});