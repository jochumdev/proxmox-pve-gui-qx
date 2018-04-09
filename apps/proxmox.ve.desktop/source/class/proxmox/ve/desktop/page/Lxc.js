qx.Class.define("proxmox.ve.desktop.page.Lxc", {
    extend: proxmox.ve.desktop.page.core.ResourcePage,

    statics: {
        SUBPAGES: ["summary", "console"],
        DEFAULT_PAGE_ID: "summary"
    },

    members: {
        _tbStartButton: null,
        _tbShutdownButton: null,

        _getContentContainer: function () {
            var containerLayout = new qx.ui.layout.Dock();
            var container = new qx.ui.container.Composite(containerLayout).set({ appearance: "content-box" });

            var toolbar = new qx.ui.container.Composite(new qx.ui.layout.HBox(5)).set({ appearance: "toolbar-box" });
            toolbar.setPadding([6, 5, 6, 8]);
            container.add(toolbar, {edge: "north", width: "100%"});

            var consoleMenu = new qx.ui.menu.Menu().set({
                offsetLeft: -93,
            });

            var cmNovnc = new qx.ui.menu.Button("noVNC", "proxmox/image/novnc.png");
            consoleMenu.add(cmNovnc);
            var cmSpice = new qx.ui.menu.Button("SPICE", "proxmox/image/virt-viewer.png");
            consoleMenu.add(cmSpice);
            var cmXtermjs = new qx.ui.menu.Button("xterm.js", "proxmox/image/xtermjs.png");
            consoleMenu.add(cmXtermjs);

            consoleMenu.setMinWidth(120);
            var consoleButton = new proxmox.core.ui.form.CssSplitButton(this.tr("Console"), ["fa", "fa-terminal"], consoleMenu);
            var startButton = this._tbStartButton = new proxmox.core.ui.form.CssButton(this.tr("Start"), ["fa", "fa-play"]);
            var shutdownButton = this._tbShutdownButton = new proxmox.core.ui.form.CssButton(this.tr("Shutdown"), ["fa", "fa-power-off"]);

            var headline = new qx.ui.basic.Label(this.getResourceData().getHeadline()).set({ appearance: "toolbar-label" });
            toolbar.add(headline);
            toolbar.add(new qx.ui.basic.Atom(), { flex: 1 });
            toolbar.add(startButton);
            toolbar.add(shutdownButton);
            toolbar.add(new proxmox.core.ui.form.CssButton(this.tr("Migrate"), ["fa", "fa-paper-plane-o"]));
            toolbar.add(consoleButton);
            toolbar.add(new proxmox.core.ui.form.CssButton(this.tr("More"), ["fa", "fa-book"]));
            toolbar.add(new proxmox.core.ui.form.CssButton(this.tr("Help"), ["fa", "fa-question-circle"]));

            var navbar = new proxmox.ve.desktop.part.Navbar("lxc");
            container.add(navbar.getContainer(), {edge: "west", height: "100%"});

            // The other times
            this.addListener("changeResourceData", this._onResourceDataChanged, this);

            return container;
        },

        _getSubPage: function(pageId) {
            var subPage;
            switch(pageId) {
                case "summary":
                    subPage = new proxmox.ve.desktop.page.lxc.Summary();
                    break;
                case "console":
                    subPage = new proxmox.ve.desktop.page.lxc.Console();
                    break;
                default:
                    return false;
            }

            return subPage;
        },

        _onResourceDataChanged: function(e) {
            var data = e.getData();
            if (data.getStatus() === "running") {
                this._tbStartButton.setEnabled(false);
                this._tbShutdownButton.setEnabled(true);
            } else {
                this._tbStartButton.setEnabled(true);
                this._tbShutdownButton.setEnabled(false);
            }
        }
    }
});