qx.Class.define("proxmox.ve.desktop.window.SearchTable", {
    extend: qx.ui.window.Window,

    construct: function (table) {
        this.base(arguments);

        this.set({
            layout: new qx.ui.layout.Canvas(),
            modal: false,
            decorator: null,
            showStatusbar: false,
            showMinimize: false,
            showMaximize: false,
            showClose: false,
            resizable: false
        });

        table.setStatusBarVisible(false);
        this.add(table, { edge: 0 });
    },

    members: {
        // overridden
        _createChildControlImpl: function (id, hash) {
            var control;

            switch (id) {
                case "captionbar":
                    // captionbar
                    var layout = new qx.ui.layout.Grid();
                    layout.setRowFlex(0, 1);
                    layout.setColumnFlex(1, 1);
                    control = new qx.ui.container.Composite(layout);
                    // this._add(control);

                    // captionbar events
                    control.addListener("dbltap", this._onCaptionPointerDblTap, this);

                    // register as move handle
                    this._activateMoveHandle(control);
                    break;
            }

            return control || this.base(arguments, id);
        }
    }
});