/**
 * Class responsible for calculating column widths and visibility.
 * Used by the `x-list` component to manage its columns.
 *
 * Uses local storage to cache a user's preferred settings.
 */
import Ember from 'ember';
import compareArrays from 'ember-inspector/utils/compare-arrays';
const { set, isNone, copy, merge } = Ember;
const { floor } = Math;
const { keys } = Object;
const THIRTY_DAYS_FROM_NOW = 1000 * 60 * 60 * 24 * 30;

export default class {

  /**
   * Set up everything when new instance is created.
   *
   * @method constructor
   * @param {Object}
   *  - {String} key Used as key for local storage caching
   *  - {Number} tableWidth The table's width used for width calculations
   *  - {Number} minWidth The minimum width a column can reach
   *  - {Service} storage The local storage service that manages caching
   *  - {Array} columnSchema Contains the list of columns. Each column object should contain:
   *    - {String} id The column's unique identifier
   *    - {String} name The column's name
   *    - {Boolean} visible The column's default visibility
   */
  constructor({ key, tableWidth = 0, minWidth = 10, storage, columnSchema }) {
    this.tableWidth = tableWidth;
    this.minWidth = minWidth;
    this.key = key;
    this.storage = storage;
    this.columnSchema = columnSchema;
    this.setupCache();
  }

  /**
   * This method is called on initialization before everything.
   *
   * Does 3 things:
   *   - Clears the cache if it's invalid.
   *   - Clears expired cache.
   *   - Sets the current cache timestamp to now.
   *
   * @method setupCache
   */
  setupCache() {
    this.clearInvalidCache();
    this.clearExpiredCache();
    this.setCacheTimestamp();
  }

  /**
   * Sets the current cache's `updatedAt` property to now.
   * This timestamp is used to later clear this cache when
   * it expires.
   *
   * @method setCacheTimestamp
   */
  setCacheTimestamp() {
    let saved = this.storage.getItem(this.getStorageKey()) || {};
    saved.updatedAt = Date.now();
    this.storage.setItem(this.getStorageKey(), saved);
  }

  /**
   * This makes sure that if a cache already exists, it matches
   * the current column schema. If it does not, clear the existing
   * cache.
   *
   * The reason this scenario may occur is for volatile schemas
   * (such as records in the Data Tab since they depend on the user's models),
   * or when a list's schema is modified in a later upgrade.
   *
   * @method clearInvalidCache
   */
  clearInvalidCache() {
    let saved = this.storage.getItem(this.getStorageKey());
    if (saved && saved.columnVisibility) {
      let savedIds = keys(saved.columnVisibility).sort();
      let schemaIds = this.columnSchema.mapBy('id').sort();
      if (!compareArrays(savedIds, schemaIds)) {
        // Clear saved items
        this.storage.removeItem(this.getStorageKey());
      }
    }
  }

  /**
   * Goes over all `x-list` caches and clears them if
   * they haven't been used for up to 30 days. This prevents
   * old caches from taking over local storage. This could happen
   * in the Data tab where schemas are dynamic and could no longer
   * be needed.
   *
   * @method clearExpiredCache
   */
  clearExpiredCache() {
    let now = Date.now();
    this.storage.keys().filter(key => key.match(/^x-list/))
    .forEach(key => {
      if (now - this.storage.getItem(key).updatedAt > THIRTY_DAYS_FROM_NOW) {
        this.storage.removeItem(key);
      }
    });
  }

  /**
   * Returns a specific column's width. This value could either
   * be calculated or retrieved from local storage cache.
   *
   * @method getColumnWidth
   * @param {String} id The column's id
   * @return {Number}   The column's width
   */
  getColumnWidth(id) {
    let total = this.tableWidth;
    let percentage = this.getSavedPercentage(id);
    if (isNone(percentage)) {
      percentage = 1 / this.columnSchema.length;
    }
    return floor(total * percentage);
  }

  /**
   * Used to update `tableWidth` property in case
   * the table's width changes.
   *
   * @method setTableWidth
   * @param {Number} tableWidth
   */
  setTableWidth(tableWidth) {
    this.tableWidth = tableWidth;
    this.build();
  }

  /**
   * Call this to build the `columns` property.
   * All width calculations and cache retrievals happen
   * here.
   *
   * @method build
   */
  build() {
    this.buildColumns();
    this.processColumns();
  }

  /**
   * Indicates whether a specific column should be visible
   * or hidden. The value depends on cached values
   * and defaults to the original schema.
   *
   * @method isColumnVisible
   * @param {String} id
   * @return {Boolean}
   */
  isColumnVisible(id) {
    let saved = this.storage.getItem(this.getStorageKey()) || {};
    if (saved.columnVisibility && !isNone(saved.columnVisibility[id])) {
      return saved.columnVisibility[id];
    }
    return this.columnSchema.findBy('id', id).visible;
  }

  /**
   * Returns an array of column objects containing a
   * `visible` property which indicates whether they are visible
   * or not.
   *
   * @method getColumnVisibility
   * @return {Array}
   */
  getColumnVisibility() {
    return this._columnVisibility;
  }

