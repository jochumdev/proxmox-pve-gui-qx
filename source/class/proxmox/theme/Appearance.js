/* ************************************************************************

   Copyright: 2018 René Jochum

   License: MIT license

   Authors:

************************************************************************ */

qx.Theme.define("proxmox.theme.Appearance",
  {
    extend: qx.theme.indigo.Appearance,

    appearances: {
      /*
       * Overwrites
       */
      "button-frame": {
        alias: "atom",

        style: function (states) {
          var decorator = "button-box";

          if (!states.disabled) {
            if (states.hovered && !states.pressed && !states.checked) {
              decorator = "button-box-hovered";
            } else if (states.hovered && (states.pressed || states.checked)) {
              decorator = "button-box-pressed-hovered";
            } else if (states.pressed || states.checked) {
              decorator = "button-box-pressed";
            }
          }

          if (states.invalid && !states.disabled) {
            decorator += "-invalid";
          } else if (states.focused) {
            decorator += "-focused";
          }

          return {
            font: "button",
            decorator: decorator,
            padding: [0, 5, 0, 2],
            cursor: states.disabled ? undefined : "pointer",
            minWidth: 5,
            minHeight: 5,
            maxHeight: 22,
          };
        }
      },

      "listitem":
        {
          alias: "atom",

          style: function (states) {
            var padding = [3, 5, 3, 5];
            if (states.lead) {
              padding = [2, 4, 2, 4];
            }
            if (states.dragover) {
              padding[2] -= 2;
            }

            var backgroundColor;
            if (states.selected) {
              backgroundColor = "background-selected-lighter";
              if (states.disabled) {
                backgroundColor += "-disabled";
              }
            }
            return {
              gap: 4,
              padding: padding,
              backgroundColor: backgroundColor,
              textColor: states.selected ? "text-selected" : undefined,
              decorator: states.lead ? "lead-item" : states.dragover ? "dragover" : undefined,
              opacity: states.drag ? 0.5 : undefined
            };
          }
        },

      "tree-folder/icon": {
        include: "image",

        style: function (states) {
          return {

          }
        }
      },

      // "tree-folder/open":
      //   {
      //     style: function (states) {
      //       return {
      //         source: states.opened ? "@FontAwesome/angle-down" : "@FontAwesome/angle-right"
      //       };
      //     }
      //   },

      "splitpane/splitter":
        {
          style: function (states) {
            return {
              backgroundColor: "background"
            };
          }
        },

      "tree": {
        include: "list",
        alias: "list",

        style: function (states) {
          return {
            decorator: undefined,
            padding: [2, 3],
          };
        }
      },

      /*
       * Own appearances
       */
      "cssatom": {
        include: "atom",
        alias: "atom"
      },

      "cssbutton": {
        alias: "cssatom",

        style: function (states) {
          var decorator = "button-box";

          if (!states.disabled) {
            if (states.hovered && !states.pressed && !states.checked) {
              decorator = "button-box-hovered";
            } else if (states.hovered && (states.pressed || states.checked)) {
              decorator = "button-box-pressed-hovered";
            } else if (states.pressed || states.checked) {
              decorator = "button-box-pressed";
            }
          }

          if (states.invalid && !states.disabled) {
            decorator += "-invalid";
          } else if (states.focused) {
            decorator += "-focused";
          }

          return {
            font: "button",
            decorator: decorator,
            padding: [0, 5, 0, 2],
            cursor: states.disabled ? undefined : "pointer",
            minWidth: 5,
            minHeight: 5,
            maxHeight: 22,
          };
        }
      },

      "header-label": {
        style: function (states) {
          return {
            font: "header",
            marginTop: 7,
          }
        }
      },

      "actionsbar-label": {
        style: function (states) {
          return {
            font: "header",
            marginTop: 2,
          }
        }
      },

      "search": {
        include: "textfield",

        style: function (states) {
          return {
            font: "header",
            marginTop: 4,
            padding: [3, 6, 2, 6],
          }
        }
      },

      "blue-button-frame": {
        include: "cssbutton",

        style: function (states) {
          var decorator = "blue-button-box";

          if (!states.disabled) {
            if (states.hovered && !states.pressed && !states.checked) {
              decorator = "button-box-hovered";
            } else if (states.hovered && (states.pressed || states.checked)) {
              decorator = "button-box-pressed-hovered";
            } else if (states.pressed || states.checked) {
              decorator = "button-box-pressed";
            }
          }

          if (states.invalid && !states.disabled) {
            decorator += "-invalid";
          } else if (states.focused) {
            decorator += "-focused";
          }

          return {
            textColor: "white",
            decorator: decorator,
            padding: [0, 7, 0, 6],
          };
        }
      },

      "blue-button-header": {
        include: "blue-button-frame",

        style: function (states) {
          return {
            marginTop: 4
          }
        }
      },

      "white-button-header": {
        include: "button-frame",

        style: function (states) {
          return {
            padding: [0, 7, 0, 6],
            marginTop: 4
          }
        }
      },

      "actionsbar-box": {
        style: function (states) {
          return {
            decorator: "actionsbar-border",
          }
        }
      },

      "content-box": {
        style: function (states) {
          return {
            backgroundColor: "white",
            decorator: "content-border"
          }
        }
      },

      "light-grey-box": {
        style: function (states) {
          return {
            backgroundColor: "background-light-grey"
          }
        }
      },

      "navbar-tree": {
        include: "tree",

        style: function (states) {
          return {
            scrollbarX: "off",
            scrollbarY: "off",
            backgroundColor: "background-light-grey",
            openMode: "tap"
          }
        }
      },

      "navbar-tree-item": {
        include: "button-frame",

        style: function (states) {
          var decorator = "button-navbar-box";

          if (!states.disabled) {
            if (states.hovered && !states.pressed && !states.checked) {
              decorator = "button-navbar-box-hovered";
            } else if (states.hovered && (states.pressed || states.checked)) {
              decorator = "button-navbar-box-pressed-hovered";
            } else if (states.pressed || states.checked) {
              decorator = "button-navbar-box-pressed";
            }
          }

          if (states.invalid && !states.disabled) {
            decorator += "-invalid";
          } else if (states.focused) {
            decorator += "-focused";
          }

          return {
            font: "button",
            decorator: decorator,
            padding: [0, 10, 0, 10],
            cursor: states.disabled ? undefined : "pointer",
            minWidth: 139,
            minHeight: 24,
            maxHeight: 24,
          };
        }
      },

      "flat-white-button-frame": {
        include: "button-frame",

        style: function (states) {
          var decorator = "flat-white-button-box";

          if (!states.disabled) {
            if (states.hovered && !states.pressed && !states.checked) {
              decorator = "flat-white-button-box-hovered";
            } else if (states.hovered && (states.pressed || states.checked)) {
              decorator = "flat-white-button-box-pressed-hovered";
            } else if (states.pressed || states.checked) {
              decorator = "flat-white-button-box-pressed";
            }
          }

          if (states.invalid && !states.disabled) {
            decorator += "-invalid";
          } else if (states.focused) {
            decorator += "-focused";
          }

          return {
            textColor: "black",
            decorator: decorator,
            padding: [3, 5, 3, 5],
          };
        }
      },

      "flat-white-selectbox": "flat-white-button-frame",
      "flat-white-selectbox/atom": "atom",
      "flat-white-selectbox/popup": "popup",
      "flat-white-selectbox/list": "widget",
      "flat-white-selectbox/arrow": "selectbox/arrow",

      "cssimage": {
        include: "image",

        style: function (states) {
          return {
            maxWidth: 24
          }
        }
      }
    }
  });
