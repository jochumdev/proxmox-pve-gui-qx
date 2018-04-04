qx.Class.define("proxmox.service.core.JsonStore", {
    extend: qx.core.Object,

    construct: function (url, delegate) {
        this.base(arguments);

        this._marshaler = new qx.data.marshal.Json(delegate);
        this._delegate = delegate;

        if (url != null) {
            this.setUrl(url);
        }
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
        /**
         * Property for holding the loaded model instance.
         */
        model: {
            nullable: true,
            event: "changeModel"
        },


        /**
         * The state of the request as an url. If you want to check if the request
         * did it’s job, use, the {@link #changeState} event and check for one of the
         * listed values.
         */
        state: {
            check: [
                "configured", "queued", "sending", "receiving",
                "completed", "aborted", "timeout", "failed"
            ],
            init: "configured",
            event: "changeState"
        },


        /**
         * The url where the request should go to.
         */
        url: {
            check: "String",
            event: "changeUrl",
            nullable: true
        }
    },


    members: {
        _marshaler: null,
        _delegate: null,

        __request: null,

        /**
         * Creates and sends a GET request with the given url.
         *
         * Listeners will be added to respond to the request’s "success",
         * "changePhase" and "fail" event.
         *
         * @param url {String} The url for the request.
         */
        _createRequest: function (url) {
            // dispose old request
            if (this.__request) {
                this.__request.cancel();
                this.__request = null;
            }

            // take care of the resource management
            url = qx.util.AliasManager.getInstance().resolve(url);
            url = qx.util.ResourceManager.getInstance().toUri(url);

            this.__request = qxc.require.Init.require(["fetch"])
                .catch(ex => {
                    this.setState("failed");
                    this.fireDataEvent("error", {request: url, error: ex});
                    throw ex;
                }).spread((fetchpoly) => {
                    var fetcher;
                    if (fetchpoly) {
                        fetcher = fetchpoly;
                    } else {
                        fetcher = window.fetch;
                    }
                    this.setState("configured");
                    return fetcher(url);
                }).then((response) => {
                    this.setState("sending");
                    return response.json();
                }).then((data) => {
                    if (this.isDisposed()) {
                        return;
                    }

                    this.setState("receiving");

                    // check for the data manipulation hook
                    var del = this._delegate;
                    if (del && qx.lang.Type.isFunction(del.manipulateData)) {
                        data = this._delegate.manipulateData(data);
                    }

                    // create the class
                    this._marshaler.toClass(data, true);

                    var oldModel = this.getModel();

                    // set the initial data
                    this.setModel(this._marshaler.toModel(data));

                    // get rid of the old model
                    if (oldModel && oldModel.dispose) {
                        oldModel.dispose();
                    }

                    // fire complete event
                    this.fireDataEvent("loaded", this.getModel());

                    this.setState("completed");

                    return this.getModel();
                }).catch((ex) => {
                    this.setState("failed");
                    this.fireDataEvent("parseError", {request: url, error: ex});
                    throw ex;
                });

            return this.__request;
        },

        /**
         * Reloads the data with the url set in the {@link #url} property.
         */
        reload: function () {
            var url = this.getUrl();
            if (url === null) {
                return new qx.Promise((resolve, reject) => {
                    reject(Error("URL is null"));
                });
            }

            return this._createRequest(url);
        }
    },

    /*
     *****************************************************************************
        DESTRUCT
     *****************************************************************************
     */

    destruct: function () {
        if (this.__request != null) {
            this._disposeObjects("__request");
        }

        // The marshaler internally uses the singleton pattern
        // (constructor.$$instance.
        this._disposeSingletonObjects("_marshaler");
        this._delegate = null;
    }
});