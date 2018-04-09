/**
 * This is the main application class of your custom application "mobiletweets"
 *
 * @asset(proxmox.ve.mobile/service.js)
 * @asset(proxmox.ve.mobile/css/*)
 */
qx.Class.define("proxmox.ve.mobile.Application", {
    extend: qx.application.Mobile,
    include: [
        proxmox.core.application.MApplication,
    ],

    properties: {
        /** Holds all feeds of a user */
        tweets: {
            check: "qx.data.Array",
            nullable: true,
            init: null,
            event: "changeTweets",
            apply: "_applyTweets" // just for logging the data
        },


        /** The current username */
        username: {
            check: "String",
            nullable: false,
            init: "",
            event: "changeUsername",
            apply: "_applyUsername" // this method will be called when the property is set
        }
    },


    /*
    *****************************************************************************
       MEMBERS
    *****************************************************************************
    */

    members: {
        __inputPage: null,

        /**
         * This method contains the initial application code and gets called
         * during startup of the application
         */
        main: function () {
            // Call super class
            this.base(arguments);

            // Enable logging in debug variant
            if (qx.core.Environment.get("qx.debug")) {
                // support native logging capabilities, e.g. Firebug for Firefox
                qx.log.appender.Native;
                // support additional cross-browser console. Press F7 to toggle visibility
                qx.log.appender.Console;
            }

            // Init proxmox.core.application.MApplication
            this.initcore();

            // Create a manager in mobile device context >> "false"
            var manager = new qx.ui.mobile.page.Manager(false);

            // Create an instance of the Input class and initial show it
            var inputPage = this.__inputPage = new proxmox.ve.mobile.page.Input();

            // Add page to manager
            manager.addDetail(inputPage);

            // Display inputPage on start
            inputPage.show();

            // Create an instance of the Tweets class and establish data bindings
            var tweetsPage = new proxmox.ve.mobile.page.Tweets();
            this.bind("tweets", tweetsPage, "tweets");
            this.bind("username", tweetsPage, "title");

            // Add page to manager
            manager.addDetail(tweetsPage);

            // Create an instance of the Tweet class
            var tweetPage = new proxmox.ve.mobile.page.TweetDetail();

            // Add page to manager
            manager.addDetail(tweetPage);

            // Load the tweets and show the tweets page
            inputPage.addListener("requestTweet", function (evt) {
                this.setUsername(evt.getData());
                tweetsPage.show();
            }, this);

            // Show the selected tweet
            tweetsPage.addListener("showTweet", function (evt) {
                var index = evt.getData();
                tweetPage.setTweet(this.getTweets().getItem(index));
                tweetPage.show();
            }, this);

            // Return to the Input page
            tweetsPage.addListener("back", function (evt) {
                inputPage.show({
                    reverse: true
                });
            }, this);

            // Return to the Tweets Page.
            tweetPage.addListener("back", function (evt) {
                tweetsPage.show({
                    reverse: true
                });
            }, this);
        },


        // property apply
        _applyUsername: function (value, old) {
            this.__loadTweets();
        },

        // property apply
        _applyTweets: function (value, old) {
            // print the loaded data in the console
            this.debug("Tweets: ", qx.lang.Json.stringify(value)); // just display the data
        },


        /**
         * Loads all tweets of the currently set user.
         */
        __loadTweets: function () {
            // Mocked Identica Tweets API
            // Create a new JSONP store instance with the given url
            var url = "proxmox.ve.mobile/service.js";

            var store = new qx.data.store.Jsonp();
            store.setCallbackName("callback");
            store.setUrl(url);

            // Use data binding to bind the "model" property of the store to the "tweets" property
            store.bind("model", this, "tweets");
        },


        /**
         * Shows the input page of the application.
         */
        __showStartPage: function () {
            this.__inputPage.show({ reverse: true });
        }
    }
});
