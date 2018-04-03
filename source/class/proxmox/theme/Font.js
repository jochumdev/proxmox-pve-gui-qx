/* ************************************************************************

   Copyright: 2018 René Jochum

   License: MIT license

   Authors:

************************************************************************ */

qx.Theme.define("proxmox.theme.Font",
  {
    extend : qx.theme.indigo.Font,

    fonts :
    {
      /*
       * Overwrites
       */
      "default": {
        size : 13,
        family : ["helvetica", "arial", "verdana", "sans-serif"],
        color: "black",
        weight: "300",
      },

      /*
       * Own
       */
      "header": {
        size : 13,
        family : ["helvetica", "arial", "verdana", "sans-serif"],
        color: "black",
        lineHeight: 1.3,
        weight: "300",
      },

      "button": {
        size : 12,
        family : ["helvetica", "arial", "verdana", "sans-serif"],
        color: "black",
        weight: "300",
        lineHeight: 1.333,
      },

      "navbar": {
        size: 13,
        family : ["helvetica", "arial", "verdana", "sans-serif"],
        color: "black",
        weight: "300",
        lineHeight: 1.85
      }
    }
  });
