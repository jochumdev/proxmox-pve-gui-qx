qx.Class.define("proxmox.ve.desktop.page.Datacenter", {
    extend: qx.core.Object,
    implement: proxmox.core.page.core.IView,
    include: [
        proxmox.core.page.core.MResourcePage
    ],

    statics: {
        SUBPAGES: ["search"],
        DEFAULT_PAGE_ID: "search"
    },

    members: {
        _searchResources: null,

        _getContentContainer: function () {
            var ct = new qx.ui.container.Composite(new qx.ui.layout.Dock()).set({ appearance: "content-box" });

            var actionsBar = new qx.ui.container.Composite(new qx.ui.layout.HBox(5)).set({ appearance: "actionsbar-box" });
            actionsBar.setPadding([6, 5, 6, 8]);
            ct.add(actionsBar, { edge: "north", width: "100%" });

            var headline = new qx.ui.basic.Label(this.tr("Datacenter")).set({ appearance: "actionsbar-label" });
            actionsBar.add(headline);
            actionsBar.add(new qx.ui.basic.Atom(), { flex: 1 });
            actionsBar.add(new proxmox.core.ui.form.CssButton(this.tr("Help"), ["fa", "fa-question-circle"]));

            var navbar = new proxmox.ve.desktop.part.Navbar("datacenter");
            ct.add(navbar.getContainer(), { edge: "west", height: "100%" });

            // Content
            var sr = this._searchResources = new proxmox.ve.desktop.part.SearchResources();
            sr.startListening();

            var searchBar = new qx.ui.container.Composite(new qx.ui.layout.HBox(5)).set({ appearance: "actionsbar-box" });
            searchBar.setPadding([6, 5, 6, 8]);
            ct.add(searchBar, { edge: "north", width: "100%" });

            searchBar.add(new qx.ui.basic.Atom(), { flex: 1 });
            searchBar.add(sr.getSearchField());

            ct.add(sr.getContainer(), { edge: "north", width: "100%" });

            this._contentContainer = ct;
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