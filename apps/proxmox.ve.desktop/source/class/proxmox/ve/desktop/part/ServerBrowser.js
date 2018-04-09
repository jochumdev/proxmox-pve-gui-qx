qx.Class.define("proxmox.ve.desktop.part.ServerBrowser", {
    extend: qx.core.Object,
    implement: proxmox.core.part.IPart,
    include: [
        qx.locale.MTranslation,
    ],

    construct: function () {
        this.base(arguments);

        var app = qx.core.Init.getApplication();

        var tree = this._tree = new proxmox.core.ui.tree.VirtualTree(null, "label", "children");
        tree.setOpenMode("tap");
        tree.setDelegate({
            // delegate implementation
            bindItem: function (controller, item, id) {
                controller.bindDefaultProperties(item, id);
                controller.bindProperty("id", "id", null, item, id);
                controller.bindProperty("type", "type", null, item, id);
                controller.bindProperty("type", "iconClasses", {
                    converter: function (data) {
                        switch (data) {
                            case "datacenter":
                                return ["fa", "fa-server", "x-tree-icon-custom"];
                                break;
                            case "node":
                                return ["fa", "fa-building", "x-tree-icon-custom"];
                                break;
                            case "lxc":
                                return ["fa", "fa-cube", "x-tree-icon-custom"];
                                break;
                            case "storage":
                                return ["fa", "fa-database", "x-tree-icon-custom"];
                                break;
                            case "qemu":
                                return ["fa", "fa-desktop", "x-tree-icon-custom"];
                                break;
                            case "pool":
                                return ["fa", "fa-tags", "x-tree-icon-custom"];
                                break;
                            default:
                                return ["fa", "fa-server", "x-tree-icon-custom"];
                                break;
                        }
                    }
                }, item, id);
                controller.bindProperty("status", "statusClasses", {
                    converter: function (data) {
                        switch (data) {
                            case "online":
                                return ["online"];
                                break;
                            case "running":
                                return ["running"];
                                break;
                            case "stopped":
                                return ["stopped"];
                                break;
                            case "ha-error":
                                return ["ha-error"];
                                break;
                            default:
                                return null;
                        }
                    }
                }, item, id);
            },

            // delegate implementation
            createItem: function () {
                return new proxmox.ve.desktop.ui.ServerBrowserTreeItem();
            }
        });

        tree.getSelection().addListener("change", (e) => {
            var data = e.getData();
            if (data.type != "add" && data.type != "add/remove") {
                return;
            }

            var id = data.added[0].getId();
            if (this._selectedTreeItem == id) {
                return;
            };

            this._selectedTreeItem = id;
            app.getNavigator().navigateTo(id);
        });

        /**
         * Bind to the service.
         */
        var sm = app.getServiceManager();
        var that = this;
        var listenToService = function() {
            var sr = sm.getService("cluster/resources");
            that.setModel(sr.getModel());

            sr.addListener("changePromise", (e) => {
                e.getData().then((model) => {
                    that.setModel(model);
                }).catch((ex) => {
                    console.log(ex);
                });
            });
        }
        listenToService();

        sm.addListener("disposedServices", () => {
            listenToService();
        });

        app.addListener("changeLogin", (e) => {
            var data = e.getData();

            if (data.login) {
                if (this._savedMode != null) {
                    this.setMode(this._savedMode);
                }
                return;
            }

            this._savedMode = this.getMode();
            this.setMode("empty");
        });

        app.getNavigator().addListener("changeRouteParams", (e) => {
            var data = e.getData();
            var table = tree.getLookupTable();
            table.forEach((node) => {
                var id = node.get("id");
                if (id == data.id) {
                    // TODO: openNodeAndParents doesnt work.
                    tree.openNodeAndParents(node);
                    tree.getSelection().push(node);
                }
            });
        });
    },

    properties: {
        model: {
            event: "changeModel",
            nullable: true,
            apply: "_updateTree"
        },

        mode: {
            init: "server",
            check: ["server", "folder", "storage", "pool", "empty"],
            event: "changeMode",
            apply: "_updateTree"
        }
    },

    members: {
        _savedMode: null,
        _tree: null,
        _selectedTreeItem: null,

        getContainer: function () {
            var leftColumnLayout = new qx.ui.layout.VBox();
            leftColumnLayout.setSpacing(5);
            var leftColumn = new qx.ui.container.Composite(leftColumnLayout).set({
                width: 240,
                padding: [0, 0, 0, 5]
            });

            var selectBox = new qx.ui.form.SelectBox().set({ appearance: "flat-white-selectbox" });
            selectBox.add(new qx.ui.form.ListItem(this.tr("Server View")).set({ model: "server" }));
            selectBox.add(new qx.ui.form.ListItem(this.tr("Folder View")).set({ model: "folder" }));
            selectBox.add(new qx.ui.form.ListItem(this.tr("Storage View")).set({ model: "storage" }));
            selectBox.add(new qx.ui.form.ListItem(this.tr("Pool View")).set({ model: "pool" }));
            leftColumn.add(selectBox);

            selectBox.addListener("changeValue", (e) => {
                this.setMode(e.getData().getModel());
            });

            /*
            * Tree
            */
            leftColumn.add(this._tree, { flex: 1 });

            return leftColumn;
        },

        _updateTree: function () {
            var treeState = this._tree.getTreeState("id");

            var model = this.getModel();
            var mode = this.getMode();

            if (!model) {
                mode = "empty";
            }

            var data = {
                label: this.tr("Datacenter"),
                type: "datacenter",
                id: "datacenter"
            };
            switch (mode) {
                case "server":
                    var nodes = {};
                    var children = [];

                    model.forEach((node) => {
                        var info = node.toJSObject();
                        if (info.type === "pool") {
                            children.push({ label: info.description, type: info.type, status: info.status, id: info.fullId });
                        } else {
                            if (!(info.node in nodes)) {
                                nodes[info.node] = { children: [] };
                            }

                            if (info.type == "node") {
                                nodes[info.node] = Object.assign({ label: info.description, type: info.type, status: info.status, id: info.fullId }, nodes[info.node]);
                            } else {
                                nodes[info.node].children.push({ label: info.description, type: info.type, status: info.status, id: info.fullId });
                            }
                        }
                    });

                    Object.keys(nodes).forEach((key) => {
                        nodes[key].children.sort(this.__sortById);
                        children.push(nodes[key]);
                    });

                    children.sort(this.__sortById);

                    data.children = children;
                    break;

                case "folder":
                    var folders = {};
                    model.forEach((node) => {
                        var info = node.toJSObject();

                        if (!(info.type in folders)) {
                            switch (info.type) {
                                case "node":
                                    folders[info.type] = { label: this.tr("Nodes"), type: "node", id: "type/node", children: [] }
                                    break;
                                case "lxc":
                                    folders[info.type] = { label: this.tr("LXC Container"), type: "lxc", id: "type/lxc", children: [] }
                                    break;
                                case "qemu":
                                    folders[info.type] = { label: this.tr("Virtual Machine"), type: "qemu", id: "type/qemu", children: [] }
                                    break;
                                case "storage":
                                    folders[info.type] = { label: this.tr("Storage"), type: "storage", id: "type/storage", children: [] }
                                    break;
                                case "pool":
                                    folders[info.type] = { label: this.tr("Resource Pool"), type: "pool", id: "type/pool", children: [] }
                                    break;
                            }
                        }

                        folders[info.type].children.push({ label: info.description, type: info.type, status: info.status, id: info.fullId });
                    });
                    var children = [];
                    Object.keys(folders).forEach((key) => {
                        folders[key].children.sort(this.__sortById);
                        children.push(folders[key]);
                    });

                    children.sort(this.__sortById);

                    data.children = children;
                    break;

                case "storage":
                    var nodes = {};

                    model.forEach((node) => {
                        var info = node.toJSObject();
                        if (info.node !== "" && !(info.node in nodes)) {
                            nodes[info.node] = { children: [] };
                        }
                        if (info.type == "storage") {
                            nodes[info.node].children.push({ label: info.description, type: info.type, status: info.status, id: info.fullId });
                        } else if (info.type == "node") {
                            nodes[info.node] = Object.assign({ label: info.description, type: info.type, status: info.status, id: info.fullId }, nodes[info.node]);
                        }
                    });

                    var children = [];
                    Object.keys(nodes).forEach((key) => {
                        nodes[key].children.sort(this.__sortById);
                        children.push(nodes[key]);
                    });

                    children.sort(this.__sortById);

                    data.children = children;
                    break;

                case "pool":
                    var nopool = [];
                    var pools = {};

                    model.forEach((node) => {
                        var info = node.toJSObject();
                        if (info.type == "lxc" || info.type == "qemu" || info.type == "pool") {
                            if (info.pool === "") {
                                nopool.push({ label: info.description, type: info.type, status: info.status, id: info.fullId });
                            } else {
                                if (!(info.pool in pools)) {
                                    pools[info.pool] = { children: [] };
                                }

                                if (info.type == "pool") {
                                    pools[info.pool] = Object.assign({ label: info.description, type: info.type, status: info.status, id: info.fullId }, pools[info.pool]);
                                } else {
                                    pools[info.pool].children.push({ label: info.description, type: info.type, status: info.status, id: info.fullId });
                                }
                            }
                        }
                    });

                    var children = [];
                    Object.keys(pools).forEach((key) => {
                        pools[key].children.sort(this.__sortById);
                        children.push(pools[key]);
                    });
                    children.sort(this.__sortById);

                    nopool.sort(this.__sortById);
                    children.push(...nopool);

                    data.children = children;
                    break;
            }

            var model = qx.data.marshal.Json.createModel(data, true);
            this._tree.setModel(model);

            this._tree.restoreTreeState("id", treeState);
        },

        __sortById: function (a, b) {
            if (a.id < b.id) return -1;
            if (a.id > b.id) return 1;
            return 0;
        }
    }
});