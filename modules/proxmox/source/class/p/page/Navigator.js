qx.Class.define("p.page.Navigator", {
    extend: qx.core.Object,

    construct: function (app) {
        this._app = app;
    },

    properties: {
        defaultId: {
            check: "String",
            init: "empty",
        },

        defaultPageId: {
            check: "String",
            init: "empty",
        },

        routeParams: {
            event: "changeRouteParams",
            nullable: true,
        },
    },

    members: {
        _app: null,

        _router: null,

        _contentView: null,
        _contentViewClazz: null,

        init: function() {
            this.getRouter().init();
        },

        getRouter: function () {
            if (this._router === null) {
                this._router = new qx.application.Routing();
            }

            return this._router;
        },

        navigateTo: function (id, pageId) {
            if (!id && !pageId) {
                id = this.getDefaultId();
                pageId = this.getDefaultPageId();
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
            this.getRouter().executeGet(route);
        },

        onGet: function(expression, func) {
            this.getRouter().onGet(expression, (data) => {
                this.setPageView(func(data));
            });
        },

        setPageView: function (routeParams) {
            var clazz = routeParams.pageClazz;
            var id = routeParams.id;
            var pageId = routeParams.pageId;

            if (this._contentViewClazz === clazz && this._contentView.getId() === id) {
                this._contentView.getContainerAsync().then((ct) => {
                    if (qx.core.Environment.get("proxmox.debug-routing")) {
                        console.debug(`Navigating to ("${id}" -> "${pageId}")`);
                    }

                    this._contentView.navigateToPageId(pageId);
                    this.setRouteParams(routeParams);
                });
                return;
            }

            if (qx.core.Environment.get("proxmox.debug-routing")) {
                if (this._contentView) {
                    console.debug(`Switching view from ("${this._contentView.getId()}") to ("${id}" -> "${pageId}")`);
                } else {
                    console.debug(`Setting view to "${id}" -> "${pageId}"`);
                }
            }
            this._contentViewClazz = clazz;

            this._app.setContentContainer(null);

            if (this._contentView != null) {
                this._contentView.dispose();
                this._contentView = null;
            }

            var view = this._contentView = new (clazz)();
            if (!qx.Class.implementsInterface(view, p.page.core.IView)) {
                throw new Error("View doesn't implement p.page.core.IView");
            }

            view.set({
                id: id
            });

            view.getContainerAsync().then((ct) => {
                if (qx.core.Environment.get("proxmox.debug-routing")) {
                    console.debug(`Got the container for "${this._contentView.getId()}"`);
                }

                view.navigateToPageId(pageId);
                this._app.setContentContainer(ct);

                this.setRouteParams(routeParams);
            });
        },
    },

    destruct: function () {
        this._disposeObjects("_router");
    }
});