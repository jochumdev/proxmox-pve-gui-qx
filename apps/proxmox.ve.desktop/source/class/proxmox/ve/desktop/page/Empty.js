qx.Class.define("proxmox.ve.desktop.page.Empty", {
    extend: qx.core.Object,
    implement: proxmox.core.page.core.IView,
    include: [
        proxmox.core.page.core.MResourcePage
    ],

    statics: {
        SUBPAGES: ["empty"],
        DEFAULT_PAGE_ID: "empty"
    },

    members: {
         _getContentContainer: function () {
            return new qx.ui.core.Widget();
        },

        _getSubPage: function(pageId) {
            return true;
        },
    }
});