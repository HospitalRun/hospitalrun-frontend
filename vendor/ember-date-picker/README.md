ember-date-picker
=================

A lightweight, mobile-optimized, date picker component for ember.js applications.

**DISCLAIMER:** This is beta software and has yet to be battle tested in a wide range of environments. As such, it should be used with caution in production apps. If you encounter any bugs or browser-specific anomalies, please submit an issue or a pull request. Thanks!

Demo
----

http://billdami.com/ember-date-picker/

Features
--------

* Lightweight (~4k javascript / ~1k css, minified and gzipped, including dependencies)
* Spin box style UI for fast date selection (built using [ember-spin-box](https://github.com/billdami/ember-spin-box)</a>)
* Supports mousewheel, keyboard, and touch-based control
* Mobile-optimized slide-up panel UI on small screens (480px width and below)
* i18n/l10n support
* Optional integration with [moment.js](http://momentjs.com/)
* Works well with Bootstrap 3

Installation
------------

1. `bower install ember-date-picker` or grab the files in `dist/`.
2. Install [ember-spin-box](https://github.com/billdami/ember-spin-box) dependency (will already be downloaded if you used bower on step 1)
2. Add `dist/ember-date-picker.min.js` to your application's javascript assets.
3. Add `dist/ember-date-picker.min.css` to your application's css assets. Or if you use LESS, and intend to customize the component's styles, you can import `lib/styles/ember-date-picker.less`.
4. **Optional:** Install [moment.js](http://momentjs.com/) to enable custom date format parsing/output.

Usage
-----

ember-date-picker is comprised of several sub-components, namely `{{date-picker-input}}` and `{{date-picker-controls}}`, for optimal efficiency and compatibility with a wide range of application structures, especially when a view contains multiple date pickers (the inputs may share a a single instance of `{{date-picker-controls}}`). With this in mind, the minimum required syntax for rendering a date picker is as follows:

```
{{date-picker-input controls="my-datepicker" value=myDate}}
{{date-picker-controls id="my-datepicker"}}
```

The `controls` parameter of the `{{date-picker-input}}` must reference the `id` of an existing `{{date-picker-controls}}` component. Note that the `id` given to the `{{date-picker-controls}}` is also used as its HTML id attribute value, so make sure that it is unique!

`{{date-picker-input}}` Parameters
-------

* **Any valid HTML text input element attribute**  
  Since `{{date-picker-input}}` renders a regular text input element, any valid HTML attribute (e.g. `value`,  `class`, `placeholder`, ect) may be provided.
* **controls** (`string`, required)  
  The `id` of the `{{date-picker-controls}}` component that the input is associated with.
* **dateFormat** (`string`)  
  The format for parsed and displayed dates (i.e. the input's value). This parameter **will only be used if moment.js is installed**, otherwise the native [Date.parse()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/parse) and [Date.toLocaleDateString()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/toLocaleDateString) functions will be used to parse and format dates, respectively. See the [moment.js docs](http://momentjs.com/docs/#/parsing/string-format/) for all available formatting tokens.
* **minYear** (`int|string|bool`, default: `false`)  
  The minimum selectable year. When set to `false`, there is no minimum year. A string value may be provided to specify a year relative to the current date (e.g. `"-10"`, or `"+25"`).
* **maxYear** (`int|string|bool`, default: `false`)  
  The maximum selectable year. When set to `false`, there is no maximum year. A string value may be provided to specify a year relative to the current date (e.g. `"-10"`, or `"+25"`).
* **onUpdate** (`string`)  
  The name of an action to send when the input's value has been updated. The new value is sent as the action's only parameter.

`{{date-picker-controls}}` Parameters
-------

* **id** (`string`, required)  
  A unique identifier that `{{date-picker-input}}` uses to associate with the component via its `controls` parameter.
* **i18n** (`object`)  
  Localized text strings for the controls UI. If provided, this parameter must match exactly the structure of the default i18n object below:  

  ```
  {
    done: "Done",
    clear: "Clear",
    today: "Today",
    monthNames: [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ]
  }
  ```
* **dateFormat** (`string`)  
  The default date format for the `{{date-picker-controls}}` component. If an associated `{{date-picker-input}}` specifies its own `dateFormat`, it will override this setting while that input is active.
* **minYear** (`int|string|bool`, default: `false`)  
  The default minimum year for the `{{date-picker-controls}}` component. If an associated `{{date-picker-input}}` specifies its own `minYear`, it will override this setting while that input is active.
* **maxYear** (`int|string|bool`, default: `false`)  
  The default maximum year for the `{{date-picker-controls}}` component. If an associated `{{date-picker-input}}` specifies its own `maxYear`, it will override this setting while that input is active.
