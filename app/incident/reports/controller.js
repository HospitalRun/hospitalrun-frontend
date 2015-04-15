import AbstractReportController from 'hospitalrun/controllers/abstract-report-controller';
import Ember from 'ember';
import NumberFormat from "hospitalrun/mixins/number-format";
export default AbstractReportController.extend(NumberFormat, {
    needs: ['incident'],
    
    departmentReportColumns: {
        department: {
            label: 'Department',
            include: true,
            property: 'type' //property type because in _addReportRow function looks for column name with value as type
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
    riskScoresReportColumns: {
        date: {
            label: 'Reported Date',
            include: true,
            property: 'reportedDate'
        },
        id: {
            label: 'Id',
            include: true,
            property: 'friendlyId'
        },
         department: {
            label: 'Department',
            include: true,
            property: 'locationOfIncident'
        },
        HarmScore: {
            label: 'Harm Score',
            include: true,
            property: 'harmScore'
        }, 
        preSeverity: {
            label: 'Pre Incident Severity',
            include: true,
            property: 'preSeverity'
        },
        preOccurence: {        
            label: 'Pre Incident Occurence',
            include: true,
            property: 'preOccurence'
        }, 
        preRiskScore: {
            label: 'Pre Incident RiskScore',
            include: true,
            property: 'preRiskScore'
        }, 
        postSeverity: {
            label: 'Post Incident Severity',
            include: true,
            property: 'postSeverity'
        }, 
        postOccurence: {
            label: 'Post Incident Occurence',
            include: true,
            property: 'postOccurence'
        }, 
        postRiskScore: {
            label: 'Post Incident RiskScore', 
            include: true,
            property: 'postRiskScore'
        }
        
    },
    reportTypes: [{
        name: 'Incidents by Department',
        value: 'department'
    }, {
        name: 'Incidents by Type of Incident',
        value: 'incidentType'
    }, {
        name: 'Incident Harm and Risk Scores',
        value: 'riskScores'
    }],

    /**
     * Find Incidents by the specified dates and the incidents's date.
     */
    _findIncidentsByDate: function() {        
        var filterEndDate = this.get('endDate'),
            filterStartDate = this.get('startDate'),
            findParams = {
                options: {},
                mapReduce: 'incident_by_date'
            },
            maxValue = this.get('maxValue');
        return new Ember.RSVP.Promise(function(resolve, reject) {
            if (Ember.isEmpty(filterStartDate)) {
                reject();
            }
            findParams.options.startkey =  [filterStartDate.getTime(), null];
            
            if (!Ember.isEmpty(filterEndDate)) {
                filterEndDate = moment(filterEndDate).endOf('day').toDate();
                findParams.options.endkey =  [filterEndDate.getTime(), maxValue];
            }
            this.store.find('incident', findParams).then(resolve, reject);
        }.bind(this));
    },

 
    _generateByDepartmentOrByIncidentTypeReport: function(incidents,reportType) {
        var reportColumns,reportProperty;
        if (reportType === 'department'){  
                reportColumns = this.get('departmentReportColumns');
                reportProperty = 'locationOfIncident';

            }
        else{
                reportColumns = this.get('incidentTypeReportColumns');
                reportProperty = 'categoryName';
            }
        this._addRowsByType(incidents, reportProperty, 'Total incidents: ',reportColumns);
        this._finishReport(reportColumns);
    },

    /**
     * Given a list of records, organize and total by them by type and then add them to the report.
     * @param records {Array} list of records to total.
     * @param typeField {String} the field in the records containing the type.
     * @param totalLabel {String} the label for the grand total.
     * @param reportColumns 
     */
    _addRowsByType: function(records, typeField, totalLabel, reportColumns) {
        var types = this._totalByType(records, typeField, totalLabel);
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
    _totalByType: function(records, typeField, totalLabel) {
        var total = 0,
            types = [];
        records.forEach(function(record) {
            var type = record.get(typeField),
                typeObject;
            if (!Ember.isEmpty(type)) {
                typeObject = types.findBy('type', type);
                if (Ember.isEmpty(typeObject)) {
                    typeObject = {
                        type: type,
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

    _generateRiskReport: function(incidents) {
        var reportColumns = this.get('riskScoresReportColumns');
        var incidentLocations = this._totalByType(incidents, 'locationOfIncident', 'total');
        incidentLocations.forEach(function(incidentLocation) {
            if (incidentLocation.type === 'total') {
                this._addReportRow({
                    visitDate: 'Total incidents: '+incidentLocation.total
                });
            } else {
                incidentLocation.records.forEach(function(visit) {
                    this._addReportRow(visit);
                }.bind(this));
                this._addReportRow({
                    visitDate: 'Total for %@: %@'.fmt(incidentLocation.type,incidentLocation.total)
                });
            }
        }.bind(this));
        this._finishReport(reportColumns);
    },
       
    actions: {
        generateReport: function() {
            var reportRows = this.get('reportRows'),
                reportType = this.get('reportType');
            reportRows.clear();
            this.showProgressModal();
            switch (reportType) {
                case 'department':
                case 'incidentType':
                case 'riskScores': {
                    this._findIncidentsByDate().then(function(incidents) {
                        switch (reportType) {
                            case 'incidentType':
                            case 'department': {
                                this._generateByDepartmentOrByIncidentTypeReport(incidents,reportType);
                                break;
                            }
                            case 'riskScores': {
                                this._generateRiskReport(incidents);
                                break;                    
                            }
                        }
                    }.bind(this), function() {
                        this.closeProgressModal();
                    }.bind(this));
                    break;
                }
            }
        }
    }
});