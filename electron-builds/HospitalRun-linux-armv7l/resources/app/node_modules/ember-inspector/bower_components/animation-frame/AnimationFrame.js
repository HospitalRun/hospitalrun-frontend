!function(e){if("object"==typeof exports&&"undefined"!=typeof module)module.exports=e();else if("function"==typeof define&&define.amd)define([],e);else{var n;"undefined"!=typeof window?n=window:"undefined"!=typeof global?n=global:"undefined"!=typeof self&&(n=self),n.AnimationFrame=e()}}(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/**
 * An even better animation frame.
 *
 * @copyright Oleg Slobodskoi 2015
 * @website https://github.com/kof/animationFrame
 * @license MIT
 */

module.exports = require('./lib/animation-frame')

},{"./lib/animation-frame":2}],2:[function(require,module,exports){
'use strict'

var nativeImpl = require('./native')
var now = require('./now')
var performance = require('./performance')

// Weird native implementation doesn't work if context is defined.
var nativeRequest = nativeImpl.request
var nativeCancel = nativeImpl.cancel

/**
 * Animation frame constructor.
 *
 * Options:
 *   - `useNative` use the native animation frame if possible, defaults to true
 *   - `frameRate` pass a custom frame rate
 *
 * @param {Object|Number} options
 */
function AnimationFrame(options) {
    if (!(this instanceof AnimationFrame)) return new AnimationFrame(options)
    options || (options = {})

    // Its a frame rate.
    if (typeof options == 'number') options = {frameRate: options}
    options.useNative != null || (options.useNative = true)
    this.options = options
    this.frameRate = options.frameRate || AnimationFrame.FRAME_RATE
    this._frameLength = 1000 / this.frameRate
    this._isCustomFrameRate = this.frameRate !== AnimationFrame.FRAME_RATE
    this._timeoutId = null
    this._callbacks = {}
    this._lastTickTime = 0
    this._tickCounter = 0
}

module.exports = AnimationFrame

/**
 * Default frame rate used for shim implementation. Native implementation
 * will use the screen frame rate, but js have no way to detect it.
 *
 * If you know your target device, define it manually.
 *
 * @type {Number}
 * @api public
 */
AnimationFrame.FRAME_RATE = 60

/**
 * Replace the globally defined implementation or define it globally.
 *
 * @param {Object|Number} [options]
 * @api public
 */
AnimationFrame.shim = function(options) {
    var animationFrame = new AnimationFrame(options)

    window.requestAnimationFrame = function(callback) {
        return animationFrame.request(callback)
    }
    window.cancelAnimationFrame = function(id) {
        return animationFrame.cancel(id)
    }

    return animationFrame
}

/**
 * Request animation frame.
 * We will use the native RAF as soon as we know it does works.
 *
 * @param {Function} callback
 * @return {Number} timeout id or requested animation frame id
 * @api public
 */
AnimationFrame.prototype.request = function(callback) {
    var self = this

    // Alawys inc counter to ensure it never has a conflict with the native counter.
    // After the feature test phase we don't know exactly which implementation has been used.
    // Therefore on #cancel we do it for both.
    ++this._tickCounter

    if (nativeImpl.supported && this.options.useNative && !this._isCustomFrameRate) {
        return nativeRequest(callback)
    }

    if (!callback) throw new TypeError('Not enough arguments')

    if (this._timeoutId == null) {
        // Much faster than Math.max
        // http://jsperf.com/math-max-vs-comparison/3
        // http://jsperf.com/date-now-vs-date-gettime/11
        var delay = this._frameLength + this._lastTickTime - now()
        if (delay < 0) delay = 0

        this._timeoutId = setTimeout(function() {
            self._lastTickTime = now()
            self._timeoutId = null
            ++self._tickCounter
            var callbacks = self._callbacks
            self._callbacks = {}
            for (var id in callbacks) {
                if (callbacks[id]) {
                    if (nativeImpl.supported && self.options.useNative) {
                        nativeRequest(callbacks[id])
                    } else {
                        callbacks[id](performance.now())
                    }
                }
            }
        }, delay)
    }

    this._callbacks[this._tickCounter] = callback

    return this._tickCounter
}

/**
 * Cancel animation frame.
 *
 * @param {Number} timeout id or requested animation frame id
 *
 * @api public
 */
AnimationFrame.prototype.cancel = function(id) {
    if (nativeImpl.supported && this.options.useNative) nativeCancel(id)
    delete this._callbacks[id]
}

},{"./native":3,"./now":4,"./performance":6}],3:[function(require,module,exports){
'use strict'

var global = window

// Test if we are within a foreign domain. Use raf from the top if possible.
try {
    // Accessing .name will throw SecurityError within a foreign domain.
    global.top.name
    global = global.top
} catch(e) {}

exports.request = global.requestAnimationFrame
exports.cancel = global.cancelAnimationFrame || global.cancelRequestAnimationFrame
exports.supported = false

var vendors = ['Webkit', 'Moz', 'ms', 'O']

// Grab the native implementation.
for (var i = 0; i < vendors.length && !exports.request; i++) {
    exports.request = global[vendors[i] + 'RequestAnimationFrame']
    exports.cancel = global[vendors[i] + 'CancelAnimationFrame'] ||
        global[vendors[i] + 'CancelRequestAnimationFrame']
}

// Test if native implementation works.
// There are some issues on ios6
// http://shitwebkitdoes.tumblr.com/post/47186945856/native-requestanimationframe-broken-on-ios-6
// https://gist.github.com/KrofDrakula/5318048

if (exports.request) {
    exports.request.call(null, function() {
        exports.supported = true
    });
}

},{}],4:[function(require,module,exports){
'use strict'

/**
 * Crossplatform Date.now()
 *
 * @return {Number} time in ms
 * @api private
 */
module.exports = Date.now || function() {
    return (new Date).getTime()
}

},{}],5:[function(require,module,exports){
'use strict'

var now = require('./now')

/**
 * Replacement for PerformanceTiming.navigationStart for the case when
 * performance.now is not implemented.
 *
 * https://developer.mozilla.org/en-US/docs/Web/API/PerformanceTiming.navigationStart
 *
 * @type {Number}
 * @api private
 */
exports.navigationStart = now()

},{"./now":4}],6:[function(require,module,exports){
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


},{"./now":4,"./performance-timing":5}]},{},[1])(1)
});