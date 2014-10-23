import Ember from 'ember';
import Resolver from 'ember/resolver';
import loadInitializers from 'ember/load-initializers';

Ember.MODEL_FACTORY_INJECTIONS = true;

var App = Ember.Application.extend({    
    modulePrefix: 'hospitalrun', // TODO: loaded via config
    Resolver: Resolver
});

loadInitializers(App, 'hospitalrun');

window.onerror = function(errorMsg, url, lineNumber, colno, error) {
    var errorMessage = "Error Occurred: "+errorMsg;
    if (url) {
        errorMessage += "; url:"+url;
    }
    if (lineNumber) {
        errorMessage += "; line:"+lineNumber;
    }
    if (colno) {
        errorMessage += "; colno:"+colno;
    }
    if (error && error.stack) {
        errorMessage += "; stack:"+error.stack;
    }
    console.log("UNCAUGHT ERROR IN APPLICATION: "+errorMessage);
};

export default App;
