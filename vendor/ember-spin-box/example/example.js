var App = Ember.Application.create({});

App.ApplicationController = Ember.ObjectController.extend({
    curContent: 'numbers',
    numbers: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'],
    periods: ['AM', 'PM'],
    range: [1900, 2000],

    spinBoxContent: function() {
        return this.get(this.get('curContent'));
    }.property('curContent'),

    spinboxValue: '3',
    spinboxUp: false,
    spinboxDown: false,
    

    actions: {
        spinboxUpdate: function(value, index) {
            //console.log('spinbox updated (new value: ' + value + ', new index: ' + index + ')');
        },

        switchValues: function(type) {
            this.set('curContent', type);
        },

        spinUp: function() {
            this.set('spinboxUp', true);
        },

        spinDown: function() {
            this.set('spinboxDown', true);
        }
    }
});