qx.Interface.define("proxmox.page.core.IView", {
    properties: {
        id: {}
    },

    members: {
        /**
         * @return {qx.ui.core.Widget} Container for the view.
         */
        getContainer: function() {
        },

        getDefaultPageId: function() {
        },

        /**
         * @return {Boolean} Whatever the navigation was sucessful.
         */
        navigateToPageId: function(pageId) {
        }
    }
});