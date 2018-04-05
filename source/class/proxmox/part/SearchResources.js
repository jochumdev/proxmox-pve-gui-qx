qx.Class.define("proxmox.part.SearchResources", {
    extend: qx.core.Object,
    implement: proxmox.part.IPart,
    include: [
        qx.locale.MTranslation,
    ],

    construct: function (tableClickMode, columns) {
        this.base(arguments);

        if (!tableClickMode) {
            tableClickMode = "cellDbltap";
        }

        if (!columns) {
            columns = ["type", "description", "disk", "memory", "cpu", "uptime"];
        }
        this._columns = columns;

        var app = qx.core.Init.getApplication();

        var tableModel = this._tableModel = new qx.ui.table.model.Simple();

        var headers = [];
        columns.forEach((column) => {
            switch (column) {
                case "type":
                    headers.push(this.tr("Type"));
                    break;
                case "description":
                    headers.push(this.tr("Description"));
                    break;
                case "disk":
                    headers.push(this.tr("Disk usage %"));
                    break;
                case "memory":
                    headers.push(this.tr("Memory usage %"));
                    break;
                case "cpu":
                    headers.push(this.tr("CPU usage"));
                    break;
                case "uptime":
                    headers.push(this.tr("Uptime"));
                    break;
                case "node":
                    headers.push(this.tr("Node"));
                    break;
                case "pool":
                    headers.push(this.tr("Pool"));
                    break;
                default:
                    throw Error(qx.lang.String.format("Unknown column key %1 given", column));
            }
        });

        tableModel.setColumns(headers);

        var table = this._table = new qx.ui.table.Table(tableModel);
        table.addListener(tableClickMode, (e) => {
            var data = tableModel.getRowData(e.getRow());
            app.navigateTo(data[data.length - 1], "");
        });

        table.set({
            decorator: null
        });

        var sf = this.getSearchField();
        sf.addListener("input", (e) => {
            this.setSearchValue(e.getData());
        });

        this._serviceManager = app.getServiceManager();
    },

    properties: {
        //
        limitType: {
            init: null,
            nullable: true,
            check: ["lxc", "qemu", "node", "storage", "pool"],
            apply: "_updateData"
        },

        model: {
            event: "changeModel",
            nullable: true,
            apply: "_updateData"
        },

        searchValue: {
            event: "changeSearchValue",
            init: "",
            apply: "_updateData"
        }
    },

    members: {
        _table: null,
        _tableModel: null,
        _searchField: null,
        _columns: null,
        _serviceManager: null,

        getSearchField: function () {
            if (this._searchField !== null) {
                return this._searchField;
            }

            this._searchField = new qx.ui.form.TextField().set({ placeholder: this.tr("Search"), height: 22 }).set({ width: 168, appearance: "search" });
            return this._searchField;
        },

        getContainer: function () {
            return this._table;
        },

        startListening: function() {
            var sr = this._serviceManager.getService("cluster/resources");
            this.setModel(sr.getModel());

            sr.addListener("changeModel", this._changeModelListener, this);

            this._serviceManager.addListener("disposedServices", () => {
                var sr = this._serviceManager.getService("cluster/resources");
                this.setModel(sr.getModel());

                sr.addListener("changeModel", this._changeModelListener, this);
            });
        },

        stopListening: function() {
            var sr = this._serviceManager.getService("cluster/resources");
            sr.removeListener("changeModel", this._changeModelListener, this);
        },

        _changeModelListener: function(e) {
            this.setModel(e.getData());
        },

        _updateData: function () {
            var model = this.getModel();
            if (!model) {
                return;
            }

            var limitType = this.getLimitType();
            var searchValue = this.getSearchValue();
            var columns = this._columns;

            var data = [];
            model.forEach((node) => {
                var type = node.getType();
                if (limitType !== null && limitType !== type) {
                    return;
                }

                if (searchValue !== "" && !node.searchValue(searchValue)) {
                    return;
                }

                var rowData = [];
                columns.forEach((column) => {
                    switch (column) {
                        case "type":
                            rowData.push(type);
                            break;
                        case "description":
                            rowData.push(node.getDescription());
                            break;
                        case "disk":
                            var disk = node.getDiskUsagePercent();
                            rowData.push(disk > 0 ? disk.toString() + " %" : "");
                            break;
                        case "memory":
                            var memory = node.getMemoryUsagePercent();
                            rowData.push(memory > 0 ? memory.toString() + " %" : "");
                            break;
                        case "cpu":
                            var cpu = node.getCPUUsagePercent();
                            rowData.push(cpu > 0 ? cpu.toString() + "% of " + node.getMaxcpu().toString() + "CPUs" : "");
                            break;
                        case "uptime":
                            rowData.push(node.getDisplayUptime());
                            break;
                        case "node":
                            rowData.push(node.getNode());
                            break;
                        case "pool":
                            rowData.push(node.getPool());
                            break;
                        default:
                            throw Error(qx.lang.String.format("Unknown column key %1 given", column));
                    }
                });

                rowData.push(node.getId());
                data.push(rowData);
            });

            this._tableModel.setData(data);
        }
    },

    destruct: function() {
        this.stopListening();
        this._disposeObjects("_tableModel");
    }
});