(function(root, factory) {
    if(typeof define === 'function' && define.amd) {
        define(['ember'], function(Ember) { return factory(Ember); });
    } else if(typeof exports === 'object') {
        module.exports = factory(require('ember'));
    } else {
        root.DatePickerControlsComponent = factory(Ember);
    }
})(this, function(Ember) {

    var DatePickerControlsComponent = Ember.Component.extend({
        classNames: ['datepicker-controls'],
        classNameBindings: ['_isOpen:shown', '_animate:animate'],
        layoutName: 'components/date-picker-controls',
        animateDuration: 300,
        repeatInterval: 150,
        repeatDelay: 500,

        _defaults: {
            minYear: false,
            maxYear: false,
            dateFormat: null,
            i18n: {
                done: "Done",
                clear: "Clear",
                today: "Today",
                monthNames: [
                    "January", "February", "March", "April", "May", "June", 
                    "July", "August", "September", "October", "November", "December"
                ]
            }
        },

        _isOpen: false,
        _animate: false,
        _currentTarget: null,
        _currentMonth: null,
        _currentDay: null,
        _currentYear: null,

        setConfig: function() {
            //sanity check provided settings/set defaults where necessary
            var config = {};
            if(Ember.isEmpty(this.get('minYear'))) config.minYear = this.get('_defaults.minYear');
            if(Ember.isEmpty(this.get('maxYear'))) config.maxYear = this.get('_defaults.maxYear');
            if(Ember.isBlank(this.get('dateFormat'))) config.dateFormat = this.get('_defaults.dateFormat');
            if(Ember.isEmpty(this.get('i18n'))) config.i18n = this.get('_defaults.i18n');

            //allow relative minYear/maxYear values to the current year (e.g. "-100", "+50")
            config.minYear = this.convertRelativeYear(this.get('minYear'));
            config.maxYear = this.convertRelativeYear(this.get('maxYear'));

            this.setProperties(config);
        }.on('init'),

        setup: function() {
            this.$el = this.$();
            Ember.$(document).on('click.date-picker-events', Ember.run.bind(this, this.handleDocClick));
        }.on('didInsertElement'),

        teardown: function() {
            Ember.$(document).off('.date-picker-events');
        }.on('willDestroyElement'),

        handleDocClick: function(e) {
            if(this.get('_currentTarget') && 
                e.target !== this.get('_currentTarget').$el.get(0) && 
                !Ember.$.contains(this.$el.get(0), e.target)) {
                this.closePicker();
            }
        },

        handleKeyDown: function(e) {
            switch(e.keyCode) {
                //enter
                case 13:
                    this.updateValue();
                    this.closePicker();
                    break;
                //esc
                case 27:
                    this.closePicker();
                    break;
            }
        }.on('keyDown'),

        convertRelativeYear: function(relValue) {
            if(typeof relValue !== 'string') {
                return relValue;
            }

            relValue = parseInt(relValue, 10);
            return !isNaN(relValue) ? new Date().getFullYear() + relValue : false;
        },

        getMonthIndex: function(monthName) {
            var months = this.get('i18n.monthNames'),
                index = months.indexOf(monthName);
            return index === -1 ? 0 : index;
        },

        getMonthName: function(index) {
            return this.get('i18n.monthNames')[index];
        },

        months: function() {
            return this.get('i18n.monthNames');
        }.property('i18n'),

        days: function() {
            var days = [],
                daysInMonth = this.getDaysInMonth(this.get('_currentYear'), this.getMonthIndex(this.get('_currentMonth')));

            for(var i=1; i<=daysInMonth; i++) {
                days.push(i);
            }

            return days;
        }.property('_currentMonth', '_currentYear'),

        years: function() {
            var min = this.get('minYear'),
                max = this.get('maxYear');
            return [typeof min === 'number' ? min : 1, typeof max === 'number' ? max : 9999];
        }.property('minYear', 'maxYear'),

        openPicker: function(target) {
            var date;
            if(!target) return;
            this.set('_currentTarget', target);

            //if the input component defines is own settings, use them instead of the control component's settings
            this.setProperties({
                inputMinYear: typeof target.get('minYear') !== 'undefined' ? this.convertRelativeYear(target.get('minYear')) : undefined,
                inputMaxYear: typeof target.get('maxYear') !== 'undefined' ? this.convertRelativeYear(target.get('maxYear')) : undefined,
                inputDateFormat : !Ember.isBlank(target.get('dateFormat')) ? target.get('dateFormat') : undefined
            });

            try {
                date = this.parseDate(target.get('value'), this.getConfig('dateFormat'));
            } catch(e) {
                date = null;
            }

            this.setCurrentValue(date);
            this.positionPicker(target.$el);
            this.set('_isOpen', true);
            Ember.run.next(this, function() {
                this.set('_animate', true);
            });
        },

        closePicker: function() {
            this.setProperties({
                _animate: false,
                _currentTarget: false
            });

            Ember.run.later(this, function() {
                this.set('_isOpen', false);
            }, this.get('animateDuration'));
        },

        positionPicker: function(inputEl) {
            if(!inputEl) return;

            var offset = inputEl.position(),
                height = inputEl.outerHeight();

            this.$el.css({
                top: (offset.top + height) + 'px',
                left: offset.left + 'px'
            });
        },

        selectedDate: function() {
            var month = this.getMonthIndex(this.get('_currentMonth')),
                year = this.get('_currentYear'),
                daysInMonth = this.getDaysInMonth(year, month),
                day = this.get('_currentDay') > daysInMonth ? 1 : this.get('_currentDay');

            return this.formatDate(new Date(year, month, day), this.getConfig('dateFormat'));
        }.property('dateFormat', 'inputDateFormat', '_currentMonth', '_currentDay', '_currentYear'),

        clearValue: function() {
            if(!this.get('_currentTarget')) return;
            this.get('_currentTarget').set('value', null);
            this.get('_currentTarget').sendAction('onUpdate', null);
        },

        updateValue: function() {
            var formattedDate = this.get('selectedDate');
            if(!this.get('_currentTarget')) return;
            this.get('_currentTarget').set('value', formattedDate);
            this.get('_currentTarget').sendAction('onUpdate', formattedDate);
        },

        setCurrentValue: function(date, updateValue) {
            //if a date is not provided or is invalid, default to the current date
            date = date || new Date();

            this.setProperties({
                _currentMonth: this.getMonthName(date.getMonth()),
                _currentYear: date.getFullYear()
            });

            Ember.run.scheduleOnce('sync', this, function() {
                this.set('_currentDay', date.getDate());
                if(updateValue) {
                    this.updateValue();
                }
            });
        },

        getConfig: function(prop) {
            var inputProp = 'input' + Ember.String.capitalize(prop);
            return this.get(typeof this.get(inputProp) !== 'undefined' ? inputProp : prop);
        },

        getDaysInMonth: function(year, month) {
            return 32 - this.daylightSavingAdjust(new Date(year, month, 32)).getDate();
        },

        daylightSavingAdjust: function(date) {
            if(!date) {
                return null;
            }

            date.setHours(date.getHours() > 12 ? date.getHours() + 2 : 0);
            return date;
        },

        parseDate: function(dateString, format) {
            var date;
            if(this.get('hasMoment')) {
                date = Ember.isBlank(format) ? moment(dateString) : moment(dateString, format);
                date = !date.isValid() ? null : date.toDate();
            } else {
                date = Date.parse(dateString);
                date = isNaN(date) ? null : new Date(date);
            }

            return date;
        },

        formatDate: function(date, format) {
            var formattedDate = null;

            if(!Ember.isNone(date)) {
                formattedDate = this.get('hasMoment') ?
                    moment(date).format(Ember.isBlank(format) ? 'l' : format) :
                    date.toLocaleDateString();
            }

            return formattedDate;
        },

        hasMoment: function() {
            return typeof moment === 'function';
        }.property(),

        actions: {
            clear: function() {
                this.clearValue();
                this.closePicker();
            },

            done: function() {
                this.updateValue();
                this.closePicker();
            },

            today: function() {
                this.setCurrentValue(null, true);
            },

            spinBoxUpdate: function(newVal) {
                this.updateValue();
            }
        }
    });

    return DatePickerControlsComponent;
});
(function(root, factory) {
    if(typeof define === 'function' && define.amd) {
        define(['ember'], function(Ember) { return factory(Ember); });
    } else if(typeof exports === 'object') {
        module.exports = factory(require('ember'));
    } else {
        root.DatePickerInputComponent = factory(Ember);
    }
})(this, function(Ember) {
    
    var DatePickerInputComponent = Ember.Component.extend({
        tagName: 'input',
        attributeBindings: ['type', 'value', 'readonly', 'placeholder'],
        classNames: ['datepicker-input'],
        type: 'text',
        readonly: true,
        placeholder: null,
        value: null,
        picker: false,

        setup: function() {
            var controlsCmp = Ember.View.views[this.get('controls')];
            this.$el = this.$();

            if(controlsCmp && typeof controlsCmp.openPicker === 'function') {
                this.set('picker', controlsCmp);
            }
        }.on('didInsertElement'),

        handleFocusIn: function(e) {
            if(!this.get('picker')) return;
            this.get('picker').openPicker(this);
        }.on('focusIn'),

        handleKeyDown: function(e) {
            if(!this.get('picker')) return;
            if(e.keyCode == 27) {
                this.get('picker').closePicker();
                this.$el.blur();
            }
        }.on('keyDown')
    });

    return DatePickerInputComponent;
});
(function(root, factory) {
    if(typeof define === 'function' && define.amd) {
        define(['ember'], function(Ember) { return factory(Ember); });
    } else if(typeof exports === 'object') {
        factory(require('ember'));
    } else {
        factory(Ember);
    }
})(this, function(Ember) {


Ember.TEMPLATES["components/date-picker-controls"]=Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Ember.Handlebars.helpers); data = data || {};
  var buffer = '', stack1, helper, options, escapeExpression=this.escapeExpression, helperMissing=helpers.helperMissing;


  data.buffer.push("<div class=\"datepicker-controls-inner\">\n    <div class=\"datepicker-toolbar datepicker-clearfix\">\n        <button class=\"btn btn-default datepicker-btn datepicker-btn-today datepicker-left\" ");
  data.buffer.push(escapeExpression(helpers.action.call(depth0, "today", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["STRING"],data:data})));
  data.buffer.push(">");
  stack1 = helpers._triageMustache.call(depth0, "i18n.today", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("</button>\n        <button class=\"btn btn-primary datepicker-btn datepicker-btn-done datepicker-right\" ");
  data.buffer.push(escapeExpression(helpers.action.call(depth0, "done", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["STRING"],data:data})));
  data.buffer.push(">");
  stack1 = helpers._triageMustache.call(depth0, "i18n.done", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("</button>\n        <button class=\"btn btn-default datepicker-btn datepicker-btn-clear datepicker-right\" ");
  data.buffer.push(escapeExpression(helpers.action.call(depth0, "clear", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["STRING"],data:data})));
  data.buffer.push(">");
  stack1 = helpers._triageMustache.call(depth0, "i18n.clear", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("</button>\n    </div>\n    <div class=\"datepicker-cols-ct\">\n        <div class=\"datepicker-cols datepicker-clearfix\">\n            <div class=\"datepicker-col datepicker-col-month\">\n                ");
  data.buffer.push(escapeExpression((helper = helpers['spin-box'] || (depth0 && depth0['spin-box']),options={hash:{
    'content': ("months"),
    'value': ("_currentMonth"),
    'onUpdate': ("spinBoxUpdate"),
    'rowHeight': (32),
    'tabindex': (1)
  },hashTypes:{'content': "ID",'value': "ID",'onUpdate': "STRING",'rowHeight': "INTEGER",'tabindex': "INTEGER"},hashContexts:{'content': depth0,'value': depth0,'onUpdate': depth0,'rowHeight': depth0,'tabindex': depth0},contexts:[],types:[],data:data},helper ? helper.call(depth0, options) : helperMissing.call(depth0, "spin-box", options))));
  data.buffer.push("\n            </div>\n            <div class=\"datepicker-col datepicker-col-day\">\n                ");
  data.buffer.push(escapeExpression((helper = helpers['spin-box'] || (depth0 && depth0['spin-box']),options={hash:{
    'content': ("days"),
    'value': ("_currentDay"),
    'onUpdate': ("spinBoxUpdate"),
    'rowHeight': (32),
    'tabindex': (2)
  },hashTypes:{'content': "ID",'value': "ID",'onUpdate': "STRING",'rowHeight': "INTEGER",'tabindex': "INTEGER"},hashContexts:{'content': depth0,'value': depth0,'onUpdate': depth0,'rowHeight': depth0,'tabindex': depth0},contexts:[],types:[],data:data},helper ? helper.call(depth0, options) : helperMissing.call(depth0, "spin-box", options))));
  data.buffer.push("\n            </div>\n            <div class=\"datepicker-col datepicker-col-year\">\n                ");
  data.buffer.push(escapeExpression((helper = helpers['spin-box'] || (depth0 && depth0['spin-box']),options={hash:{
    'range': ("years"),
    'value': ("_currentYear"),
    'onUpdate': ("spinBoxUpdate"),
    'rowHeight': (32),
    'tabindex': (3)
  },hashTypes:{'range': "ID",'value': "ID",'onUpdate': "STRING",'rowHeight': "INTEGER",'tabindex': "INTEGER"},hashContexts:{'range': depth0,'value': depth0,'onUpdate': depth0,'rowHeight': depth0,'tabindex': depth0},contexts:[],types:[],data:data},helper ? helper.call(depth0, options) : helperMissing.call(depth0, "spin-box", options))));
  data.buffer.push("\n            </div>\n        </div>\n    </div>\n</div>");
  return buffer;
  
});

});
(function(root, factory) {
    if(typeof define === 'function' && define.amd) {
        define([
            'ember',
            './components/date-picker-controls.js',
            './components/date-picker-input.js',
        ], function(Ember, Controls, Input) { 
            return factory(Ember, Controls, Input); 
        });
    } else if(typeof exports === 'object') {
        module.exports = factory(
            require('ember'),
            require('./components/date-picker-controls.js'),
            require('./components/date-picker-input.js')
        );
    } else {
        factory(
            Ember,
            root.DatePickerControlsComponent,
            root.DatePickerInputComponent
        );
    }
})(this, function(Ember, Controls, Input) {

    Ember.Application.initializer({
        name: 'date-picker',
        initialize: function(container, application) {
            container.register('component:date-picker-controls', Controls);
            container.register('component:date-picker-input', Input);
        }
    });

    return {
        DatePickerControls: Controls,
        DatePickerInput: Input
    };
});