qx.Class.define("pvec.Utils", {
    type: "static",

    statics: {
        getDefaultViewer: function (allowSpice) {
            var dv = 'vv'; // TODOD: in Proxmox code this is "html5".

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
            var dv = pvec.Utils.getDefaultViewer(allowSpice);
            pvec.Utils.openConsoleWindow(dv, vmtype, vmid, nodename, vmname);
        },

        openConsoleWindow: function (viewer, vmtype, vmid, nodename, vmname) {
            // qemu, lxc, shell, upgrade

            if (vmid == undefined && (vmtype === 'qemu' || vmtype === 'lxc')) {
                throw new Error("missing vmid");
            }

            if (!nodename) {
                throw new Error("no nodename specified");
            }

            if (vmtype === "qemu") {
                vmtype = "kvm";
            }

            if (viewer === 'html5') {
                pvec.Utils.openVNCViewer(vmtype, vmid, nodename, vmname);
            } else if (viewer === 'xtermjs') {
                p.Utils.openXtermJsViewer(vmtype, vmid, nodename, vmname);
            } else if (viewer === 'vv') {
                var url;
                var params = { proxy: p.Utils.windowHostname() };
                if (vmtype === 'kvm') {
                    url = '/nodes/' + nodename + '/qemu/' + vmid.toString() + '/spiceproxy';
                    pvec.Utils.openSpiceViewer(url, params);
                } else if (vmtype === 'lxc') {
                    url = '/nodes/' + nodename + '/lxc/' + vmid.toString() + '/spiceproxy';
                    pvec.Utils.openSpiceViewer(url, params);
                } else if (vmtype === 'shell') {
                    url = '/nodes/' + nodename + '/spiceshell';
                    pvec.Utils.openSpiceViewer(url, params);
                } else if (vmtype === 'upgrade') {
                    url = '/nodes/' + nodename + '/spiceshell';
                    params.upgrade = 1;
                    pvec.Utils.openSpiceViewer(url, params);
                }
            } else {
                throw new Error(`unknown viewer type "${viewer}`);
            }
        },

        openVNCViewer: function(vmtype, vmid, nodename, vmname) {
            if (vmtype === "qemu") {
                vmtype = "kvm";
            }

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

        openSpiceViewer: function(url, params) {
            var sm = qx.core.Init.getApplication().getServiceManager();

            var simpleService = new pvec.service.SimpleService(sm.getBaseUrl() + url);
            simpleService.set({
                method: "POST",
                noModelTransform: true,
            });

            simpleService.fetch(params).then((data) => {
                var raw = "[virt-viewer]\n";
                for (var key in data) {
                    raw += key + "=" + data[key] + "\n";
                }
                var url = 'data:application/x-virt-viewer;charset=UTF-8,' +
                    encodeURIComponent(raw);

                p.Utils.downloadWithName(url, "pve-spice.vv");
            }).catch((ex) => console.error(ex));

        }
    }
});