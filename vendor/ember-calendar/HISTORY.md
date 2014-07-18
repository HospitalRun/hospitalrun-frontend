1.0.0 / 2013-10-11
==================

* Add daily view and view switching.
* Add convertible example demonstrating view switching.
* Add distribution scripts with precompiled templates.
* BREAKING: Rename `Ember.Calendar.CalendarView` to `Ember.Calendar.ContainerView`; add new `Ember.Calendar.CalendarView` that wraps (optional) view switching buttons and calendar body.
* BREAKING: Rename weekly view template: `ember-calendar` to `ember-calendar-week`.
* BREAKING: Rename keys related to weekly view in Ember.Calendar.CalendarController: `dayViewClass` to `weekDayViewClass`, `headingDateViewClass` to `weekHeadingDateViewClass`, `dates` to `weekDates`, `days` to `weekDays`.
* Update build script to use node and npm modules only.