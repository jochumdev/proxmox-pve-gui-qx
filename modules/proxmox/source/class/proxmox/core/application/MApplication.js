/**
 * The base mixin for all Qooxdoo based proxmox applications.
 */
qx.Mixin.define("proxmox.core.application.MApplication", {
    events: {
        changeLogin: "qx.event.type.Data"
    },

    properties: {
        csrfPreventionToken: {
            init: null,
            nullable: true
        },

        language: {
            nullable: true,
            init: "en",
            apply: "_appyLanguage"
        },

        contentContainer: {
            nullable: true,
            apply: "_appplyContentContainer"
        },
    },

    members: {
        _serviceManager: null,

        _localStore: null,

        _router: null,

        initcore: function () {
            /**
             * Localstore
             */
            this._localStore = new qx.bom.Storage.getLocal();

            /**
             * ServiceManager
             */
            this._serviceManager = new proxmox.core.service.Manager();

            /**
             * Navigator
             */
            this._navigator = new proxmox.core.page.Navigator(this);
        },

        getServiceManager: function () {
            return this._serviceManager;
        },

        getLocalStore: function () {
            return this._localStore;
        },

        getNavigator: function() {
            return this._navigator;
        },

        _appyLanguage: function (value) {
            if (value !== null) {
                qx.locale.Manager.getInstance().setLocale(value);
            }
        },
    },

    destruct: function () {
        this._disposeObjects("_serviceManager", "_localStore");
    }
});