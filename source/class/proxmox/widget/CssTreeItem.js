qx.Class.define("proxmox.widget.CssTreeItem", {
    extend: qx.ui.tree.VirtualTreeItem,

    properties: {
        iconClasses: {
            check: "Array",
            event: "changeIconClasses",
            apply: "_applyCssClasses",
            nullable: true
        },

        statusClasses: {
            check: "Array",
            event: "changeStatusClasses",
            apply: "_applyCssClasses",
            nullable: true
        },

        cssClasses: {
            check: "Array",
            event: "changeCssClasses",
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
        // overridden
        _createChildControlImpl: function (id, hash) {
            var control;

            switch (id) {
                case "icon":
                    control = new proxmox.widget.CssImage().set({
                        anonymous: true
                    });
                    this.bind("cssClasses", control, "cssClasses");
                    break;
            }

            return control || this.base(arguments, id);
        },

        _applyCssClasses: function() {
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