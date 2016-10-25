const takeAPicture = 'Take a Picture';
const uploadAFile = 'Upload a File';

import Ember from 'ember';
// Derived from https://developer.mozilla.org/en-US/docs/Web/API/WebRTC_API/Taking_still_photos and
// https://github.com/samdutton/simpl/blob/master/getusermedia/sources/js/main.js
navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
export default Ember.Component.extend({
  canvas: null,
  video: null,
  photo: null,
  photoFile: null,
  width: 200,
  height: 0,
  selectedCamera: null,
  videoSources: null,
  photoSource: null,
  photoSources: [
    takeAPicture,
    uploadAFile
  ],
  setupCamera: false,

  /**
   * Setup the specified camera
   */
  _cameraChange: function(selectedCamera) {
    this.set('selectedCamera', selectedCamera);
    let stream = this.get('stream');
    let video = this.get('video');
    if (!Ember.isEmpty(stream)) {
      video.src = null;
      this._stopStream();
    }
    let videoSource = this.get('selectedCamera');
    let constraints = {
      audio: false,
      video: {
        optional: [{ sourceId: videoSource }]
      }
    };
    navigator.getUserMedia(constraints, this._gotStream.bind(this), this._errorCallback);
    this._setupVideo();
  },

  _errorCallback: function(error) {
    console.log('navigator.getUserMedia error: ', error);
  },

  /**
   * Callback for MediaStreamTrack.getSources
   */
  _gotSources: function(sourceInfos) {
    let cameraCount = 0;
    let cameraLabel;
    let videoSources = [];
    for (let i = 0; i !== sourceInfos.length; ++i) {
      let sourceInfo = sourceInfos[i];
      if (sourceInfo.kind === 'video') {
        cameraLabel = `Camera '${++cameraCount}`;
        if (sourceInfo.label) {
          cameraLabel += ` (${sourceInfo.label})`;
        }
        videoSources.addObject({
          id: sourceInfo.id,
          label: cameraLabel
        });
      }
    }
    this.set('videoSources', videoSources);
    if (videoSources.length > 0) {
      this.set('selectedCamera', videoSources[0].id);
      this.cameraChange(videoSources[0].id);
    }
  },

  /**
   * Callback handler for getUserMedia.
   */
  _gotStream: function(stream) {
    if (this.isDestroyed) {
      this._stopStream(stream);
    } else {
      let video = this.get('video');
      this.set('stream', stream); // make stream available to object
      video.src = window.URL.createObjectURL(stream);
      video.play();
    }
  },

  _photoSourceChanged: function(photoSource) {
    let camera = this.$('.camera');
    let fileUpload = this.$('.fileupload');
    let setupCamera = this.get('setupCamera');
    this.set('photoSource', photoSource);
    if (photoSource === uploadAFile) {
      fileUpload.show();
      camera.hide();
    } else {
      fileUpload.hide();
      camera.show();
      if (!setupCamera) {
        let canvas = this.$('canvas')[0];
        let photo = this.$('img')[0];
        let video = this.$('video')[0];
        this.setProperties({
          canvas: canvas,
          photo: photo,
          video: video
        });
        if (typeof MediaStreamTrack === 'undefined' || MediaStreamTrack.getSources === 'undefined') {
          if (navigator.getUserMedia) {
            navigator.getUserMedia({ audio: false, video: true }, this._gotStream.bind(this), this._errorCallback);
            this._setupCanPlayListener(video);
          }
        } else {
          MediaStreamTrack.getSources(this._gotSources.bind(this));
          this._setupCanPlayListener(video);
        }
        this.set('setupCamera', true);
      }
    }
  },

  _setupCanPlayListener: function(video) {
    // Remove listener if it was already added before.
    video.removeEventListener('canplay', this._setupVideo.bind(this), false);
    video.addEventListener('canplay', this._setupVideo.bind(this), false);
  },

  /**
   * Setup the dimensions for the video preview and picture elements.
   */
  _setupVideo: function() {
    let canvas = this.get('canvas');
    let height = this.get('height');
    let video = this.get('video');
    let width = this.get('width');
    height = video.videoHeight / (video.videoWidth / width);
    video.setAttribute('width', width);
    video.setAttribute('height', height);
    canvas.setAttribute('width', width);
    canvas.setAttribute('height', height);
    this.setProperties({
      height: height,
      width: width
    });
  },

  _setup: function() {
    this.cameraChange = this._cameraChange.bind(this);
    this.photoSourceChange = this._photoSourceChanged.bind(this);
    let photoSource = takeAPicture;
    if (!this.get('canCaptureVideo')) {
      photoSource = uploadAFile;
    }
    this.set('photoSource', photoSource);
  }.on('init'),

  _stopStream: function(stream) {
    let streamToStop = stream || this.get('stream');
    if (!Ember.isEmpty(streamToStop)) {
      if (typeof streamToStop.active === 'undefined') {
        streamToStop.stop();
      } else {
        let track = streamToStop.getTracks()[0];
        track.stop();
      }
    }
  },

  actions: {
    takePhoto: function() {
      let canvas = this.get('canvas');
      let height = this.get('height');
      let video = this.get('video');
      let width = this.get('width');
      canvas.width = width;
      canvas.height = height;
      canvas.getContext('2d').drawImage(video, 0, 0, width, height);
      let data = canvas.toDataURL('image/png');
      let binary = atob(data.split(',')[1]);
      let array = [];
      for (let i = 0; i < binary.length; i++) {
        array.push(binary.charCodeAt(i));
      }
      this.set('photoFile', new Blob([new Uint8Array(array)], { type: 'image/png' }));
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
    let camera = this.$('.camera');
    let fileUpload = this.$('.fileUpload');
    if (camera.length === 1) {
      fileUpload.hide();
    }
    this.photoSourceChange(this.get('photoSource'));
  },

  showCameraSelect: function() {
    let photoSource = this.get('photoSource');
    let videoSources = this.get('videoSources');
    return (photoSource === takeAPicture && videoSources && videoSources.length > 1);
  }.property('photoSource', 'videoSources'),

  willDestroyElement: function() {
    this._stopStream();
  }
});
