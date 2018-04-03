/* ************************************************************************

   Copyright: 2018 René Jochum

   License: MIT license

   Authors:

************************************************************************ */

/**
 * This is the main application class of "proxmox"
 *
 * @asset(proxmox/*)
 */
qx.Class.define("proxmox.Application", {
  extend: qx.application.Standalone,

  events: {
    changeLogin: "qx.event.type.Data"
  },

  properties: {
    routeParams: {
      event: "changeRouteParams"
    }
  },

  members: {
    _blocker: null,
    _loginWindow: null,
    _contentViewClazz: null,
    _contentContainer: null,
    _contentContainerHolder: null,

    _services: null,
    _servicesTimer: null,

    _router: null,

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

      /*
      -------------------------------------------------------------------------
        Below is your actual application code...
      -------------------------------------------------------------------------
      */
      var r = qxc.require.Init.getInstance();
      r.addResourceManagerPath("fetch", "proxmox/js/fetch.min.js");

      // Must be last
      r.init();

      var defaultRouteParams = {
        method: "GET",
        path: "/",
        id: "empty",
        pageId: "empty"
      };
      this.setRouteParams(defaultRouteParams);
      this._buildRoutes();

      this._services = {
        resources: new proxmox.service.Resources(),
        tasks: new proxmox.service.Tasks()
      };
      var st = this._servicesTimer = new qx.event.Timer(3000);
      st.addListener("interval", () => {
        this._services.resources.fetch();
        this._services.tasks.fetch();
      });

      var main_container = new qx.ui.container.Composite(new qx.ui.layout.Dock());
      var blocker = this._blocker = new qx.ui.core.Blocker(main_container).set({
        color: "white",
        opacity: 0.4
      });

      var loginWindow = this._loginWindow = new proxmox.window.Login();
      loginWindow.addListener("changeLogin", (e) => {
        this.fireDataEvent("changeLogin", e.getData());
      });
      loginWindow.moveTo(
        Math.round((qx.bom.Viewport.getWidth() - loginWindow.getWidth()) / 2),
        Math.round((qx.bom.Viewport.getHeight() - loginWindow.getHeight()) / 2)
      );

      // Header
      var headerColumn = new qx.ui.container.Composite(new qx.ui.layout.HBox(5));
      headerColumn.setPadding(5);
      main_container.add(headerColumn, { edge: "north", width: "100%" });

      headerColumn.add(new qx.ui.basic.Image("proxmox/proxmox_logo.png"));
      var versionLabel = new qx.ui.basic.Label("").set({ appearance: "header-label", rich: true });
      headerColumn.add(versionLabel);
      headerColumn.add(new qx.ui.form.TextField().set({ placeholder: this.tr("Search"), height: 22 }).set({ width: 168, appearance: "header-search" }));
      headerColumn.add(new qx.ui.basic.Atom(), { flex: 1 });
      var loginLabel = new qx.ui.basic.Label("").set({ appearance: "header-label" });
      headerColumn.add(loginLabel);
      headerColumn.add(new qx.ui.basic.Image("@FontAwesome/cog").set({ appearance: "header-label" }));
      var docButton = new qx.ui.form.Button(this.tr("Documentation"), "@FontAwesome/book").set({ appearance: "white-button-header" });
      docButton.addListener("execute", (e) => {
        var win = window.open("https://pve.proxmox.com/pve-docs/", '_blank');
        win.focus();
      });
      headerColumn.add(docButton);
      headerColumn.add(new qx.ui.form.Button(this.tr("Create VM"), "@FontAwesome/desktop").set({ appearance: "blue-button-header" }));
      var buttonCreateCT = new qx.ui.form.Button(this.tr("Create CT"), "@FontAwesome/cube").set({ appearance: "blue-button-header" });
      headerColumn.add(buttonCreateCT);
      var logoutButton = new qx.ui.form.Button(this.tr("Logout"), "@FontAwesome/sign-out").set({ appearance: "blue-button-header" });
      headerColumn.add(logoutButton);

      logoutButton.addListener("execute", (e) => {
        this.fireDataEvent("changeLogin", { login: false });
      });

      this.addListener("changeLogin", (e) => {
        var data = e.getData();

        if (data.login) {
          this._services.resources.fetch();
          this._services.tasks.fetch();
          this._servicesTimer.start();

          versionLabel.setValue(this.tr("Virtual Environment %1", "5.1-46"));
          loginLabel.setValue(this.tr("You are logged in as '%1'", data.username + "@" + data.realm));

          blocker.unblock();

          this.getRouter().init();
        } else {
          this._servicesTimer.stop();
          versionLabel.setValue(this.tr("Virtual Environment %1", "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"));
          loginLabel.setValue("");
          this.setPageView(proxmox.page.Empty, defaultRouteParams);
          blocker.block();
          loginWindow.open();
        }
      });

      // Vertical splitpane for the log
      var vspane = new qx.ui.splitpane.Pane("vertical");
      main_container.add(vspane, { edge: "north", width: "100%" });

      // Horizontal splitpane for Navigation + Content
      var hspane = this._contentContainerHolder = new qx.ui.splitpane.Pane("horizontal");
      vspane.add(hspane, 1)

      // Left tree column
      var serverBrowser = new proxmox.part.ServerBrowser("server");
      hspane.add(serverBrowser.getContainer(), 0);

      this.setPageView(proxmox.page.Empty, defaultRouteParams);

      // Log row
      var logRow = new qx.ui.container.Composite(new qx.ui.layout.Basic());
      vspane.add(logRow, 0);

      var application_root = this.getRoot();
      application_root.add(main_container, { edge: 0 });

      // TODO: REMOVE ME!!!!
      if (qx.core.Environment.get("qx.debug")) {
        this.fireDataEvent("changeLogin", {
          username: "root",
          password: "root",
          realm: "pam",
          login: true
        });
      } else {
        this.fireDataEvent("changeLogin", {login: false});
      }
    },

    setPageView: function (clazz, routeParams) {
      if (this._contentViewClazz === clazz && this._contentView.getId() == routeParams.id) {
          if (!this._contentView.navigateToPageId(routeParams.pageId)) {
            this.navigateTo(routeParams.id, this._contentView.getDefaultPageId());
            return;
          }

          this.setRouteParams(routeParams);
          return;
      }

      this._contentViewClazz = clazz;

      if (this._contentContainer != null) {
        if (this._contentContainerHolder._indexOf(this._contentContainer) !== -1) {
          this._contentContainerHolder.remove(this._contentContainer);
          this._contentContainer = null;
          this._contentView = null;
        }
      }

      var view = this._contentView = new (clazz)();
      view.set({
        id: routeParams.id
      });

      var ct = this._contentContainer = view.getContainer();
      if (!view.navigateToPageId(routeParams.pageId)) {
        this.navigateTo(routeParams.id, view.getDefaultPageId());
        return;
      }
      this._contentContainerHolder.add(ct, 1);

      this.setRouteParams(routeParams);
    },

    getService: function(service) {
      return this._services[service];
    },

    getRouter: function() {
      return this._router;
    },

    navigateTo: function(id, pageId) {
      if (!id && !pageId) {
        return;
      }

      var routeParams = this.getRouteParams();
      if (!id) {
        id = routeParams.id
      }

      if (!pageId) {
        pageId = routeParams.pageId;
      }

      this._router.executeGet("/" + id + "/" + pageId);
    },

    _buildRoutes: function() {
      qx.application.Routing.DEFAULT_PATH = '/datacenter/search';
      var r = this._router = new qx.application.Routing();

      r.onGet("^\/datacenter\/?(?:([a-z0-9\-\/]*))$", (data) => {
        var oldParams = this.getRouteParams();
        var routeParams = {
          method: "GET",
          path: data.path,
          id: "datacenter",
          pageId: data.params[0] != "" ? data.params[0] : oldParams.pageId
        };
        this.setPageView(proxmox.page.Datacenter, routeParams);
      });

      r.onGet('/storage/{node}/{storage}\/?(?:([a-z0-9\-\/]*))$', (data) => {
        var id = "storage/" + data.params.node + "/" + data.params.storage;
        var oldParams = this.getRouteParams();
        var routeParams = {
          method: "GET",
          path: data.path,
          id: id,
          pageId: data.params[2] != "" ? data.params[2] : oldParams.pageId
        };

        this.setPageView(proxmox.page.Storage, routeParams);
      });

      r.onGet('^\/(node|lxc|qemu|type)+\/([a-z0-9]+)\/?(?:([a-z0-9\-\/]*))$', (data) => {
        var id = data.params[0] + "/" + data.params[1];
        var oldParams = this.getRouteParams();
        routeParams = {
          method: "GET",
          path: data.path,
          id: id,
          pageId: data.params[2] != "" ? data.params[2] : oldParams.pageId
        };

        switch (data.params[0]) {
          case "node":
            this.setPageView(proxmox.page.Node, routeParams);
            break;
          case "lxc":
            this.setPageView(proxmox.page.Lxc, routeParams);
            break;
          case "qemu":
            this.setPageView(proxmox.page.Qemu, routeParams);
            break;
          case "type":
            this.setPageView(proxmox.page.Type, routeParams);
            break;
          default:
            this.setPageView(proxmox.page.Empty, routeParams);
        }
      });
    }
  }
});
