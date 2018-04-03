qx.Mixin.define("proxmox.page.core.MResourcePage", {
    include: [
        qx.locale.MTranslation,
    ],

    construct: function () {
        var app = qx.core.Init.getApplication();
        this.setApp(app);

        this._resourceService = app.getService("resources");

        this._resourceService.addListener("changeModel", (e) => {
            if (this.getId() == null) {
                return;
            }

            var model = e.getData();
            this.__updateDataFromService(model);
        });
    },

    properties: {
        id: {
            check: "String",
            apply: "_applyId",
            nullable: true,
            init: null
        },

        app: {},

        resourceData: {
            event: "changeResourceData",
            nullable: true,
            init: null
        }
    },

    members: {
        _contentContainer: null,
        _currentSubPageContainer: null,
        _resourceService: null,

        _applyId: function(value, old) {
            this.__updateDataFromService(this._resourceService.getModel());
        },

        __updateDataFromService: function(model) {
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
        getContainer: function() {
            this._contentContainer = this._getContentContainer();
            return this._contentContainer;
        },

        // proxmox.page.core.IView implementation
        navigateToPageId: function(pageId) {
            var subPage = this._getSubPage(pageId);
            if (subPage === false) {
                return false;
            }

            subPage.setPage(this);
            subPage.bind("id", this, "id");

            if (this._currentSubPageContainer != null) {
                this._contentContainer.remove(this._currentSubPageContainer);
            }

            var subc = this._currentSubPageContainer = subPage.getSubPageContainer();
            this._contentContainer.add(subc, {edge: "north", width: "100%"});

            return true;
        }
    }
});