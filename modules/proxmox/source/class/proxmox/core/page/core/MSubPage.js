qx.Mixin.define("proxmox.core.page.core.MSubPage", {
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