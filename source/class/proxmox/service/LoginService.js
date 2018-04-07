qx.Class.define("proxmox.service.LoginService", {
    extend: proxmox.service.core.AbstractService,

    construct: function (url, method) {
        this.base(arguments, url, method);

        this.setMethod(proxmox.service.Manager.POST);
    },

    members: {
        _configureRequest: function (data) {
            var cfg = this.base(arguments, data);
            return cfg;
        },

        getDelegate: function () {
            return {
                manipulateData: function (data) {
                    if (data.errors) {
                        throw Error("Got an error(s) form the API: " + qx.lang.Json.stringify(errors));
                    }
                    return data.data;
                }
            }
        },

        login: function (username, password, realm) {
            return this.fetch({ username: username, password: password, realm: realm })
                .then((model) => {
                    var app = qx.core.Init.getApplication();
                    qx.module.Cookie.set("PVEAuthCookie", model.getTicket(), null, "/");
                    qx.module.Cookie.set("PVELangCookie", app.getLanguage(), null, "/");
                    var loginData = {
                        username: model.getUsername(),
                        login: true
                    };

                    var app = qx.core.Init.getApplication();

                    app.getLocalStore().setItem("qx-username", model.getUsername());

                    app.setCsrfPreventionToken(model.getCSRFPreventionToken());
                    app.getLocalStore().setItem("qx-csrfpreventiontoken", model.getCSRFPreventionToken());

                    app.fireDataEvent("changeLogin", loginData);
                })
        },

        logout: function () {
            qx.module.Cookie.del("PVEAuthCookie", "/");
            qx.module.Cookie.del("PVELangCookie", "/");

            var app = qx.core.Init.getApplication();
            app.fireDataEvent("changeLogin", { login: false });
        },

        checkLoggedIn: function() {
            var app = qx.core.Init.getApplication();
            var username = app.getLocalStore().getItem("qx-username");
            if (!username) {
                app.fireDataEvent("changeLogin", { login: false });
                return;
            }

            this.fetch({
                username: username,
                password: qx.module.Cookie.get("PVEAuthCookie")
            }).then((model) => {
                app.setLanguage(qx.module.Cookie.get("PVELangCookie"));
                app.setCsrfPreventionToken(app.getLocalStore().getItem("qx-csrfpreventiontoken"));
                app.fireDataEvent("changeLogin", { username: username, login: true });
            }).catch((ex) => {
                app.fireDataEvent("changeLogin", { login: false });
            });
        }
    }
});