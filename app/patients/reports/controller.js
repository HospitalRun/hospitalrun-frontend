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
            property: 'contacts'
        },
        dateOfBirth: {
            label: 'Date Of Birth',
            include: true,
            property: 'patient.dateOfBirth'
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
        primaryDiagnoses: {
            label: 'Primary Diagnoses',
            include: false,
            property: 'primaryDiagnoses'
        },
        procedures: {
            label: 'Procedures',
            include: false,
            property: 'procedures'
        },
        referredBy: {
            label: 'Referred By',
            include: false,
            property: 'patient.referredBy'            
        },
        referredDate: {
            label: 'Referred Date',
            include: false,
            property: 'patient.referredDate'            
        },
        secondaryDiagnoses: {
            label: 'Secondary Diagnoses',
            include: false,
            property: 'secondaryDiagnoses'
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

    /**
     * Filter the records by the specified field and the the specified start and (optional) end dates.
     * @param {Array} records to filter.
     * @param {String} field name of the date field in the record to filter by.
     */
    _filterByDate: function(records, field) {
        var endDate = this.get('endDate'),
            startDate = this.get('startDate');        
        return records.filter(function(record) {
            var compareDate = moment(record.get(field));
            return ((Ember.isEmpty(endDate) || compareDate.isSame(endDate, 'day') || 
                     compareDate.isBefore(endDate, 'day')) &&
                    (Ember.isEmpty(startDate) || compareDate.isSame(startDate, 'day') || compareDate.isAfter(startDate, 'day')));
        });
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
            var endDate = this.get('endDate'),
                reportRows = this.get('reportRows'),
                reportType = this.get('reportType'),
                startDate = this.get('startDate');
            if (Ember.isEmpty(startDate) && Ember.isEmpty(endDate)) {
                return;
            }
            reportRows.clear();            
            switch (reportType) {
                case 'expiration': {
                    this._generateExpirationReport();
                    break;                    
                }
                default: {
                    this._generateInventoryReport();
                    break;
                }
            }
        }
    }
});