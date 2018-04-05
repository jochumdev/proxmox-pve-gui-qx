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
                    var data = data.data;
                    var result = []

                    data.forEach((node) => {
                        // Short Id
                        var idParts = node.id.split("/");
                        switch(node.type) {
                            case "pool":
                                node.shortId = idParts[2];
                                node.id = idParts[1] + "/" + idParts[2];
                                break;
                            default:
                                node.shortId = idParts[1];
                        }

                        // Name
                        switch (node.type) {
                            case "storage":
                                node.name = node.storage;
                                break;
                            case "pool":
                                node.name = node.pool;
                                break;
                            case "node":
                                node.name = node.node;
                                break;
                        }

                        // Status
                        if (node.type === "pool") {
                            node.status = "";
                        }

                        // Node
                        if (node.type === "pool") {
                            node.node = "";
                        }

                        // Description
                        switch (node.type) {
                            case "node":
                                node.description = node.name;
                                break;
                            case "pool":
                                node.description = node.pool;
                                break;
                            case "storage":
                                node.description = node.name + " (" + node.node + ")";
                                break;
                            default:
                                node.description = node.shortId + " (" + node.name + ")";
                        }

                        // Pool
                        if (!("pool" in node)) {
                            node.pool = "";
                        }

                        result.push(node);
                    });

                    return result;
                },

                getModelMixins: function(properties, parentProperty) {
                    return proxmox.model.MResource;
                }
            }
        }
    }
});