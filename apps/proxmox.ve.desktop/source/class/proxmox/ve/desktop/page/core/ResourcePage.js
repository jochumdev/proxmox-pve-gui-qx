qx.Class.define("proxmox.ve.desktop.page.core.ResourcePage", {
    extend: proxmox.core.page.core.ResourcePage,

    members: {
        _applySubContainer: function(value, old) {
            if (old !== null) {
                this._contentContainer.remove(old);
            }

            if (value !== null) {
                this._contentContainer.add(value, { edge: "center", width: "100%", height: "100%"});
            }
        },
    },
});