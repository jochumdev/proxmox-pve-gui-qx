qx.Class.define("proxmox.core.page.core.ResourcePage", {
    extend: proxmox.core.page.core.Page,

    construct: function () {
        this.base(arguments);

        var app = this._app = qx.core.Init.getApplication();
        var sm = this._serviceManager = app.getServiceManager();

        this._resourceService = sm.getService("cluster/resources");

        this._resourceService.addListener("changeModel", (e) => {
            if (this.getId() == null) {
                return;
            }

            var model = e.getData();
            this.__updateDataFromService(model);
        });
        this.__updateDataFromService(this._resourceService.getModel());
    },

    properties: {
        resourceData: {
            event: "changeResourceData",
            nullable: true,
        }
    },

    members: {
        _app: null,
        _serviceManager: null,
        _resourceService: null,

        _applyId: function (value, old) {
            this.__updateDataFromService(this._resourceService.getModel());
        },

        __updateDataFromService: function (model) {
            if (!model) {
                return
            }

            var nodeId = this.getId();
            model.forEach((node) => {
                if (node.getId() == nodeId) {
                    this.setResourceData(node);
                }
            });
        },

        /**
         * Get called before _getContentContainer gets called
         * overwrite if you want to init some stuff.
         */
        _init: function() {},

        /**
         * Gets called on destruct, overwrite if you want to dispose your
         * own stuff.
         */
        _destroy: function() {

        },

        // overriden
        // proxmox.page.core.IView implementation
        getContainerAsync: function () {
            if (this._contentContainerPromise !== null) {
                return this._contentContainerPromise;
            }

            if (this.getResourceData() === null) {
                this._contentContainerPromise = new qx.Promise((resolve, reject) => {
                    this.addListenerOnce("changeResourceData", resolve)
                }).then(() => {
                    this._init();
                    this._contentContainer = this._getContentContainer();
                    return this._contentContainer;
                });
            } else {
                this._contentContainerPromise = new qx.Promise((resolve, reject) => {
                    this._init();
                    this._contentContainer = this._getContentContainer();
                    resolve(this._contentContainer);
                });
            }

            return this._contentContainerPromise;
        },
    },

    destruct: function() {
        this._destroy();
        this._serviceManager.disposeResourceServices();
        this._disposeObjects("_contentContainer", "_currentSubPageContainer");
    }
});