qx.Mixin.define("proxmox.core.page.core.MResourcePage", {
    include: [
        qx.locale.MTranslation,
    ],

    construct: function () {
        var app = this._serviceManager = qx.core.Init.getApplication();
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
        id: {
            check: "String",
            apply: "_applyId",
            nullable: true
        },

        resourceData: {
            event: "changeResourceData",
            nullable: true,
        }
    },

    members: {
        _app: null,
        _serviceManager: null,

        _contentContainerPromise: null,
        _contentContainer: null,
        _currentPageId: null,
        _currentSubPageContainer: null,
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

        // proxmox.page.core.IView implementation
        getContainerAsync: function () {
            if (this._contentContainerPromise !== null) {
                return this._contentContainerPromise;
            }

            if (this.getResourceData() === null) {
                this._contentContainerPromise = new qx.Promise((resolve, reject) => {
                    this.addListenerOnce("changeResourceData", resolve)
                }).then(() => {
                    this._contentContainer = this._getContentContainer();
                    return this._contentContainer;
                });
            } else {
                this._contentContainerPromise = new qx.Promise((resolve, reject) => {
                    this._contentContainer = this._getContentContainer();
                    resolve(this._contentContainer);
                });
            }

            return this._contentContainerPromise;
        },

        // proxmox.page.core.IView implementation
        navigateToPageId: function (pageId) {
            if (pageId === this._currentPageId) {
                return true;
            }

            var subPage = this._getSubPage(pageId);
            if (subPage === false) {
                return false;
            }

            if (subPage === true) {
                return true;
            }

            subPage.setPage(this);
            subPage.set({
                id: this.getId(),
            });

            if (this._currentSubPageContainer !== null) {
                this._contentContainer.remove(this._currentSubPageContainer);
            }

            var subc = this._currentSubPageContainer = subPage.getSubPageContainer();
            this._contentContainer.add(subc, { edge: "north", width: "100%" });
            this._currentPageId = pageId;

            return true;
        }
    },

    destruct: function() {
        this._serviceManager.disposeResourceServices();
        this._disposeObjects("_contentContainer", "_currentSubPageContainer");
    }
});