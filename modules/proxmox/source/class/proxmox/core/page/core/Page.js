qx.Class.define("proxmox.core.page.core.Page", {
    extend: qx.core.Object,
    include: [
        qx.locale.MTranslation,
    ],
    implement: proxmox.core.page.core.IView,

    properties: {
        id: {
            check: "String",
            nullable: true,
            apply: "_applyId",
        },
    },

    members: {
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

            if (this._currentSubPageContainer !== null) {
                this._contentContainer.remove(this._currentSubPageContainer);
            }

            var subc = this._currentSubPageContainer = subPage.getSubPageContainer();
            this._contentContainer.add(subc, { edge: "center", width: "100%", height: "100%"});
            this._currentPageId = pageId;

            return true;
        },

        _applyId: function(value, old) {

        },
    },
});