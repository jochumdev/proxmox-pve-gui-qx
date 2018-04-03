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
            return;
        },

        getLabel: function() {
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
        },

        toJSObject: function() {
            var object = {
                label: this.getLabel(),
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