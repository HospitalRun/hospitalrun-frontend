import { get, computed } from '@ember/object';
import { isEmpty } from '@ember/utils';
import Controller from '@ember/controller';
import DateFormat from 'hospitalrun/mixins/date-format';
import ModalHelper from 'hospitalrun/mixins/modal-helper';
import moment from 'moment';
import NumberFormat from 'hospitalrun/mixins/number-format';
import PaginationProps from 'hospitalrun/mixins/pagination-props';
import PouchDbMixin from 'hospitalrun/mixins/pouchdb';
import ProgressDialog from 'hospitalrun/mixins/progress-dialog';
export default Controller.extend(DateFormat, ModalHelper, NumberFormat, PaginationProps, PouchDbMixin, ProgressDialog, {
  defaultErrorMessage: 'An error was encountered while generating the requested report.  Please let your system administrator know that you have encountered an error.',
  offset: 0,
  limit: 25,
  progressMessage: 'Please wait while your report is generated.',
  progressTitle: 'Generating Report',
  reportColumns: null,
  reportHeaders: null,
  reportRows: [],
  reportTitle: null,
  reportType: null,
  reportTypes: null,
  showFirstPageButton: true,
  showLastPageButton: true,
  showReportResults: false,

  /**
   * Add a row to the report using the selected columns to add the row.
   * @param {Array} row the row to add
   * @param {boolean} skipFormatting true if formatting should be skipped.
   * @param reportColumns {Object} the columns to display on the report;
   * optional, if not set, the property reportColumns on the controller
   * will be used.
   * @param reportAction {Object} action to fire on row when row is clicked.
   */
  _addReportRow(row, skipFormatting, reportColumns, rowAction) {
    let columnValue;
    let reportRows = this.get('reportRows');
    let reportRow = [];
    if (isEmpty(reportColumns)) {
      reportColumns = this.get('reportColumns');
    }
    for (let column in reportColumns) {
      if (reportColumns[column].include) {
        columnValue = get(row, reportColumns[column].property);
        if (isEmpty(columnValue)) {
          reportRow.push('');
        } else if (reportColumns[column].format === '_numberFormat') {
          if (skipFormatting) {
            reportRow.push(columnValue);
          } else {
            reportRow.push(this._numberFormat(columnValue));
          }
        } else if (!skipFormatting && reportColumns[column].format) {
          reportRow.push(this[reportColumns[column].format](columnValue));
        } else {
          reportRow.push(columnValue);
        }
      }
    }
    if (rowAction) {
      reportRows.addObject({
        rowAction,
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
  _finishReport(reportColumns) {
    this.set('showReportResults', true);
    this.set('offset', 0);
    this._setReportHeaders(reportColumns);
    this._setReportTitle();
    this._generateExport();
    this.closeProgressModal();
  },

  _generateExport() {
    let csvRows = [];
    let reportHeaders = this.get('reportHeaders');
    let dataArray = [reportHeaders];
    dataArray.addObjects(this.get('reportRows'));
    dataArray.forEach(function(reportRow) {
      let rowToAdd;
      if (reportRow.row) {
        rowToAdd = reportRow.row;

      } else {
        rowToAdd = reportRow;

      }
      rowToAdd = rowToAdd.map(function(column) {
        if (!column) {
          return '';
        } else if (column.replace) {
          return column.replace('"', '""');
        } else {
          return column;
        }

      });
      csvRows.push(`"${rowToAdd.join('","')}"`);
    });
    let csvString = csvRows.join('\r\n');
    let uriContent = `data:application/csv;charset=utf-8,${encodeURIComponent(csvString)}`;
    this.set('csvExport', uriContent);
  },

  _notifyReportError(errorMessage) {
    let intl = this.get('intl');
    this.closeProgressModal();
    this.displayAlert(intl.t('alerts.reportError'), intl.t('messages.reportError'));
    throw new Error(errorMessage);
  },

  _setReportHeaders(reportColumns) {
    let reportHeaders = [];
    if (isEmpty(reportColumns)) {
      reportColumns = this.get('reportColumns');
    }
    for (let column in reportColumns) {
      if (reportColumns[column].include) {
        reportHeaders.push(reportColumns[column].label);
      }
    }
    this.set('reportHeaders', reportHeaders);
  },

  _setReportTitle() {
    let endDate = this.get('endDate');
    let formattedEndDate = '';
    let formattedStartDate = '';
    let reportType = this.get('reportType');
    let reportTypes = this.get('reportTypes');
    let startDate = this.get('startDate');
    if (!isEmpty(endDate)) {
      formattedEndDate = moment(endDate).format('l');
    }

    let reportDesc = reportTypes.findBy('value', reportType);
    if (isEmpty(startDate)) {
      this.set('reportTitle', this.get('intl').t(
        'inventory.reports.titleSingleDate',
        {
          name: reportDesc.name,
          date: formattedEndDate
        }
      ));
    } else {
      formattedStartDate = moment(startDate).format('l');
      this.set('reportTitle', this.get('intl').t(
        'inventory.reports.titleDateRange',
        {
          name: reportDesc.name,
          startDate: formattedStartDate,
          endDate: formattedEndDate
        }
      ));
    }
  },

  actions: {
    firstPage() {
      this.set('offset', 0);
    },

    nextPage() {
      let limit = this.get('limit');
      this.incrementProperty('offset', limit);
    },

    previousPage() {
      let limit = this.get('limit');
      this.decrementProperty('offset', limit);
    },

    lastPage() {
      let reportRowLength = this.get('reportRows.length');
      let limit = this.get('limit');
      let pages = parseInt(reportRowLength / limit);
      this.set('offset', (pages * limit));
    }

  },

  currentReportRows: computed('reportRows.[]', 'offset', 'limit', function() {
    let limit = this.get('limit');
    let offset = this.get('offset');
    let reportRows = this.get('reportRows');
    return reportRows.slice(offset, offset + limit);
  }),

  disablePreviousPage: computed('offset', function() {
    return (this.get('offset') === 0);
  }),

  disableNextPage: computed('offset', 'limit', 'reportRows.length', function() {
    let limit = this.get('limit');
    let length = this.get('reportRows.length');
    let offset = this.get('offset');
    return ((offset + limit) >= length);
  }),

  showPagination: computed('reportRows.length', function() {
    let length = this.get('reportRows.length');
    let limit = this.get('limit');
    return (length > limit);
  })

});
