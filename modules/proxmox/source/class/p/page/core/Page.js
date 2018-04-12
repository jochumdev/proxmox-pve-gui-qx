qx.Class.define("p.page.core.Page", {
    extend: qx.core.Object,
    include: [
        qx.locale.MTranslation,
    ],
    implement: p.page.core.IView,

    construct: function () {
        this.base(arguments);

        var app = this._app = qx.core.Init.getApplication();

        this._caps = app.getCaps();
    },

    properties: {
        id: {
            check: "String",
            nullable: true,
            apply: "_applyId",
        },

        subContainer: {
            nullable: true,
            apply: "_applySubContainer",
        },
    },

    members: {
        _app: null,

        _caps: null,

        _contentContainerPromise: null,
        _contentContainer: null,

        _currentPageId: null,
        _currentSubPageContainer: null,

        // proxmox.page.core.IView implementation
        getContainerAsync: function () {
            if (this._contentContainerPromise !== null) {
                return this._contentContainerPromise;
            }

            this._contentContainerPromise = new qx.Promise((resolve, reject) => {
                this._contentContainer = this._getContentContainer();
                resolve(this._contentContainer);
            });

            return this._contentContainerPromise;
        },

        // proxmox.page.core.IView implementation
        navigateToPageId: function (pageId) {
            if (pageId === this._currentPageId) {
                return true;
            }

            var subPage = this._getSubPage(pageId);
            if (subPage === false) {
                return false;
            }

            if (subPage === true) {
                return true;
            }

            subPage.setPage(this);
            subPage.set({
                id: this.getId(),
            });

            this.setSubContainer(null);

            var subc = this._currentSubPageContainer = subPage.getSubPageContainer();
            this.setSubContainer(subc);
            this._currentPageId = pageId;

            return true;
        },

        _applyId: function(value, old) {

        },

        _applySubContainer: function(value, old) {

        },
    },
});