qx.Mixin.define("proxmox.ve.core.application.MApplication", {
    include: [
        proxmox.core.application.MApplication,
    ],

    members: {
        _pagebasepath: null,

        initve: function (pagebasepath) {
            this.initcore();
            this.getNavigator().setDefaultId("datacenter");
            this.getNavigator().setDefaultPageId("search");

            this._pagebasepath = pagebasepath;

            this._buildRoutes();
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
        }
    }
});