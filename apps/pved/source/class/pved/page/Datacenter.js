qx.Class.define("pved.page.Datacenter", {
    extend: pved.page.core.Page,

    statics: {
        SUBPAGES: ["search"],
        DEFAULT_PAGE_ID: "search"
    },

    members: {
        _searchResources: null,

        _getContentContainer: function () {
            var ct = new qx.ui.container.Composite(new qx.ui.layout.Dock()).set({ appearance: "content-box" });

            var toolbar = new qx.ui.container.Composite(new qx.ui.layout.HBox(5)).set({ appearance: "toolbar-box" });
            toolbar.setPadding([6, 5, 6, 8]);
            ct.add(toolbar, { edge: "north", width: "100%" });

            var headline = new qx.ui.basic.Label(this.tr("Datacenter")).set({ appearance: "toolbar-label" });
            toolbar.add(headline);
            toolbar.add(new qx.ui.basic.Atom(), { flex: 1 });
            toolbar.add(new p.ui.form.CssButton(this.tr("Help"), ["fa", "fa-question-circle"]));

            var navbar = new pved.part.Navbar("datacenter");
            ct.add(navbar.getContainer(), { edge: "west", height: "100%" });

            // Content
            var sr = this._searchResources = new pved.part.SearchResources();
            sr.startListening();

            var searchBar = new qx.ui.container.Composite(new qx.ui.layout.HBox(5)).set({ appearance: "toolbar-box" });
            searchBar.setPadding([6, 5, 6, 8]);
            ct.add(searchBar, { edge: "north", width: "100%" });

            searchBar.add(new qx.ui.basic.Atom(), { flex: 1 });
            searchBar.add(sr.getSearchField());

            ct.add(sr.getContainer(), { edge: "north", width: "100%" });

            return ct;
        },

        _getSubPage: function(pageId) {
            return true;
        },
    },

    destruct: function () {
        this._disposeObjects("_searchResources");
    }
});