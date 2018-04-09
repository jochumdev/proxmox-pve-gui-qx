qx.Class.define("proxmox.ve.desktop.page.Lxc", {
    extend: proxmox.ve.desktop.page.core.ResourcePage,

    statics: {
        SUBPAGES: ["summary", "console"],
        DEFAULT_PAGE_ID: "summary"
    },

    properties: {
        currentData: {
            event: "changeCurrentData",
            nullable: true,
        },
    },

    members: {
        _currentService: null,

        _tbStartButton: null,
        _tbShutdownButton: null,
        _tbConsoleButton: null,

        // overriden
        _init: function() {
            var resourceData = this.getResourceData();
            var sm = this._serviceManager;

            // The "current" service
            var cs = this._currentService = sm.getResourceService(
                "nodes/{node}/{fullVmId}/status/{action}",
                [resourceData.getNode(), resourceData.getId(), "current"],
            );
            cs.set({
                wantsTimer: true,
            });
            cs.addListener("changeModel", this.setCurrentData, this);
            cs.fetch();

            /**
             * Start/Shutdown button.
             */
            this._tbStartButton = new proxmox.core.ui.form.CssButton(this.tr("Start"), ["fa", "fa-play"]);
            this._tbShutdownButton = new proxmox.core.ui.form.CssButton(this.tr("Shutdown"), ["fa", "fa-power-off"]);
            this._tbStartButton.addListener("execute", () => {
                this.removeListener("changeResourceData", this._buttonsOnResourceDataChanged);
                this._tbStartButton.setEnabled(false);
                this._tbShutdownButton.setEnabled(true);

                var sv = sm.getUnregisteredResourceService(
                    "nodes/{node}/{fullVmId}/status/{action}",
                    [resourceData.getNode(), resourceData.getId(), "start"],
                    proxmox.core.service.Manager.POST,
                ).fetch().finally(() => {
                    this.addListener("changeResourceData", this._buttonsOnResourceDataChanged, this);
                    sv.dispose();
                });
            });

            this._tbShutdownButton.addListener("execute", () => {
                this.removeListener("changeResourceData", this._buttonsOnResourceDataChanged);
                this._tbStartButton.setEnabled(true);
                this._tbShutdownButton.setEnabled(false);

                var sv = sm.getUnregisteredResourceService(
                    "nodes/{node}/{fullVmId}/status/{action}",
                    [resourceData.getNode(), resourceData.getId(), "shutdown"],
                    proxmox.core.service.Manager.POST,
                ).fetch().finally(() => {
                    this.addListener("changeResourceData", this._buttonsOnResourceDataChanged, this);
                    sv.dispose();
                });
            });

            /**
             * Console buttons
             */
            var consoleMenu = new qx.ui.menu.Menu().set({
                offsetLeft: -93,
            });

            var cmNovnc = new qx.ui.menu.Button("noVNC", "proxmox/image/novnc.png");
            cmNovnc.addListener("execute", () => {
                var rdata = this.getResourceData();
                proxmox.ve.core.Utils.openVNCViewer(rdata.getType(), rdata.getShortId(), rdata.getNode(), rdata.getName());
            });
            consoleMenu.add(cmNovnc);
            var cmSpice = new qx.ui.menu.Button("SPICE", "proxmox/image/virt-viewer.png");
            consoleMenu.add(cmSpice);
            var cmXtermjs = new qx.ui.menu.Button("xterm.js", "proxmox/image/xtermjs.png");
            cmXtermjs.addListener("execute", () => {
                var rdata = this.getResourceData();
                proxmox.core.Utils.openXtermJsViewer(rdata.getType(), rdata.getShortId(), rdata.getNode(), rdata.getName());
            });
            consoleMenu.add(cmXtermjs);

            consoleMenu.setMinWidth(120);
            this._tbConsoleButton = new proxmox.core.ui.form.CssSplitButton(this.tr("Console"), ["fa", "fa-terminal"], consoleMenu);


            /**
             * Update buttons
             */
            // First time
            var e = new qx.event.type.Data();
            e.init(resourceData);
            this._buttonsOnResourceDataChanged(e);

            // Now listen to the service
            this.addListener("changeResourceData", this._buttonsOnResourceDataChanged, this);
        },

        // overriden
        _destroy: function() {
            this._currentService.removeListener("changeModel", this.setCurrentData);
        },

        _getContentContainer: function () {
            var containerLayout = new qx.ui.layout.Dock();
            var container = new qx.ui.container.Composite(containerLayout).set({ appearance: "content-box" });

            var toolbar = new qx.ui.container.Composite(new qx.ui.layout.HBox(5)).set({ appearance: "toolbar-box" });
            toolbar.setPadding([6, 5, 6, 8]);
            container.add(toolbar, {edge: "north", width: "100%"});

            var headline = new qx.ui.basic.Label(this.getResourceData().getHeadline()).set({ appearance: "toolbar-label" });
            toolbar.add(headline);
            toolbar.add(new qx.ui.basic.Atom(), { flex: 1 });
            toolbar.add(this._tbStartButton);
            toolbar.add(this._tbShutdownButton);
            toolbar.add(new proxmox.core.ui.form.CssButton(this.tr("Migrate"), ["fa", "fa-paper-plane-o"]));
            toolbar.add(this._tbConsoleButton);
            toolbar.add(new proxmox.core.ui.form.CssButton(this.tr("More")));
            toolbar.add(new proxmox.core.ui.form.CssButton(this.tr("Help"), ["fa", "fa-question-circle"]));

            var navbar = new proxmox.ve.desktop.part.Navbar("lxc");
            container.add(navbar.getContainer(), {edge: "west", height: "100%"});

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

        _buttonsOnResourceDataChanged: function(e) {
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