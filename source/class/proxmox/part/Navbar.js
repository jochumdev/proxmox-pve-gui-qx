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
            hideRoot: true,
            width: 137
        });

        tree.setDelegate({
            bindItem: function (controller, item, id) {
                controller.bindProperty("label", "label", null, item, id);
                controller.bindProperty("icon", "cssClasses", {
                    converter: function (data) {
                        if (data.slice(0, 6) === "image:") {
                            return data.slice(6);
                        }

                        return ["fa", `fa-${data}`, "x-treelist-item-icon"];
                    }
                }, item, id);
                controller.bindProperty("id", "id", null, item, id);
            },

            // delegate implementation
            createItem: function () {
                return new proxmox.ui.NavbarTreeItem();
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
                                icon: "search",
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
                                icon: "book",
                                id: "summary"
                            },
                            {
                                label: this.tr("Content"),
                                icon: "th",
                                id: "content"
                            },
                            {
                                label: this.tr("Permissions"),
                                icon: "unlock",
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
                                icon: "book",
                                id: "summary"
                            },
                            {
                                label: this.tr("Members"),
                                icon: "th",
                                id: "content"
                            },
                            {
                                label: this.tr("Permissions"),
                                icon: "unlock",
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
                                icon: "book",
                                id: "summary"
                            },
                            {
                                label: this.tr("Console"),
                                icon: "terminal",
                                id: "console"
                            },
                            {
                                label: this.tr("Resources"),
                                icon: "cube",
                                id: "resources"
                            },
                            {
                                label: this.tr("Network"),
                                icon: "exchange",
                                id: "network"
                            },
                            {
                                label: this.tr("DNS"),
                                icon: "globe",
                                id: "dns"
                            },
                            {
                                label: this.tr("Options"),
                                icon: "cog",
                                id: "options"
                            },
                            {
                                label: this.tr("Task History"),
                                icon: "list",
                                id: "task-history"
                            },
                            {
                                label: this.tr("Backup"),
                                icon: "floppy-o",
                                id: "backup"
                            },
                            {
                                label: this.tr("Replication"),
                                icon: "retweet",
                                id: "replication"
                            },
                            {
                                label: this.tr("Snapshots"),
                                icon: "history",
                                id: "snapshots"
                            },
                            {
                                label: this.tr("Firewall"),
                                icon: "shield",
                                id: "firewall",
                                children: [
                                    {
                                        label: this.tr("Options"),
                                        icon: "cog",
                                        id: "firewall/options"
                                    },
                                    {
                                        label: this.tr("Alias"),
                                        icon: "external-link",
                                        id: "firewall/alias"
                                    },
                                    {
                                        label: this.tr("IPSet"),
                                        icon: "list-ol",
                                        id: "firewall/ipset"
                                    },
                                    {
                                        label: this.tr("Log"),
                                        icon: "list",
                                        id: "firewall/log"
                                    }
                                ]
                            },
                            {
                                label: this.tr("Permissions"),
                                icon: "unlock",
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
                                icon: "book",
                                id: "summary"
                            },
                            {
                                label: this.tr("Console"),
                                icon: "terminal",
                                id: "console"
                            },
                            {
                                label: this.tr("Hardware"),
                                icon: "desktop",
                                id: "hardware"
                            },
                            {
                                label: this.tr("Options"),
                                icon: "cog",
                                id: "options"
                            },
                            {
                                label: this.tr("Task History"),
                                icon: "list",
                                id: "task-history"
                            },
                            {
                                label: this.tr("Monitor"),
                                icon: "eye",
                                id: "monitor"
                            },
                            {
                                label: this.tr("Backup"),
                                icon: "floppy-o",
                                id: "backup"
                            },
                            {
                                label: this.tr("Replication"),
                                icon: "retweet",
                                id: "replication"
                            },
                            {
                                label: this.tr("Snapshots"),
                                icon: "history",
                                id: "snapshots"
                            },
                            {
                                label: this.tr("Firewall"),
                                icon: "shield",
                                id: "firewall",
                                children: [
                                    {
                                        label: this.tr("Options"),
                                        icon: "cog",
                                        id: "firewall/options"
                                    },
                                    {
                                        label: this.tr("Alias"),
                                        icon: "external-link",
                                        id: "firewall/alias"
                                    },
                                    {
                                        label: this.tr("IPSet"),
                                        icon: "list-ol",
                                        id: "firewall/ipset"
                                    },
                                    {
                                        label: this.tr("Log"),
                                        icon: "list",
                                        id: "firewall/log"
                                    }
                                ]
                            },
                            {
                                label: this.tr("Permissions"),
                                icon: "unlock",
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
                                icon: "book",
                                id: "summary"
                            },
                            {
                                label: this.tr("Shell"),
                                icon: "terminal",
                                id: "shell"
                            },
                            {
                                label: this.tr("System"),
                                icon: "cogs",
                                id: "system",
                                children: [
                                    {
                                        label: this.tr("Network"),
                                        icon: "exchange",
                                        id: "system/network"
                                    },
                                    {
                                        label: this.tr("DNS"),
                                        icon: "globe",
                                        id: "system/dns"
                                    },
                                    {
                                        label: this.tr("Time"),
                                        icon: "clock-o",
                                        id: "system/time"
                                    },
                                    {
                                        label: this.tr("Syslog"),
                                        icon: "list",
                                        id: "system/syslog"
                                    }
                                ]
                            },
                            {
                                label: this.tr("Updates"),
                                icon: "refresh",
                                id: "updates"
                            },
                            {
                                label: this.tr("Firewall"),
                                icon: "shield",
                                id: "firewall",
                                children: [
                                    {
                                        label: this.tr("Options"),
                                        icon: "cog",
                                        id: "firewall/options"
                                    },
                                    {
                                        label: this.tr("Log"),
                                        icon: "list",
                                        id: "firewall/log"
                                    }
                                ]
                            },
                            {
                                label: this.tr("Disks"),
                                icon: "hdd-o",
                                id: "disks"
                            },
                            {
                                label: this.tr("Ceph"),
                                icon: "image:proxmox/logo-ceph.png",
                                id: "ceph",
                                children: [
                                    {
                                        label: this.tr("Configuration"),
                                        icon: "cog",
                                        id: "ceph/configuration"
                                    },
                                    {
                                        label: this.tr("Monitor"),
                                        icon: "television",
                                        id: "ceph/monitor"
                                    },
                                    {
                                        label: this.tr("OSD"),
                                        icon: "hdd-o",
                                        id: "ceph/osd"
                                    },
                                    {
                                        label: this.tr("Pools"),
                                        icon: "sitemap",
                                        id: "ceph/pools"
                                    },
                                    {
                                        label: this.tr("Log"),
                                        icon: "list",
                                        id: "ceph/log"
                                    }
                                ]
                            },
                            {
                                label: this.tr("Replication"),
                                icon: "retweet",
                                id: "replication"
                            },
                            {
                                label: this.tr("Task History"),
                                icon: "list",
                                id: "task-history"
                            },

                            {
                                label: this.tr("Subscription"),
                                icon: "life-ring",
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
                                icon: "search",
                                id: "search"
                            },
                            {
                                label: this.tr("Summary"),
                                icon: "book",
                                id: "summary"
                            },
                            {
                                label: this.tr("Options"),
                                icon: "cog",
                                id: "options"
                            },
                            {
                                label: this.tr("Storage"),
                                icon: "database",
                                id: "storage"
                            },
                            {
                                label: this.tr("Backup"),
                                icon: "floppy-o",
                                id: "backup"
                            },
                            {
                                label: this.tr("Replication"),
                                icon: "retweet",
                                id: "replication"
                            },
                            {
                                label: this.tr("Permissions"),
                                icon: "unlock",
                                id: "permissions",
                                children: [
                                    {
                                        label: this.tr("Users"),
                                        icon: "user",
                                        id: "permissions/users"
                                    },
                                    {
                                        label: this.tr("Groups"),
                                        icon: "users",
                                        id: "permissions/groups"
                                    },
                                    {
                                        label: this.tr("Pools"),
                                        icon: "tags",
                                        id: "permissions/pools"
                                    },
                                    {
                                        label: this.tr("Roles"),
                                        icon: "male",
                                        id: "permissions/roles"
                                    },
                                    {
                                        label: this.tr("Authentication"),
                                        icon: "key",
                                        id: "permissions/authentication"
                                    }
                                ]
                            },
                            {
                                label: this.tr("HA"),
                                icon: "heartbeat",
                                id: "ha"
                            },
                            {
                                label: this.tr("Firewall"),
                                icon: "shield",
                                id: "firewall",
                                children: [
                                    {
                                        label: this.tr("Options"),
                                        icon: "cog",
                                        id: "firewall/options"
                                    },
                                    {
                                        label: this.tr("Security Group"),
                                        icon: "users",
                                        id: "firewall/security-group"
                                    },
                                    {
                                        label: this.tr("Alias"),
                                        icon: "external-link",
                                        id: "firewall/alias"
                                    },
                                    {
                                        label: this.tr("IPSet"),
                                        icon: "list-ol",
                                        id: "firewall/ipset"
                                    }
                                ]
                            },
                            {
                                label: this.tr("Support"),
                                icon: "comments-o",
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