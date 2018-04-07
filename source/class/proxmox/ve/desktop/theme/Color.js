/* ************************************************************************

   Copyright: 2018 René Jochum

   License: MIT license

   Authors:

************************************************************************ */

qx.Theme.define("proxmox.ve.desktop.theme.Color",
  {
    extend : qx.theme.indigo.Color,

    colors :
    {
      /*
       * Overwrites
       */
      "background": "#CFCFCF",

      "button-border": "#D8D8D8",
      "background-selected": "#3892D4",

      "background-selected-lighter": "#D6E9F6",
      "text-selected": "black",
      "text-placeholder": "gray",

      /*
       * Own
       */
      "background-light-grey": "#F5F5F5",

      "blue-button-border": "#157fCC",
      "blue-button-bright": "#3892D4",

      // Navigation
      "button-nav-selected": "#C2DDF2",
      "button-nav-hovered": "#C2DDF2"

    }
  });
