qx.Class.define("proxmox.page.Empty", {
    extend: qx.core.Object,
    implement: proxmox.page.core.IView,

    statics: {
        SUBPAGES: ["empty"],
        DEFAULT_PAGE_ID: "empty"
    },

    properties: {
        id: {},
    },

    members: {
        navigateToPageId: function(pageId) {
            return true;
        },

        getContainerAsync: function () {
            return new qx.Promise((resolve, reject) => {
                var ct = new qx.ui.container.Composite(new qx.ui.layout.Dock());
                ct.add(new qx.ui.core.Widget(), {edge: "north", height: "100%"});

                resolve(ct);
            });
        }
    }
});