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

  events: {
    changeLogin: "qx.event.type.Data"
  },

  properties: {
    routeParams: {
      event: "changeRouteParams"
    },

    csrfPreventionToken: {
      init: null,
      nullable: true
    },

    language: {
      nullable: true,
      init: "en",
      apply: "_appyLanguage"
    }
  },

  members: {
    _blocker: null,
    _loginWindow: null,
    _contentViewClazz: null,
    _contentContainer: null,
    _contentContainerPromise: null,
    _contentContainerHolder: null,

    _serviceManager: null,
    _servicesTimer: null,

    _localStore: null,

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

      /**
       * Routing
       */
      var defaultRouteParams = {
        method: "GET",
        path: "/",
        id: "empty",
        pageId: "empty"
      };
      this.setRouteParams(defaultRouteParams);
      this._buildRoutes();

      /**
       * Localstore
       */
      this._localStore = new qx.bom.Storage.getLocal();

      /**
       * ServiceManager
       */
      var sm = this._serviceManager = new proxmox.core.service.Manager();
      sm.setBaseUrl("/api2/json");
      sm.registerEndpoint("cluster/resources", "cluster/resources", proxmox.ve.core.service.cluster.Resources);
      sm.registerEndpoint("cluster/tasks", "cluster/tasks", proxmox.ve.core.service.SimpleService);
      sm.registerEndpoint("access/domains", "access/domains", proxmox.ve.core.service.SimpleService);
      sm.registerEndpoint(
          "access/ticket",
          "access/ticket",
          proxmox.ve.core.service.SimpleService,
          proxmox.core.service.Manager.POST
      );
      sm.registerEndpoint(
        "internal:login",
        "access/ticket",
        proxmox.ve.core.service.LoginService
      );

      /**
       * Timers
       */
      var st = this._servicesTimer = new qx.event.Timer(5000);
      st.addListener("interval", () => {
        this._serviceManager.getService("cluster/resources").fetch(null, true).catch((ex) => {
          console.error(ex);
        });
        this._serviceManager.getService("cluster/tasks").fetch(null, true).catch((ex) => {
          console.error(ex);
        });
      });

      var main_container = new qx.ui.container.Composite(new qx.ui.layout.Dock());
      var blocker = this._blocker = new qx.ui.core.Blocker(main_container).set({
        color: "white",
        opacity: 0.4
      });

      // Search Field
      var sr = new proxmox.ve.desktop.part.SearchResources("cellTap", ["type", "description", "node", "pool"]);
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

      var versionLabel = new qx.ui.basic.Label("").set({ appearance: "header-label", rich: true });
      headerColumn.add(versionLabel);
      headerColumn.add(srf);
      headerColumn.add(new qx.ui.basic.Atom(), { flex: 1 });
      var loginLabel = new qx.ui.basic.Label("").set({ appearance: "header-label" });
      headerColumn.add(loginLabel);
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

      this.addListener("changeLogin", (e) => {
        var data = e.getData();

        if (data.login) {
          this._serviceManager.getService("cluster/resources").fetch(null, true).catch((ex) => {
            console.error(ex);
          });
          this._serviceManager.getService("cluster/tasks").fetch(null, true).catch((ex) => {
            console.error(ex);
          });

          // Timer
          this._servicesTimer.start();

          versionLabel.setValue(this.tr("Virtual Environment %1", "5.1-46"));
          loginLabel.setValue(this.tr("You are logged in as '%1'", data.fullusername));

          blocker.unblock();

          this.getRouter().init();

          if (this._loginWindow) {
            this._loginWindow.dispose();
            this._loginWindow = null;
          }
        } else {
          // Timer
          this._servicesTimer.stop();

          versionLabel.setValue(this.tr("Virtual Environment %1", "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"));
          loginLabel.setValue("");
          this.setPageView(proxmox.ve.desktop.page.Empty, defaultRouteParams);
          blocker.block();

          this._loginWindow = new proxmox.ve.desktop.window.Login();
          this._loginWindow.open();
        }
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
      this._contentContainerHolder = new qx.ui.container.Composite(new qx.ui.layout.Canvas());
      hspane.add(this._contentContainerHolder, 1)

      this.setPageView(proxmox.ve.desktop.page.Empty, defaultRouteParams);

      // Log row
      var logRow = new qx.ui.container.Composite(new qx.ui.layout.Basic());
      vspane.add(logRow, 0);

      var application_root = this.getRoot();
      application_root.add(main_container, { edge: 0 });

      // TODO: REMOVE ME!!!!
      // if (qx.core.Environment.get("qx.debug")) {
      //   this.getServiceManager().setBaseUrl("proxmox/json");
      //   this.fireDataEvent("changeLogin", {
      //     username: "root",
      //     password: "root",
      //     realm: "pam",
      //     login: true,
      //   });
      // } else {
      //   this.fireDataEvent("changeLogin", {login: false});
      // }
      this.getServiceManager().getService("internal:login").checkLoggedIn();
    },

    setPageView: function (clazz, routeParams) {
      if (this._contentViewClazz === clazz && this._contentView.getId() === routeParams.id) {
          if (qx.core.Environment.get("proxmox.debug-routing")) {
            console.debug(`Navigating to ("${routeParams.id}" -> "${routeParams.pageId}")`);
          }

          this._contentView.navigateToPageId(routeParams.pageId);
          this.setRouteParams(routeParams);
          return;
      }

      if (qx.core.Environment.get("proxmox.debug-routing")) {
        if (this._contentView) {
          console.debug(`Switching view from ("${this._contentView.getId()}") to ("${routeParams.id}" -> "${routeParams.pageId}")`);
        } else {
          console.debug(`Setting view to "${routeParams.id}" -> "${routeParams.pageId}"`);
        }
      }
      this._contentViewClazz = clazz;

      if (this._contentContainer != null) {
        if (this._contentContainerHolder._indexOf(this._contentContainer) !== -1) {
          this._contentContainerHolder.remove(this._contentContainer);
          this._contentContainer = null;
          if (this._contentView != null) {
            this._contentView.dispose();
            this._contentView = null;
          }
        }
      }

      var view = this._contentView = new (clazz)();
      view.set({
        id: routeParams.id
      });

      this._contentContainerPromise = view.getContainerAsync();
      this._contentContainerPromise.then((ct) => {
        this._contentContainer = ct;
        view.navigateToPageId(routeParams.pageId);
        this._contentContainerHolder.add(ct, {edge: 0});

        this.setRouteParams(routeParams);
      });
    },

    getServiceManager: function() {
      return this._serviceManager;
    },

    getLocalStore: function() {
      return this._localStore;
    },

    getRouter: function() {
      return this._router;
    },

    navigateTo: function(id, pageId) {
      if (!id && !pageId) {
        id = "datacenter";
        pageId = "search";
      }

      var routeParams = this.getRouteParams();
      if (!id) {
        id = routeParams.id
      }

      if (!pageId) {
        pageId = routeParams.pageId;
      }

      var route = "/" + id + "/" + pageId;
      if (qx.core.Environment.get("proxmox.debug-routing")) {
        console.debug(`Executing GET route: "${route}"`);
      }
      this._router.executeGet(route);
    },

    _buildRoutes: function() {
      qx.application.Routing.DEFAULT_PATH = '/datacenter/search';
      var r = this._router = new qx.application.Routing();

      r.onGet("^\/datacenter\/?(?:([a-zA-Z0-9\-\/]*))$", (data) => {
        var oldParams = this.getRouteParams();
        var routeParams = {
          method: "GET",
          path: data.path,
          id: "datacenter",
          pageId: data.params[0] != "" ? data.params[0] : oldParams.pageId
        };
        this.setPageView(proxmox.ve.desktop.page.Datacenter, routeParams);
      });

      r.onGet('/storage/{node}/{storage}\/?(?:([a-zA-Z0-9\-\/]*))$', (data) => {
        var id = "storage/" + data.params.node + "/" + data.params.storage;
        var oldParams = this.getRouteParams();
        var routeParams = {
          method: "GET",
          path: data.path,
          id: id,
          pageId: data.params[2] != "" ? data.params[2] : oldParams.pageId
        };

        this.setPageView(proxmox.ve.desktop.page.Storage, routeParams);
      });

      r.onGet('^\/(node|lxc|qemu|type|pool)+\/([a-zA-Z0-9]+)\/?(?:([a-zA-Z0-9\-\/]*))$', (data) => {
        var id = data.params[0] + "/" + data.params[1];
        var oldParams = this.getRouteParams();
        var routeParams = {
          method: "GET",
          path: data.path,
          id: id,
          pageId: data.params[2] != "" ? data.params[2] : oldParams.pageId
        };

        var clazz;
        switch (data.params[0]) {
          case "node":
            clazz = proxmox.ve.desktop.page.Node;
            break;
          case "lxc":
            clazz = proxmox.ve.desktop.page.Lxc;
            break;
          case "qemu":
            clazz = proxmox.ve.desktop.page.Qemu;
            break;
          case "type":
            clazz = proxmox.ve.desktop.page.Type;
            break;
          case "pool":
            clazz = proxmox.ve.desktop.page.Pool;
            break;
          default:
            clazz = proxmox.ve.desktop.page.Empty;
        }

        if (!clazz.SUBPAGES.includes(routeParams.pageId)) {
          routeParams.pageId = clazz.DEFAULT_PAGE_ID;
        }
        this.setPageView(clazz, routeParams);
      });
    },

    _appyLanguage: function(value) {
      if (value !== null) {
        qx.locale.Manager.getInstance().setLocale(value);
      }
    }
  },

  destruct: function() {
    this._disposeObjects("_serviceManager");
  }
});
