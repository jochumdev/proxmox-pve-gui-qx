/**
 * @asset(proxmox/json/cluster/resources.json)
 */
qx.Class.define("proxmox.service.Resources", {
    extend: proxmox.service.core.AbstractService,

    members: {
        // Abstract implementation
        getUrl: function() {
            return qx.util.ResourceManager.getInstance().toUri("proxmox/json/cluster/resources.json");
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