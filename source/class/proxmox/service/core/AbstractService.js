qx.Class.define("proxmox.service.core.AbstractService", {
    extend: qx.core.Object,
    type: "abstract",
    implement: [
        proxmox.service.core.IService
    ],

    construct: function (url, method) {
        this.base(arguments);

        this.set({
            url: url,
            method: method
        });
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
                "configured", "sending", "receiving",
                "completed", "failed"
            ],
            init: "configured",
            event: "changeState"
        },

        url: {
            check: "String",
        },

        method: {
            check: ["GET", "POST", "PUT", "DEL", "OPTIONS"]
        },

        headers: {
            init: {},
        },

        mode: {
            check: ["no-cors", "cors", "same-origin"],
            init: "same-origin"
        }
    },

    members: {
        __store: null,
        __marshaler: null,
        __request: null,

        getDelegate: function () {
            return undefined;
        },

        /**
         * @return {Promise} From the fetch Request.
         */
        fetch: function (data) {
            if (this.__marshaler === null) {
                this.__marshaler = new qx.data.marshal.Json(this.getDelegate());
            }

            return this._createRequest(data);
        },

        /**
         * Overwrite if you want to manipulate request data.
         *
         * @see: https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch
         */
        _configureRequest: function (data) {
            var cfg = {
                cache: 'no-cache',
                method: this.getMethod(),
                // mode: this.getMode()
            }

            var h = {};
            var ho = this.getHeaders();
            for (var key in ho) {
                h[key] = ho[key];
            }

            if (data) {
                // TODO: Add support for other content types based on the given content type.
                h['Content-Type'] = 'application/x-www-form-urlencoded';
                cfg.body = qx.util.Uri.toParameter(data);
            }
            cfg.headers = h;

            return cfg;
        },

        /**
         * Creates and sends a GET request with the given url.
         *
         * Listeners will be added to respond to the request’s "success",
         * "changePhase" and "fail" event.
         *
         * @param url {String} The url for the request.
         */
        _createRequest: function (data) {
            if (this.isDisposed()) {
                throw new Error("Disposed");
            }

            // dispose old request
            if (this.__requestPromise) {
                this.__requestPromise.cancel();
                this.__requestPromise = null;
            }

            // take care of the resource management
            var url = this.getUrl();
            url = qx.util.AliasManager.getInstance().resolve(url);
            url = qx.util.ResourceManager.getInstance().toUri(url);

            this.__requestPromise = qxc.require.Init.require(["fetch"])
                .catch(ex => {
                    this.setState("failed");
                    this.fireDataEvent("error", { request: url, error: ex });
                    throw ex;
                }).spread((fetchpoly) => {
                    var fetchImpl;
                    if (fetchpoly) {
                        fetchImpl = fetchpoly;
                    } else {
                        fetchImpl = window.fetch;
                    }

                    return fetchImpl;

                }).then((fetchImpl) => {

                    var cfg = this._configureRequest(data);

                    this.setState("configured");
                    this.setState("sending");
                    return fetchImpl(url, cfg)
                        .then((response) => {
                            if (response.status == 200) {
                                return response.json()
                                    .then((data) => {
                                        if (this.isDisposed()) {
                                            throw new Error("Disposed");
                                        }

                                        this.setState("receiving");

                                        // check for the data manipulation hook
                                        var del = this.getDelegate();
                                        if (del && qx.lang.Type.isFunction(del.manipulateData)) {
                                            data = del.manipulateData(data);
                                        }

                                        // create the class
                                        this.__marshaler.toClass(data, true);

                                        var oldModel = this.getModel();

                                        // set the initial data
                                        var model = this.__marshaler.toModel(data);
                                        this.setModel(model);

                                        // get rid of the old model
                                        if (oldModel && oldModel.dispose) {
                                            oldModel.dispose();
                                        }

                                        // fire complete event
                                        this.fireDataEvent("loaded", model);

                                        this.setState("completed");

                                        return model;
                                    }).catch((ex) => {
                                        this.setState("failed");
                                        this.fireDataEvent("parseError", { request: url, error: ex });
                                        this.fireDataEvent("error", { request: url, error: ex });
                                        throw ex;
                                    });
                            } else {
                                var ex = new Error("Request failed");
                                this.setState("failed");
                                this.fireDataEvent("error", { request: url, error: ex});
                                throw ex;
                            }
                        });
                });

            return this.__requestPromise;
        },
    },

    destruct: function () {
        if (this.__requestPromise != null) {
            this._disposeObjects("__request");
        }

        // The marshaler internally uses the singleton pattern
        // (constructor.$$instance.
        this._disposeSingletonObjects("_marshaler");
    }
});