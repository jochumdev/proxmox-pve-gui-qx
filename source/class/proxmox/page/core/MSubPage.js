qx.Mixin.define("proxmox.page.core.MSubPage", {
    include: [
        qx.locale.MTranslation,
    ],

    properties: {
        page: {},

        id: {
            event: "changeId",
            nullable: true
        }
    },

});