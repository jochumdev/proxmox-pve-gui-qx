qx.Class.define("proxmox.ve.desktop.page.Type", {
    extend: proxmox.ve.desktop.page.core.Page,

    statics: {
        SUBPAGES: ["search"],
        DEFAULT_PAGE_ID: "search"
    },

    members: {
        _getContentContainer: function () {
            var ct = new qx.ui.container.Composite(new qx.ui.layout.Dock()).set({ appearance: "content-box" });

            var toolbar = new qx.ui.container.Composite(new qx.ui.layout.HBox(5)).set({ appearance: "toolbar-box" });
            toolbar.setPadding([6, 5, 6, 8]);
            ct.add(toolbar, { edge: "north", width: "100%" });

            var idSplit = this.getId().split("/");

            var headline;
            switch (idSplit[1]) {
                case "lxc":
                    var headline = new qx.ui.basic.Label(this.tr("LXC Container")).set({ appearance: "toolbar-label" });
                    break;
                case "qemu":
                    var headline = new qx.ui.basic.Label(this.tr("Virtual Machine")).set({ appearance: "toolbar-label" });
                    break;
                case "node":
                    var headline = new qx.ui.basic.Label(this.tr("Nodes")).set({ appearance: "toolbar-label" });
                    break;
                case "storage":
                    var headline = new qx.ui.basic.Label(this.tr("Storage")).set({ appearance: "toolbar-label" });
                    break;
                case "pool":
                    var headline = new qx.ui.basic.Label(this.tr("Pool")).set({ appearance: "toolbar-label" });
                    break;
                default:
                    var headline = new qx.ui.basic.Label(this.tr("Unknown")).set({ appearance: "toolbar-label" });
            }

            toolbar.add(headline);
            toolbar.add(new qx.ui.basic.Atom(), { flex: 1 });
            toolbar.add(new proxmox.core.ui.form.CssButton(this.tr("Help"), ["fa", "fa-question-circle"]));

            var navbar = new proxmox.ve.desktop.part.Navbar("searchOnly");
            ct.add(navbar.getContainer(), { edge: "west", height: "100%" });

            // Content
            var sr = this._searchResources = new proxmox.ve.desktop.part.SearchResources();
            sr.startListening();
            sr.setLimitType(idSplit[1]);

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