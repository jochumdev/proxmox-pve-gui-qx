qx.Interface.define("proxmox.core.page.core.ISubPage", {
    properties: {
        page: {},

        id: {
            event: "changeId"
        }
    },

    members: {
        /**
         * @return {qx.ui.core.Widget} Container for the view.
         */
        getSubPageContainer: function() {
        }
    }
});