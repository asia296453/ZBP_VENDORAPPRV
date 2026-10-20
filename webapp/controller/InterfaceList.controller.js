sap.ui.define([
     "zbpvendorapprv/controller/BaseController",
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/routing/History",
    "sap/m/MessageToast",
    "sap/m/MessageBox",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator"
], function (BaseController,Controller, History, MessageToast, MessageBox,Filter,FilterOperator) {
    "use strict";

    return BaseController.extend("zbpvendorapprv.controller.InterfaceList", {
        onInit: function () {
            
        },

        onPressRecord: function (oEvent) {
            var oSelectedItem = oEvent.getSource();
            var oContext = oSelectedItem.getBindingContext();

            if (!oContext) {
                MessageToast.show("Unable to retrieve record details.");
                return;
            }

            // Reverted to Identification because her JSON payload still uses it
            var sSelectedId = oContext.getProperty("RecordNo");

            // SAFETY CHECK: Prevents the router crash if the ID is blank
            if (!sSelectedId || sSelectedId.trim() === "") {
                MessageBox.error("The Customer ID is missing from the backend response. Cannot navigate.");
                return;
            }

            var oRouter = this.getOwnerComponent().getRouter();
            oRouter.navTo("ProcessInterfaceRoute", {
                reqId: sSelectedId 
            });
        },

        onNavBack: function () {
            var oHistory = History.getInstance();
            var sPreviousHash = oHistory.getPreviousHash();

            if (sPreviousHash !== undefined) {
                window.history.go(-1);
            } else {
                var oRouter = this.getOwnerComponent().getRouter();
                oRouter.navTo("Routemain", {}, true);
            }
        },
        onBeforeRebindTable: function (oEvent) {

    var oBindingParams = oEvent.getParameter("bindingParams");

    var sRequestNo = this.byId("idRequestNumber").getValue();

    if (sRequestNo) {

        oBindingParams.filters.push(
            new Filter(
                "RequestNumber",
                FilterOperator.EQ,
                sRequestNo
            )
        );
    }

}
    });
});