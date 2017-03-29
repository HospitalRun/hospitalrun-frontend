import PortMixin from "ember-debug/mixins/port-mixin";
import ProfileManager from "ember-debug/models/profile-manager";

const Ember = window.Ember;
const { computed: { oneWay }, run: { later }, subscribe, Object: EmberObject } = Ember;

let profileManager = new ProfileManager();
let queue = [];

function push(info) {
  const index = queue.push(info);
  if (index === 1) {
    later(flush, 50);
  }
  return index - 1;
}

function flush() {
  let entry, i;
  for (i = 0; i < queue.length; i++) {
    entry = queue[i];
    if (entry.type === 'began') {
      // If there was an error during rendering `entry.endedIndex` never gets set.
      if (entry.endedIndex) {
        queue[entry.endedIndex].profileNode = profileManager.began(entry.timestamp, entry.payload, entry.now);
      }
    } else {
      profileManager.ended(entry.timestamp, entry.payload, entry.profileNode);
    }

  }
  queue.length = 0;
}

subscribe("render", {
  before(name, timestamp, payload) {
    const info = {
      type: 'began',
      timestamp,
      payload,
      now: Date.now()
    };
    return push(info);
  },

  after(name, timestamp, payload, beganIndex) {
    const endedInfo = {
      type: 'ended',
      timestamp,
      payload
    };

    const index = push(endedInfo);
    queue[beganIndex].endedIndex = index;
  }
});

export default EmberObject.extend(PortMixin, {
  namespace: null,
  port: oneWay('namespace.port').readOnly(),
  application: oneWay('namespace.application').readOnly(),
  viewDebug: oneWay('namespace.viewDebug').readOnly(),
  portNamespace: 'render',

  profileManager,

  init() {
    this._super();
    this.profileManager.wrapForErrors = (context, callback) => this.get('port').wrap(() => callback.call(context));
    this._subscribeForViewTrees();
  },

  willDestroy() {
    this._super();
    this.profileManager.wrapForErrors = function(context, callback) {
      return callback.call(context);
    };
    this.profileManager.offProfilesAdded(this, this.sendAdded);
    this.profileManager.offProfilesAdded(this, this._updateViewTree);
  },

  _subscribeForViewTrees() {
    this.profileManager.onProfilesAdded(this, this._updateViewTree);
  },

  _updateViewTree(profiles) {
    let viewDurations = {};
    this._flatten(profiles).forEach(node => {
      if (node.viewGuid) {
        viewDurations[node.viewGuid] = node.duration;
      }
    });
    this.get('viewDebug').updateDurations(viewDurations);
  },

  _flatten(profiles, array) {
    array = array || [];
    profiles.forEach(profile => {
      array.push(profile);
      this._flatten(profile.children, array);
    });
    return array;
  },

  sendAdded(profiles) {
    this.sendMessage('profilesAdded', { profiles });
  },

  messages: {
    watchProfiles() {
      this.sendMessage('profilesAdded', { profiles: this.profileManager.profiles });
      this.profileManager.onProfilesAdded(this, this.sendAdded);
    },

    releaseProfiles() {
      this.profileManager.offProfilesAdded(this, this.sendAdded);
    },

    clear() {
      this.profileManager.clearProfiles();
      this.sendMessage('profilesUpdated', { profiles: [] });
    }
  }
});
