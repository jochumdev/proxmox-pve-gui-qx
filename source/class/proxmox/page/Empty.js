qx.Class.define("proxmox.page.Empty", {
    extend: qx.core.Object,
    implement: proxmox.page.core.IView,

    properties: {
        id: {},
        pageId: {}
    },

    members: {
        getDefaultPageId: function() {
            return "empty"
        },

        navigateToPageId: function(pageId) {
            return pageId == "empty" ? true : false;
        },

        getContainer: function () {
            var ct = new qx.ui.container.Composite(new qx.ui.layout.Dock());
            ct.add(new qx.ui.core.Widget(), {edge: "north", height: "100%"});
            return ct;
        }
    }
});