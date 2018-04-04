qx.Class.define("proxmox.page.Type", {
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

                var idSplit = this.getId().split("/");

                var headline;
                switch(idSplit[1]) {
                    case "lxc":
                        var headline = new qx.ui.basic.Label(this.tr("LXC Container")).set({ appearance: "actionsbar-label" });
                        break;
                    case "qemu":
                        var headline = new qx.ui.basic.Label(this.tr("Virtual Machine")).set({ appearance: "actionsbar-label" });
                        break;
                    case "node":
                        var headline = new qx.ui.basic.Label(this.tr("Nodes")).set({ appearance: "actionsbar-label" });
                        break;
                    case "storage":
                        var headline = new qx.ui.basic.Label(this.tr("Storage")).set({ appearance: "actionsbar-label" });
                        break;
                }

                actionsBar.add(headline);
                actionsBar.add(new qx.ui.basic.Atom(), { flex: 1 });
                actionsBar.add(new qx.ui.form.Button(this.tr("Help"), "@FontAwesome/question-circle"));

                var navbar = new proxmox.part.Navbar("searchOnly");
                ct.add(navbar.getContainer(), {edge: "west", height: "100%"});

                // Content
                var sr = new proxmox.part.SearchResources();
                sr.setLimitType(idSplit[1]);

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