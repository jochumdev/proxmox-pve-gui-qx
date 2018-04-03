qx.Mixin.define("proxmox.model.MResource", {
    include: [
        qx.locale.MTranslation,
    ],

    members: {
        getShortId: function() {
            var idParts = this.getId().split("/");
            return idParts[1];
        },

        getDisplayName: function() {
            switch (this.getType()) {
                case "lxc":
                case "qemu":
                    return this.getName();
                case "storage":
                    return this.getStorage();
            }

            return "";
        },

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
            }
            return "";
        },

        getDescription: function() {
            switch (this.getType()) {
                case "node":
                    return this.getNode();
                case "lxc":
                case "qemu":
                    return this.getShortId() + " (" + this.getName() + ")";
                    break;
                case "storage":
                    return this.getStorage() + " (" + this.getNode() + ")";
                    break;
            }
            return "";
        },

        getDiskUsagePercent: function() {
            return Math.round(this.getDisk() / this.getMaxdisk() * 100 * 10) / 10;
        },

        getMemoryUsagePercent: function() {
            if (this.getType() === "storage") {
                return -1;
            }
            return Math.round(this.getMem() / this.getMaxmem() * 100 * 10) / 10;
        },

        getCPUUsagePercent: function() {
            if (this.getType() === "storage") {
                return -1;
            }
            return Math.round(this.getCpu() * 100 * 10) / 10;
        },

        getDisplayUptime: function() {
            if (this.getType() === "storage") {
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

            if (this.getDisplayName().includes(value)) {
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
                name: this.getDisplayName()
            };

            return object;
        }
    }
});