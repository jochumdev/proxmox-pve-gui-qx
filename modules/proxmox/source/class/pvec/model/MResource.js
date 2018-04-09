qx.Mixin.define("pvec.model.MResource", {
    include: [
        qx.locale.MTranslation,
    ],

    members: {
        getHeadline: function() {
            switch (this.getType()) {
                case "node":
                    return this.tr("Node '%1'", this.getNode());
                case "lxc":
                    return this.tr("Container %1 (%2) on node '%3'", this.getShortId(), this.getName(), this.getNode());
                case "qemu":
                    return this.tr("Virtual Machine %1 (%2) on node '%3'", this.getShortId(), this.getName(), this.getNode());
                case "storage":
                    return this.tr("Storage '%1' on node '%2'", this.getStorage(), this.getNode());
                case "pool":
                    return this.tr("Resource Pool: %1", this.getPool());
            }
            return "";
        },

        getDiskUsagePercent: function() {
            if (!qx.Class.hasProperty(this.constructor, "disk")) {
                return -1;
            }

            return Math.round(this.getDisk() / this.getMaxdisk() * 100 * 10) / 10;
        },

        getMemoryUsagePercent: function() {
            if (!qx.Class.hasProperty(this.constructor, "mem")) {
                return -1;
            }
            return Math.round(this.getMem() / this.getMaxmem() * 100 * 10) / 10;
        },

        getCPUUsagePercent: function() {
            var type = this.getType();
            if (type === "storage" || type === "pool") {
                return -1;
            }

            var status = this.getStatus();
            if (status !== "online" && status !== "running") {
                return -1;
            }

            if (!qx.Class.hasProperty(this.constructor, "cpu")) {
                return 0;
            }
            return Math.round(this.getCpu() * 100 * 10) / 10;
        },

        getDisplayUptime: function() {
            if (!qx.Class.hasProperty(this.constructor, "uptime")) {
                return "-";
            }

            var status = this.getStatus();
            if (status !== "online" && status !== "running") {
                return "-";
            }

            return p.Utils.secondsToHHMMSS(this.getUptime());
        },

        searchValue: function(value) {
            var value = new qx.type.BaseString(value).toLocaleLowerCase();

            var strings = [this.getType(), this.getNode(), this.getName(), this.getPool()];

            for (var i = 0; i < strings.length; i++) {
                if (new qx.type.BaseString(strings[i]).toLocaleLowerCase().indexOf(value) !== -1) {
                    return true;
                }
            }

            return false;
        },

        toJSObject: function() {
            var object = {
                description: this.getDescription(),
                type: this.getType(),
                status: this.getStatus(),
                fullId: this.getId(),
                node: this.getNode(),
                id: this.getShortId(),
                name: this.getName(),
                pool: this.getPool()
            };

            return object;
        }
    }
});