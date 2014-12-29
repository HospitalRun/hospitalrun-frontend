import Ember from "ember";
var LoginController = Ember.Controller.extend(Ember.SimpleAuth.LoginControllerMixin, {
     authenticatorFactory: 'authenticators:custom',

     actions: {
         // display an error when logging in fails
         sessionAuthenticationFailed: function(message) {
           this.set('errorMessage', message);
         },

         // handle login success
         sessionAuthenticationSucceeded: function() {
             this.set('errorMessage', "");
             this.set('identification', "");
             this.set('password', "");
             this._super();
         }
     }
 }
);

export default LoginController;
