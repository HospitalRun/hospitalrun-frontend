'use strict'

var now = require('./now')
var PerformanceTiming = require('./performance-timing')

/**
 * Crossplatform performance.now()
 *
 * https://developer.mozilla.org/en-US/docs/Web/API/Performance.now()
 *
 * @return {Number} relative time in ms
 * @api public
 */
exports.now = function () {
    if (window.performance && window.performance.now) return window.performance.now()
    return now() - PerformanceTiming.navigationStart
}

