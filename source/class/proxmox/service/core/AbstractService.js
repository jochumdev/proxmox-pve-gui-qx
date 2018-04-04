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

    events: {
        /**
         * Data event fired after the model has been created. The data will be the
         * created model.
         */
        "loaded": "qx.event.type.Data",

        /**
         * Fired when a parse error (i.e. broken JSON) occurred
         * during the load. The data contains a hash of the original
         * response and the parser error (exception object).
         */
        "parseError": "qx.event.type.Data",

        /**
         * Fired when an error (aborted, timeout or failed) occurred
         * during the load. The data contains the response of the request.
         * If you want more details, use the {@link #changeState} event.
         */
        "error": "qx.event.type.Data"
    },

    properties: {
        // Overwrite or set me!
        url: {
            check: "String",
        }
    },

    members: {
        __store: null,

        getDelegate: function() {
            return undefined;
        },

        /**
         * @return {Promise} From the fetch Request.
         */
        fetch: function () {
            if (this.__store) {
                return this.__store.reload();
            }

            this.__store = new proxmox.service.core.JsonStore(this.getUrl(), this.getDelegate());
            this.__store.addListener("error", (e) => {
                var data = e.getData();
                this.fireDataEvent("loaded", data);
                console.log(data);
            });
            this.__store.addListener("parseError", (e) => {
                var data = e.getData();
                this.fireDataEvent("parseError", data);
                console.log(data);
            });
            this.__store.addListener("loaded", (e) => {
                var data = e.getData();
                this.fireDataEvent("loaded", data);
            });

            this.__store.bind("model", this, "model");

            return this.__store.reload();
        }
    },

    destruct: function () {
        this._disposeObjects("__store");
    }
});