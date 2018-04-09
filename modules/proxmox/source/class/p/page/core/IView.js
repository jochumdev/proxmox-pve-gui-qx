qx.Interface.define("p.page.core.IView", {
    statics: {
        DEFAULT_PAGE_ID: "",
        SUBPAGES: "",
    },

    properties: {
        id: {}
    },

    members: {
        /**
         * @return {Promise} A promise which will return a qx.ui.core.Widget on success.
         */
        getContainerAsync: function() {
        },

        /**
         * @return {Boolean} Whatever the navigation was sucessful.
         */
        navigateToPageId: function(pageId) {
        }
    }
});