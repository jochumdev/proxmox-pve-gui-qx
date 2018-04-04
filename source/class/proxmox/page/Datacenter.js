qx.Class.define("proxmox.page.Datacenter", {
    extend: qx.core.Object,
    implement: proxmox.page.core.IView,
    include: [
        qx.locale.MTranslation,
    ],

    statics: {
        SUBPAGES: ["search"],
        DEFAULT_PAGE_ID: "search"
    },

    properties: {
        id: {
            check: "String",
            nullable: true,
            init: null
        }
    },

    members: {
        getContainerAsync: function () {
            return new qx.Promise((resolve, reject) => {
                var ct = new qx.ui.container.Composite(new qx.ui.layout.Dock()).set({ appearance: "content-box"});

                var actionsBar = new qx.ui.container.Composite(new qx.ui.layout.HBox(5)).set({ appearance: "actionsbar-box" });
                actionsBar.setPadding([6, 5, 6, 8]);
                ct.add(actionsBar, {edge: "north", width: "100%"});

                var headline = new qx.ui.basic.Label(this.tr("Datacenter")).set({ appearance: "actionsbar-label" });
                actionsBar.add(headline);
                actionsBar.add(new qx.ui.basic.Atom(), { flex: 1 });
                actionsBar.add(new qx.ui.form.Button(this.tr("Help"), "@FontAwesome/question-circle"));

                var navbar = new proxmox.part.Navbar("datacenter");
                ct.add(navbar.getContainer(), {edge: "west", height: "100%"});

                // Content
                var sr = new proxmox.part.SearchResources();

                var searchBar = new qx.ui.container.Composite(new qx.ui.layout.HBox(5)).set({ appearance: "actionsbar-box" });
                searchBar.setPadding([6, 5, 6, 8]);
                ct.add(searchBar, {edge: "north", width: "100%"});

                searchBar.add(new qx.ui.basic.Atom(), { flex: 1 });
                searchBar.add(sr.getSearchField());

                ct.add(sr.getContainer(), {edge: "north", width: "100%"});

                resolve(ct);
            });
        },

        navigateToPageId: function(pageId) {
            return true;
        },
    }
});