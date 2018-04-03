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
            event: "changeResourceData"
        },

        resourceInfo: {
            event: "changeResourceInfo"
        },

        headline: {
            event: "changeHeadline",
            init: ""
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
                    var info = proxmox.Utils.getResourceInfo(node);
                    this.setResourceInfo(info);

                    switch (info.type) {
                        case "node":
                            this.setHeadline(this.tr("Node '%1'", info.node));
                            break;
                        case "lxc":
                            this.setHeadline(this.tr("Container %1 (%2) on node '%3'", info.id, info.name, info.node));
                            break;
                        case "qemu":
                            this.setHeadline(this.tr("Virtual Machine %1 (%2) on node '%3'", info.id, info.name, info.node));
                            break;
                        case "storage":
                            this.setHeadline(this.tr("Storage '%1' on node '%2'", info.name, info.node));
                            break;
                    }
                    return;
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