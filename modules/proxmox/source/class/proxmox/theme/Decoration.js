/* ************************************************************************

   Copyright: 2018 René Jochum

   License: MIT license

   Authors:

************************************************************************ */

qx.Theme.define("proxmox.theme.Decoration", {
  extend: qx.theme.simple.Decoration,

  decorations: {
    /*
     * Overwrites
     */

    "inset":
      {
        style:
          {
            width: 1,
            color: ["border-light", "border-light", "border-light", "border-light"]
          }
      },

    "focused-inset":
      {
        style:
          {
            width: 1,
            color: "background-selected"
          }
      },

    /*
    ---------------------------------------------------------------------------
      BUTTON
    ---------------------------------------------------------------------------
    */
    "button-box": {
      style: {
        radius: 3,
        width: 1,
        color: "button-border",
        backgroundColor: "button-box-bright"
      }
    },

    "button-box-pressed": {
      include: "button-box",

      style: {
        gradientStart: ["button-box-bright-pressed", 40],
        gradientEnd: ["button-box-dark-pressed", 70],
        backgroundColor: "button-box-bright-pressed"
      }
    },

    "button-box-pressed-hovered": {
      include: "button-box-pressed",

      style: {
        color: "button-border-hovered"
      }
    },

    "button-box-hovered": {
      include: "button-box",

      style: {
        color: "button-border-hovered"
      }
    },

    "button-box-focused":
      {
        include: "button-box",

        style:
          {
            color: "background-selected"
          }
      },

    "button-box-pressed-focused":
      {
        include: "button-box-pressed",

        style:
          {
            color: "background-selected"
          }
      },

    "button-box-hovered-focused": { include: "button-box-focused" },

    "button-box-pressed-hovered-focused": { include: "button-box-pressed-focused" },

    /*
     * Own
     */

    "toolbar-border": {
      style: {
        widthBottom: 1,
        color: "background"
      }
    },

    "content-border": {
      style: {
        widthRight: 5,
        color: "background"
      }
    },

    /* blue button */
    "blue-button-box": {
      style: {
        radius: 3,
        width: 1,
        color: "blue-button-border",
        backgroundColor: "blue-button-bright"
      }
    },

    "blue-button-box-pressed": {
      include: "blue-button-box",

      style: {
        gradientStart: ["button-box-bright-pressed", 40],
        gradientEnd: ["button-box-dark-pressed", 70],
        backgroundColor: "button-box-bright-pressed"
      }
    },

    "blue-button-box-pressed-hovered": {
      include: "blue-button-box-pressed",

      style: {
        color: "button-border-hovered"
      }
    },

    "blue-button-box-hovered": {
      include: "blue-button-box",

      style: {
        color: "button-border-hovered"
      }
    },

    "blue-button-box-focused":
      {
        include: "blue-button-box",

        style:
          {
            color: "background-selected"
          }
      },

    "blue-button-box-pressed-focused":
      {
        include: "blue-button-box-pressed",

        style:
          {
            color: "background-selected"
          }
      },

    "blue-button-box-hovered-focused": { include: "blue-button-box-focused" },

    "blue-button-box-pressed-hovered-focused": { include: "blue-button-box-pressed-focused" },

    /* white button */
    "flat-white-button-box": {
      style: {
        width: 1,
        color: "white",
        backgroundColor: "white"
      }
    },

    "flat-white-button-box-pressed": {
      include: "flat-white-button-box",

      style: {
        backgroundColor: "button-box-bright-pressed"
      }
    },

    "flat-white-button-box-pressed-hovered": {
      include: "flat-white-button-box",

      style: {
        color: "button-border-hovered"
      }
    },

    "flat-white-button-box-hovered": {
      include: "flat-white-button-box",

      style: {
        color: "button-border-hovered"
      }
    },

    "flat-white-button-box-focused": {
      include: "flat-white-button-box",

      style:
        {
          color: "background-selected"
        }
    },

    "flat-white-button-box-pressed-focused": {
      include: "lat-white-button-box-pressed",

      style:
        {
          color: "background-selected"
        }
    },

    "flat-white-button-box-hovered-focused": { include: "flat-white-button-box-focused" },

    "flat-white-button-box-pressed-hovered-focused": { include: "flat-white-button-box-pressed-focused" },

    /*
    ---------------------------------------------------------------------------
      Navbar buttons
    ---------------------------------------------------------------------------
    */
    "button-navbar-box": {
      style: {
      }
    },

    "button-navbar-box-pressed": {
      include: "button-navbar-box",

      style: {
        backgroundColor: "button-box-bright-pressed"
      }
    },

    "button-navbar-box-pressed-hovered": {
      include: "button-navbar-box-pressed",

      style: {
        backgroundColor: "button-nav-hovered"
      }
    },

    "button-navbar-box-hovered": {
      include: "button-navbar-box",

      style: {
        backgroundColor: "button-nav-hovered"
      }
    },

    "button-navbar-box-focused":
      {
        include: "button-navbar-box",

        style:
          {
            backgroundColor: "button-nav-selected"
          }
      },

    "button-navbar-box-pressed-focused":
      {
        include: "button-navbar-box-pressed",

        style:
          {
            backgroundColor: "button-nav-selected"
          }
      },

    "button-navbar-box-hovered-focused": { include: "button-navbar-box-focused" },

    "button-navbar-box-pressed-hovered-focused": { include: "button-navbar-box-pressed-focused" },
  }
});
