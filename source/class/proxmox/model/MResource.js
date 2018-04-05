qx.Mixin.define("proxmox.model.MResource", {
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
            var type = this.getType();
            if (type == "pool") {
                return -1;
            }
            return Math.round(this.getDisk() / this.getMaxdisk() * 100 * 10) / 10;
        },

        getMemoryUsagePercent: function() {
            var type = this.getType();
            if (type === "storage") {
                return -1;
            }
            return Math.round(this.getMem() / this.getMaxmem() * 100 * 10) / 10;
        },

        getCPUUsagePercent: function() {
            var type = this.getType();
            if (type === "storage") {
                return -1;
            }
            return Math.round(this.getCpu() * 100 * 10) / 10;
        },

        getDisplayUptime: function() {
            var type = this.getType();
            if (type === "storage" || type == "pool") {
                return "-";
            }
            return proxmox.Utils.secondsToHHMMSS(this.getUptime());
        },

        searchValue: function(value) {
            if (this.getType().includes(value)) {
                return true;
            }

            if (this.getNode().includes(value)) {
                return true;
            }

            if (this.getName().includes(value)) {
                return true;
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