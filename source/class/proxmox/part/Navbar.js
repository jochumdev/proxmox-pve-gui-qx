qx.Class.define("proxmox.part.Navbar", {
    extend: qx.core.Object,
    implement: proxmox.part.IPart,
    include: [
        qx.locale.MTranslation,
    ],

    construct: function (mode) {
        this.base(arguments);

        var app = qx.core.Init.getApplication();

        var tree = this._tree = new qx.ui.tree.VirtualTree(null, "label", "children").set({
            appearance: "navbar-tree",
            iconPath: "icon",
            hideRoot: true
        });

        tree.setDelegate({
            bindItem: function (controller, item, id) {
                controller.bindDefaultProperties(item, id);
                controller.bindProperty("id", "id", null, item, id);
            },

            // delegate implementation
            createItem: function () {
                return new proxmox.widget.IdTreeItem().set({
                    appearance: "navbar-tree-item"
                });
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

            app.navigateTo(null, id);
        });

        // app.addListener("changeRouteParams", (e) => {
        //     var data = e.getData();
        //     var table = tree.getLookupTable();
        //     table.forEach((node) => {
        //         var id = node.get("id");
        //         if (id == data.pageId) {
        //             // TODO: openNodeAndParents doesnt work.
        //             tree.openNodeAndParents(node);
        //             tree.getSelection().push(node);
        //         }
        //     });
        // });

        this.setMode(mode);
    },

    properties: {
        mode: {
            check: ["lxc", "qemu", "node", "datacenter", "searchOnly", "storage"],
            event: "changeMode",
            apply: "_applyMode"
        }
    },

    members: {
        _tree: null,
        _mode: null,
        _selectedTreeItem: null,

        getContainer: function () {
            var navBar = new qx.ui.container.Composite(new qx.ui.layout.VBox(2)).set({ appearance: "light-grey-box" });
            var slideBar = new qx.ui.container.SlideBar("horizontal");
            slideBar.add(navBar);

            navBar.add(this._tree, { flex: 1 });

            return slideBar;
        },

        _applyMode: function (value, old) {
            var data;

            switch (value) {
                case "searchOnly":
                    data = {
                        label: "root",
                        children: [
                            {
                                label: this.tr("Search"),
                                icon: "@FontAwesome/search",
                                id: "search"
                            }
                        ]
                    }
                    break;

                case "storage":
                    data = {
                        label: "root",
                        children: [
                            {
                                label: this.tr("Summary"),
                                icon: "@FontAwesome/book",
                                id: "summary"
                            },
                            {
                                label: this.tr("Content"),
                                icon: "@FontAwesome/th",
                                id: "content"
                            },
                            {
                                label: this.tr("Permissions"),
                                icon: "@FontAwesome/unlock",
                                id: "permissions"
                            },
                        ]
                    }
                    break;

                case "pool":
                    data = {
                        label: "root",
                        children: [
                            {
                                label: this.tr("Summary"),
                                icon: "@FontAwesome/book",
                                id: "summary"
                            },
                            {
                                label: this.tr("Members"),
                                icon: "@FontAwesome/th",
                                id: "content"
                            },
                            {
                                label: this.tr("Permissions"),
                                icon: "@FontAwesome/unlock",
                                id: "permissions"
                            },
                        ]
                    }
                    break;

                case "lxc":
                    data = {
                        label: "root",
                        children: [
                            {
                                label: this.tr("Summary"),
                                icon: "@FontAwesome/book",
                                id: "summary"
                            },
                            {
                                label: this.tr("Console"),
                                icon: "@FontAwesome/terminal",
                                id: "console"
                            },
                            {
                                label: this.tr("Resources"),
                                icon: "@FontAwesome/cube",
                                id: "resources"
                            },
                            {
                                label: this.tr("Network"),
                                icon: "@FontAwesome/exchange",
                                id: "network"
                            },
                            {
                                label: this.tr("DNS"),
                                icon: "@FontAwesome/globe",
                                id: "dns"
                            },
                            {
                                label: this.tr("Options"),
                                icon: "@FontAwesome/cog",
                                id: "options"
                            },
                            {
                                label: this.tr("Task History"),
                                icon: "@FontAwesome/list",
                                id: "task-history"
                            },
                            {
                                label: this.tr("Backup"),
                                icon: "@FontAwesome/floppy-o",
                                id: "backup"
                            },
                            {
                                label: this.tr("Replication"),
                                icon: "@FontAwesome/retweet",
                                id: "replication"
                            },
                            {
                                label: this.tr("Snapshots"),
                                icon: "@FontAwesome/history",
                                id: "snapshots"
                            },
                            {
                                label: this.tr("Firewall"),
                                icon: "@FontAwesome/shield",
                                id: "firewall",
                                children: [
                                    {
                                        label: this.tr("Options"),
                                        icon: "@FontAwesome/cog",
                                        id: "firewall/options"
                                    },
                                    {
                                        label: this.tr("Alias"),
                                        icon: "@FontAwesome/external-link",
                                        id: "firewall/alias"
                                    },
                                    {
                                        label: this.tr("IPSet"),
                                        icon: "@FontAwesome/list-ol",
                                        id: "firewall/ipset"
                                    },
                                    {
                                        label: this.tr("Log"),
                                        icon: "@FontAwesome/list",
                                        id: "firewall/log"
                                    }
                                ]
                            },
                            {
                                label: this.tr("Permissions"),
                                icon: "@FontAwesome/unlock",
                                id: "firewall/permissions"
                            }
                        ]
                    }
                    break;

                case "qemu":
                    data = {
                        label: "root",
                        children: [
                            {
                                label: this.tr("Summary"),
                                icon: "@FontAwesome/book",
                                id: "summary"
                            },
                            {
                                label: this.tr("Console"),
                                icon: "@FontAwesome/terminal",
                                id: "console"
                            },
                            {
                                label: this.tr("Hardware"),
                                icon: "@FontAwesome/desktop",
                                id: "hardware"
                            },
                            {
                                label: this.tr("Options"),
                                icon: "@FontAwesome/cog",
                                id: "options"
                            },
                            {
                                label: this.tr("Task History"),
                                icon: "@FontAwesome/list",
                                id: "task-history"
                            },
                            {
                                label: this.tr("Monitor"),
                                icon: "@FontAwesome/eye",
                                id: "monitor"
                            },
                            {
                                label: this.tr("Backup"),
                                icon: "@FontAwesome/floppy-o",
                                id: "backup"
                            },
                            {
                                label: this.tr("Replication"),
                                icon: "@FontAwesome/retweet",
                                id: "replication"
                            },
                            {
                                label: this.tr("Snapshots"),
                                icon: "@FontAwesome/history",
                                id: "snapshots"
                            },
                            {
                                label: this.tr("Firewall"),
                                icon: "@FontAwesome/shield",
                                id: "firewall",
                                children: [
                                    {
                                        label: this.tr("Options"),
                                        icon: "@FontAwesome/cog",
                                        id: "firewall/options"
                                    },
                                    {
                                        label: this.tr("Alias"),
                                        icon: "@FontAwesome/external-link",
                                        id: "firewall/alias"
                                    },
                                    {
                                        label: this.tr("IPSet"),
                                        icon: "@FontAwesome/list-ol",
                                        id: "firewall/ipset"
                                    },
                                    {
                                        label: this.tr("Log"),
                                        icon: "@FontAwesome/list",
                                        id: "firewall/log"
                                    }
                                ]
                            },
                            {
                                label: this.tr("Permissions"),
                                icon: "@FontAwesome/unlock",
                                id: "permissions"
                            }
                        ]
                    }
                    break;

                case "node":
                    data = {
                        label: "root",
                        children: [
                            {
                                label: this.tr("Summary"),
                                icon: "@FontAwesome/book",
                                id: "summary"
                            },
                            {
                                label: this.tr("Shell"),
                                icon: "@FontAwesome/terminal",
                                id: "shell"
                            },
                            {
                                label: this.tr("System"),
                                icon: "@FontAwesome/cogs",
                                id: "system",
                                children: [
                                    {
                                        label: this.tr("Network"),
                                        icon: "@FontAwesome/exchange",
                                        id: "system/network"
                                    },
                                    {
                                        label: this.tr("DNS"),
                                        icon: "@FontAwesome/globe",
                                        id: "system/dns"
                                    },
                                    {
                                        label: this.tr("Time"),
                                        icon: "@FontAwesome/clock-o",
                                        id: "system/time"
                                    },
                                    {
                                        label: this.tr("Syslog"),
                                        icon: "@FontAwesome/list",
                                        id: "system/syslog"
                                    }
                                ]
                            },
                            {
                                label: this.tr("Updates"),
                                icon: "@FontAwesome/refresh",
                                id: "updates"
                            },
                            {
                                label: this.tr("Firewall"),
                                icon: "@FontAwesome/shield",
                                id: "firewall",
                                children: [
                                    {
                                        label: this.tr("Options"),
                                        icon: "@FontAwesome/cog",
                                        id: "firewall/options"
                                    },
                                    {
                                        label: this.tr("Log"),
                                        icon: "@FontAwesome/list",
                                        id: "firewall/log"
                                    }
                                ]
                            },
                            {
                                label: this.tr("Disks"),
                                icon: "@FontAwesome/hdd-o",
                                id: "disks"
                            },
                            {
                                label: this.tr("Ceph"),
                                icon: "proxmox/logo-ceph.png",
                                id: "ceph",
                                children: [
                                    {
                                        label: this.tr("Configuration"),
                                        icon: "@FontAwesome/cog",
                                        id: "ceph/configuration"
                                    },
                                    {
                                        label: this.tr("Monitor"),
                                        icon: "@FontAwesome/television",
                                        id: "ceph/monitor"
                                    },
                                    {
                                        label: this.tr("OSD"),
                                        icon: "@FontAwesome/hdd-o",
                                        id: "ceph/osd"
                                    },
                                    {
                                        label: this.tr("Pools"),
                                        icon: "@FontAwesome/sitemap",
                                        id: "ceph/pools"
                                    },
                                    {
                                        label: this.tr("Log"),
                                        icon: "@FontAwesome/list",
                                        id: "ceph/log"
                                    }
                                ]
                            },
                            {
                                label: this.tr("Replication"),
                                icon: "@FontAwesome/retweet",
                                id: "replication"
                            },
                            {
                                label: this.tr("Task History"),
                                icon: "@FontAwesome/list",
                                id: "task-history"
                            },

                            {
                                label: this.tr("Subscription"),
                                icon: "@FontAwesome/life-ring",
                                id: "subscription"
                            }
                        ]
                    }
                    break;

                case "datacenter":
                    data = {
                        label: "root",
                        children: [
                            {
                                label: this.tr("Search"),
                                icon: "@FontAwesome/search",
                                id: "search"
                            },
                            {
                                label: this.tr("Summary"),
                                icon: "@FontAwesome/book",
                                id: "summary"
                            },
                            {
                                label: this.tr("Options"),
                                icon: "@FontAwesome/cog",
                                id: "options"
                            },
                            {
                                label: this.tr("Storage"),
                                icon: "@FontAwesome/database",
                                id: "storage"
                            },
                            {
                                label: this.tr("Backup"),
                                icon: "@FontAwesome/floppy-o",
                                id: "backup"
                            },
                            {
                                label: this.tr("Replication"),
                                icon: "@FontAwesome/retweet",
                                id: "replication"
                            },
                            {
                                label: this.tr("Permissions"),
                                icon: "@FontAwesome/unlock",
                                id: "permissions",
                                children: [
                                    {
                                        label: this.tr("Users"),
                                        icon: "@FontAwesome/user",
                                        id: "permissions/users"
                                    },
                                    {
                                        label: this.tr("Groups"),
                                        icon: "@FontAwesome/users",
                                        id: "permissions/groups"
                                    },
                                    {
                                        label: this.tr("Pools"),
                                        icon: "@FontAwesome/tags",
                                        id: "permissions/pools"
                                    },
                                    {
                                        label: this.tr("Roles"),
                                        icon: "@FontAwesome/male",
                                        id: "permissions/roles"
                                    },
                                    {
                                        label: this.tr("Authentication"),
                                        icon: "@FontAwesome/key",
                                        id: "permissions/authentication"
                                    }
                                ]
                            },
                            {
                                label: this.tr("HA"),
                                icon: "@FontAwesome/heartbeat",
                                id: "ha"
                            },
                            {
                                label: this.tr("Firewall"),
                                icon: "@FontAwesome/shield",
                                id: "firewall",
                                children: [
                                    {
                                        label: this.tr("Options"),
                                        icon: "@FontAwesome/cog",
                                        id: "firewall/options"
                                    },
                                    {
                                        label: this.tr("Security Group"),
                                        icon: "@FontAwesome/users",
                                        id: "firewall/security-group"
                                    },
                                    {
                                        label: this.tr("Alias"),
                                        icon: "@FontAwesome/external-link",
                                        id: "firewall/alias"
                                    },
                                    {
                                        label: this.tr("IPSet"),
                                        icon: "@FontAwesome/list-ol",
                                        id: "firewall/ipset"
                                    }
                                ]
                            },
                            {
                                label: this.tr("Support"),
                                icon: "@FontAwesome/comments-o",
                                id: "support"
                            },
                        ]
                    }
                    break;
            }

            var model = qx.data.marshal.Json.createModel(data, true);
            this._tree.setModel(model);
        }
    }
});