qx.Class.define("pved.page.Node", {
    extend: pved.page.core.ResourcePage,

    statics: {
        SUBPAGES: ["summary"],
        DEFAULT_PAGE_ID: "summary"
    },

    members: {
        _getContentContainer: function () {
            var containerLayout = new qx.ui.layout.Dock();
            var container = new qx.ui.container.Composite(containerLayout).set({ appearance: "content-box" });

            var toolbar = new qx.ui.container.Composite(new qx.ui.layout.HBox(5)).set({ appearance: "toolbar-box" });
            toolbar.setPadding([6, 5, 6, 8]);
            container.add(toolbar, {edge: "north", width: "100%"});

            var headline = new qx.ui.basic.Label(this.getResourceData().getHeadline()).set({ appearance: "toolbar-label" });
            toolbar.add(headline);
            toolbar.add(new qx.ui.basic.Atom(), { flex: 1 });
            toolbar.add(new p.ui.form.CssButton(this.tr("Start"), ["fa", "fa-book"]));
            toolbar.add(new p.ui.form.CssButton(this.tr("Shutdown"), ["fa", "fa-power-off"]));
            toolbar.add(new p.ui.form.CssButton(this.tr("Migrate"), ["fa", "fa-paper-plane-o"]));
            toolbar.add(new p.ui.form.CssButton(this.tr("Console"), ["fa", "fa-terminal"]));
            toolbar.add(new p.ui.form.CssButton(this.tr("More"), ["fa", "fa-book"]));
            toolbar.add(new p.ui.form.CssButton(this.tr("Help"), ["fa", "fa-question-circle"]));

            var navbar = new pved.part.Navbar("node");
            container.add(navbar.getContainer(), {edge: "west", height: "100%"});

            return container;
        },

        _getSubPage: function(pageId) {
            var subPage;
            switch(pageId) {
                case "summary":
                    subPage = new pved.page.node.Summary();
                    break;
                default:
                    return false;
            }

            return subPage;
        }
    }
});