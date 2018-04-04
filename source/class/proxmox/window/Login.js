/**
 * TODO: Remove when we remove the "mock" endpoint.
 * @asset(proxmox/json/*)
 */
qx.Class.define("proxmox.window.Login", {
    extend: qx.ui.window.Window,

    events: {
        changeLogin: "qx.event.type.Data"
    },

    construct: function () {
        this.base(arguments, this.tr("Proxmox VE Login"));

        var app = qx.core.Init.getApplication();
        var sm = app.getServiceManager();

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

        this.add(new qx.ui.basic.Label().set({
            value: 'Any login will work with "Mock Data".',
            rich: false
        }));

        var form = new qx.ui.form.Form();

        var host = new qx.ui.form.SelectBox();
        form.add(host, this.tr("Host"), null, "host");
        host.add(new qx.ui.form.ListItem(this.tr("Mock Data")).set({model: "proxmox/json"}));
        host.add(new qx.ui.form.ListItem("srv01").set({model: "https://srv01.pcdummy.lan:8006/api2"}));
        host.add(new qx.ui.form.ListItem("srv02").set({model: "https://srv02.pcdummy.lan:8006/api2"}));
        host.add(new qx.ui.form.ListItem("srv03").set({model: "https://srv03.pcdummy.lan:8006/api2"}));

        host.addListener("changeValue", (e) => {
            sm.setBaseUrl(e.getData().getModel());
        });

        var username = new qx.ui.form.TextField();
        username.setRequired(true);
        form.add(username, this.tr("Username"), null, "username");

        var password = new qx.ui.form.PasswordField();
        password.setRequired(true);
        form.add(password, this.tr("Password"), null, "password");

        var realm = new qx.ui.form.SelectBox();
        var realmPam = new qx.ui.form.ListItem(this.tr("Linux PAM standard authentication")).set({model: "pam"});
        realm.add(new qx.ui.form.ListItem(this.tr("Proxmox VE authentication server")).set({model: "pve"}));
        realm.add(realmPam);
        realm.setValue(realmPam);
        form.add(realm, this.tr("Realm"), null, "realm");

        var language = new qx.ui.form.SelectBox();
        language.add(new qx.ui.form.ListItem("English").set({model: "en"}));
        language.add(new qx.ui.form.ListItem("German").set({model: "de"}));
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
                var loginData = {
                    username: controller.getModel().getUsername(),
                    password: controller.getModel().getPassword(),
                    realm: controller.getModel().getRealm(),
                    login: true
                };
                sm.setBaseUrl(controller.getModel().getHost());
                this.fireDataEvent("changeLogin", loginData);
                this.close();
            }
        }, this);
        form.addButton(loginbutton);

        var renderer = new qx.ui.form.renderer.Single(form);
        this.add(renderer);
    }
});