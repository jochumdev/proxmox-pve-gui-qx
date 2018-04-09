qx.Class.define("proxmox.ve.core.Utils", {
    type: "static",

    statics: {
        getDefaultViewer: function (allowSpice) {
            var dv = 'html5';

            var app = qx.core.Init.getApplication();
            var versionInfo = app.getVersionInfo();
            if (qx.Class.hasProperty(versionInfo.constructor, "console")) {
                dv = versionInfo.getConsole();
            }

            if (dv === 'vv' && !allowSpice) {
                dv = 'html5';
            }

            return dv;
        },

        openDefaultConsoleWindow: function(allowSpice, vmtype, vmid, nodename, vmname) {
            var dv = proxmox.ve.core.Utils.defaultViewer(allowSpice);
            proxmox.ve.core.Utils.openConsoleWindow(dv, vmtype, vmid, nodename, vmname);
        },

        openConsoleWindow: function (viewer, vmtype, vmid, nodename, vmname) {
            // kvm, lxc, shell, upgrade

            if (vmid == undefined && (vmtype === 'kvm' || vmtype === 'lxc')) {
                throw "missing vmid";
            }

            if (!nodename) {
                throw "no nodename specified";
            }

            if (viewer === 'html5') {
                proxmox.ve.core.Utils.openVNCViewer(vmtype, vmid, nodename, vmname);
            } else if (viewer === 'xtermjs') {
                proxmox.core.Utils.openXtermJsViewer(vmtype, vmid, nodename, vmname);
            } else if (viewer === 'vv') {
                var url;
                var params = { proxy: proxmox.core.Utils.windowHostname() };
                if (vmtype === 'kvm') {
                    url = '/nodes/' + nodename + '/qemu/' + vmid.toString() + '/spiceproxy';
                    proxmox.ve.core.Utils.openSpiceViewer(url, params);
                } else if (vmtype === 'lxc') {
                    url = '/nodes/' + nodename + '/lxc/' + vmid.toString() + '/spiceproxy';
                    proxmox.ve.core.Utils.openSpiceViewer(url, params);
                } else if (vmtype === 'shell') {
                    url = '/nodes/' + nodename + '/spiceshell';
                    proxmox.ve.core.Utils.openSpiceViewer(url, params);
                } else if (vmtype === 'upgrade') {
                    url = '/nodes/' + nodename + '/spiceshell';
                    params.upgrade = 1;
                    proxmox.ve.core.Utils.openSpiceViewer(url, params);
                }
            } else {
                throw "unknown viewer type";
            }
        },

        openVNCViewer: function(vmtype, vmid, nodename, vmname) {
            var url = qx.util.Uri.toParameter({
                console: vmtype,
                novnc: 1,
                vmid: vmid,
                vmname: vmname,
                node: nodename
            });
            var nw = window.open("/?" + url, '_blank', "innerWidth=745,innerheight=427");
            nw.focus();
        },
    }
});