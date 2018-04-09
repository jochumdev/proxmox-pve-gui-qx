/* ************************************************************************

   qooxdoo - the new era of web development

   http://qooxdoo.org

   Copyright:
     2004-2008 1&1 Internet AG, Germany, http://www.1und1.de

   License:
     MIT: https://opensource.org/licenses/MIT
     See the LICENSE file in the project's top-level directory for details.

   Authors:
     * René Jochum (pcdummy)

************************************************************************ */

/**
 * A button which acts as a normal button and shows a menu on one
 * of the sides to open something like a history list.
 *
 * @childControl button {qx.ui.form.Button} button to execute action
 * @childControl arrow {qx.ui.form.MenuButton} arrow to open the popup
 */
qx.Class.define("p.ui.form.CssSplitButton", {
  extend : qx.ui.form.SplitButton,

  /*
  *****************************************************************************
     CONSTRUCTOR
  *****************************************************************************
  */

  /**
   * @param label {String} Label to use
   * @param icon {Array?null} Icon to use
   * @param menu {qx.ui.menu.Menu} Connect to menu instance
   * @param command {qx.ui.command.Command} Command instance to connect with
   */
  construct : function(label, iconCssClasses, menu, command)
  {
    this.base(arguments, label, null, menu, command);

    if (iconCssClasses != null) {
      this.setIconCssClasses(iconCssClasses);
    }
  },

  /*
  *****************************************************************************
     PROPERTIES
  *****************************************************************************
  */

  properties :
  {
    iconCssClasses :
    {
      check : "Array",
      apply : "_applyIconCssClasses",
      nullable : true,
      themeable : true

    },
  },



  /*
  *****************************************************************************
     MEMBERS
  *****************************************************************************
  */

  members :
  {
    // property apply
    _applyIconCssClasses : function(value, old)
    {
      var button = this.getChildControl("button");
      value == null ? button.resetIconCssClasses() : button.setIconCssClasses(value);
    },


    /*
    ---------------------------------------------------------------------------
      WIDGET API
    ---------------------------------------------------------------------------
    */

    // overridden
    _createChildControlImpl : function(id, hash)
    {
      var control;

      switch(id)
      {
        case "button":
          control = new p.ui.form.CssButton;
          control.addListener("execute", this._onButtonExecute, this);
          control.setFocusable(false);
          this._addAt(control, 0, {flex: 1});
          break;
      }

      return control || this.base(arguments, id);
    },
  }
});
