/**
 * @asset(proxmox/json/cluster/tasks.json)
 */
qx.Class.define("proxmox.service.Tasks", {
    extend: proxmox.service.core.AbstractService,

    members: {
        // Abstract implementation
        getUrl: function() {
            return qx.util.ResourceManager.getInstance().toUri("proxmox/json/cluster/tasks.json");
        },

        getDelegate: function() {
            return {
                manipulateData: function(data) {
                    return data.data;
                }
            }
        }
    }
});