qx.Mixin.define("p.page.core.MSubPage", {
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