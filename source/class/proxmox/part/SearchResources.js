qx.Class.define("proxmox.part.SearchResources", {
    extend: qx.core.Object,
    implement: proxmox.part.IPart,
    include: [
        qx.locale.MTranslation,
    ],

    construct: function (mode) {
        this.base(arguments);

        var app = qx.core.Init.getApplication();

        var tableModel = this._tableModel = new qx.ui.table.model.Simple();
        tableModel.setColumns([this.tr("Type"), this.tr("Description"), this.tr("Disk usage %"), this.tr("Memory usage %"), this.tr("CPU usage"), this.tr("Uptime")]);

        var table = this._table = new qx.ui.table.Table(tableModel);
        table.addListener("cellDbltap", (e) => {
            app.navigateTo(tableModel.getRowData(e.getRow())[6], "");
        });

        table.set({
            decorator: null
        });

        var sf = this.getSearchField();
        sf.addListener("input", (e) => {
            this.setSearchValue(e.getData());
        });

        var sr = app.getService("resources");
        this.setModel(sr.getModel());

        sr.addListener("changeModel", (e) => {
            this.setModel(e.getData());
        });
    },

    properties: {
        //
        limitType: {
            init: null,
            nullable: true,
            check: ["lxc", "qemu", "node", "storage"],
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

        _createTable: function () {

        },

        _updateData: function () {
            var model = this.getModel();
            if (!model) {
                return;
            }

            var limitType = this.getLimitType();
            var searchValue = this.getSearchValue();

            var data = [];
            model.forEach((node) => {
                var type = node.getType();
                if (limitType !== null && limitType !== type) {
                    return;
                }

                if (searchValue !== "" && !node.searchValue(searchValue)) {
                    return;
                }

                var disk = node.getDiskUsagePercent();
                var memory = node.getMemoryUsagePercent();
                var cpu = node.getCPUUsagePercent();

                data.push([
                    type,
                    node.getDescription(),
                    disk > 0 ? disk.toString() + " %" : "",
                    memory > 0 ? memory.toString() + " %" : "",
                    cpu > 0 ? cpu.toString() + "% of " + node.getMaxcpu().toString() + "CPUs" : "",
                    node.getDisplayUptime(),
                    node.getId()
                ]);
            });

            this._tableModel.setData(data);
        }
    },

    destruct : function() {
        this._disposeObjects("_tableModel");
    }
});