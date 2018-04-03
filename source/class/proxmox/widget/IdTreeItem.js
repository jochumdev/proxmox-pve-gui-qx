qx.Class.define("proxmox.widget.IdTreeItem", {
    extend: qx.ui.tree.VirtualTreeItem,

    properties: {
        id: {
            check: "String",
            event: "changeId"
        }
    }
});