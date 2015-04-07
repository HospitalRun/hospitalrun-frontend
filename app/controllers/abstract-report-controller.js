import Ember from "ember";
import DateFormat from 'hospitalrun/mixins/date-format';
import NumberFormat from 'hospitalrun/mixins/number-format';
import PouchDbMixin from 'hospitalrun/mixins/pouchdb';
import ProgressDialog from "hospitalrun/mixins/progress-dialog";
export default Ember.ArrayController.extend(DateFormat, NumberFormat, PouchDbMixin, ProgressDialog, {
    offset: 0,
    limit: 25,
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
     * @param reportAction {Object} action to fire on row when row is clicked.     
     */
    _addReportRow: function(row, skipNumberFormatting, reportColumns, rowAction) {
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
        if (rowAction) {
            reportRows.addObject({
                rowAction: rowAction,
                row: reportRow
            });
        } else {
            reportRows.addObject(reportRow);
        }
    },
    
    /**
     * Finish up the report by setting headers, titles and export.
     * @param reportColumns {Object} the columns to display on the report; 
     * optional, if not set, the property reportColumns on the controller 
     * will be used. 
     */
    _finishReport: function(reportColumns) {
        this.set('showReportResults', true);
        this.set('offset', 0);
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
        dataArray.forEach(function(reportRow) { 
            if (reportRow.row) {                
                csvRows.push('"'+reportRow.row.join('","')+'"');                
            } else {
                csvRows.push('"'+reportRow.join('","')+'"');
            }
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
    
    actions: {
        nextPage: function() {
            var limit = this.get('limit');
            this.incrementProperty('offset', limit);
        },
        
        previousPage: function() {
            var limit = this.get('limit');
            this.decrementProperty('offset', limit);    
        }
    },
    
    currentReportRows: function() {		
        var limit = this.get('limit'),
            offset = this.get('offset'),
            reportRows = this.get('reportRows');		
        return reportRows.slice(offset, offset+limit);		
    }.property('reportRows.@each', 'offset', 'limit'),    
    
    disablePreviousPage: function() {
        return (this.get('offset') === 0);
    }.property('offset'),
    
    disableNextPage: function() {
        var limit = this.get('limit'),
            length = this.get('reportRows.length'),
            offset = this.get('offset');
            return ((offset+limit) >= length);
    }.property('offset','limit','reportRows.length'),
    
    showPagination: function() {
        var length = this.get('reportRows.length'),
            limit = this.get('limit');
        return (length > limit);            
    }.property('reportRows.length')
    
});