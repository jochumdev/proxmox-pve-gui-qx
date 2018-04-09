/* ************************************************************************

   Copyright: 2018 René Jochum

   License: MIT license

   Authors:

************************************************************************ */

/**
 * This is the main application class of "proxmox"
 * @asset(proxmox/*)
 * @asset(proxmox.ve.destkop/*)
 */
qx.Class.define("proxmox.ve.desktop.Application", {
    extend: qx.application.Standalone,
    include: [
        proxmox.ve.core.application.MApplication,
    ],

    members: {
        _contentContainerHolder: null,

        _blocker: null,
        _loginWindow: null,

        _servicesTimer: null,

        _versionLabel: null,
        _loginLabel: null,

        /**
         * This method contains the initial application code and gets called
         * during startup of the application
         *
         * @lint ignoreDeprecated(alert)
         */
        main: function () {
            // Call super class
            this.base(arguments);

            // Enable logging in debug variant
            if (qx.core.Environment.get("qx.debug")) {
                // support native logging capabilities, e.g. Firebug for Firefox
                qx.log.appender.Native;
                // support additional cross-browser console. Press F7 to toggle visibility
                qx.log.appender.Console;
            }

            // Init proxmox.ve.core.application.MApplication
            this.initve("proxmox.ve.desktop.page.");

            // Container holder
            var ctHolder = this._contentContainerHolder = new qx.ui.container.Composite(new qx.ui.layout.Canvas()).set({
                width: qx.bom.Viewport.getWidth(),
                height: qx.bom.Viewport.getHeight() - 100,
            });

            var emptyRouteParams = {
                id: "empty",
                pageId: "empty",
                pageClazz: proxmox.ve.desktop.page.Empty,
            };
            this.getNavigator().setRouteParams(emptyRouteParams);

            var main_container = new qx.ui.container.Composite(new qx.ui.layout.Dock());
            this._blocker = new qx.ui.core.Blocker(main_container).set({
                color: "white",
                opacity: 0.4
            });

            // Search Field
            var sr = new proxmox.ve.desktop.part.SearchResources("cellTap", ["type", "description", "node", "pool"]);
            sr.setStateStoreKey("qx-globalsearchtable-columnstate");
            var srf = sr.getSearchField();
            var srTable = sr.getContainer();
            var searchWindow = new proxmox.ve.desktop.window.SearchTable(srTable);
            srTable.addListener("cellTap", (e) => {
                sr.stopListening();
                searchWindow.close();
            });
            srf.addListener("focusin", (e) => {
                var srfBounds = srf.getBounds();
                searchWindow.moveTo(srfBounds.left - 10, srfBounds.top + srfBounds.height - 10);

                sr.startListening();

                searchWindow.show();
            });
            srf.addListener("focusout", (e) => {
                qx.event.Timer.once(() => {
                    sr.stopListening();
                    searchWindow.close();
                }, this, 100);
            });


            // Header
            var headerColumn = new qx.ui.container.Composite(new qx.ui.layout.HBox(5));
            headerColumn.setPadding(5);
            main_container.add(headerColumn, { edge: "north", width: "100%" });

            var proxmoxLogo = new qx.ui.basic.Image("proxmox/image/proxmox_logo.png");
            headerColumn.add(proxmoxLogo);
            proxmoxLogo.addListener("click", (e) => {
                var win = window.open("https://www.proxmox.com", '_blank');
                win.focus();
            });

            this._versionLabel = new qx.ui.basic.Label("").set({ appearance: "header-label", rich: true });
            headerColumn.add(this._versionLabel);
            headerColumn.add(srf);
            headerColumn.add(new qx.ui.basic.Atom(), { flex: 1 });
            this._loginLabel = new qx.ui.basic.Label("").set({ appearance: "header-label" });
            headerColumn.add(this._loginLabel);
            headerColumn.add(new proxmox.core.ui.basic.CssImage(["fa", "fa-gear"]).set({ appearance: "header-label" }));
            var docButton = new proxmox.core.ui.form.CssButton(this.tr("Documentation"), ["fa", "fa-book"]).set({ appearance: "white-button-header" });
            docButton.addListener("execute", (e) => {
                var win = window.open("/pve-docs/index.html", '_blank');
                win.focus();
            });
            headerColumn.add(docButton);
            headerColumn.add(new proxmox.core.ui.form.CssButton(this.tr("Create VM"), ["fa", "fa-desktop"]).set({ appearance: "blue-button-header" }));
            var buttonCreateCT = new proxmox.core.ui.form.CssButton(this.tr("Create CT"), ["fa", "fa-cube"]).set({ appearance: "blue-button-header" });
            headerColumn.add(buttonCreateCT);
            var logoutButton = new proxmox.core.ui.form.CssButton(this.tr("Logout"), ["fa", "fa-sign-out"]).set({ appearance: "blue-button-header" });
            headerColumn.add(logoutButton);

            logoutButton.addListener("execute", (e) => {
                this.getServiceManager().getService("internal:login").logout();
            });

            // Vertical splitpane for the log
            var vspane = new qx.ui.splitpane.Pane("vertical");
            main_container.add(vspane, { edge: "north", width: "100%" });

            // Horizontal splitpane for Navigation + Content
            var hspane = new qx.ui.splitpane.Pane("horizontal");
            vspane.add(hspane, 1)

            // Left tree column
            var serverBrowser = new proxmox.ve.desktop.part.ServerBrowser();
            hspane.add(serverBrowser.getContainer(), 0);

            // Container holder
            hspane.add(ctHolder, 1)

            // this._navigator.setPageView(emptyRouteParams);

            // Log row
            var logRow = new qx.ui.container.Composite(new qx.ui.layout.Basic());
            vspane.add(logRow, 0);

            var application_root = this.getRoot();
            application_root.add(main_container, { edge: 0 });

            this.getServiceManager().getService("internal:login").checkLoggedIn();
        },

        _appplyContentContainer: function (value, old) {
            var ctHolder = this._contentContainerHolder;

            if (value === null) {
                if (ctHolder._indexOf(old) !== -1) {
                    ctHolder.remove(old);
                }
            } else {
                ctHolder.add(value, { edge: 0 });
            }
        },

        _onLogin: function (data) {
            // Versioninfo
            if (this.getVersionInfo() === null) {
                this.addListenerOnce("changeVersionInfo", (e) => {
                    var model = e.getData();
                    this._versionLabel.setValue(this.tr("Virtual Environment %1", `${model.getVersion()}-${model.getRelease()}`));
                });
            } else {
                var model = this.getVersionInfo();
                this._versionLabel.setValue(this.tr("Virtual Environment %1", `${model.getVersion()}-${model.getRelease()}`));
            }

            this._loginLabel.setValue(this.tr("You are logged in as '%1'", data.fullusername));

            this._blocker.unblock();

            if (this._loginWindow !== null) {
                this._loginWindow.dispose();
                this._loginWindow = null;
            }
        },

        _onLogout: function(data) {
            this._versionLabel.setValue(this.tr("Virtual Environment %1", "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"));
            this._loginLabel.setValue("");
            this._navigator.setPageView(emptyRouteParams);
            this._blocker.block();

            this._loginWindow = new proxmox.ve.desktop.window.Login();
            this._loginWindow.open();
        },
    }
});
