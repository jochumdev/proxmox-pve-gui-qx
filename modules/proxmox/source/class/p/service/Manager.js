qx.Class.define("p.service.Manager", {
    extend: qx.core.Object,

    construct: function() {
        this.base(arguments);

        this._endpoints = {};
        this._services = {};
        this._resourceServices = {};

        var st = this._serviceTimer = new qx.event.Timer(this.getTimerInterval());
        st.addListener("interval", this._onTimer, this);
    },

    statics: {
        GET: "GET",
        POST: "POST",
        PUT: "PUT",
        DEL: "DEL"
    },

    events: {
        disposedServices: "qx.event.type.Event",
        disposedResourceServices: "qx.event.type.Event",
    },

    properties: {
        baseUrl: {
            check: "String",
            init: "",
            apply: "_applyBaseUrl"
        },

        timerInterval: {
            check: "Integer",
            init: 5000,
            apply: "_applyTimerInterval",
        },
    },

    members: {
        _serviceTimer: null,
        _endpoints: null,
        _services: null,
        _resourceServices: null,

        /**
         * Registers and endpoint to this Manager.
         *
         * @param name {String} Service Name for future use.
         * @param pattern {String} Path pattern, see: http://www.qooxdoo.org/5.1/api/#qx.lang.String~format
         * @param serviceClazz {Class?} Qx class which implements p.service.core.IService.
         * @param method {String?} HTTP Method - default GET.
         * @param wantsTimer {Boolean?} If the endpoint wants to get called periodically.
         */
        registerEndpoint: function(name, pattern, serviceClazz, method, wantsTimer) {
            method = method || p.service.Manager.GET;
            name = this._translateServiceName(name, method);
            this._endpoints[name] = {
                pattern: pattern,
                serviceClazz: serviceClazz,
                method: method,
                wantsTimer: wantsTimer || false
            };
        },

        /**
         * @param name {String} Service Name.
         * @param method {String?} HTTP Method - default GET.
         */
        getService: function(name, method) {
            method = method || p.service.Manager.GET;
            name = this._translateServiceName(name, method);
            if (name in this._services) {
                return this._services[name];
            }

            var sv = this._services[name] = this._createService(name, null, method);
            return sv;
        },

        /**
         * @param name {String} Service Name.
         * @param args {Array?} Array of arguments for the endpoint registered with registerEndpoint.
         * @param method {String?} HTTP Method - default GET.
         */
        getResourceService: function(name, args, method) {
            method = method || p.service.Manager.GET;
            name = this._translateServiceName(name, method);
            if (name in this._resourceServices) {
                var sv = this._resourceServices[name]
                if (sv.args.equals(args)) {
                    return sv;
                } else {
                    // Never disposed old resources.
                    // TODO: Maybe dispose here and recreate.
                    throw Error("Requested a ResourceService with different args, that should not happen");
                }
            }

            var sv = this._createService(name, args, method);
            this._resourceServices[name] = {sv: sv, args: new qx.data.Array(args)};
            return sv;
        },

        /**
         * Creates and returns a resource service that won't be registerd internaly.
         *
         * WARNING: You need to dispose that service yourself.
         *
         * @param name {String} Service Name.
         * @param args {Array?} Array of arguments for the endpoint registered with registerEndpoint.
         * @param method {String?} HTTP Method - default GET.
         */
        getUnregisteredResourceService: function(name, args, method) {
            method = method || p.service.Manager.GET;
            name = this._translateServiceName(name, method);

            return this._createService(name, args, method);
        },

        disposeServices: function() {
            Object.keys(this._services).forEach((key) => {
                this._disposeObjects(this._services[key]);
            });
            this._services = {};

            this.fireEvent("disposedServices");
        },

        disposeResourceServices: function() {
            Object.keys(this._resourceServices).forEach((key) => {
                this._disposeObjects(this._resourceServices[key].sv);
            });
            this._resourceServices = {};

            this.fireEvent("disposedResourceServices");
        },

        getTimer: function() {
            return this._serviceTimer;
        },

        executeTimerOnce: function() {
            this._onTimer();
        },

        _createService: function(name, args, method) {
            if (!(name in this._endpoints)) {
                throw Error(`Register the endpoint "${name}" with registerEndpoint first`);
            }

            var endpoint = this._endpoints[name];
            var url;
            if (args != null) {
                url = this.getBaseUrl() + "/" + qx.lang.String.format(endpoint.pattern, args);
            } else {
                url = this.getBaseUrl() + "/" + endpoint.pattern;
            }

            var sv = new (endpoint.serviceClazz)(url, method, endpoint.wantsTimer);

            return sv;
        },

        _translateServiceName: function(name, method) {
            return name + "|" + method;
        },

        _applyBaseUrl: function() {
            this.disposeServices();
            this.disposeResourceServices();
        },

        _applyTimerInterval: function(value) {
            this._serviceTimer.setInterval(value);
        },

        _onTimer: function() {
            var services = this._services;
            Object.keys(services).forEach((key) => {
                var service = services[key];
                // Filter out services that dont want a timer.
                if (!service.getWantsTimer()) {
                    return;
                }

                service.executeTimer();
            });

            var rServices = this._resourceServices;
            Object.keys(rServices).forEach((key) => {
                var service = rServices[key].sv;
                // Filter out services that dont want a timer.
                if (!service.getWantsTimer()) {
                    return;
                }

                service.executeTimer();
            });
        },
    },

    destruct: function () {
        this.disposeServices();
        this.disposeResourceServices();
    }
});