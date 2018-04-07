qx.Class.define("proxmox.ui.tree.CssVirtualTreeItem", {
    extend: qx.ui.tree.VirtualTreeItem,

    properties: {
        cssClasses: {
            event: "changeCssClasses",
            nullable: true,
            apply: "_applyCssClasses"
        },

        internalCssClasses: {
            event: "changeInternalCssClasses",
            nullable: true
        }
    },

    members: {
        _hasCssIcon: false,
        _wasCssIcon: false,
        _iconAdded: false,

        // overrideen
        addIcon: function () {
            var icon = this.getChildControl("icon");
            var cssicon = this.getChildControl("cssicon");

            if (this._iconAdded) {
                if (this._hasCssIcon && !this._wasCssIcon) {
                    this._remove(icon);
                } else if (!this._hasCssIcon && this._wasCssIcon) {
                    this._remove(cssicon);
                } else if (this._wasCssIcon) {
                    this._remove(cssicon);
                } else {
                    this._remove(icon);
                }
            }

            if (this._hasCssIcon) {
                this._add(cssicon);
            } else {
                this._add(icon);
            }

            this._wasCssIcon = this._hasCssIcon;
            this._iconAdded = true;
        },

        // overridden
        _createChildControlImpl: function (id, hash) {
            var control;

            switch (id) {
                case "cssicon":
                    var cssClasses = this.getCssClasses();
                    control = new proxmox.ui.basic.CssImage(cssClasses);
                    control.set({
                        anonymous: true
                    });
                    this.bind("internalCssClasses", control, "cssClasses")
                    break;
            }

            return control || this.base(arguments, id);
        },

        _applyCssClasses: function (cssClasses) {
            if (Array.isArray(cssClasses)) {
                this._hasCssIcon = true;

                this.setIcon(null);
                this.setInternalCssClasses(cssClasses);

                this._addWidgets();
            } else {
                this._hasCssIcon = false;

                this.setIcon(cssClasses);
                this.setInternalCssClasses(null);

                this._addWidgets();
            }
        }
    }
});