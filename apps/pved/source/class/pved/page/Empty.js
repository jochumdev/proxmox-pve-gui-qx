qx.Class.define("pved.page.Empty", {
    extend: pved.page.core.Page,

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