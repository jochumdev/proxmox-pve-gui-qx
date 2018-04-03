qx.Class.define("proxmox.part.ServerBrowser", {
    extend: qx.core.Object,
    implement: proxmox.part.IPart,
    include: [
        qx.locale.MTranslation,
    ],

    construct: function (mode) {
        this.base(arguments);

        var app = qx.core.Init.getApplication();

        var tree = this._tree = new proxmox.widget.Tree(null, "label", "children");
        tree.setOpenMode("tap");
        tree.setDelegate({
            // delegate implementation
            bindItem: function (controller, item, id) {
                controller.bindDefaultProperties(item, id);
                controller.bindProperty("type", "type", null, item, id);
                controller.bindProperty("id", "id", null, item, id);
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
                return new proxmox.widget.CssTreeItem();
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
            app.navigateTo(id);
        });

        this.setMode(mode);

        app.getService("resources").addListener("changeModel", (e) => {
            this.setModel(e.getData());
        });

        app.addListener("changeLogin", (e) => {
            var data = e.getData();

            if (data.login && this._savedMode != null) {
                this.setMode(this._savedMode);
                return;
            }

            this._savedMode = this.getMode();
            this.setMode("empty");
        });

        app.addListener("changeRouteParams", (e) => {
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

        _updateTree: function (model) {
            var treeState = this._tree.getTreeState("id");

            var mode = this.getMode();
            var model = this.getModel();

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

                    model.forEach((node) => {
                        var info = proxmox.Utils.getResourceInfo(node);
                        if (!(info.node in nodes)) {
                            nodes[info.node] = { children: [] };
                        }

                        if (info.type == "node") {
                            nodes[info.node] = Object.assign({ label: info.label, type: info.type, status: info.status, id: info.fullId }, nodes[info.node]);
                        } else {
                            nodes[info.node].children.push({ label: info.label, type: info.type, status: info.status, id: info.fullId });
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

                case "folder":
                    var folders = {};
                    model.forEach((node) => {
                        var info = proxmox.Utils.getResourceInfo(node);

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
                            }
                        }

                        folders[info.type].children.push({ label: info.label, type: info.type, status: info.status, id: info.fullId });
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
                        var info = proxmox.Utils.getResourceInfo(node);
                        if (!(info.node in nodes)) {
                            nodes[info.node] = { children: [] };
                        }
                        if (info.type == "storage") {
                            nodes[info.node].children.push({ label: info.label, type: info.type, status: info.status, id: info.fullId });
                        } else if (info.type == "node") {
                            nodes[info.node] = Object.assign({ label: info.label, type: info.type, status: info.status, id: info.fullId }, nodes[info.node]);
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
                    var children = [];

                    model.forEach((node) => {
                        var info = proxmox.Utils.getResourceInfo(node);
                        if (info.type == "lxc" || info.type == "qemu") {
                            children.push({ label: info.label, type: info.type, status: info.status, id: info.fullId });
                        }
                    });

                    children.sort(this.__sortById);

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