//Derived from https://developer.mozilla.org/en-US/docs/Web/API/WebRTC_API/Taking_still_photos and
//https://github.com/samdutton/simpl/blob/master/getusermedia/sources/js/main.js
navigator.getUserMedia = navigator.getUserMedia ||  navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
export default Ember.Component.extend({
    showCameraSelect: false,
    canvas: null,
    video: null, 
    photo: null,    
    streaming: false,
    width: 200,
    height: 0,
    selectedCamera: null,
    videoSources: [],

    _setup: function() {        
        if (typeof MediaStreamTrack === 'undefined'){
            this.showCameraSelect = false;
        } else {
          MediaStreamTrack.getSources(this._gotSources.bind(this));
        }        
    }.on('init'),
    
    _gotSources: function(sourceInfos) {
        var cameraCount = 0,
            videoSources = this.get('videoSources');
        for (var i = 0; i !== sourceInfos.length; ++i) {
            var sourceInfo = sourceInfos[i];
            if (sourceInfo.kind === 'video') {
                videoSources.addObject({
                    id: sourceInfo.id,
                    label: sourceInfo.label || 'camera ' + (++cameraCount)
                });
            }
        }
    },
    
    _setupVideo: function() {
        var canvas = this.get('canvas'),
            height = this.get('height'),
            streaming = this.get('streaming'),
            video = this.get('video'),
            width = this.get('width');
        if (!streaming) {
            height = video.videoHeight / (video.videoWidth/width);
            video.setAttribute('width', width);
            video.setAttribute('height', height);
            canvas.setAttribute('width', width);
            canvas.setAttribute('height', height);
            streaming = true;
            this.setProperties({
                height: height,
                streaming: streaming,
                width: width
            });
        }
    },
    
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
    }.observes('selectedCamera'),
    
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
            //photo.setAttribute('src', data);
        }
    },
                            
    
    didInsertElement: function() {
        var canvas = this.$('canvas')[0],
            photo = this.$('img')[0],
            video = this.$('video')[0];
    
        this.setProperties({
            canvas: canvas,
            photo: photo,
            video: video
        });
        video.addEventListener('canplay', this._setupVideo.bind(this), false);
    
    }
});