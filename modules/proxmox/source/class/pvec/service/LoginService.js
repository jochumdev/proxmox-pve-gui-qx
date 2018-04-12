qx.Class.define("pvec.service.LoginService", {
    extend: p.service.core.AbstractService,

    construct: function (url, method) {
        this.base(arguments, url, method);

        this.set({
            method: p.service.Manager.POST,
            noModelTransform: true,
        });

        this._app = qx.core.Init.getApplication();
    },

    members: {
        _app: null,

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

        getUserInfo: function() {
            var userInfo = this._app.getLocalStore().getItem("qx-userinfo");
            if (userInfo === null || userInfo === "") {
                return {
                    username: "",
                    fullusername: "",
                    realm: "pam",
                    csrfPreventionToken: "",
                    locale: this._app.getLanguage(),
                    saveUsername: false,
                }
            }

            return userInfo;
        },

        login: function (username, password, realm, saveUsername) {
            return this.fetch({ username: username, password: password, realm: realm })
                .then((data) => {
                    qx.module.Cookie.set("PVEAuthCookie", data.ticket, null, "/");
                    qx.module.Cookie.set("PVELangCookie", this._app.getLanguage(), null, "/");
                    var loginData = {
                        fullusername: data.username,
                        login: true
                    };

                    this._app.getLocalStore().setItem("qx-userinfo", {
                        username: username,
                        fullusername: data.username,
                        realm: realm,
                        locale: this._app.getLanguage(),
                        saveUsername: saveUsername,
                    });

                    this._app.setCaps(data.cap);
                    this._app.setCsrfPreventionToken(data.CSRFPreventionToken);
                    this._app.fireDataEvent("changeLogin", loginData);
                })
        },

        logout: function () {
            qx.module.Cookie.del("PVEAuthCookie", "/");
            qx.module.Cookie.del("PVELangCookie", "/");

            this._app.fireDataEvent("changeLogin", { login: false });
        },

        checkLoggedIn: function() {
            var userInfo = this.getUserInfo();

            if (userInfo.fullusername === "") {
                this._app.fireDataEvent("changeLogin", { login: false });
                return;
            }

            this.fetch({
                username: userInfo.fullusername,
                password: qx.module.Cookie.get("PVEAuthCookie")
            }, true).then((data) => {

                this._app.setLanguage(userInfo.locale);
                this._app.setCsrfPreventionToken(data.CSRFPreventionToken);
                this._app.setCaps(data.cap);
                this._app.fireDataEvent("changeLogin", { fullusername: data.username, login: true });
            }).catch((ex) => {
                this._app.fireDataEvent("changeLogin", { login: false });
            });
        }
    }
});