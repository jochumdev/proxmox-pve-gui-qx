qx.Class.define("proxmox.Utils", {
    type : "static",

    statics:
    {
        getResourceInfo: function(apiData) {
            var info = {
                label: "",
                type: apiData.getType(),
                status: apiData.getStatus(),
                fullId: apiData.getId(),
                node: apiData.getNode(),
                id: "",
                name: ""
            };

            var idParts = info.fullId.split("/");
            info.id = idParts[1];

            switch (info.type) {
                case "node":
                    info.label = apiData.getNode();
                    break;
                case "lxc":
                case "qemu":
                    info.name = apiData.getName();
                    info.label = info.id + " (" + info.name + ")";
                    break;
                case "storage":
                    info.name = apiData.getStorage();
                    info.label = info.name + " (" + info.node + ")";
                    break;
            }

            return info;
        }
    }
});