/**
 * Mixing for Proxmox VE Applications.
 *
 * Users have to implement "_onLogin" and "_onLogout".
 */
qx.Mixin.define("pvec.application.MApplication", {
    include: [
        p.application.MApplication,
    ],

    events: {
        changeLogin: "qx.event.type.Data"
    },

    properties: {
        csrfPreventionToken: {
            init: null,
            nullable: true
        },

        language: {
            nullable: true,
            init: "en",
            apply: "_appyLanguage"
        },
        versionInfo: {
            event: "changeVersionInfo",
            nullable: true,
        }
    },

    members: {
        _pagebasepath: null,

        initve: function (pagebasepath) {
            this.initcore();
            this.getNavigator().setDefaultId("datacenter");
            this.getNavigator().setDefaultPageId("search");

            this._pagebasepath = pagebasepath;

            this._registerSMEndpoints();
            this._buildRoutes();

            // Login state changes
            this.addListener("changeLogin", this._onVELoginChange, this);
        },

        _registerSMEndpoints: function() {
            /**
             * ServiceManager
             */
            var sm = this.getServiceManager();
            sm.setBaseUrl("/api2/json");
            sm.registerEndpoint(
                "cluster/resources",
                "cluster/resources",
                pvec.service.cluster.Resources,
                null,   // method - default GET
                true, // wantsTimer
            );
            sm.registerEndpoint(
                "cluster/tasks",
                "cluster/tasks",
                pvec.service.SimpleService,
                null,   // method - default GET
                true, // wantsTimer
            );
            sm.registerEndpoint(
                "access/domains",
                "access/domains",
                pvec.service.SimpleService,
                null,   // method - default GET
                false, // wantsTimer
            );
            sm.registerEndpoint(
                "version",
                "version",
                pvec.service.SimpleService,
                null,   // method - default GET
                false, // wantsTimer
            );
            sm.registerEndpoint(
                "internal:login",
                "access/ticket",
                pvec.service.LoginService,
                null,   // method - default GET
                false, // wantsTimer
            );

            // Yes, we can register the same service with different methods.
            sm.registerEndpoint(
                "nodes/{node}/{fullVmId}/status/{command}",
                "nodes/%1/%2/status/%3",
                pvec.service.SimpleService,
                null,   // method - default GET
                false,
            );
            sm.registerEndpoint(
                "nodes/{node}/{fullVmId}/status/{command}",
                "nodes/%1/%2/status/%3",
                pvec.service.SimpleService,
                p.service.Manager.POST,
                false,
            );
        },

        _buildRoutes: function () {
            qx.application.Routing.DEFAULT_PATH = '/datacenter/search';
            var n = this._navigator;

            n.onGet("^\/datacenter\/?(?:([a-zA-Z0-9\-\/]*))$", (data) => {
                var routeParams = {
                    id: "datacenter",
                    pageId: data.params[0],
                    pageClazz: null,
                };

                var clazz = routeParams.pageClazz = qx.Class.getByName(this._pagebasepath + "Datacenter");
                if (!clazz.SUBPAGES.includes(routeParams.pageId)) {
                    routeParams.pageId = clazz.DEFAULT_PAGE_ID;
                }

                return routeParams;
            });

            n.onGet('/storage/{node}/{storage}\/?(?:([a-zA-Z0-9\-\/]*))$', (data) => {
                var id = "storage/" + data.params.node + "/" + data.params.storage;
                var routeParams = {
                    id: id,
                    pageId: data.params[2],
                    pageClazz: null,
                };

                var clazz = routeParams.pageClazz = qx.Class.getByName(this._pagebasepath + "Storage");
                if (!clazz.SUBPAGES.includes(routeParams.pageId)) {
                    routeParams.pageId = clazz.DEFAULT_PAGE_ID;
                }

                return routeParams;
            });

            n.onGet('^\/(node|lxc|qemu|type|pool)+\/([a-zA-Z0-9]+)\/?(?:([a-zA-Z0-9\-\/]*))$', (data) => {
                var id = data.params[0] + "/" + data.params[1];
                var routeParams = {
                    id: id,
                    pageId: data.params[2],
                    pageClazz: null,
                };

                var clazz = routeParams.pageClazz = qx.Class.getByName(this._pagebasepath + qx.lang.String.firstUp(data.params[0]));
                if (!clazz.SUBPAGES.includes(routeParams.pageId)) {
                    routeParams.pageId = clazz.DEFAULT_PAGE_ID;
                }

                return routeParams;
            });
        },

        _onVELoginChange: function(e) {
            var data = e.getData();

            if (data.login === true) {
                // Navigator
                this._navigator.init();

                // Timer
                this._serviceManager.executeTimerOnce();
                this._serviceManager.getTimer().start();

                // Versioninfo
                var vs = this._serviceManager.getService("version");
                vs.fetch().then((model) => {
                    this.setVersionInfo(model);
                });

                // Now executes the applications "_onLogin"
                this._onLogin(data);
            } else {
                // Timer
                this._serviceManager.getTimer().stop();

                // Now executes the applications "_onLogout"
                this._onLogout(data);
            }
        }
    }
});