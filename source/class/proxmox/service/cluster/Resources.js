qx.Class.define("proxmox.service.cluster.Resources", {
    extend: proxmox.service.core.AbstractService,

    members: {
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