  /**
   * Builds an array of columns and sets their `visible` property to the
   * current column's visibility status. The array is stored in
   * `_columnVisibility` property which will be the true reference to
   * which columns are visible and which are not at the moment.
   *
   * @method buildColumnVisibility
   */
  buildColumnVisibility() {
    if (this._columnVisibility) {
      return this._columnVisibility;
    }
    this._columnVisibility = this.columnSchema.map(column => merge(copy(column), {
      visible: this.isColumnVisible(column.id)
    }));
  }

  /**
   * Builds the `_columns` array which is a list of all columns
   * along with their calculated/cached widths. Call this method
   * whenever you need to recalculate the columns' widths.
   *
   * @method buildColumns
   */
  buildColumns() {
    this.buildColumnVisibility();
    let totalWidth = 0;
    let columns = this._columnVisibility.filterBy('visible')
    .map(({ id, name }) => {
      let width = this.getColumnWidth(id);
      totalWidth += width;
      return { width, id, name };
    });
    // Fix percentage precision errors. If we only add it to the last column
    // the last column will slowly increase in size every time we visit this list.
    // So we distribute the extra pixels starting with the smallest column.
    if (columns.length > 0) {
      let diff = this.tableWidth - totalWidth;
      while (diff > 0) {
        columns.sortBy('width').forEach(column => {
          if (diff > 0) {
            column.width++;
            diff--;
          }
        });
      }
    }
    this._columns = columns;
  }

  /**
   * Method that updates a specific column's width.
   * One column's width change will affect the last column's
   * width. Calling this will result in an updated `columns`
   * array.
   *
   * @method updateColumnWidth
   * @param {String} id The column's id
   * @param {Number} width The column's new width
   */
  updateColumnWidth(id, width) {
    let column = this._columns.findBy('id', id);
    let previousWidth = column.width;
    column.width = width;
    let last = this._columns[this._columns.length - 1];
    let lastColumnWidth = last.width + previousWidth - width;
    last.width = lastColumnWidth;
    this.processColumns();
  }

  /**
   * Method to toggle the visibility of a column. Mainly called
   * when a user toggles a column using the header's context menu.
   *
   * This method also resets width because adding/removing columns
   * will invalidate the current width distribution.
   *
   * @method toggleVisibility
   * @param {String} id
   */
  toggleVisibility(id) {
    let column = this._columnVisibility.findBy('id', id);
    column.visible = !column.visible;
    if (!this._columnVisibility.isAny('visible')) {
      // If this column was the last visible column
      // cancel toggling and set back to `true`.
      column.visible = true;
    }
    this.resetWidths();
  }

  /**
   * Calculates the columns' left positions and maximum width.
   * The maximum width of one column depends on the columns
   * positioned after that column.
   *
   * This method also saves all visibility and width settings.
   *
   * @method processColumns
   */
  processColumns() {
    let columns = this._columns;
    let prevLeft, prevWidth;
    columns = columns.map(({ id, name, visible, width }, index) => {
      let last = this._columns[this._columns.length - 1];
      let left = 0;
      if (index > 0) {
        left = prevWidth + prevLeft;
      }
      let maxWidth = width + last.width - this.minWidth;
      prevLeft = left;
      prevWidth = width;
      return { id, name, width, left, maxWidth };
    });
    this.saveVisibility();
    this.saveWidths();
    set(this, 'columns', columns);
  }

  /**
   * Caches which columns are visible and which ones are hidden.
   * Uses local storage. Visibility settings will remain unchanged
   * whenever the inspector is used another time.
   *
   * @method saveVisibility
   */
  saveVisibility() {
    let saved = this.storage.getItem(this.getStorageKey()) || {};
    saved.columnVisibility = this._columnVisibility.reduce((obj, { id, visible }) => {
      obj[id] = visible;
      return obj;
    }, {});
    this.storage.setItem(this.getStorageKey(), saved);
  }

  /**
   * Resets the current column widths by clearing the cache and
   * recalculating them from scratch.
   *
   * @method resetWidths
   */
  resetWidths() {
    let saved = this.storage.getItem(this.getStorageKey()) || {};
    delete saved.columnWidths;
    this.storage.setItem(this.getStorageKey(), saved);
    this.build();
  }

  /**
   * Uses local storage to cache the current column widths. A specific
   * table's widths will remaing unchanged anyime the inspector is opened again.
   *
   * The stored widths are percentages so that they remain independent of a table's
   * width.
   *
   * @method saveWidths
   */
  saveWidths() {
    let columns = {};
    let totalWidth = this._columns.reduce((sum, { width }) => sum + width, 0);
    this._columns.forEach(({ id, width }) => {
      columns[id] = width / totalWidth;
    });
    let saved = this.storage.getItem(this.getStorageKey()) || {};
    saved.columnWidths = columns;
    this.storage.setItem(this.getStorageKey(), saved);
  }

  /**
   * The storage key to use for local storage.
   * Depends on the `key` property.
   *
   * @method getStorageKey
   */
  getStorageKey() {
    return `x-list__${this.key}`;
  }

  /**
   * Returns the cached width of a column.
   *
   * @method getSavedPercentage
   * @param  {String} id The column's id
   * @return {Number}    The cached percentage
   */
  getSavedPercentage(id) {
    let saved = this.storage.getItem(this.getStorageKey()) || {};
    return saved.columnWidths && saved.columnWidths[id];
  }
}
