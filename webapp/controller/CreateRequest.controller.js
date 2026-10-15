sap.ui.define([
    "zbpvendorapprv/controller/BaseController",
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/routing/History",
    "sap/m/MessageToast",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageBox",
    "sap/m/SelectDialog",
    "sap/m/StandardListItem",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator"
], function (BaseController, Controller, History, MessageToast, JSONModel, MessageBox, SelectDialog, StandardListItem, Filter, FilterOperator) {
    "use strict";

    return BaseController.extend("zbpvendorapprv.controller.CreateRequest", {

        onInit: function () {
            var oViewModel = new JSONModel({
                isEditable: true,
                isValidated: false,
                pendingFiles: []
            });
            this.getView().setModel(oViewModel, "ui");

            var oModel = new JSONModel(this._getInitialData());
            this.getView().setModel(oModel);


            const oModel1 = this.getOwnerComponent().getModel();

            oModel1.refreshSecurityToken(
                function () {
                    console.log("CSRF token successfully fetched");
                },
                function (oError) {
                    console.error("CSRF token fetch failed", oError);
                }
            );

            var oRouter = this.getOwnerComponent().getRouter();
            oRouter.getRoute("CreateRequestRoute").attachPatternMatched(this._onRouteMatched, this);
        },
        _onRouteMatched: function (oEvent) {
            this.getView().getModel("ErrorModel").setProperty("/", []);
            var oViewModel = this.getView().getModel("ui");
            oViewModel.setProperty("/isEditable", true);
            oViewModel.setProperty("/header", true);
            this.getOwnerComponent().getModel("MyInbox").setProperty("/isVisible", false);
            this.getOwnerComponent().getModel("MyInbox").refresh(true);
            
            this.setTabVisibility();
            this.setUIModel("CR");
            this.oF4Mapping = this.setoF4Mapping();
            this.getOwnerComponent().getModel("LocalModel").setProperty("/RequestType", "CR");
            this.getOwnerComponent().getModel("LocalModel").refresh(true);
        },

        setTabVisibility: function () {
            var svalue = {
                "VendorCreate": true,
                "VendorCreateEdit": false,
                "VendorCreateEnable": true,
                "VendorCreateGrouping": true,

                "CompanyCodeData": true,
                "CompanyCodeDataEdit": false,
                "CompanyCodeDataEnable": true,

                "BankData": true,
                "BankDataEdit": false,
                "BankDataEnable": true,

                "PurchaseOrgData": true,
                "PurchaseOrgDataEdit": false,
                "PurchaseOrgDataEnable": true,

                "IdentifiNumbers": true,
                "IdentifiNumbersEdit": false,
                "IdentifiNumbersEnable": true,

                "TaxNumbersData": true,
                "TaxNumbersDataEdit": false,
                "TaxNumbersDataEnable": true,

                "Certificates": true,
                "CertificatesEdit": false,
                "CertificatesEnable": true,
                
                "ContactDetails": true,
                "ContactDetailsEdit": false,
                "ContactDetailsEnable": true
            }
            this.getView().getModel("Header").setProperty("/", svalue);
        },

        _getInitialData: function () {
            return {
                Identification: "", Grouping: "01", ExternalNumber: "", SearchTerm1: "", SearchTerm2: "",
                TitleKey: "0003", Name1: "", Name2: "", Name3: "", Name4: "", BuildingCode: "", Street: "", District: "",
                City: "", PostalCode: "", Region: "", Country: "", StructureGroup: "", Language: "E", Telephone: "",
                Email: "", Fax: "", "ID": "", CR: "", BankKey: "", SalesOrg: "", DistChannel: "", Division: "00", CustPricProc: "1", SalesCustomerGroup: "",
                SalesDistrict: "", Incoterms: "", Incoterms1: "", ShippingCondition: "01", Currency: "SAR", AccAssmtGrpCust: "",
                PytTerms: "", DeliverPlant: "", SalesGroup: "", SalesOffice: "", ItemProposal: "", TaxClassification: "", CustomerGrp1: "",
                CustomerGrp2: "", CustomerGrp3: "", CustomerGrp4: "", CustomerGrp5: "", CompanyCode: "", ReconAccout: "",
                HeadOffice: "", SortKey: "", PlanningGroup: "", PreviousAccnumber: "", PaymenttermsC: "",
                RecordPaymntHistory: true, PaymentMethod: "", HouseBank: "", DunningProcedure: "1000", AccountingClerk: "10",
                PolicyNumber: "", InstitutionNumber: "", AmountInsured: " 0.00", ValidTo: "00000000", LeadMonths: " 0",
                Deductible: " 0", ClrgWithVend: true, ChkDoubleInv: true, CertificateNum: "", CreditBusPartner: "", CreatedOn: "00000000",
                Certificates: [{

                    CountryComp: "", CertificateID: "", CertificateNo: "", RegionCity: "",
                    CreditValidFrom: "00000000", CreditValidTo: "00000000", CertStat: "", MainCert: false,
                    ExemptionType: "", ExemptReason: "", DateOfIssue: "00000000", Description1: "",
                    Description2: "", Date1: "00000000", Date2: "00000000", AdditionalNo1: "000000000000000",
                    AdditionalNo2: "000000000000000"
                }],
                CheckRule: "01", Rules: "Standard", RiskClass: "", CreditGroup: "0000", CreditSegment: "",
                CreditLimit: " 0.00", LimitNotDefined: false, BlockInCrMgt: false, LimitValidTo: "00000000", CreditAnalyst: "",
                CustomerGroup: "", ResubmissionOn: "00000000", Calculated: " 0.00", SpecialAttention: false,
                BlockReason: "", CollectionProf: "", Segment: "", CollectionGroup: "", Specialist: ""
            };
        },

        onNavBack: function () {
            this.getView().getModel().setData(this._getInitialData());

            var oUiModel = this.getView().getModel("ui");
            if (oUiModel) {
                oUiModel.setProperty("/pendingFiles", []);
                oUiModel.setProperty("/isEditable", true);
                oUiModel.setProperty("/isValidated", false);
            }
            
            this.setUIModel("");
            this.getOwnerComponent().getRouter().navTo("Routemain", {}, true);
        },

        onValidate: function () {
            // var oViewModel = this.getView().getModel("ui");
            // oViewModel.setProperty("/isEditable", false);
            // oViewModel.setProperty("/isValidated", true);
            var oModel = this.getView().getModel();
            var oPayload = oModel.getData();
            var ogeneraldataModel = this.getView().getModel("dataModel").getData().VendorCreate;
            var ocompcodeModel = this.getView().getModel("dataModel").getData().CompanyCodeData;
            var opOrgModel = this.getView().getModel("dataModel").getData().PurchaseOrgData;
            var oBankDataModel = this.getView().getModel("dataModel").getData().BankData;
            var aRequiredFields_generaldata = [
                "Grouping", "Name1", "Name2", "SearchTerm1", "BuildingCode", "Street", "District", "City", "PostalCode", "Region", "Country", "Language"
            ];
            var aRequiredFields_compcode = [
                "CompanyCode", "ReconAccout", "PlanningGroup", "PaymenttermsC","SortKey","PaymentMethod"
            ];
            var aRequiredFields_BankData = [
                "BankCountry", "BankKey"
            ];

            var aRequiredFields_POrg = [
                "POrg", "Currency", "PaymentTerms", "IncotermsLocation", "Calculation"
            ];


            var bValid = true;
            var bValid1 = true;
            // var oError = this.getView().getModel("ErrorModel").getProperty("/");
            // if (oError.length > 0) {
            //     var svalue = "";
            //     for (var i = 0; i < oError.length; i++) {
            //         svalue = svalue + "\n" + oError[i].value;
            //         bValid1 = false; debugger;
            //         MessageToast.show(svalue);
            //     }
            // }

            if (bValid1) {
                if (bValid) {
                    for (var i = 0; i < aRequiredFields_generaldata.length; i++) {
                        if (!ogeneraldataModel[aRequiredFields_generaldata[i]] || ogeneraldataModel[aRequiredFields_generaldata[i]].toString().trim() === "") {
                            bValid = false;
                            break;
                        }
                    }
                    if (!bValid) {
                        MessageToast.show("Please fill in all mandatory fields (marked with *)");
                        return;
                    }
                }
                if (bValid) {
                    for (var i = 0; i < aRequiredFields_compcode.length; i++) {
                        if (ocompcodeModel[aRequiredFields_compcode[i]] !== undefined && (!ocompcodeModel[aRequiredFields_compcode[i]]
                            || ocompcodeModel[aRequiredFields_compcode[i]].toString().trim() === "")) {
                            bValid = false;
                            break;
                        }
                    }
                    if (!bValid) {
                        MessageToast.show("Please fill in all mandatory fields (marked with *) for Company Code Data.");
                        return;
                    }
                }
                if (bValid && opOrgModel["POrg"] !== '') {
                    for (var i = 0; i < aRequiredFields_POrg.length; i++) {
                        if (opOrgModel[aRequiredFields_POrg[i]] !== undefined && (!opOrgModel[aRequiredFields_POrg[i]]
                            || opOrgModel[aRequiredFields_POrg[i]].toString().trim() === "")) {
                            bValid = false;
                            break;
                        }
                    }

                    if (!bValid) {
                        MessageToast.show("Please fill in all mandatory fields (marked with *) for Purchase Org Data");
                        return;
                    }
                }

                if (bValid) {
                    for (var i = 0; i < oBankDataModel.length; i++) {
                        if (oBankDataModel[i].BankCountry !== undefined && oBankDataModel[i].BankCountry === "") {
                            bValid = false;
                            break;
                        }
                        else if (oBankDataModel[i].BankKey !== undefined && oBankDataModel[i].BankKey === "") {
                            bValid = false;
                            break;
                        }
                    }
                }
                if (!bValid) {
                    MessageToast.show("Please fill in all mandatory fields (marked with *) for Bank Data.");
                    return;
                }

                if (bValid) {
                    var oViewModel = this.getView().getModel("ui");
                    oViewModel.setProperty("/isEditable", false);
                    oViewModel.setProperty("/isValidated", true);

                    this.getView().getModel("Header").getData().VendorCreateEnable = false;
                    this.getView().getModel("Header").getData().VendorCreateGrouping = false;
                    this.getView().getModel("Header").getData().BankDataEnable = false;
                    this.getView().getModel("Header").getData().PurchaseOrgDataEnable = false;
                    this.getView().getModel("Header").getData().CompanyCodeDataEnable = false;
                    this.getView().getModel("Header").getData().IdentifiNumbersEnable = false;
                    this.getView().getModel("Header").getData().TaxNumbersDataEnable = false;
                    this.getView().getModel("Header").getData().CertificatesEnable = false;
                    this.getView().getModel("Header").getData().ContactDetailsEnable = false;
                    this.getView().getModel("Header").refresh(true);

                    MessageToast.show("Validation Successful. Form locked. You can now Submit.");

                    this.onPostRequest("D", "V","CR");
                }
            }
        },

        onEdit: function () {
            var oViewModel = this.getView().getModel("ui");
            oViewModel.setProperty("/isEditable", true);
            oViewModel.setProperty("/isValidated", false);

            this.getView().getModel("Header").getData().VendorCreateEnable = true;
            this.getView().getModel("Header").getData().VendorCreateGrouping = true;
            this.getView().getModel("Header").getData().BankDataEnable = true;
            this.getView().getModel("Header").getData().PurchaseOrgDataEnable = true;
            this.getView().getModel("Header").getData().CompanyCodeDataEnable = true;
            this.getView().getModel("Header").getData().IdentifiNumbersEnable = true;
            this.getView().getModel("Header").getData().TaxNumbersDataEnable = true;
            this.getView().getModel("Header").getData().CertificatesEnable = true;
            this.getView().getModel("Header").getData().ContactDetailsEnable = true;
            this.getView().getModel("Header").refresh(true);
        },

        onAddCertificate: function () {
            var oModel = this.getView().getModel("dataModel").getProperty("/Certificates");
            var oModelcpy = JSON.parse(JSON.stringify(oModel[0]));
            for (var i = 0; i < Object.values(oModelcpy).length; i++) {
                if (Object.keys(oModelcpy)[i] === "Date1"
                    || Object.keys(oModelcpy)[i] === "Date2"
                    || Object.keys(oModelcpy)[i] === "CreditValidFrom"
                    || Object.keys(oModelcpy)[i] === "CreditValidTo"
                    || Object.keys(oModelcpy)[i] === "DateOfIssue") {
                    oModelcpy[Object.keys(oModelcpy)[i]] = null;
                }
                else if (Object.keys(oModelcpy)[i] === "MainCert") {
                    oModelcpy[Object.keys(oModelcpy)[i]] = false;
                } else {
                    oModelcpy[Object.keys(oModelcpy)[i]] = "";
                }
            }
            oModel.push(oModelcpy);

            this.getView().getModel("dataModel").setProperty("/Certificates", oModel);
        },

        onDeleteCertificate: function (oEvent) {
            var oContext = oEvent.getSource().getBindingContext("dataModel");
            var iIndex = parseInt(oContext.getPath().split("/").pop());
            var oModel = this.getView().getModel("dataModel");
            var aCertificates = oModel.getProperty("/Certificates");

            if (aCertificates.length === 1) {
                sap.m.MessageToast.show("You must have at least one certificate entry.");
                return;
            }

            aCertificates.splice(iIndex, 1);
            oModel.setProperty("/Certificates", aCertificates);
        },



        onManualInputChange: function (oEvent) {
            var oInput = oEvent.getSource();
            this.sBindingPath = oInput.getBindingPath("value");
            var sFieldName = this.sBindingPath.split("/").pop();
            this.sFieldName = sFieldName;
            this.prop = this.sBindingPath.split("/")[1];
            // Get the row's binding context
            var oContext = oInput.getBindingContext("dataModel");
            if (oContext !== undefined) {
                var oRowData = oContext.getObject();
                this.sPath = oContext.getPath();
                this.iRowIndex = parseInt(this.sPath.split("/").pop(), 10);
                this.stblmodel = this.sPath.split("/")[1];
            }


            if (oInput.getValue() !== undefined && oInput.getValue() !== "") {
                if (this.sBindingPath === "/VendorCreate/Region") {
                    sFieldName = "Region1";
                }

                var oConfig = this.oF4Mapping[sFieldName];

                var aInitialFilters = [];
                var aInitialFilters1 = [];
                debugger;
                if (oConfig.returnProperty !== undefined) {
                    aInitialFilters1.push(new sap.ui.model.Filter(oConfig.returnProperty, sap.ui.model.FilterOperator.EQ, oInput.getValue()));
                } else {
                    aInitialFilters1.push(new sap.ui.model.Filter(oConfig.key, sap.ui.model.FilterOperator.EQ, oInput.getValue()));
                }

                var aDependencies = Array.isArray(oConfig.filterBy) ? oConfig.filterBy : [oConfig.filterBy];
                if (aDependencies[0] !== undefined) {
                    for (var i = 0; i < aDependencies.length; i++) {
                        var oDep = aDependencies[i];
                        var smodelpath1 = oInput.getBindingInfo("value").parts[0].path.split("/")[1];
                        if (smodelpath1 !== undefined) {
                            var sParentValue = this.getView().getModel("dataModel").getProperty("/" + smodelpath1 + "/" + oDep.field);
                        }
                        else {
                            var sParentValue = this.getView().getModel("dataModel").getProperty("/" + this.stblmodel + "/" + this.iRowIndex + "/" + oDep.field);
                        }
                        if (sParentValue !== "") {
                            sParentValue = this._extractKey(sParentValue);
                        }
                        aInitialFilters.push(new sap.ui.model.Filter(oDep.filterProperty, sap.ui.model.FilterOperator.EQ, sParentValue));
                    }
                }
                debugger;
                this.onReadOData(oConfig.set, aInitialFilters, "X", aInitialFilters1, oConfig.description).then((oresponse) => {
                    if (oresponse.indexOf("E") !== -1) {
                        var smsg = oresponse.split("-")[1] + " for " + oConfig.key;
                        MessageBox.error(smsg);
                        var svalue = {
                            "type": oConfig.key,
                            "value": smsg
                        }
                        var oErrorModel = this.getView().getModel("ErrorModel").getProperty("/");
                        oErrorModel.push(svalue);
                        this.getView().getModel("ErrorModel").setProperty("/", oErrorModel);
                    }
                    else if (oresponse.length === 1) {
                        var sval = oresponse[0]["description"] + "(" + oresponse[0]["field"] + ")";

                        if (oInput.getBindingContext("dataModel") !== undefined) {
                            this.getView().getModel("dataModel").setProperty(this.sPath + "/" + this.sFieldName, sval);
                            this.getView().getModel("dataModel").refresh(true);
                            var oErrorModel = this.getView().getModel("ErrorModel").getProperty("/");
                            const updatedError = oErrorModel.filter(user => user.type !== this.sFieldName);
                            this.getView().getModel("ErrorModel").setProperty("/", updatedError);
                        } else {
                            this.getView().getModel("dataModel").setProperty(this.sBindingPath, sval);
                            this.getView().getModel("dataModel").refresh(true);
                            var oErrorModel = this.getView().getModel("ErrorModel").getProperty("/");
                            const updatedError = oErrorModel.filter(user => user.type !== this.oConfig.key);
                            this.getView().getModel("ErrorModel").setProperty("/", updatedError);
                        }

                    }
                });
            } else {
                var oErrorModel = this.getView().getModel("ErrorModel").getProperty("/");
                const updatedError = oErrorModel.filter(user => user.type !== this.sFieldName);
                this.getView().getModel("ErrorModel").setProperty("/", updatedError);
            }

            // var oInput = oEvent.getSource();

            // if (oInput.getValue()) {
            //     oInput.setValue("");
            //     oInput.setValueState(sap.ui.core.ValueState.Error);
            //     oInput.setValueStateText("Manual typing is disabled. Please click the icon to select a valid option.");
            // } else {
            //     oInput.setValueState(sap.ui.core.ValueState.None);
            // }
        },
        onSubmitRequest: function () {
            this.onPostRequest("S", "","CR");
        },
        onSaveDraft: function () {
            this.onPostRequest("D", "","CR");
        },
        

        onFilesSelected: function (oEvent) {
            var aFiles = oEvent.getParameter("files");
            if (!aFiles || aFiles.length === 0) {
                return;
            }

            var oUiModel = this.getView().getModel("ui");
            var aPendingFiles = oUiModel.getProperty("/pendingFiles") || [];

            for (var i = 0; i < aFiles.length; i++) {
                aPendingFiles.push({
                    fileObject: aFiles[i],
                    fileName: aFiles[i].name,
                    fileSize: (aFiles[i].size / 1024).toFixed(2) + " KB",
                    comment: ""
                });
            }
            oUiModel.setProperty("/pendingFiles", aPendingFiles);
            oEvent.getSource().clear();
        },

        onRemoveFile: function (oEvent) {
            var oItem = oEvent.getSource().getParent();
            var oTable = this.getView().byId("attachmentTable");
            var iIndex = oTable.indexOfItem(oItem);

            var oUiModel = this.getView().getModel("ui");
            var aPendingFiles = oUiModel.getProperty("/pendingFiles");

            aPendingFiles.splice(iIndex, 1);
            oUiModel.setProperty("/pendingFiles", aPendingFiles);
        },

        _uploadFilesInSequence: function (sRecordNo, aFiles, iIndex) {
            if (iIndex >= aFiles.length) {
                this.getView().setBusy(false);
                sap.m.MessageToast.show("Request and all attachments uploaded successfully!");
                this.onNavBack();
                return;
            }

            var oFileItem = aFiles[iIndex];
            var sUploadUrl = "/sap/opu/odata/sap/ZBP_VENDOR_APPROVAL_SRV/CustomerMasterSet('" + sRecordNo + "')/Attachments";

            var sSlug = oFileItem.fileName;
            if (oFileItem.comment) {
                sSlug += "|" + oFileItem.comment;
            }

            var sToken = this.getOwnerComponent().getModel().getSecurityToken();

            $.ajax({
                url: sUploadUrl,
                type: "POST",
                processData: false,
                contentType: oFileItem.fileObject.type || "application/octet-stream",
                data: oFileItem.fileObject,
                headers: {
                    "x-csrf-token": sToken,
                    "slug": sSlug
                },
                success: function () {
                    this._uploadFilesInSequence(sRecordNo, aFiles, iIndex + 1);
                }.bind(this),
                error: function () {
                    sap.m.MessageBox.error("Failed to upload file: " + oFileItem.fileName);
                    this.getView().setBusy(false);
                }.bind(this)
            });
        },

        onAddRow: function () {
            var oModel = this.getView().getModel("dataModel").getProperty("/BankData");
            var oModelcpy = JSON.parse(JSON.stringify(oModel[0]));
            for (var i = 0; i < Object.values(oModelcpy).length; i++) {
                if (Object.keys(oModelcpy)[i] === "Indicator") {
                    oModelcpy[Object.keys(oModelcpy)[i]] = false;
                } else {
                    oModelcpy[Object.keys(oModelcpy)[i]] = "";
                }
            }
            oModel.push(oModelcpy);
            this.getView().getModel("dataModel").setProperty("/BankData", oModel);
            this.getView().getModel("dataModel").refresh(true);
        },

        onselectbankcheckbox: function (oEvent) {
            var oContext = oEvent.getSource().getBindingContext("dataModel");
            if (oContext !== undefined) {
                var oRowData = oContext.getObject();
                var sPath = oContext.getPath();
                this.getView().getModel("dataModel").setProperty(sPath + "/Indicator", oEvent.getParameter("selected"));
                this.getView().getModel("dataModel").refresh(true);
            }
        },
        onselectMainCert: function (oEvent) {
            var oContext = oEvent.getSource().getBindingContext("dataModel");
            if (oContext !== undefined) {
                var oRowData = oContext.getObject();
                var sPath = oContext.getPath();
                this.getView().getModel("dataModel").setProperty(sPath + "/MainCert", oEvent.getParameter("selected"));
                this.getView().getModel("dataModel").refresh(true);
            }
        },
        onDeleteRow: function (oEvent) {
            var oTable = this.byId("employeeTable");
            var oModel = this.getView().getModel("dataModel");
            var aItems = oModel.getProperty("/BankData");
            var oselection = oTable.getSelectedIndices();
            var that = this;
            if (oselection.length === 0) {
                MessageBox.warning("Please select at least one row.");
                return;
            }

            MessageBox.confirm(
                "Delete " + oselection.length + " selected row(s)?",
                {
                    onClose: function (sAction) {

                        if (sAction === MessageBox.Action.OK) {
                            oselection
                                .sort(function (a, b) {
                                    return b - a;
                                })
                                .forEach(function (iIndex) {
                                    aItems.splice(iIndex, 1);
                                });

                            // Clear selection
                            oTable.clearSelection();
                            that.getView().getModel("dataModel").setProperty("/BankData", aItems);
                            that.getView().getModel("dataModel").refresh(true);
                        }
                    }
                }
            );
        },

        onAddRowIdentifiNumbers: function () {
            var oModel = this.getView().getModel("dataModel").getProperty("/IdentifiNumbers");
            var oModelcpy = JSON.parse(JSON.stringify(oModel[0]));
            for (var i = 0; i < Object.values(oModelcpy).length; i++) {
                if (Object.keys(oModelcpy)[i] === "EntryDate"
                    || Object.keys(oModelcpy)[i] === "ValidFrom"
                    || Object.keys(oModelcpy)[i] === "ValidTo") {
                    oModelcpy[Object.keys(oModelcpy)[i]] = null;
                } else {
                    oModelcpy[Object.keys(oModelcpy)[i]] = "";
                }
            }
            oModel.push(oModelcpy);
            this.getView().getModel("dataModel").setProperty("/IdentifiNumbers", oModel);
            this.getView().getModel("dataModel").refresh(true);
        },
        onDeleteRowIdentifiNumbers: function (oEvent) {
            var oTable = this.byId("identificationTable");
            var oModel = this.getView().getModel("dataModel");
            var aItems = oModel.getProperty("/IdentifiNumbers");
            var oselection = oTable.getSelectedIndices();
            var that = this;
            if (oselection.length === 0) {
                MessageBox.warning("Please select at least one row.");
                return;
            }

            MessageBox.confirm(
                "Delete " + oselection.length + " selected row(s)?",
                {
                    onClose: function (sAction) {

                        if (sAction === MessageBox.Action.OK) {
                            oselection
                                .sort(function (a, b) {
                                    return b - a;
                                })
                                .forEach(function (iIndex) {
                                    aItems.splice(iIndex, 1);
                                });

                            // Clear selection
                            oTable.clearSelection();
                            that.getView().getModel("dataModel").setProperty("/IdentifiNumbers", aItems);
                            that.getView().getModel("dataModel").refresh(true);
                        }
                    }
                }
            );
        },



        onAddRowTaxNumbersData: function () {
            var oModel = this.getView().getModel("dataModel").getProperty("/TaxNumbersData");
            var oModelcpy = JSON.parse(JSON.stringify(oModel[0]));
            for (var i = 0; i < Object.values(oModelcpy).length; i++) {
                oModelcpy[Object.keys(oModelcpy)[i]] = "";
            }
            oModel.push(oModelcpy);
            this.getView().getModel("dataModel").setProperty("/TaxNumbersData", oModel);
            this.getView().getModel("dataModel").refresh(true);
        },
        onDeleteRowTaxNumbersData: function (oEvent) {
            var oTable = this.byId("TaxNumbersDataTable");
            var oModel = this.getView().getModel("dataModel");
            var aItems = oModel.getProperty("/TaxNumbersData");
            var oselection = oTable.getSelectedIndices();
            var that = this;
            if (oselection.length === 0) {
                MessageBox.warning("Please select at least one row.");
                return;
            }

            MessageBox.confirm(
                "Delete " + oselection.length + " selected row(s)?",
                {
                    onClose: function (sAction) {

                        if (sAction === MessageBox.Action.OK) {
                            oselection
                                .sort(function (a, b) {
                                    return b - a;
                                })
                                .forEach(function (iIndex) {
                                    aItems.splice(iIndex, 1);
                                });

                            // Clear selection
                            oTable.clearSelection();
                            that.getView().getModel("dataModel").setProperty("/TaxNumbersData", aItems);
                            that.getView().getModel("dataModel").refresh(true);
                        }
                    }
                }
            );
        },

        removeLeadingZero(svalue) {
            var sResult = svalue.replace(/^0+/, "");
            return sResult;
        },


    });
});