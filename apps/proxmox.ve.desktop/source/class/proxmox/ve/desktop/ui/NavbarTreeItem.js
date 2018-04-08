qx.Class.define("proxmox.ve.desktop.ui.NavbarTreeItem", {
    extend: proxmox.core.ui.tree.CssVirtualTreeItem,

    properties: {
        appearance: {
            refine: true,
            init: "navbar-tree-item"
        },

        id: {
            check: "String",
            event: "changeId"
        }
    },

    members: {
        // overridden
        _addWidgets: function () {
            this.addSpacer();
            // this.addOpenButton();
            this.addIcon();
            this.addLabel();
        },

        // overridden
        _updateIndent: function () {
            if (this.__spacer) {
                this.__spacer.setWidth(this.getLevel() * this.getIndent());
            }
        },
    }
});