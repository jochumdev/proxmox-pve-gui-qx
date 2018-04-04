qx.Class.define("proxmox.service.SimpleService", {
    extend: proxmox.service.core.AbstractService,

    members: {
        getDelegate: function() {
            return {
                manipulateData: function(data) {
                    return data.data;
                }
            }
        }
    }
});