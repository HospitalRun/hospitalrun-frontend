import Ember from 'ember';

const { camelize } = Ember.String;

export default Ember.Mixin.create({
  navItems: [
    {
      title: 'Inventory',
      iconClass: 'octicon-package',
      route: 'inventory',
      capability: 'inventory',
      subnav: [
        {
          title: 'Requests',
          iconClass: 'octicon-chevron-right',
          route: 'inventory.index',
          capability: 'add_inventory_request'
        },
        {
          title: 'Items',
          iconClass: 'octicon-chevron-right',
          route: 'inventory.listing',
          capability: 'inventory'
        },
        {
          title: 'Inventory Received',
          iconClass: 'octicon-plus',
          route: 'inventory.batch',
          subroute: 'new',
          capability: 'add_inventory_item'
        },
        {
          title: 'Reports',
          iconClass: 'octicon-chevron-right',
          route: 'inventory.reports',
          capability: 'inventory'
        }
      ]
    },
    {
      title: 'Patients',
      iconClass: 'octicon-organization',
      route: 'patients',
      capability: 'patients',
      subnav: [
        {
          title: 'Patient Listing',
          iconClass: 'octicon-chevron-right',
          route: 'patients',
          capability: 'patients'
        },
        {
          title: 'Admitted Patients',
          iconClass: 'octicon-chevron-right',
          route: 'patients.admitted',
          capability: 'patients'
        },
        {
          title: 'New Patient',
          iconClass: 'octicon-plus',
          route: 'patients.edit',
          subroute: 'new',
          capability: 'add_patient'
        },
        {
          title: 'Reports',
          iconClass: 'octicon-chevron-right',
          route: 'patients.reports',
          capability: 'patients'
        }
      ]
    },
    {
      title: 'Appointments',
      iconClass: 'octicon-calendar',
      route: 'appointments.index',
      capability: 'appointments',
      subnav: [
        {
          title: 'This Week',
          iconClass: 'octicon-chevron-right',
          route: 'appointments.index',
          capability: 'appointments'
        },
        {
          title: 'Today',
          iconClass: 'octicon-chevron-right',
          route: 'appointments.today',
          capability: 'appointments'
        },
        {
          title: 'Missed',
          iconClass: 'octicon-chevron-right',
          route: 'appointments.missed',
          capability: 'appointments'
        },
        {
          title: 'Search',
          iconClass: 'octicon-search',
          route: 'appointments.search',
          capability: 'appointments'
        },
        {
          title: 'Add Appointment',
          iconClass: 'octicon-plus',
          route: 'appointments.edit',
          subroute: 'new',
          capability: 'add_appointment'
        }
      ]
    },
    {
      title: 'Imaging',
      iconClass: 'octicon-device-camera',
      route: 'imaging.index',
      capability: 'imaging',
      subnav: [
        {
          title: 'Requests',
          iconClass: 'octicon-chevron-right',
          route: 'imaging.index',
          capability: 'imaging'
        },
        {
          title: 'Completed',
          iconClass: 'octicon-chevron-right',
          route: 'imaging.completed',
          capability: 'imaging'
        },
        {
          title: 'New Request',
          iconClass: 'octicon-plus',
          route: 'imaging.edit',
          subroute: 'new',
          capability: 'add_imaging'
        }
      ]
    },
    {
      title: 'Medication',
      iconClass: 'octicon-file-text',
      route: 'medication.index',
      capability: 'medication',
      subnav: [
        {
          title: 'Requests',
          iconClass: 'octicon-chevron-right',
          route: 'medication.index',
          capability: 'medication'
        },
        {
          title: 'Completed',
          iconClass: 'octicon-chevron-right',
          route: 'medication.completed',
          capability: 'medication'
        },
        {
          title: 'New Request',
          iconClass: 'octicon-plus',
          route: 'medication.edit',
          subroute: 'new',
          capability: 'add_medication'
        },
        {
          title: 'Dispense',
          iconClass: 'octicon-checklist',
          route: 'medication.edit',
          subroute: 'dispense',
          capability: 'fulfill_medication'
        },
        {
          title: 'Return Medication',
          iconClass: 'octicon-mail-reply',
          route: 'medication.return',
          subroute: 'new',
          capability: 'add_medication'
        }
      ]
    },
    {
      title: 'Labs',
      iconClass: 'octicon-microscope',
      route: 'labs.index',
      capability: 'labs',
      subnav: [
        {
          title: 'Requests',
          iconClass: 'octicon-chevron-right',
          route: 'labs.index',
          capability: 'labs'
        },
        {
          title: 'Completed',
          iconClass: 'octicon-chevron-right',
          route: 'labs.completed',
          capability: 'labs'
        },
        {
          title: 'New Request',
          iconClass: 'octicon-plus',
          route: 'labs.edit',
          subroute: 'new',
          capability: 'add_lab'
        }
      ]
    },
    {
      title: 'Billing',
      iconClass: 'octicon-credit-card',
      route: 'invoices.index',
      capability: 'invoices',
      subnav: [
        {
          title: 'Invoices',
          iconClass: 'octicon-chevron-right',
          route: 'invoices.index',
          capability: 'invoices'
        },
        {
          title: 'New Invoice',
          iconClass: 'octicon-plus',
          route: 'invoices.edit',
          subroute: 'new',
          capability: 'invoices'
        },
        {
          title: 'Prices',
          iconClass: 'octicon-chevron-right',
          route: 'pricing.index',
          capability: 'invoices'
        },
        {
          title: 'Price Profiles',
          iconClass: 'octicon-chevron-right',
          route: 'pricing.profiles',
          capability: 'invoices'
        }
      ]
    },
    {
      title: 'Administration',
      iconClass: 'octicon-person',
      route: 'admin.lookup',
      capability: 'admin',
      subnav: [
        {
          title: 'Lookup Lists',
          iconClass: 'octicon-chevron-right',
          route: 'admin.lookup',
          capability: 'update_config'
        },
        {
          title: 'Address Fields',
          iconClass: 'octicon-chevron-right',
          route: 'admin.address',
          capability: 'update_config'
        },
        {
          title: 'Load DB',
          iconClass: 'octicon-plus',
          route: 'admin.loaddb',
          capability: 'load_db'
        },
        {
          title: 'Users',
          iconClass: 'octicon-chevron-right',
          route: 'users',
          capability: 'users'
        },
        {
          title: 'New User',
          iconClass: 'octicon-plus',
          route: 'users.edit',
          subroute: 'new',
          capability: 'add_user'
        },
        {
          title: 'User Roles',
          iconClass: 'octicon-chevron-right',
          route: 'admin.roles',
          capability: 'user_roles'
        },
        {
          title: 'Workflow',
          iconClass: 'octicon-chevron-right',
          route: 'admin.workflow',
          capability: 'update_config'
        }
      ]
    }
  ],

  // Navigation items get mapped localizations
  localizedNavItems: Ember.computed('navItems.[]', function() {
    let localizationPrefix = 'navigation.';
    // Supports unlocalized keys for now, otherwise we would get:
    // "Missing translation: key.etc.path"
    let translationOrOriginal = (translation, original) => {
      // Check for typeof string, because if it's found in localization,
      // i18n will return a SafeString object, not a string
      return typeof translation === 'string' ? original : translation;
    };
    return this.get('navItems').map((nav) => {
      let sectionKey = localizationPrefix + camelize(nav.title).toLowerCase();
      let navTranslated = this.get('i18n').t(sectionKey);

      nav.localizedTitle = translationOrOriginal(navTranslated, nav.title);
      // Map all of the sub navs, too
      nav.subnav = nav.subnav.map((sub) => {
        let subItemKey = `${localizationPrefix}subnav.${camelize(sub.title)}`;
        let subTranslated = this.get('i18n').t(subItemKey);

        sub.localizedTitle = translationOrOriginal(subTranslated, sub.title);
        return sub;
      });

      return nav;
    });
  })
});
