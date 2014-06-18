ember-spin-box
=================

A lightweight and versatile spin box component for ember.js applications.

**DISCLAIMER:** This is beta software and has yet to be battle tested in a wide range of environments. As such, it should be used with caution in production apps. If you encounter any bugs or browser-specific anomalies, please submit an issue or a pull request. Thanks!

Demo
----

http://billdami.com/ember-spin-box/

Features
--------

* Tiny footprint (~3.5k javascript / <1k css, minified and gzipped)
* Supports mousewheel, keyboard, and touch-based interaction
* Flexible list options configuration, provide an array of items or a numeric range
* Exposes parameters to allow external control
* Minimal base CSS that is easy to extend and customize

Installation
------------

1. `bower install ember-spin-box` or grab the files in `dist/`.
2. Add `dist/ember-spin-box.min.js` to your application's javascript assets.
3. Add `dist/ember-spin-box.min.css` to your application's css assets. Or if you use LESS, and intend to customize the component's styles, you can import `lib/styles/ember-spin-box.less`.

Usage
-----

At minimum, ember-spin-box must either have a `content` parameter set to an array of list options, or a `range` parameter set to numeric range (see the "Parameters" section below for more info on how to define the range). In most cases, you will also want to provide a `value` parameter, which is what the spin box uses as its initial selected value, and is updated as the current selection changes. Here is a basic example of rendering a spin box:

```
{{spin-box content=spinBoxItems value=spinBoxValue}}
```

Where `spinBoxItems` references an array of items to use as the spin box's options, and `spinBoxValue` references the currently selected option, e.g.:

```
App.ApplicationController = Ember.ObjectController.extend({
  spinBoxItems: ["foo", "bar", "baz"],
  spinBoxValue: "bar"
});
```

Parameters
----------
* **content** (`array`, default: `undefined`)  
  An array of values to use as the spin box's options. A spin box must either have a value for `content` or `range` (if both are provided, `content` takes precendence).
* **range** (`array`, default: `undefined`)  
  A numeric range to use as the spin box's options, specified as an array in the form of `[start, end]` where `start` and `end` are integer values that define the lowest and highest values respectively (e.g. `[1900, 2014]`).
* **value** (`mixed`, default: `null`)  
  The spin box's initially selected value (if it exists in the provided `content` or `range`). If this parameter is bound to a property, it will be updated as the spin box's selection changes.
* **visibleRows** (`int`, default: `5`)  
  The number of option rows that are visible to the user. This value **must be an odd number** so that there is a middle row, which indicates the currently selected value.
* **rowHeight** (`int`, default: `28`)  
  The height, in pixels, of each option row (including padding, margin, border, ect.). If you modify this value, make sure you adjust the relevant CSS properties associated with the `.spinbox-row`  class. This value, in conjunction with `visibleRows`, determines the total height of the spin box.
* **circular** (`bool`, default: `true`)  
  When set to false, the spin box's options list will not be circular, i.e. moving downwards from the last option will **not** cycle back to the first item, and vice versa.
* **tabindex** (`int`, default: `null`)  
  Sets the spin box container element's `tabindex` attribute. Providing a positive integer value allows the spin box to be focusable, enabling keyboard-based interaction (up/down arrows).
* **spinUpWhen** (`bool`, default: `undefined`)  
  When the bound property is set to `true`, the spin box will be "spun" upward, and the previous option will be selected. Useful for allowing interaction with the spin box from other parts of you application's interface (see demo for examples).
* **spinDownWhen** (`bool`, default: `undefined`)  
  When the bound property is set to `true`, the spin box will be "spun" downward, and the next option will be selected.
* **onUpdate** (`string`)  
  The name of an action to send when the spin box's value has been updated via the interface. The new value, and the new value's index are sent as the action's two parameters.
