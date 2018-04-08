qx.Interface.define("proxmox.core.service.core.IService", {

    properties: {
        wantsTimer: {
            check: "Boolean",
            init: false,
        }
    },

    members: {
        fetch: function() {
            return true;
        },

        executeTimer: function() {
            return true;
        }
    }
});