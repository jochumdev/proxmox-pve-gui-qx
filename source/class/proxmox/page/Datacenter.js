qx.Class.define("proxmox.page.Datacenter", {
    extend: qx.core.Object,
    implement: proxmox.page.core.IView,
    include: [
        qx.locale.MTranslation,
    ],

    properties: {
        id: {
            check: "String",
            nullable: true,
            init: null
        }
    },

    members: {
        getContainer: function () {
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
            var scroll = new qx.ui.container.Scroll().set({
                scrollbarX: "auto",
                scrollbarY: "auto",
                height: qx.bom.Viewport.getHeight() - 200
            });
            scroll.add(new qx.ui.core.Widget().set({ width: 2000, minWidth: 2000, height: 2000, minHeight: 2000 }));
            ct.add(scroll, {edge: "north", width: "100%"});

            return ct;
        },

        getDefaultPageId: function() {
            return "search"
        },

        navigateToPageId: function(pageId) {
            return pageId == "search" ? true : false;
        },
    }
});