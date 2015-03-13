import couchOauthSign from "hospitalrun/utils/couch-oauth-sign";

export default function(configs) {
    function PouchOauthXHR(objParameters) {
        this.internalXHR = new XMLHttpRequest(objParameters);
        this.requestHeaders = {
        };
        this.upload = this.internalXHR.upload;
    }

    PouchOauthXHR.prototype = {
        _decodeParameters: function(param_string, current_params) {
            var return_params = current_params || {},
            params = decodeURIComponent(param_string).split('&'),
            param_parts,
            i;
            for (i=0;i<params.length;i++) {
                param_parts = params[i].split('=');
                return_params[param_parts[0]] =param_parts[1];            
            }
            return return_params;
        },

        abort: function() {
            this.internalXHR.abort();        
        },

        oauth: configs,

        getAllResponseHeaders: function() {
            return this.internalXHR.getAllResponseHeaders();
        },

        getResponseHeader: function(header) {
            return this.internalXHR.getResponseHeader(header);
        },

        open: function(method, url, async, user, password) {
            this.method = method;
            this.url = url;
            if (async !== undefined) {
                this.async = async;
            } else {
                   this.async = true;
            }            
            this.user = user;
            this.password = password;
            if(url.indexOf("?") > 0) {
                var url_params = url.split("?");
                if (this.method === 'POST' || this.method === 'GET') {                
                    this.url = url_params[0];
                }
                this.params = this._decodeParameters(url_params[1]);            
            }
        },

        send: function(data) {
            if (this.signOauth !== undefined) {            
                this.params = this.signOauth(this.params);
                if (this.method === 'POST' || this.method === 'GET') {                
                    if (this.params !== undefined ) {                    
                        this.url = this.url + '?'+ decodeURIComponent($.param( this.params ));
                    }
                } else {
                    var oauth_header = 'OAuth realm=""';
                    for (var parameter in this.params) {
                        if (parameter.indexOf("oauth_") === 0) {                        
                            oauth_header += ', '+parameter+'="'+this.params[parameter]+'"';
                        }
                    }
                    this.requestHeaders['Authorization'] = oauth_header;
                }         
            }

            this.internalXHR.open(this.method, this.url, this.async, this.user, this.password);

            for (var header in this.requestHeaders) {
                this.internalXHR.setRequestHeader(header, this.requestHeaders[header]);
            }

            if (this.withCredentials !== undefined) {
                this.internalXHR.withCredentials = this.withCredentials;
            }
            if (this.responseType !== undefined) {
                this.internalXHR.responseType = this.responseType;
            } 

            if (this.timeout  !== undefined) {
                this.internalXHR.timeout = this.timeout;
            }
            if (this.ontimeout  !== undefined) {
                this.internalXHR.ontimeout = this.ontimeout;
            }
            this.readyState = this.internalXHR.readyState;
            this.status = this.internalXHR.status;
            if (this.onreadystatechange !== undefined) {
                var xhrwrapper = this;
                this.internalXHR.onreadystatechange = function() {
                    if (this.readyState === 4 && status === 0) {
                        console.log("wrapper readystatechange fired with xhr state and status:",this.readyState, this.status);
                        console.log("URL WAS: "+this.url,this);
                    }
                    xhrwrapper.readyState = this.readyState;
                    xhrwrapper.response = this.response;
                    xhrwrapper.responseText = this.responseText;
                    xhrwrapper.responseType = this.responseType;
                    xhrwrapper.responseXML = this.responseXML;
                    xhrwrapper.status = this.status;
                    xhrwrapper.statusText = this.statusText;
                    xhrwrapper.onreadystatechange();
                };
            }
            this.internalXHR.send(data);
        },

        setRequestHeader: function(header, value) {
            this.requestHeaders[header] = value;
        },
        
        signOauth: function(params) {
            var signature_url = this.url,
                dblocation = this.url.indexOf('/db/');
            if (dblocation > -1) {            
                signature_url = 'http://localhost:5984/' + this.url.substring(dblocation+4);
            }

            params = couchOauthSign(signature_url, {
                    consumerKey: this.oauth.config_consumer_key,
                    consumerSecret:  this.oauth.config_consumer_secret,
                    token: this.oauth.config_oauth_token,
                    tokenSecret: this.oauth.config_token_secret,
                    type: this.method,
                    requestParams: params
            });
            return params;
        }
    };

    return PouchOauthXHR;
}
