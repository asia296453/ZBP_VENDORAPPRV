sap.ui.define([
    "sap/ui/core/UIComponent",
    "zbpvendorapprv/model/models"
], (UIComponent, models) => {
    "use strict";

    return UIComponent.extend("zbpvendorapprv.Component", {
        metadata: {
            manifest: "json",
            interfaces: [
                "sap.ui.core.IAsyncContentCreation"
            ]
        },

        init() {
            // call the base component's init function
            UIComponent.prototype.init.apply(this, arguments);

            // set the device model
            this.setModel(models.createDeviceModel(), "device");

            // enable routing
            this.getRouter().initialize();
            
            this.setModel(new sap.ui.model.json.JSONModel,"ui");
            this.setModel(new sap.ui.model.json.JSONModel,"dataModel");
            this.setModel(new sap.ui.model.json.JSONModel,"dataModelCpy");
            this.setModel(new sap.ui.model.json.JSONModel,"ErrorModel");
            this.setModel(new sap.ui.model.json.JSONModel,"oF4Mapping");
            this.setModel(new sap.ui.model.json.JSONModel,"LocalModel");
            this.setModel(new sap.ui.model.json.JSONModel,"Header");
            this.setModel(new sap.ui.model.json.JSONModel,"MyInbox");
        }
    });
});