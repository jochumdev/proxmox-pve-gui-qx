qx.Class.define("pved.page.core.Page", {
    extend: p.page.core.Page,

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
