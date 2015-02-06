import Ember from "ember";
import DateFormat from 'hospitalrun/mixins/date-format';
import NumberFormat from 'hospitalrun/mixins/number-format';
import PouchDbMixin from 'hospitalrun/mixins/pouchdb';
import ProgressDialog from "hospitalrun/mixins/progress-dialog";
export default Ember.ArrayController.extend(DateFormat, NumberFormat, PouchDbMixin, ProgressDialog, {
    progressMessage: 'Please wait while your report is generated.',
    progressTitle: 'Generating Report',
    reportColumns: null,
    reportRows: [],
    reportTitle: null,
    reportType: null,
    reportTypes: null,    
    showReportResults: false,
    
    /**
     * Add a row to the report using the selected columns to add the row.
     * @param {Array} row the row to add
     * @param {boolean} skipNumberFormatting true if number columns should not be formatted.
     * @param reportColumns {Object} the columns to display on the report; 
     * optional, if not set, the property reportColumns on the controller 
     * will be used. 
     */
    _addReportRow: function(row, skipNumberFormatting, reportColumns) {
        var columnValue,
            reportRows = this.get('reportRows'),
            reportRow = [];
        if (Ember.isEmpty(reportColumns)) {
            reportColumns = this.get('reportColumns');
        }
        for (var column in reportColumns) {
            if (reportColumns[column].include) {
                columnValue = Ember.get(row,reportColumns[column].property);
                if (Ember.isEmpty(columnValue)) {
                     reportRow.push('');
                } else if (reportColumns[column].format === '_numberFormat') {
                    if (skipNumberFormatting) {
                        reportRow.push(columnValue);
                    } else {
                        reportRow.push(this._numberFormat(columnValue));
                    }
                } else if (reportColumns[column].format) {
                    reportRow.push(this[reportColumns[column].format](columnValue));
                } else {
                    reportRow.push(columnValue);
                }
            }
        }
        reportRows.addObject(reportRow);
    },
    
    /**
     * Finish up the report by setting headers, titles and export.
     * @param reportColumns {Object} the columns to display on the report; 
     * optional, if not set, the property reportColumns on the controller 
     * will be used. 
     */
    _finishReport: function(reportColumns) {
        this.set('showReportResults', true);
        this._setReportHeaders(reportColumns);
        this._setReportTitle();
        this._generateExport();
        this.closeProgressModal();
    },
    
    _generateExport: function() {
        var csvRows = [],
            reportHeaders = this.get('reportHeaders'),
            dataArray = [reportHeaders];
        dataArray.addObjects(this.get('reportRows'));
        dataArray.forEach(function(row) { 
            csvRows.push('"'+row.join('","')+'"');
        });
        var csvString = csvRows.join('\r\n');
        var uriContent = "data:application/csv;charset=utf-8," + encodeURIComponent(csvString);
        this.set('csvExport', uriContent);
    },
    
    _setReportHeaders: function(reportColumns) {
        var reportHeaders = [];
        if (Ember.isEmpty(reportColumns)) {
            reportColumns = this.get('reportColumns');
        }
        for (var column in reportColumns) {
            if (reportColumns[column].include) {
                reportHeaders.push(reportColumns[column].label);
            }
        }
        this.set('reportHeaders', reportHeaders);
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

    
});