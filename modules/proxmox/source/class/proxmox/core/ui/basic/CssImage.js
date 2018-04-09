/* ************************************************************************

   Copyright: 2018

   License: MIT license

   Authors:

************************************************************************ */

qx.Class.define("proxmox.core.ui.basic.CssImage",
{
  extend : qx.ui.core.Widget,

  construct: function(cssClasses) {
    this.base(arguments);

    if (cssClasses) {
      this.setCssClasses(cssClasses);
    }
  },

  properties: {
    appearance: {
      refine: true,
      init: "cssimage"
    },

    /* this is here so it works as drop in replacement for qx.ui.basic.Image */
    source: {
      init: null,
      nullable: true,
    },

    cssClasses: {
      check: "Array",
      init: null,
      nullable: true,
      event: "changeCssClasses",
      apply: "_applyCssClasses",
      themeable: true
    }
  },

  members: {
    // Overwriten
    _getContentHint: function()
    {
      return {
        width: 17,
        height: 16,
      }
    },

    _applyCssClasses: function(value, old) {
      var cElem = this.getContentElement();
      if (old != null) {
        old.forEach((sc) => {
          cElem.removeClass(sc);
        });
      }

      if (value != null) {
        value.forEach((sc) => {
            cElem.addClass(sc);
        });
      }
    },

    // overridden
    _applyTextColor : function(value, old)
    {
      if (value) {
        this.getContentElement().setStyle("color", qx.theme.manager.Color.getInstance().resolve(value));
      } else {
        this.getContentElement().removeStyle("color");
      }
    },
  }
});