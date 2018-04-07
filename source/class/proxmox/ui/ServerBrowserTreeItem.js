qx.Class.define("proxmox.ui.ServerBrowserTreeItem", {
    extend: proxmox.ui.tree.CssVirtualTreeItem,

    properties: {
        iconClasses: {
            check: "Array",
            event: "changeIconClasses",
            apply: "_updateCssClasses",
            nullable: true
        },

        statusClasses: {
            check: "Array",
            event: "changeStatusClasses",
            apply: "_updateCssClasses",
            nullable: true
        },

        type: {
            check: "String",
            event: "changeType"
        },

        id: {
            check: "String",
            event: "changeId"
        }
    },

    members: {
        _updateCssClasses: function() {
            var ic = this.getIconClasses();
            var sc = this.getStatusClasses();

            var result = [];
            if (ic != null) {
                result.push(...ic);
            }
            if (sc != null) {
                result.push(...sc);
            }

            this.setCssClasses(result);
        }
    }
});