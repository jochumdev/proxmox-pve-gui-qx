qx.Class.define("proxmox.ve.desktop.page.Type", {
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
        _getContentContainer: function () {
            var ct = new qx.ui.container.Composite(new qx.ui.layout.Dock()).set({ appearance: "content-box" });

            var actionsBar = new qx.ui.container.Composite(new qx.ui.layout.HBox(5)).set({ appearance: "actionsbar-box" });
            actionsBar.setPadding([6, 5, 6, 8]);
            ct.add(actionsBar, { edge: "north", width: "100%" });

            var idSplit = this.getId().split("/");

            var headline;
            switch (idSplit[1]) {
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
                case "pool":
                    var headline = new qx.ui.basic.Label(this.tr("Pool")).set({ appearance: "actionsbar-label" });
                    break;
                default:
                    var headline = new qx.ui.basic.Label(this.tr("Unknown")).set({ appearance: "actionsbar-label" });
            }

            actionsBar.add(headline);
            actionsBar.add(new qx.ui.basic.Atom(), { flex: 1 });
            actionsBar.add(new proxmox.core.ui.form.CssButton(this.tr("Help"), ["fa", "fa-question-circle"]));

            var navbar = new proxmox.ve.desktop.part.Navbar("searchOnly");
            ct.add(navbar.getContainer(), { edge: "west", height: "100%" });

            // Content
            var sr = this._searchResources = new proxmox.ve.desktop.part.SearchResources();
            sr.startListening();
            sr.setLimitType(idSplit[1]);

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