sap.ui.define([
    "zbpvendorapprv/controller/BaseController",
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageToast"
], (BaseController, Controller, MessageToast) => {
    "use strict";

    return BaseController.extend("zbpvendorapprv.controller.main", {
        onInit() {
            // Initialization logic if required
            this.getOwnerComponent().getModel("ui").setProperty("/isEditable", false);
            this.getOwnerComponent().getModel("ui").setProperty("/isVisible", false);
            this.getOwnerComponent().getModel("ui").setProperty("/home", true);
            this.getOwnerComponent().getModel("ui").setProperty("/header", false);
            this.getOwnerComponent().getModel("ui").refresh(true);

            this.getOwnerComponent().getModel("MyInbox").setProperty("/isVisible", false);
            this.getOwnerComponent().getModel("MyInbox").refresh(true);
            // debugger;
            // var sRequestNumber = "5000000001";
            var sRequestNumber = "";
            if (this.getOwnerComponent().getComponentData() !== undefined &&
                this.getOwnerComponent().getComponentData().startupParameters.RequestNumber !== undefined) {
                sRequestNumber = this.getOwnerComponent().getComponentData().startupParameters.RequestNumber[0];

                if (sRequestNumber !== "") {
                    this.getOwnerComponent().getModel("ui").setProperty("/header", false);
                    this.getOwnerComponent().getModel("ui").setProperty("/home", false);
                    this.getOwnerComponent().getModel("ui").setProperty("/isEditable", false);
                    this.getOwnerComponent().getModel("ui").setProperty("/isVisible", true);
                    this.getOwnerComponent().getModel("ui").refresh(true);

                    this.getOwnerComponent().getModel("MyInbox").setProperty("/isVisible", true);
                    this.getOwnerComponent().getModel("MyInbox").refresh(true);

                    this.setUIModel();
                    this.setTabVisibility();
                    this.oF4Mapping = this.setoF4Mapping();

                    this.onReadOData("/VendorCreateSet(RequestNumber='" + sRequestNumber + "')", null).then((oresponse) => {
                        this.getDescription(oresponse);
                        this.getView().getModel("dataModel").getData().VendorCreate.Status = 'DRAFT';
                        this.getView().getModel("dataModel").refresh(true);


                        this.getOwnerComponent().getModel("LocalModel").setProperty("/RequestType", 'CR');
                        this.getOwnerComponent().getModel("LocalModel").refresh(true);
                    });
                }

            }
        },

        setTabVisibility: function () {
            var svalue = {
                "VendorCreate": true,
                "VendorCreateEdit": false,
                "VendorCreateEnable": false,
                "VendorCreateGrouping": false,

                "CompanyCodeData": true,
                "CompanyCodeDataEdit": false,
                "CompanyCodeDataEnable": false,

                "BankData": true,
                "BankDataEdit": false,
                "BankDataEnable": false,

                "PurchaseOrgData": true,
                "PurchaseOrgDataEdit": false,
                "PurchaseOrgDataEnable": false,

                "IdentifiNumbers": true,
                "IdentifiNumbersEdit": false,
                "IdentifiNumbersEnable": false,

                "TaxNumbersData": true,
                "TaxNumbersDataEdit": false,
                "TaxNumbersDataEnable": false,

                "Certificates": true,
                "CertificatesEdit": false,
                "CertificatesEnable": false,

                "ContactDetails": true,
                "ContactDetailsEdit": false,
                "ContactDetailsEnable": false
            }
            this.getOwnerComponent().getModel("Header").setProperty("/", svalue);
        },
        onCreateNewRequest: function () {
            const oRouter = this.getOwnerComponent().getRouter();
            // "CreateRequestRoute" must match the route name in manifest.json
            oRouter.navTo("CreateRequestRoute");
            // oRouter.navTo("CreateRequestRoute", {
            //     RequestNo: '0',
            //     Type:"C"
            // });
        },
        onpressdisplaysupplier: function () {
            const oRouter = this.getOwnerComponent().getRouter();
            // "CreateRequestRoute" must match the route name in manifest.json
            oRouter.navTo("InterfaceListRoute");
            // oRouter.navTo("CreateRequestRoute", {
            //     RequestNo: '0',
            //     Type:"C"
            // });
        },

        onchangeSupplier: function () {
            const oRouter = this.getOwnerComponent().getRouter();
            // "CreateRequestRoute" must match the route name in manifest.json
            oRouter.navTo("ChangeSupplier");
            // oRouter.navTo("CreateRequestRoute", {
            //     RequestNo: '0',
            //     Type:"C"
            // });
        },
        onextendSupplier: function () {
            const oRouter = this.getOwnerComponent().getRouter();
            // "CreateRequestRoute" must match the route name in manifest.json
            oRouter.navTo("ExtendSupplier");
            // oRouter.navTo("CreateRequestRoute", {
            //     RequestNo: '0',
            //     Type:"C"
            // });
        },
        onProcessFromInterface: function () {
            const oRouter = this.getOwnerComponent().getRouter();
            oRouter.navTo("InterfaceListRoute");
        },

    });
});