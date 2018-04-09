qx.Class.define("pved.page.Qemu", {
    extend: pved.page.core.ResourcePage,

    statics: {
        SUBPAGES: ["summary"],
        DEFAULT_PAGE_ID: "summary"
    },

    properties: {
        currentData: {
            async: true,
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
                "nodes/{node}/{fullVmId}/status/{command}",
                [resourceData.getNode(), resourceData.getId(), "current"],
            );
            cs.set({
                wantsTimer: true,
            });
            cs.addListener("changeModel", this._setCurrentData, this);
            cs.fetch();

            /**
             * Start/Shutdown button.
             */
            this._tbStartButton = new p.ui.form.CssButton(this.tr("Start"), ["fa", "fa-fw", "fa-play"]);
            this._tbShutdownButton = new p.ui.form.CssButton(this.tr("Shutdown"), ["fa", "fa-power-off"]);
            this._tbStartButton.addListener("execute", () => {
                this.removeListener("changeResourceData", this._buttonsOnResourceDataChanged);
                this._tbStartButton.setEnabled(false);
                this._tbShutdownButton.setEnabled(true);

                var sv = sm.getUnregisteredResourceService(
                    "nodes/{node}/{fullVmId}/status/{command}",
                    [resourceData.getNode(), resourceData.getId(), "start"],
                    p.service.Manager.POST,
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
                    "nodes/{node}/{fullVmId}/status/{command}",
                    [resourceData.getNode(), resourceData.getId(), "shutdown"],
                    p.service.Manager.POST,
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

            var cmNovnc = new qx.ui.menu.Button("noVNC", "p/images/novnc.png");
            cmNovnc.addListener("execute", () => {
                pvec.Utils.openVNCViewer(resourceData.getType(), resourceData.getShortId(), resourceData.getNode(), resourceData.getName());
            }, this);
            consoleMenu.add(cmNovnc);
            var cmSpice = new qx.ui.menu.Button("SPICE", "p/images/virt-viewer.png");
            cmSpice.addListener("execute", (e) => {
                this.getCurrentDataAsync().then((model) => {
                    var allowSpice = model.getSpice() === 1;
                    pvec.Utils.openDefaultConsoleWindow(allowSpice, resourceData.getType(), resourceData.getShortId(), resourceData.getNode(), resourceData.getName());
                });
            }, this);
            consoleMenu.add(cmSpice);
            var cmXtermjs = new qx.ui.menu.Button("xterm.js", "p/images/xtermjs.png");
            cmXtermjs.addListener("execute", () => {
                p.Utils.openXtermJsViewer(resourceData.getType(), resourceData.getShortId(), resourceData.getNode(), resourceData.getName());
            }, this);
            consoleMenu.add(cmXtermjs);

            consoleMenu.setMinWidth(120);
            this._tbConsoleButton = new p.ui.form.CssSplitButton(this.tr("Console"), ["fa", "fa-terminal"], consoleMenu);
            this._tbConsoleButton.addListener("execute", (e) => {
                this.getCurrentDataAsync().then((model) => {
                    var allowSpice = model.getSpice() === 1;
                    pvec.Utils.openDefaultConsoleWindow(allowSpice, resourceData.getType(), resourceData.getShortId(), resourceData.getNode(), resourceData.getName());
                });
            }, this);

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
            this._currentService.removeListener("changeModel", this._setCurrentData);
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
            toolbar.add(new p.ui.form.CssButton(this.tr("Migrate"), ["fa", "fa-paper-plane-o"]));
            toolbar.add(this._tbConsoleButton);
            toolbar.add(new p.ui.form.CssButton(this.tr("More"), ["fa", "fa-book"]));
            toolbar.add(new p.ui.form.CssButton(this.tr("Help"), ["fa", "fa-question-circle"]));

            var navbar = new pved.part.Navbar("qemu");
            container.add(navbar.getContainer(), {edge: "west", height: "100%"});

            return container;
        },

        _getSubPage: function(pageId) {
            var subPage;
            switch(pageId) {
                case "summary":
                    subPage = new pved.page.qemu.Summary();
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
        },

        _setCurrentData: function(e) {
            this.setCurrentDataAsync(e.getData()).then(() => null);
        },
    }
});