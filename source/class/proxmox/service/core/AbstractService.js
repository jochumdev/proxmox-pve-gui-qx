qx.Class.define("proxmox.service.core.AbstractService", {
    extend: qx.core.Object,
    type: "abstract",
    include: [qx.ui.form.MModelProperty],
    implement: [
        proxmox.service.core.IService,
        qx.ui.form.IModel
    ],

    construct: function () {
        this.base(arguments);
    },

    members: {
        __store: null,

        getUrl: function () {
            throw new Error("Abstract method call.");
        },

        getDelegate: function() {
            return undefined;
        },

        fetch: function () {
            if (this.__store) {
                this.__store.reload();
                return;
            }

            this.__store = new proxmox.service.core.JsonStore(this.getUrl(), this.getDelegate());
            this.__store.addListener("error", (e) => {
                console.log(e.getData());
            });
            this.__store.addListener("parseError", (e) => {
                console.log(e.getData());
            });
            this.__store.bind("model", this, "model");
        }
    }
});