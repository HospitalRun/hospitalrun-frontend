import Ember from 'ember';

const TAKE_PICTURE = 'takeAPicture';
const UPLOAD_FILE = 'uploadAFile';
const FILE_SOURCES = [TAKE_PICTURE, UPLOAD_FILE];

const { computed, get, inject, isEmpty, set } = Ember;

// Derived from https://developer.mozilla.org/en-US/docs/Web/API/WebRTC_API/Taking_still_photos and
// https://github.com/samdutton/simpl/blob/master/getusermedia/sources/js/main.js
export default Ember.Component.extend({
  defaultDocumentSource: null,
  canvas: null,
  height: 0,
  isImage: false,
  document: null,
  documentFile: null,
  documentSource: null,
  sourceLabel: null,
  selectedCamera: null,
  setupCamera: false,
  video: null,
  videoSources: null,
  width: 200,

  i18n: inject.service(),
  canCaptureVideo: computed(function() {
    return navigator.mediaDevices && navigator.mediaDevices.getUserMedia;
  }),
  documentSources: computed(function() {
    let i18n = get(this, 'i18n');
    return FILE_SOURCES.map((source) => {
      return {
        label: i18n.t(`components.takePhoto.labels.${source}`),
        value: source
      };
    });
  }),

  sourceChooserLabel: computed('sourceLabel', function() {
    let i18n = get(this, 'i18n');
    let sourceLabel = get(this, 'sourceLabel');
    if (isEmpty(sourceLabel)) {
      return i18n.t('components.takePhoto.how');
    } else {
      return sourceLabel;
    }
  }),

  showFileUpload: computed('documentSource', function() {
    let documentSource = get(this, 'documentSource');
    return documentSource === UPLOAD_FILE;
  }),

  didInsertElement() {
    let documentSource = get(this, 'defaultDocumentSource');
    if (isEmpty(documentSource)) {
      documentSource = UPLOAD_FILE;
    }
    this._documentSourceChanged(documentSource);
  },

  willDestroyElement() {
    this._stopStream();
  },

  /**
   * Setup the specified camera
   */
  _cameraChange(selectedCamera) {
    set(this, 'selectedCamera', selectedCamera);
    let stream = get(this, 'stream');
    let video = get(this, 'video');
    if (!Ember.isEmpty(stream)) {
      video.src = null;
      this._stopStream();
    }
    let videoSource = get(this, 'selectedCamera');
    let constraints = {
      audio: false,
      video: {
        deviceId: videoSource
      }
    };
    navigator.mediaDevices.getUserMedia(constraints).then(this._gotStream.bind(this)).catch(this._errorCallback);
    this._setupVideo();
  },

  _errorCallback(error) {
    console.log('navigator.mediaDevices.getUserMedia error: ', error);
  },

  /**
   * Callback for MediaStreamTrack.getSources
   */
  _gotSources(sourceInfos) {
    let cameraCount = 0;
    let cameraLabel;
    let videoSources = [];
    for (let i = 0; i !== sourceInfos.length; ++i) {
      let sourceInfo = sourceInfos[i];
      if (sourceInfo.kind === 'videoinput') {
        cameraLabel = `Camera '${++cameraCount}`;
        if (sourceInfo.label) {
          cameraLabel += ` (${sourceInfo.label})`;
        }
        videoSources.addObject({
          deviceId: sourceInfo.deviceId,
          label: cameraLabel
        });
      }
    }
    set(this, 'videoSources', videoSources);
    if (videoSources.length > 0) {
      set(this, 'selectedCamera', videoSources[0].deviceId);
      this._cameraChange(videoSources[0].deviceId);
    }
  },

  /**
   * Callback handler for getUserMedia.
   */
  _gotStream(stream) {
    if (this.isDestroyed) {
      this._stopStream(stream);
    } else {
      let video = get(this, 'video');
      set(this, 'stream', stream); // make stream available to object
      video.srcObject = stream;
      video.play();
    }
  },

  _documentSourceChanged(documentSource) {
    let camera = this.$('.camera');
    let setupCamera = get(this, 'setupCamera');
    set(this, 'documentSource', documentSource);
    if (documentSource === UPLOAD_FILE) {
      camera.hide();
    } else {
      camera.show();
      if (!setupCamera) {
        let canvas = this.$('canvas').get(0);
        let document = this.$('img').get(0);
        let video = this.$('video').get(0);
        this.setProperties({
          canvas,
          document,
          video
        });
        if (navigator.mediaDevices) {
          if (!navigator.mediaDevices.enumerateDevices) {
            if (navigator.mediaDevices.getUserMedia) {
              let constraints = { audio: false, video: true };
              navigator.mediaDevices.getUserMedia(constraints).then(this._gotStream.bind(this)).catch(this._errorCallback);
              this._setupCanPlayListener(video);
            }
          } else {
            navigator.mediaDevices.enumerateDevices().then(this._gotSources.bind(this)).catch(this._errorCallback);
            this._setupCanPlayListener(video);
          }
        }
        set(this, 'setupCamera', true);
      }
    }
  },

  _setupCanPlayListener(video) {
    // Remove listener if it was already added before.
    video.removeEventListener('canplay', this._setupVideo.bind(this), false);
    video.addEventListener('canplay', this._setupVideo.bind(this), false);
  },

  /**
   * Setup the dimensions for the video preview and picture elements.
   */
  _setupVideo() {
    let canvas = get(this, 'canvas');
    let height = get(this, 'height');
    let video = get(this, 'video');
    let width = get(this, 'width');
    height = video.videoHeight / (video.videoWidth / width);
    video.setAttribute('width', width);
    video.setAttribute('height', height);
    canvas.setAttribute('width', width);
    canvas.setAttribute('height', height);
    this.setProperties({
      height,
      width
    });
  },

  _stopStream(stream) {
    let streamToStop = stream || get(this, 'stream');
    if (!Ember.isEmpty(streamToStop)) {
      if (typeof streamToStop.active === 'undefined') {
        streamToStop.stop();
      } else {
        let [track] = streamToStop.getTracks();
        track.stop();
      }
    }
  },

  actions: {
    cameraChange(selectedCamera) {
      this._cameraChange(selectedCamera);
    },

    documentSourceChange(documentSource) {
      this._documentSourceChanged(documentSource);
    },

    uploaddocument() {
      let canvas = get(this, 'canvas');
      let height = get(this, 'height');
      let video = get(this, 'video');
      let width = get(this, 'width');
      canvas.width = width;
      canvas.height = height;
      canvas.getContext('2d').drawImage(video, 0, 0, width, height);
      let data = canvas.toDataURL('image/png');
      let binary = atob(data.split(',')[1]);
      let array = [];
      for (let i = 0; i < binary.length; i++) {
        array.push(binary.charCodeAt(i));
      }
      set(this, 'documentFile', new Blob([new Uint8Array(array)], { type: 'image/png' }));
      set(this, 'isImage', true);
    }
  }

});
