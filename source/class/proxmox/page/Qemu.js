qx.Class.define("proxmox.page.Qemu", {
    extend: qx.core.Object,
    implement: proxmox.page.core.IView,
    include: [
        proxmox.page.core.MResourcePage
    ],

    statics: {
        SUBPAGES: ["summary"],
        DEFAULT_PAGE_ID: "summary"
    },

    members: {
        _getContentContainer: function () {
            var containerLayout = new qx.ui.layout.Dock();
            var container = new qx.ui.container.Composite(containerLayout).set({ appearance: "content-box" });

            var actionsBar = new qx.ui.container.Composite(new qx.ui.layout.HBox(5)).set({ appearance: "actionsbar-box" });
            actionsBar.setPadding([6, 5, 6, 8]);
            container.add(actionsBar, {edge: "north", width: "100%"});

            var headline = new qx.ui.basic.Label(this.getResourceData().getHeadline()).set({ appearance: "actionsbar-label" });
            actionsBar.add(headline);
            actionsBar.add(new qx.ui.basic.Atom(), { flex: 1 });
            actionsBar.add(new proxmox.ui.form.CssButton(this.tr("Start"), ["fa", "fa-book"]));
            actionsBar.add(new proxmox.ui.form.CssButton(this.tr("Shutdown"), ["fa", "fa-power-off"]));
            actionsBar.add(new proxmox.ui.form.CssButton(this.tr("Migrate"), ["fa", "fa-paper-plane-o"]));
            actionsBar.add(new proxmox.ui.form.CssButton(this.tr("Console"), ["fa", "fa-terminal"]));
            actionsBar.add(new proxmox.ui.form.CssButton(this.tr("More"), ["fa", "fa-book"]));
            actionsBar.add(new proxmox.ui.form.CssButton(this.tr("Help"), ["fa", "fa-question-circle"]));

            var navbar = new proxmox.part.Navbar("qemu");
            container.add(navbar.getContainer(), {edge: "west", height: "100%"});

            return container;
        },

        _getSubPage: function(pageId) {
            var subPage;
            switch(pageId) {
                case "summary":
                    subPage = new proxmox.page.qemu.Summary();
                    break;
                default:
                    return false;
            }

            return subPage;
        }
    }
});