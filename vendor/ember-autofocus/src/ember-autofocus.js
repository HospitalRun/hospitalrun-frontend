;(function(){
    // my own namespace = my own clutter
    window.AndreasPizsa = window.AndreasPizsa || {};
    AndreasPizsa.Ember = AndreasPizsa.Ember || {};

    AndreasPizsa.Ember.ViewAutofocus = Ember.View.extend({
      attributeBindings : ['on','scrolling'],
      useScheduling     : true,
      on                : null,
      scrolling         : false,
      hasNativeAutofocus: ('autofocus' in document.createElement('input')),
      useNativeAutofocus: false,

      scheduleAutofocus: function() {
        if(this.hasNativeAutofocus &&
            (this.useNativeAutofocus=Em.$('[autofocus]').length>0))
        {
            return;
        }

        if (this.useScheduling) {
          Ember.run.scheduleOnce('afterRender', this, this.autofocus);
        } else {
          this.autofocus();
        }
      }.on('didInsertElement'),

      preventScrolling : function() {
        if(!this.scrolling) {
            window.scrollTo(0,0);
            window.setTimeout(function(){window.scrollTo(0,0);},100);
        }
      }.on('didInsertElement'),

      autofocus: (function() {
        var selector = this.on;
        if (selector === null) {
          selector = 'input[autofocus],textarea[autofocus],button[autofocus]';
          if (Em.$(selector).length === 0) {
            selector = 'input';
          }
        }
        var scrollX = window.scrollX, scrollY = window.scrollY;
        Em.$(selector).first().select().focus();
        window.scrollTo(scrollX, scrollY);
      })
    });

    Ember.Handlebars.helper('autofocus', AndreasPizsa.Ember.ViewAutofocus);
    Ember.TextField.reopen({
      attributeBindings: ['autofocus']
    });
}());
