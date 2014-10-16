//Derived from https://developer.mozilla.org/en-US/docs/Web/API/WebRTC_API/Taking_still_photos and
//https://github.com/samdutton/simpl/blob/master/getusermedia/sources/js/main.js
navigator.getUserMedia = navigator.getUserMedia ||  navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
export default Ember.Component.extend({
    showCameraSelect: false,
    canvas: null,
    video: null, 
    photo: null,
    width: 200,
    height: 0,
    selectedCamera: Ember.computed.alias('parentView.model.selectedCamera'),
    videoSources: null,
    
    /***
     * Setup the specified camera
     */
    _cameraChange: function() {
        var video = this.get('video');
        if (!!window.stream) {
            video.src = null;
            window.stream.stop();
        }        
        var videoSource = this.get('selectedCamera');
        var constraints = {
            audio: false,
            video: {
                optional: [{sourceId: videoSource}]
            }
        };
        navigator.getUserMedia(constraints, this._gotStream.bind(this), this._errorCallback);
        this._setupVideo();
    }.observes('parentView.model.selectedCamera'),    
        
    /***
     * Callback for MediaStreamTrack.getSources
     */
    _gotSources: function(sourceInfos) {
        var cameraCount = 0,
            cameraLabel,
            videoSources = [];
        for (var i = 0; i !== sourceInfos.length; ++i) {
            var sourceInfo = sourceInfos[i];
            if (sourceInfo.kind === 'video') {
                cameraLabel = 'Camera ' + (++cameraCount);
                if (sourceInfo.label) {
                    cameraLabel += ' ('+sourceInfo.label + ')';
                }
                videoSources.addObject({
                    id: sourceInfo.id,
                    label: cameraLabel
                });
            }
        }
        this.set('videoSources', videoSources);
        if (videoSources.length > 0) {
            this.set('selectedCamera',videoSources[0].id);
            if (videoSources.length === 1) {
                this.set('showCameraSelect', false);
            } else {
                this.set('showCameraSelect', true);
            }
            this._cameraChange();
        }
    },

    /***
     * Setup the dimensions for the video preview and picture elements.
     */
    _setupVideo: function() {
        var canvas = this.get('canvas'),
            height = this.get('height'),
            video = this.get('video'),
            width = this.get('width');
        height = video.videoHeight / (video.videoWidth/width);
        video.setAttribute('width', width);
        video.setAttribute('height', height);
        canvas.setAttribute('width', width);
        canvas.setAttribute('height', height);
        this.setProperties({
            height: height,
            width: width
        });
    },
    
    /***
     * Callback handler for getUserMedia.
     */
    _gotStream: function(stream) {
        var video = this.get('video');
        window.stream = stream; // make stream available to console
        video.src = window.URL.createObjectURL(stream);
        video.play();
    },

    _errorCallback: function(error){
        console.log("navigator.getUserMedia error: ", error);
    },
                                      
    actions: {
        takePhoto: function () {
            var canvas = this.get('canvas'),
                height = this.get('height'),                
                video = this.get('video'),
                width = this.get('width');            
            canvas.width = width;
            canvas.height = height;
            canvas.getContext('2d').drawImage(video, 0, 0, width, height);
            //var data = canvas.toDataURL('image/png');            
        }
    },
                            
    canCaptureVideo: function() {
        if (navigator.getUserMedia) {
            return true;
        } else {
            return false;
        }
    }.property(),
    
    didInsertElement: function() {
        var canvas = this.$('canvas')[0],
            photo = this.$('img')[0],
            video = this.$('video')[0];
    
        this.setProperties({
            canvas: canvas,
            photo: photo,
            video: video
        });
        if (typeof MediaStreamTrack === 'undefined' || MediaStreamTrack.getSources === 'undefined' ){
            this.set('showCameraSelect', false);
            if (navigator.getUserMedia) {
                navigator.getUserMedia({audio: false,video: true}, this._gotStream.bind(this), this._errorCallback);
            }
        } else {
          MediaStreamTrack.getSources(this._gotSources.bind(this));
        }
        video.addEventListener('canplay', this._setupVideo.bind(this), false);
    
    }
});