qx.Class.define("proxmox.page.pool.Summary", {
    extend: qx.core.Object,
    include: [
        proxmox.page.core.MSubPage
    ],
    implement: [
        proxmox.page.core.ISubPage
    ],

    members: {
        getSubPageContainer: function () {
            // Content
            var scroll = new qx.ui.container.Scroll().set({
                scrollbarX: "auto",
                scrollbarY: "auto",
                height: qx.bom.Viewport.getHeight() - 200
            });
            scroll.add(new qx.ui.core.Widget().set({ width: 2000, minWidth: 2000, height: 2000, minHeight: 2000 }));

            return scroll;
        }
    }
});