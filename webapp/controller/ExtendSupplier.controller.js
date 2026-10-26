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

    return BaseController.extend("zbpvendorapprv.controller.ExtendSupplier", {

        onInit: function () {
            var oRouter = this.getOwnerComponent().getRouter();
            oRouter.getRoute("ExtendSupplier").attachPatternMatched(this._onRouteMatched, this);
        },
        _onRouteMatched: function (oEvent) {
            var oViewModel = {
                isEditable: true,
                isValidated: false,
                isChangeMode: true,
                isSubmit:false,
                header: true,
                pendingFiles: []
            };
            this.getView().getModel("ui").setProperty("/", oViewModel);
            this.getView().getModel("ui").refresh(true);
            this.getView().getModel("ErrorModel").setProperty("/", []);
            this.getOwnerComponent().getModel("MyInbox").setProperty("/isVisible", false);
            this.getOwnerComponent().getModel("MyInbox").refresh(true);
            this.setTabVisibility();
            this.setUIModel("EX");
            this.oF4Mapping = this.setoF4Mapping();
            this.getOwnerComponent().getModel("LocalModel").setProperty("/VendorName", "");
            this.getOwnerComponent().getModel("LocalModel").setProperty("/RequestType", "EX");
            this.getOwnerComponent().getModel("LocalModel").refresh(true);

        },

        setTabVisibility: function () {
            var svalue = {
                "VendorCreate": false,
                "VendorCreateEdit": false,
                "VendorCreateEnable": false,
                "VendorCreateGrouping": false,

                "CompanyCodeData": true,
                "CompanyCodeDataEdit": true,
                "CompanyCodeDataEnable": true,

                "BankData": false,
                "BankDataEdit": false,
                "BankDataEnable": false,

                "PurchaseOrgData": false,
                "PurchaseOrgDataEdit": false,
                "PurchaseOrgDataEnable": false,

                "IdentifiNumbers": false,
                "IdentifiNumbersEdit": false,
                "IdentifiNumbersEnable": false,

                "TaxNumbersData": false,
                "TaxNumbersDataEdit": false,
                "TaxNumbersDataEnable": false,

                "Certificates": false,
                "CertificatesEdit": false,
                "CertificatesEnable": false,

                "ContactDetails": false,
                "ContactDetailsEdit": false,
                "ContactDetailsEnable": false
            }
            this.getView().getModel("Header").setProperty("/", svalue);
            this.getView().getModel("HeaderCpy").setProperty("/", JSON.parse(JSON.stringify(svalue)));
        },

        onEditGeneral: function (oEvent) {
            this.getView().getModel("Header").getData().VendorCreateEnable = true;
            this.getView().getModel("Header").refresh(true);
        },
        onEditIdentifiNumbers: function (oEvent) {
            this.getView().getModel("Header").getData().IdentifiNumbersEnable = true;
            this.getView().getModel("Header").refresh(true);
        },
        onEditTaxNumbers: function (oEvent) {
            this.getView().getModel("Header").getData().TaxNumbersDataEnable = true;
            this.getView().getModel("Header").refresh(true);
        },
        onEditBankData: function (oEvent) {
            this.getView().getModel("Header").getData().BankDataEnable = true;
            this.getView().getModel("Header").refresh(true);
        },
        onEditCertificates: function (oEvent) {
            this.getView().getModel("Header").getData().CertificatesEnable = true;
            this.getView().getModel("Header").refresh(true);
        },
        onEditPurchaseOrg: function (oEvent) {
            this.getView().getModel("Header").getData().PurchaseOrgDataEnable = true;
            this.getView().getModel("Header").refresh(true);
        },

        onEditContacts: function (oEvent) {
            this.getView().getModel("Header").getData().ContactDetailsEnable = true;
            this.getView().getModel("Header").refresh(true);
        },
        onNavBack: function () {
            this.setUIModel("");
            this.getOwnerComponent().getRouter().navTo("Routemain", {}, true);
        },


        onValidate: function () {
            var oModel = this.getView().getModel();
            var oPayload = oModel.getData();
            var ogeneraldataModel = this.getView().getModel("dataModel").getData().VendorCreate;
            var ocompcodeModel = this.getView().getModel("dataModel").getData().CompanyCodeData;
            var opOrgModel = this.getView().getModel("dataModel").getData().PurchaseOrgData;
            var oBankDataModel = this.getView().getModel("dataModel").getData().BankData;
            // var aRequiredFields_generaldata = [
            //     "Grouping", "Name1", "Name2", "SearchTerm1", "BuildingCode", "Street", "District", "City", "PostalCode", "Region", "Country", "Language"
            // ];
            var aRequiredFields_compcode = [
                "CompanyCode", "ReconAccout", "PlanningGroup", "PaymenttermsC"
            ];
            // var aRequiredFields_BankData = [
            //     "BankCountry", "BankKey"
            // ];

            // var aRequiredFields_POrg = [
            //     "POrg", "Currency", "PaymentTerms", "IncotermsLocation", "Calculation"
            // ];

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

            // if (bValid1) {
            //     if (bValid) {
            //         for (var i = 0; i < aRequiredFields_generaldata.length; i++) {
            //             if (!ogeneraldataModel[aRequiredFields_generaldata[i]] || ogeneraldataModel[aRequiredFields_generaldata[i]].toString().trim() === "") {
            //                 bValid = false;
            //                 break;
            //             }
            //         }
            //         if (!bValid) {
            //             MessageToast.show("Please fill in all mandatory fields (marked with *)");
            //             return;
            //         }
            //     }
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
                // if (bValid && opOrgModel["POrg"] !== '') {
                //     for (var i = 0; i < aRequiredFields_POrg.length; i++) {
                //         if (opOrgModel[aRequiredFields_POrg[i]] !== undefined && (!opOrgModel[aRequiredFields_POrg[i]]
                //             || opOrgModel[aRequiredFields_POrg[i]].toString().trim() === "")) {
                //             bValid = false;
                //             break;
                //         }
                //     }

                //     if (!bValid) {
                //         MessageToast.show("Please fill in all mandatory fields (marked with *) for Purchase Org Data");
                //         return;
                //     }
                // }

                // if (bValid) {
                //     for (var i = 0; i < oBankDataModel.length; i++) {
                //         if (oBankDataModel[i].BankCountry !== undefined && oBankDataModel[i].BankCountry === "") {
                //             bValid = false;
                //             break;
                //         }
                //         else if (oBankDataModel[i].BankKey !== undefined && oBankDataModel[i].BankKey === "") {
                //             bValid = false;
                //             break;
                //         }
                //     }
                // }
                // if (!bValid) {
                //     MessageToast.show("Please fill in all mandatory fields (marked with *) for Bank Data.");
                //     return;
                // }

                if (bValid) {
                    var oViewModel = this.getView().getModel("ui");
                    oViewModel.setProperty("/isEditable", false);
                    oViewModel.setProperty("/isValidated", true);
                    oViewModel.setProperty("/isSubmit",false);

                    // MessageToast.show("Validation Successful. Form locked. You can now Submit.");

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
                    this.onPostRequest("D", "V","EX");
                }
        },

        onEdit: function () {
            var oViewModel = this.getView().getModel("ui");
            oViewModel.setProperty("/isEditable", true);
            oViewModel.setProperty("/isValidated", false);
            oViewModel.setProperty("/isSubmit",false);
            oViewModel.refresh(true);
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
            this.onPostRequest("S", "","EX");
        },
        onSaveDraft: function () {
            this.onPostRequest("D", "","EX");
        },
        _extractKey: function (vValue) {
            if (typeof vValue !== "string") {
                return vValue;
            }
            var aMatch = vValue.match(/\(([^()]+)\)$/);
            return aMatch ? aMatch[1].trim() : "";// vValue.trim();
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