sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/routing/History",
    "sap/m/MessageToast",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageBox",
    "sap/m/SelectDialog",
    "sap/m/StandardListItem",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator"
], function (Controller, History, MessageToast, JSONModel, MessageBox, SelectDialog, StandardListItem, Filter, FilterOperator) {
    "use strict";

    return Controller.extend("zbpvendorapprv.controller.ProcessInterface", {
        
        onInit: function () {
            var oViewModel = new JSONModel({
                isEditable: false
            });
            this.getView().setModel(oViewModel, "ui");

            var oRouter = this.getOwnerComponent().getRouter();
            oRouter.getRoute("ProcessInterfaceRoute").attachPatternMatched(this._onRouteMatched, this);
        },

        _onRouteMatched: function (oEvent) {
            var sReqId = oEvent.getParameter("arguments").reqId;
            
            if (!sReqId) {
                MessageBox.error("No Request ID found in the URL.");
                return;
            }

            var oODataModel = this.getOwnerComponent().getModel();
            var sPath = "/CustomerMasterSet"; 
            var aFilters = [new Filter("RecordNo", FilterOperator.EQ, sReqId)];

            this.getView().setBusy(true);

            oODataModel.read(sPath, {
                filters: aFilters,
                success: function (oData) {
                    this.getView().setBusy(false);
                    
                    if (oData.results && oData.results.length > 0) {
                        
                        var oRecord = oData.results.find(function(row) {
                            return row.RecordNo === sReqId;
                        }) || oData.results[0]; 

                       oRecord.Language = oRecord.Language || "EN";
                        oRecord.Division = oRecord.Division || "00";
                        oRecord.Currency = oRecord.Currency || "SAR";
                        oRecord.CustPricProc = oRecord.CustPricProc || "1";
                        oRecord.ShippingCondition = oRecord.ShippingCondition || "01";
                        oRecord.DunningProcedure = oRecord.DunningProcedure || "1000";
                        oRecord.CheckRule = oRecord.CheckRule || "01";
                        oRecord.Rules = oRecord.Rules || "Standard";

                        oRecord.Email = (oRecord.Email === "X");
                        oRecord.BlockInCrMgt = (oRecord.BlockInCrMgt === "X");
                        oRecord.SpecialAttention = (oRecord.SpecialAttention === "X");
                        oRecord.RecordPaymntHistory = (oRecord.RecordPaymntHistory === "X" || oRecord.RecordPaymntHistory === undefined);
                        oRecord.ClrgWithVend = (oRecord.ClrgWithVend === "X" || oRecord.ClrgWithVend === undefined);
                        
                        var oLocalModel = new JSONModel(oRecord);
                        this.getView().setModel(oLocalModel);
                    } else {
                        MessageBox.error("Customer ID " + sReqId + " was not found in the backend data.");
                    }
                }.bind(this),
                error: function (oError) {
                    this.getView().setBusy(false);
                    MessageBox.error("Failed to load interface data.");
                }.bind(this)
            });
        },

       onNavBack: function () {
            // 1. Lock the form back to "Read Only" mode in case they clicked Cancel while editing
            if (this.getView().getModel("ui")) {
                this.getView().getModel("ui").setProperty("/isEditable", false);
            }

            // 2. CRITICAL: Clear any pending file uploads so they don't accidentally attach to the next customer!
            var oUploadSet = this.getView().byId("processUploader"); 
            if (oUploadSet) {
                oUploadSet.removeAllIncompleteItems();
            }

            // 3. Explicitly route straight to the main list table
            this.getOwnerComponent().getRouter().navTo("Routemain", {}, true); 
        },

        onEdit: function () {
            this.getView().getModel("ui").setProperty("/isEditable", true);
            MessageToast.show("Form unlocked for editing.");
        },

        onSubmit: function () {
            var oPayload = this.getView().getModel().getData();
            
            var aRequiredFields = [
                "Grouping", "Name1", "Name2", "BuildingCode", "Street", "District", "City", "PostalCode", "Region", "Country", 
                "SalesOrg", "DistChannel", "Division", "SalesCustomerGroup", "SalesDistrict", "Incoterms", "Incoterms2", "AccAssmtGrpCust", "PytTerms", "SalesGroup", "SalesOffice", "CustomerGrp1", "CustomerGrp2", "CustomerGrp3", 
                "CompanyCode", "ReconAccout", "SortKey", "PlanningGroup", "PaymenttermsC",
                "CheckRule", "Rules", "RiskClass", "CreditGroup", "CreditSegment", "CollectionProf", "CollectionGroup", "Specialist"
            ];

            var bValid = true;
            for (var i = 0; i < aRequiredFields.length; i++) {
                if (!oPayload[aRequiredFields[i]] || oPayload[aRequiredFields[i]].toString().trim() === "") {
                    bValid = false; 
                    break;
                }
            }

            if (!bValid) {
                MessageToast.show("Please fill in all mandatory fields before submitting.");
                return;
            }

            this.getView().getModel("ui").setProperty("/isEditable", false);
            this._submitUpdate();
        },

       _submitUpdate: function () {
            var oLocalModel = this.getView().getModel(); 
            var oPayload = JSON.parse(JSON.stringify(oLocalModel.getData())); 

            // ACTION FLAG FOR PROCESS
            oPayload.Action = "P";

            oPayload.Email = oPayload.Email ? "X" : "";
            oPayload.RecordPaymntHistory = oPayload.RecordPaymntHistory ? "X" : "";
            oPayload.ClrgWithVend = oPayload.ClrgWithVend ? "X" : "";
            oPayload.BlockInCrMgt = oPayload.BlockInCrMgt ? "X" : "";
            oPayload.SpecialAttention = oPayload.SpecialAttention ? "X" : "";

            var oODataModel = this.getOwnerComponent().getModel();
            
            // 1. CHANGED: For a POST request, we point to the Entity Set itself, without the ID
            var sPath = "/CustomerMasterSet"; 
            
            this.getView().setBusy(true);

            // 2. CHANGED: Using .create() sends an HTTP POST, triggering CREATE_ENTITY in ABAP
            oODataModel.create(sPath, oPayload, {
             success: function () {
                    this.getView().setBusy(false);
                    var oUploadSet = this.getView().byId("processUploader");
                    
                    if (oUploadSet && oUploadSet.getIncompleteItems().length > 0) {
                        // We still use oPayload.RecordNo here to attach files to the correct record
                        var sUploadUrl = "/sap/opu/odata/sap/ZBP_VENDOR_APPROVAL_SRV/CustomerMasterSet('" + oPayload.RecordNo + "')/Attachments";
                        oUploadSet.getIncompleteItems().forEach(function (oItem) {
                            oItem.setUploadUrl(sUploadUrl);
                        });
                        oUploadSet.upload();
                        sap.m.MessageToast.show("Record Submitted! Uploading attachments...");
                    } else {
                        sap.m.MessageToast.show("Record Submitted successfully!");
                    }

                    this.onNavBack();
                }.bind(this),
                error: function (oError) {
                    this.getView().setBusy(false);
                    sap.m.MessageBox.error("An error occurred during submission.");
                }.bind(this)
            });
        },

        onBeforeUploadStarts: function (oEvent) {
            var oItem = oEvent.getParameter("item");
            var sRecordNo = this.getView().getModel().getProperty("/RecordNo");
            var sUploadUrl = "/sap/opu/odata/sap/ZBP_VENDOR_APPROVAL_SRV/CustomerMasterSet('" + sRecordNo + "')/Attachments";
            oItem.setUploadUrl(sUploadUrl);

            var oODataModel = this.getOwnerComponent().getModel();
            var oCustomerHeaderToken = new sap.ui.core.Item({
                key: "x-csrf-token",
                text: oODataModel.getSecurityToken()
            });
            oItem.addHeaderField(oCustomerHeaderToken);
        },

        onUploadCompleted: function (oEvent) {
            sap.m.MessageToast.show("File uploaded and attached successfully!");
        },

        onFileDeleted: function (oEvent) {
            sap.m.MessageToast.show("File removed.");
        },

       // F4 Value Help Mappings
        onValueHelpRequest: function (oEvent) {
            var oInput = oEvent.getSource();
            var sBindingPath = oInput.getBindingPath("value"); 
            var sFieldName = sBindingPath.substring(1); 

            // Fully updated F4 Mapping based on Excel Search Helps
            var oF4Mapping = {
                "ReconAccout":     { set: "/ReconAccountF4Set",    key: "ReconAccout" },
                "PytTerms":        { set: "/PaymentTermsF4Set",    key: "PytTerms" },
                 "Payment Terms":        { set: "/PaymentTermsCF4Set",    key: "Payment Terms" },
                "Grouping":        { set: "/GroupingF4Set",        key: "Grouping" },
                "Region":          { set: "/RegionF4Set",          key: "Region" },
                "Country":         { set: "/CountryF4Set",         key: "Country" },
                "StructureGroup":  { set: "/StructureGroupF4Set",  key: "StructureGroup" },
                "Language":        { set: "/LanguageF4Set",        key: "Language" },
                "SalesOrg":        { set: "/SalesOrgF4Set",        key: "SalesOrg" },
                "DistChannel":     { set: "/DistChannelF4Set",     key: "DistChannel" },
                "Division":        { set: "/DivisionF4Set",        key: "Division" }, 
                "SalesCustomerGroup":{ set: "/CustomerGroupF4Set", key: "CustomerGroup" },
                "SalesDistrict":   { set: "/SalesDistrictF4Set",   key: "SalesDistrict" },
                "Incoterms":       { set: "/IncotermsF4Set",       key: "Incoterms" },
                "Currency":        { set: "/CurrencyF4Set",        key: "Currency" },
                "AccAssmtGrpCust": { set: "/AccAssmtGrpCustF4Set", key: "AccAssmtGrpCust" },
                "DeliverPlant":    { set: "/DeliverPlantF4Set",    key: "DeliverPlant" },
                "SalesGroup":      { set: "/SalesGroupF4Set",      key: "SalesGroup" },
                "SalesOffice":     { set: "/SalesOfficeF4Set",     key: "SalesOffice" },
                "CustomerGrp1":    { set: "/CustomerGroup1F4Set",  key: "CustomerGrp1" },
                "CustomerGrp2":    { set: "/CustomerGroup2F4Set",  key: "CustomerGrp2" },
                "CustomerGrp3":    { set: "/CustomerGroup3F4Set",  key: "CustomerGrp3" },
                "CustomerGrp4":    { set: "/CustomerGroup4F4Set",  key: "CustomerGrp4" },
                "CustomerGrp5":    { set: "/CustomerGroup5F4Set",  key: "CustomerGrp5" },
                "CompanyCode":     { set: "/CompanyCodeF4Set",     key: "CompanyCode" },
                "SortKey":         { set: "/SortKeyF4Set",         key: "SortKey" },
                "PlanningGroup":   { set: "/PlanningGroupF4Set",   key: "PlanningGroup" },
                "AccountingClerk": { set: "/AccountingClerkF4Set", key: "AccountingClerk" },
                "CollectionProf":  { set: "/CollectionProfF4Set",  key: "CollectionProf" },
                "CollectionGroup": { set: "/CollectionGroupF4Set", key: "CollectionGroup" },
                "Specialist":      { set: "/Specialistf4Set",      key: "Specialist" },
                "RiskClass":       { set: "/RiskClassF4Set",       key: "RiskClass" },
                "CreditGroup":     { set: "/CreditGroupF4Set",     key: "CreditGroup" }
            };

            var oConfig = oF4Mapping[sFieldName];
            if (!oConfig) {
                sap.m.MessageToast.show("Value help not mapped for field: " + sFieldName);
                return;
            }

            var oModel = this.getOwnerComponent().getModel();
            var oMetaModel = oModel.getMetaModel();

            // Briefly show a busy indicator on the input field while building the table
            oInput.setBusy(true);

            oMetaModel.loaded().then(function () {
                oInput.setBusy(false);

                // 1. Fetch metadata for this specific backend Entity Set
                var sEntitySetName = oConfig.set.substring(1); 
                var oEntitySet = oMetaModel.getODataEntitySet(sEntitySetName);
                if (!oEntitySet) {
                    sap.m.MessageToast.show("No backend metadata found for " + sEntitySetName);
                    return;
                }

                var oEntityType = oMetaModel.getODataEntityType(oEntitySet.entityType);
                var aColumns = [];
                var aCells = [];

                // 2. Dynamically create a Column and Cell for EVERY field Pravalika sends!
                oEntityType.property.forEach(function (oProp) {
                    // Uses the sap:label from ABAP if available, otherwise uses the raw property name
                    var sLabel = oProp["sap:label"] || oProp.name; 
                    aColumns.push(new sap.m.Column({
                        header: new sap.m.Label({ text: sLabel })
                    }));
                    aCells.push(new sap.m.Text({ text: "{" + oProp.name + "}" }));
                });

                // 3. Create the robust Table Dialog
                var oTableSelectDialog = new sap.m.TableSelectDialog({
                    title: "Select " + sFieldName,
                    columns: aColumns,
                   search: function (oEvt) {
                        var sValue = oEvt.getParameter("value");
                        var oBinding = oEvt.getSource().getBinding("items");

                        // If search is cleared, remove all filters to show all data
                        if (!sValue) {
                            oBinding.filter([]);
                            return;
                        }

                        var aFilters = [];

                        // Dynamically build a "Contains" filter for EVERY String column
                        oEntityType.property.forEach(function (oProp) {
                            if (oProp.type === "Edm.String") {
                                aFilters.push(new sap.ui.model.Filter({
                                    path: oProp.name,
                                    operator: sap.ui.model.FilterOperator.Contains,
                                    value1: sValue
                                }));
                            }
                        });

                        // Combine all column filters with an "OR" condition
                        var oCombinedFilter = new sap.ui.model.Filter({
                            filters: aFilters,
                            and: false 
                        });

                        oBinding.filter([oCombinedFilter]);
                    },
                    // --------------------------------

                    confirm: function (oEvt) {
                        var oSelectedItem = oEvt.getParameter("selectedItem");
                        if (oSelectedItem) {
                            var sSelectedValue = oSelectedItem.getBindingContext().getProperty(oConfig.key);
                            this.getView().getModel().setProperty(sBindingPath, sSelectedValue);
                        }
                    }.bind(this)
                });

                oTableSelectDialog.setModel(oModel);

                var oTemplate = new sap.m.ColumnListItem({
                    cells: aCells
                });

                oTableSelectDialog.bindAggregation("items", {
                    path: oConfig.set,
                    template: oTemplate
                });

                this.getView().addDependent(oTableSelectDialog);
                oTableSelectDialog.open();

            }.bind(this)).catch(function () {
                oInput.setBusy(false);
                sap.m.MessageToast.show("Failed to load OData metadata.");
            });
        }
    });
});