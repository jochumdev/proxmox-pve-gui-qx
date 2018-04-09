var IPV4_OCTET = "(?:25[0-5]|(?:[1-9]|1[0-9]|2[0-4])?[0-9])";
var IPV4_REGEXP = "(?:(?:" + IPV4_OCTET + "\\.){3}" + IPV4_OCTET + ")";
var IPV6_H16 = "(?:[0-9a-fA-F]{1,4})";
var IPV6_LS32 = "(?:(?:" + IPV6_H16 + ":" + IPV6_H16 + ")|" + IPV4_REGEXP + ")";
var IPV6_REGEXP = "(?:" +
    "(?:(?:"                                                  + "(?:" + IPV6_H16 + ":){6})" + IPV6_LS32 + ")|" +
    "(?:(?:"                                         +   "::" + "(?:" + IPV6_H16 + ":){5})" + IPV6_LS32 + ")|" +
    "(?:(?:(?:"                           + IPV6_H16 + ")?::" + "(?:" + IPV6_H16 + ":){4})" + IPV6_LS32 + ")|" +
    "(?:(?:(?:(?:" + IPV6_H16 + ":){0,1}" + IPV6_H16 + ")?::" + "(?:" + IPV6_H16 + ":){3})" + IPV6_LS32 + ")|" +
    "(?:(?:(?:(?:" + IPV6_H16 + ":){0,2}" + IPV6_H16 + ")?::" + "(?:" + IPV6_H16 + ":){2})" + IPV6_LS32 + ")|" +
    "(?:(?:(?:(?:" + IPV6_H16 + ":){0,3}" + IPV6_H16 + ")?::" + "(?:" + IPV6_H16 + ":){1})" + IPV6_LS32 + ")|" +
    "(?:(?:(?:(?:" + IPV6_H16 + ":){0,4}" + IPV6_H16 + ")?::" +                         ")" + IPV6_LS32 + ")|" +
    "(?:(?:(?:(?:" + IPV6_H16 + ":){0,5}" + IPV6_H16 + ")?::" +                         ")" + IPV6_H16  + ")|" +
    "(?:(?:(?:(?:" + IPV6_H16 + ":){0,7}" + IPV6_H16 + ")?::" +                         ")"             + ")"  +
    ")";

var DnsName_REGEXP = "(?:(([a-zA-Z0-9]([a-zA-Z0-9\\-]*[a-zA-Z0-9])?)\\.)*([A-Za-z0-9]([A-Za-z0-9\\-]*[A-Za-z0-9])?))";

qx.Class.define("proxmox.core.Utils", {
    type: "static",

    statics: {
        secondsToHHMMSS: function(seconds) {
            var sec_num = parseInt(seconds, 10); // don't forget the second param
            var hours   = Math.floor(sec_num / 3600);
            var minutes = Math.floor((sec_num - (hours * 3600)) / 60);
            var seconds = sec_num - (hours * 3600) - (minutes * 60);

            if (hours   < 10) {hours   = "0"+hours;}
            if (minutes < 10) {minutes = "0"+minutes;}
            if (seconds < 10) {seconds = "0"+seconds;}
            return hours+':'+minutes+':'+seconds;
        },

        openXtermJsViewer: function(vmtype, vmid, nodename, vmname) {
            var url = qx.util.Uri.toParameter({
                console: vmtype,
                xtermjs: 1,
                vmid: vmid,
                vmname: vmname,
                node: nodename
            });
            var nw = window.open("/?" + url, '_blank', 'toolbar=no,location=no,status=no,menubar=no,resizable=yes,width=800,height=420');
            nw.focus();
        },

        IP4_match: new RegExp("^(?:" + IPV4_REGEXP + ")$"),
        IP4_cidr_match: new RegExp("^(?:" + IPV4_REGEXP + ")\/([0-9]{1,2})$"),
        IP6_match: new RegExp("^(?:" + IPV6_REGEXP + ")$"),
        IP6_cidr_match: new RegExp("^(?:" + IPV6_REGEXP + ")\/([0-9]{1,3})$"),
        IP6_bracket_match: new RegExp("^\\[(" + IPV6_REGEXP + ")\\]"),

        IP64_match: new RegExp("^(?:" + IPV6_REGEXP + "|" + IPV4_REGEXP + ")$"),

        DnsName_match: new RegExp("^" + DnsName_REGEXP + "$"),

        HostPort_match: new RegExp("^(" + IPV4_REGEXP + "|" + DnsName_REGEXP + ")(:\\d+)?$"),
        HostPortBrackets_match: new RegExp("^\\[(?:" + IPV6_REGEXP + "|" + IPV4_REGEXP + "|" + DnsName_REGEXP + ")\\](:\\d+)?$"),
        IP6_dotnotation_match: new RegExp("^" + IPV6_REGEXP + "(\\.\\d+)?$"),

        windowHostname: function() {
            return window.location.hostname.replace(proxmox.core.Utils.IP6_bracket_match,
                function(m, addr, offset, original) { return addr; });
        },
    }
});