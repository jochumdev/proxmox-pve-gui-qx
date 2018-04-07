qx.Class.define("proxmox.window.Login", {
    extend: qx.ui.window.Window,

    construct: function () {
        this.base(arguments, this.tr("Proxmox VE Login"));

        var app = qx.core.Init.getApplication();
        var sm = this._serviceManager = app.getServiceManager();
        var loginService = sm.getService("internal:login");
        var userInfo = loginService.getUserInfo();

        var layout = new qx.ui.layout.VBox();
        layout.setSpacing(4);
        this.set({
            layout: layout,
            modal: false,
            showMinimize: false,
            showMaximize: false,
            showClose: false,
            width: 400,
            height: 200,
            centerOnAppear: true
        });

        var form = new qx.ui.form.Form();


        var saveUsername = userInfo.saveUsername;

        /**
         * Username
         */
        var username = new qx.ui.form.TextField();
        username.setRequired(true);
        if (saveUsername) {
            username.setValue(userInfo.username);
        }
        form.add(username, this.tr("Username"), null, "username");

        var password = new qx.ui.form.PasswordField();
        password.setRequired(true);
        form.add(password, this.tr("Password"), null, "password");

        /**
         * realm
         */
        var realm = this._realmSelectbox = new qx.ui.form.SelectBox();
        form.add(realm, this.tr("Realm"), null, "realm");
        this._fetchRealms();
        this._serviceManager.addListener("disposedServices", this._fetchRealms, this);

        /**
         * Language
         */
        var languages = [
            { name: "English", shortname: "en" },
            { name: "German", shortname: "de" },
        ];

        var languageBox = new qx.ui.form.SelectBox();
        languages.forEach((lang) => {
            var item = new qx.ui.form.ListItem(lang.name).set({ model: lang.shortname });
            languageBox.add(item);
            if (userInfo.locale === lang.shortname) {
                languageBox.setSelection([item]);
            }
        });

        form.add(languageBox, this.tr("Language"), null, "language");

        languageBox.addListener("changeValue", (e) => {
            app.setLanguage(e.getData().getModel());
        });

        /**
         * Save username checkbox
         */
        var saveUsernameCheckbox = new qx.ui.form.CheckBox(this.tr("Save User name"));
        saveUsernameCheckbox.setValue(saveUsername);
        form.addButton(saveUsernameCheckbox);
        saveUsernameCheckbox.addListener("changeValue", (e) => {
            saveUsername = e.getData();
        });

        /**
         * Form handling
         */
        var controller = new qx.data.controller.Form(null, form);
        controller.createModel();

        var loginbutton = new proxmox.ui.form.CssButton(this.tr("Login"));
        loginbutton.addListener("execute", function () {
            if (form.validate()) {
                loginService.login(
                    controller.getModel().getUsername(),
                    controller.getModel().getPassword(),
                    controller.getModel().getRealm(),
                    saveUsername,
                ).catch((ex) => {
                    console.log(ex);
                    console.log("Login failed");
                });
            }
        }, this);
        form.addButton(loginbutton);

        var renderer = new qx.ui.form.renderer.Single(form);
        this.add(renderer);
    },

    members: {
        _serviceManager: null,
        _realmSelectbox: null,

        _fetchRealms: function () {
            var service = this._serviceManager.getService("access/domains");
            service.fetch().then((model) => {
                if (!model) {
                    return;
                }

                var userInfo = this._serviceManager.getService("internal:login").getUserInfo();

                this._realmSelectbox.removeAll();
                model.forEach((node) => {
                    var item = new qx.ui.form.ListItem(node.getComment()).set({ model: node.getRealm() });
                    this._realmSelectbox.add(item);

                    if (userInfo.realm === node.getRealm()) {
                        this._realmSelectbox.setSelection([item]);
                    }
                });
            });
        }
    }
});