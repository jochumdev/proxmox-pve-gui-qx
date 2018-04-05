qx.Class.define("proxmox.service.cluster.Resources", {
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
                    return data.data;
                },

                getModelMixins: function(properties) {
                    return proxmox.model.MResource;
                }
            }
        }
    }
});