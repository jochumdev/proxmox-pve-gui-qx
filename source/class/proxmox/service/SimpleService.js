qx.Class.define("proxmox.service.SimpleService", {
    extend: proxmox.service.core.AbstractService,

    members: {
        _configureRequest: function(data) {
            var cfg = this.base(arguments, data);

            var app = qx.core.Init.getApplication();
            var csrf = app.getCsrfPreventionToken();
            if (csrf) {
                cfg.headers['CSRFPreventionToken'] = csrf;
            }
            cfg.credentials = 'include';

            return cfg;
        },

        getDelegate: function() {
            return {
                manipulateData: function(data) {
                    if (data.errors) {
                        throw Error("Got an error(s) form the API: " + qx.lang.Json.stringify(errors));
                    }
                    return data.data;
                }
            }
        }
    }
});