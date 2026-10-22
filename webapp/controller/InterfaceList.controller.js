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
            
            this.oF4Mapping = this.setoF4Mapping();

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

},

onRequestNumberF4: function (oEvent) {

    var oInput = oEvent.getSource();
    var oModel = this.getOwnerComponent().getModel();

    if (!this._oReqNumDialog) {

        this._oReqNumDialog = new sap.m.TableSelectDialog({

            title: "Select Request Number",

            columns: [
                new sap.m.Column({
                    header: new sap.m.Label({
                        text: "Request Number"
                    })
                }),
                new sap.m.Column({
                    header: new sap.m.Label({
                        text: "WFStatus"
                    })
                }),
                new sap.m.Column({
                    header: new sap.m.Label({
                        text: "RequestBy"
                    })
                })
            ],

            search: function (oEvt) {

                var sValue = oEvt.getParameter("value");

                var aFilters = sValue ?
                    [new Filter("RequestNumber", FilterOperator.Contains, sValue)] : [];

                oEvt.getSource().getBinding("items").filter(aFilters);

            },

            confirm: function (oEvt) {

                var oSelectedItem = oEvt.getParameter("selectedItem");

                if (oSelectedItem && this._oActiveReqInput) {

                    var sReqId = oSelectedItem.getCells()[0].getText();

                    this._oActiveReqInput.setValue(sReqId);

                    this.byId("smartTable").rebindTable();

                }

            }.bind(this)

        });

        this.getView().addDependent(this._oReqNumDialog);
        this._oReqNumDialog.setModel(oModel);

    }

    this._oActiveReqInput = oInput;

    this._oReqNumDialog.bindAggregation("items", {

        path: "/WorkflowStatusSet",

        template: new sap.m.ColumnListItem({

            cells: [
                new sap.m.Text({
                    text: "{RequestNumber}"
                }),
                new sap.m.Text({
                    text: "{WFStatus}"
                }),
                new sap.m.Text({
                    text: "{RequestBy}"
                })
            ]

        })

    });

    this._oReqNumDialog.open();

}
    });
});