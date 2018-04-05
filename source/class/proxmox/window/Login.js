qx.Class.define("proxmox.window.Login", {
    extend: qx.ui.window.Window,

    construct: function () {
        this.base(arguments, this.tr("Proxmox VE Login"));

        var app = qx.core.Init.getApplication();
        var sm = this._serviceManager = app.getServiceManager();

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

        var host = new qx.ui.form.SelectBox();

        var username = new qx.ui.form.TextField();
        username.setRequired(true);
        form.add(username, this.tr("Username"), null, "username");

        var password = new qx.ui.form.PasswordField();
        password.setRequired(true);
        form.add(password, this.tr("Password"), null, "password");

        var realm = this._realmSelectbox = new qx.ui.form.SelectBox();
        form.add(realm, this.tr("Realm"), null, "realm");
        this._fetchRealms();
        this._serviceManager.addListener("disposedServices", this._fetchRealms, this);

        var language = new qx.ui.form.SelectBox();
        language.add(new qx.ui.form.ListItem("English").set({ model: "en" }));
        language.add(new qx.ui.form.ListItem("German").set({ model: "de" }));
        form.add(language, this.tr("Language"), null, "language");

        language.addListener("changeValue", (e) => {
            qx.locale.Manager.getInstance().setLocale(e.getData().getModel());
        });


        var controller = new qx.data.controller.Form(null, form);
        controller.createModel();

        var saveUsername = new qx.ui.form.CheckBox(this.tr("Save User name"));
        form.addButton(saveUsername);

        var loginbutton = new qx.ui.form.Button(this.tr("Login"));
        loginbutton.addListener("execute", function () {
            if (form.validate()) {
                var service = sm.getService("internal:login").login(
                    controller.getModel().getUsername(),
                    controller.getModel().getPassword(),
                    controller.getModel().getRealm(),
                    controller.getModel().getLanguage()
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
                this._realmSelectbox.removeAll();
                model.forEach((node) => {
                    this._realmSelectbox.add(new qx.ui.form.ListItem(node.getComment()).set({model: node.getRealm()}));
                });
            });
        }
    }
});