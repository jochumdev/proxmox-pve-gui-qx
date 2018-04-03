qx.Class.define("proxmox.page.Storage", {
    extend: qx.core.Object,
    implement: proxmox.page.core.IView,
    include: [
        proxmox.page.core.MResourcePage
    ],

    members: {
        getDefaultPageId: function() {
            return "summary";
        },

        _getContentContainer: function () {
            var containerLayout = new qx.ui.layout.Dock();
            var container = new qx.ui.container.Composite(containerLayout).set({ appearance: "content-box" });

            var actionsBar = new qx.ui.container.Composite(new qx.ui.layout.HBox(5)).set({ appearance: "actionsbar-box" });
            actionsBar.setPadding([6, 5, 6, 8]);
            container.add(actionsBar, {edge: "north", width: "100%"});

            var headline = new qx.ui.basic.Label(this.getHeadline()).set({ appearance: "actionsbar-label" });
            actionsBar.add(headline);
            actionsBar.add(new qx.ui.basic.Atom(), { flex: 1 });
            actionsBar.add(new qx.ui.form.Button(this.tr("Help"), "@FontAwesome/question-circle"));

            var navbar = new proxmox.part.Navbar("storage");
            container.add(navbar.getContainer(), {edge: "west", height: "100%"});

            return container;
        },

        _getSubPage: function(pageId) {
            var subPage;
            switch(pageId) {
                case "summary":
                    subPage = new proxmox.page.storage.Summary();
                    break;
                default:
                    return false;
            }

            return subPage;
        }
    }
});