import ProfileNode from './profile-node';
const Ember = window.Ember;
const { run: { scheduleOnce } } = Ember;

/**
 * A class for keeping track of active rendering profiles as a list.
 */
const ProfileManager = function() {
  this.profiles = [];
  this.current = null;
  this.currentSet = [];
  this._profilesAddedCallbacks = [];
};

ProfileManager.prototype = {
  began(timestamp, payload, now) {
    return this.wrapForErrors(this, function() {
      this.current = new ProfileNode(timestamp, payload, this.current, now);
      return this.current;
    });
  },

  ended(timestamp, payload, profileNode) {
    if (payload.exception) { throw payload.exception; }
    return this.wrapForErrors(this, function() {
      this.current = profileNode.parent;
      profileNode.finish(timestamp);

      // Are we done profiling an entire tree?
      if (!this.current) {
        this.currentSet.push(profileNode);
        // If so, schedule an update of the profile list
        scheduleOnce('afterRender', this, this._profilesFinished);
      }
    });
  },

  wrapForErrors(context, callback) {
    return callback.call(context);
  },

  clearProfiles() {
    this.profiles.length = 0;
  },

  _profilesFinished() {
    return this.wrapForErrors(this, function() {
      const firstNode = this.currentSet[0];
      let parentNode = new ProfileNode(firstNode.start, { template: 'View Rendering' });

      parentNode.time = 0;
      this.currentSet.forEach(n => {
        parentNode.time += n.time;
        parentNode.children.push(n);
      });
      parentNode.calcDuration();

      this.profiles.push(parentNode);
      this._triggerProfilesAdded([parentNode]);
      this.currentSet = [];
    });
  },

  _profilesAddedCallbacks: undefined, // set to array on init

  onProfilesAdded(context, callback) {
    this._profilesAddedCallbacks.push({ context, callback });
  },

  offProfilesAdded(context, callback) {
    let index = -1, item;
    for (let i = 0, l = this._profilesAddedCallbacks.length; i < l; i++) {
      item = this._profilesAddedCallbacks[i];
      if (item.context === context && item.callback === callback) {
        index = i;
      }
    }
    if (index > -1) {
      this._profilesAddedCallbacks.splice(index, 1);
    }
  },

  _triggerProfilesAdded(profiles) {
    this._profilesAddedCallbacks.forEach(function(item) {
      item.callback.call(item.context, profiles);
    });
  }
};

export default ProfileManager;
