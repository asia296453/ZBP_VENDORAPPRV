sap.ui.define(["sap/ui/core/mvc/Controller", "sap/ui/core/routing/History", "sap/m/MessageBox", 'sap/ui/model/Filter',
    "sap/ui/model/FilterOperator", "sap/ui/model/json/JSONModel", "sap/ui/core/Fragment", "sap/m/UploadCollectionParameter"
], function (e, t, MessageBox, Filter, FilterOperator, JSONModel, Fragment, r) {
    "use strict";
    return e.extend("zbpvendorapprv.controller.BaseController", {
        onInit: function () {

        },
        ondisplayAttachments: function (oEvent) {
            var e = 'AT';
            var t = this.getView(),
                a = this.getModel("i18n");
            // this._oAttachmentDialog = t.byId("idDialogUploadAttachments11");
            var LabelText = e;
            if (!this._oAttachmentDialog) {
                this._oAttachmentDialog = sap.ui.xmlfragment(t.getId(), "zbpvendorapprv.fragment.DisplayAttachments", this);
                t.addDependent(this._oAttachmentDialog)
            }
            jQuery.sap.syncStyleClass("sapUiSizeCompact", this.getView(), this._oAttachmentDialog);
            this.getView().setBusy(true);
            var sBreqno = this.getOwnerComponent().getModel("display").getData().results.Breqno;
            this.readAllAttachmentData(e, 'X', sBreqno);
            var i = this.getOwnerComponent().getModel("UploadAttachmentModel");
            i.setData({
                ATTACHSet: []
            })
        },
        onUploadAttachments: function (oEvent) {
            var e = 'AT';
            var t = this.getView(),
                a = this.getModel("i18n");
            //    this._oAttachmentDialog = t.byId("idDialogUploadAttachments");
            var LabelText = e;
            if (!this._oAttachmentDialog) {
                this._oAttachmentDialog = sap.ui.xmlfragment(t.getId(), "zbpvendorapprv.fragment.UploadAttachments", this);
                t.addDependent(this._oAttachmentDialog)
            }
            jQuery.sap.syncStyleClass("sapUiSizeCompact", this.getView(), this._oAttachmentDialog);
            this.getView().setBusy(true);

            this.readAllAttachmentData(e, 'X', '0');
            var i = this.getOwnerComponent().getModel("UploadAttachmentModel");
            i.setData({
                ATTACHSet: []
            })
        },
        readAllAttachmentData: function (e, bflag, sBreqno) {
            var t = this.getModel("AttachmentType").Breqno,
                r = this.getOwnerComponent().getModel(),
                surll = "/ATTACH1Set",
                s = [],
                sListType = e;

            if (sBreqno !== undefined) {
                t = sBreqno;
            }
            s.push(new Filter("Breqno", FilterOperator.EQ, t));


            var n = this;
            n.getView().setBusy(true);
            r.read(surll, {
                filters: s,
                success: function (e, t) {
                    n.getView().setBusy(false);
                    if (bflag !== '') {
                        n._OpenAttachmentDialog(e);
                    }
                },
                error: function (e, t) {
                    n.getView().setBusy(false)
                }
            })
        },

        onValidation: function (oval) {
            var bflag = true;
            if (this.getView().getModel("user") !== undefined &&
                this.getView().getModel("user").getData().results.Apuser === 'X') {
                this.getView().getModel("item").getData().results.forEach(function (item, index) {
                    if (item.Taxcode === '' && bflag) {
                        MessageBox.error("Please enter Tax Code");
                        bflag = false;
                        return;
                    }
                });
            }

            return bflag;
        },
        onHandleCancelUpload1: function (e) {
            // this.readAllAttachmentData('', '');
            this._oAttachmentDialog.close();
            //  this._oAttachmentDialog.destroy();
        },
        _OpenAttachmentDialog: function (e) {

            var t = [],
                a = this.getModel("AttachmentType").Breqno,
                i = this.getOwnerComponent().getModel("UploadAttachmentModel"),
                r = {},
                sBreqno = this.getOwnerComponent().getModel("display").getData().results.Breqno,
                surl = '';
            i.setData([]);
            for (var o = 0; o < e.results.length; o++) {
                surl = "/sap/opu/odata/sap/ZFI_BUDGET_REQ_SRV/ATTACHSet(Breqno='" + e.results[o].Breqno + "',Zlevel=" + e.results[o].Zlevel + ",Serial=" + e.results[o].Serial + ")/$value";
                r = {
                    DocId: e.results[o].Serial,
                    FileName: e.results[o].FileName,
                    ProjectCode: "",
                    Mandt: "",
                    Mimetype: e.results[o].Mimetype,
                    Breqno: e.results[o].Breqno,
                    Serial: e.results[o].Serial,
                    UpldBy: e.results[o].UpldBy,
                    UpldDat: e.results[o].UpldDat,
                    UpldTime: e.results[o].UpldTime,
                    Uname: e.results[o].UpldBy,
                    Url: surl
                };
                t.push(r)
            }
            i.setData([]);
            i.setData({
                ATTACHSet: t
            });
            this.getView().setBusy(false);
            this._oAttachmentDialog.open()
        },
        getRouter: function () {
            return this.getOwnerComponent().getRouter()
        },
        getModel: function (e) {
            return this.getView().getModel(e)
        },
        setModel: function (e, t) {
            return this.getView().setModel(e, t)
        },
        showBusy: function (bBusy) {
            if (bBusy) {
                sap.ui.core.BusyIndicator.show(0);
            } else {
                sap.ui.core.BusyIndicator.hide();
            }
        },
        getText: function (sProperty, aArgs) {
            if (!this._oResourceBundle) {
                this._oResourceBundle = this.getModel("i18n").getResourceBundle();
            }
            return this._oResourceBundle.getText(sProperty, aArgs);
        },

        getResourceBundle: function (sText) {
            return this.getOwnerComponent().getModel("i18n").getResourceBundle()
        },
        onNavBack: function () {
            var e = t.getInstance().getPreviousHash(),
                n = sap.ushell.Container.getService("CrossApplicationNavigation");
            if (e !== undefined || !n.isInitialNavigation()) {
                history.go(-1)
            } else {
                this.getRouter().navTo("master", {}, true)
            }
        },



        formatstatusapp: function (sText) {
            var sTxt = '';
            if (sText === '' || sText === 'SAVE' || sText === 'IN') {
                sTxt = 'In Process';
            } else if (sText === 'SUFA') {
                sTxt = 'Submitted for Approval';
            }
            else if (sText === 'AP') {
                sTxt = 'Approved';

            } else if (sText === 'RE') {
                sTxt = 'Reopen';
            }
            else if (sText === 'RJ') {
                sTxt = 'Rejected';
            }

            return sTxt;
        },
        timeformat: function (val) {
            if (val !== null) {
                if (typeof val === 'string' || val instanceof String) {
                    val = val.replace(/^PT/, '').replace(/S$/, '');
                    val = val.replace('H', ':').replace('M', ':');

                    var multipler = 60 * 60;
                    var result = 0;
                    val.split(':').forEach(function (token) {
                        result += token * multipler;
                        multipler = multipler / 60;
                    });
                    var timeinmiliseconds = result * 1000;

                    var timeFormat = sap.ui.core.format.DateFormat.getTimeInstance({
                        pattern: "KK:mm:ss a"
                    });
                    var TZOffsetMs = new Date(0).getTimezoneOffset() * 60 * 1000;
                    return timeFormat.format(new Date(timeinmiliseconds + TZOffsetMs));
                } else {
                    val = val.ms;
                    var ms = val % 1000;
                    val = (val - ms) / 1000;
                    var secs = val % 60;
                    val = (val - secs) / 60;
                    var mins = val % 60;
                    var hrs = (val - mins) / 60;

                    return hrs + ':' + mins + ':' + secs;
                }
            }
        },
        DateFormatStr: function (oVal) {
            if (oVal !== null) {
                if (typeof oVal === 'string' || oVal instanceof String) {
                    return oVal.substr(8, 2) + "-" + oVal.substr(5, 2) + "-" + oVal.substr(0, 4);
                } else if (oVal instanceof Date) {
                    var sDate = oVal.toJSON();
                    return sDate.substr(8, 2) + "-" + sDate.substr(5, 2) + "-" + sDate.substr(0, 4);

                }
            }
        },
        getViewData: function (sValue, suserid) {
            var oFilter = new sap.ui.model.Filter("Breqno", sap.ui.model.FilterOperator.EQ, sValue);
            this.getOdata("/CLAIMREQSet(Breqno='" + sValue + "')", "display", null, true);
            this.getOdata("/BRWRLOGSet", "approvallog", oFilter);
            this.getOdata("/TAXCODESet", "Taxcode", null);
            this.getOdata("/USREMPSet(Usrid='" + suserid + "')", "user", null);
        },

        setUIModel: function (stype) {
            this.getOwnerComponent().getModel("LocalModel").setProperty("/RequestNumber", "");
            var sServiceURL = "/sap/opu/odata/sap/ZBP_VENDOR_APPROVAL_SRV/";
            var oModel = new sap.ui.model.odata.v2.ODataModel(sServiceURL);
            var oDate = new Date(9999, 11, 31);
            oModel.attachMetadataLoaded(null, function () {
                var oMetadata = oModel.getServiceMetadata().dataServices.schema[0].entityType;


                for (var i = 0; i < oMetadata.length; i++) {
                    if (oMetadata[i].name === "VendorCreate" || oMetadata[i].name === "CompanyCodeData"
                        || oMetadata[i].name === "BankData" || oMetadata[i].name === "PurchaseOrgData"
                        || oMetadata[i].name === "IdentifiNumbers" || oMetadata[i].name === "TaxNumbersData"
                        || oMetadata[i].name === "Certificates" || oMetadata[i].name === "ContactPerson") {
                        var oJsonData = {};
                        var oFieldMetadata = {};
                        oMetadata[i].property.forEach(r => {
                            oJsonData[r.name] = "";
                            // Store metadata
                            oFieldMetadata[r.name] = {
                                type: r.type,
                                maxLength: parseInt(r.maxLength) || null
                            };
                        })

                        this.getOwnerComponent().getModel("dataModel").setProperty("/" + oMetadata[i].name + "Property", oFieldMetadata);


                        if (oJsonData.Indicator !== undefined && oJsonData.Indicator === "") {
                            oJsonData.Indicator = false;
                        }

                        if (oJsonData.MainCert !== undefined && oJsonData.MainCert === "") {
                            oJsonData.MainCert = false;
                        }
                        if (oJsonData.ClrgWithVend !== undefined && oJsonData.ClrgWithVend === "") {
                            oJsonData.ClrgWithVend = false;
                        }
                        if (oJsonData.ChkDoubleInv !== undefined && oJsonData.ChkDoubleInv === "") {
                            oJsonData.ChkDoubleInv = true;
                        }


                        if (oJsonData.Language !== undefined && oJsonData.Language === "") {
                            oJsonData.Language = 'English(E)';
                        }

                        if (oJsonData.TitleKey !== undefined && oJsonData.TitleKey === "") {
                            oJsonData.TitleKey = "Company(0003)";
                        }

                        if (oJsonData.Status !== undefined && oJsonData.Status === "") {
                            oJsonData.Status = 'DRAFT';
                        }

                        if (oMetadata[i].name === "ContactPerson") {
                            if (oJsonData.Grouping !== undefined && oJsonData.Grouping === "") {
                                oJsonData.Grouping = 'ZCP1';
                            }

                            if (oJsonData.ValidTo !== undefined) {
                                oJsonData.ValidTo = "9999-12-31";
                            }
                        }

                        if (oMetadata[i].name === "Certificates") {
                            if (oJsonData.CreditValidTo !== undefined) {
                                oJsonData.CreditValidTo = "9999-12-31";
                            }
                        }

                        if (oMetadata[i].name === "BankData"
                            || oMetadata[i].name === "IdentifiNumbers"
                            || oMetadata[i].name === "TaxNumbersData"
                            || oMetadata[i].name === "Certificates"
                            || oMetadata[i].name === "ContactPerson") {
                            var oarr = [];
                            oarr.push(oJsonData);


                            // oarr.push(JSON.parse(JSON.stringify(oJsonData)));
                            this.getOwnerComponent().getModel("dataModel").setProperty("/" + oMetadata[i].name, oarr);
                            this.getOwnerComponent().getModel("dataModelCpy").setProperty("/" + oMetadata[i].name, JSON.parse(JSON.stringify(oarr)));

                            if (oMetadata[i].name === "BankData") {
                                this.getOwnerComponent().getModel("dataModel").setProperty("/ContactBankData", JSON.parse(JSON.stringify(oarr)));
                                this.getOwnerComponent().getModel("dataModelCpy").setProperty("/ContactBankData", JSON.parse(JSON.stringify(oarr)));

                            }

                        } else {
                            this.getOwnerComponent().getModel("dataModel").setProperty("/" + oMetadata[i].name, oJsonData);
                            this.getOwnerComponent().getModel("dataModelCpy").setProperty("/" + oMetadata[i].name, JSON.parse(JSON.stringify(oJsonData)));
                        }



                    }
                }
            }.bind(this), null);

            if (stype === 'CR') {
                this.getOwnerComponent().getModel("LocalModel").setProperty("/RequestType", "CR");
                this.getOwnerComponent().getModel("LocalModel").setProperty("/Status", "DRAFT");
                this.getOwnerComponent().getModel("LocalModel").refresh(true);
            }
            else if (stype === 'CH') {
                this.getOwnerComponent().getModel("LocalModel").setProperty("/RequestType", "CH");
                this.getOwnerComponent().getModel("LocalModel").setProperty("/Status", "DRAFT");
                this.getOwnerComponent().getModel("LocalModel").refresh(true);
            } else {
                this.getOwnerComponent().getModel("LocalModel").setProperty("/RequestType", "");
                this.getOwnerComponent().getModel("LocalModel").setProperty("/Status", "DRAFT");
                this.getOwnerComponent().getModel("LocalModel").refresh(true);
            }

        },

        setoF4Mapping: function () {
            var oF4Mapping = {
                "ReconAccout": { set: "/ReconAccountF4Set", returnProperty: "GLAccount", filterBy: { field: "CompanyCode", filterProperty: "CompanyCode" }, model: "CompanyCodeData", "description": "LongText", fielddesc: "ReconAccountDesc" },
                "PytTerms": { set: "/PaymentTermsF4Set", key: "PytTerms", fielddesc: "" },
                "PaymentTerms": { set: "/PaymentTermsF4Set", key: "PaymentTerms", model: "PurchaseOrgData", fielddesc: "PaymenttermsDesc" },
                "PaymentMethod": { set: "/PaymentMethodF4Set", returnProperty: "PaymentMethod", filterBy: { field: "CompanyCode", filterProperty: "CompanyCode", fielddesc: "" }, model: "CompanyCodeData", fielddesc: "PaymentMethodDesc" },
                "HouseBank": { set: "/HouseBankF4Set", returnProperty: "HouseBank", filterBy: { field: "CompanyCode", filterProperty: "CompanyCode", fielddesc: "" }, model: "CompanyCodeData", "description": "HouseBank", fielddesc: "HouseBankDesc" },
                "Grouping": { set: "/GroupingF4Set", key: "Grouping", fielddesc: "GroupingDesc" },
                "Region1": { set: "/RegionF4Set", key: "Region", returnProperty: "Region", filterBy: { field: "Country", filterProperty: "Country", optional: true, fielddesc: "" }, model: "VendorCreate", fielddesc: "RegionDesc" },
                "Region": { set: "/RegionF4Set", key: "Region", returnProperty: "Region", filterBy: { field: "Country", filterProperty: "Country", optional: true, fielddesc: "" }, model: "IdentifiNumbers", fielddesc: "RegionDesc" },
                "Country1": { set: "/CountryF4Set", key: "Country", fielddesc: "CountryDesc" },
                "Country": { set: "/CountryF4Set", key: "Country", model: "IdentifiNumbers", fielddesc: "CountryDesc" },
                "Region2": { set: "/RegionF4Set", key: "Region", returnProperty: "Region", filterBy: { field: "Country", filterProperty: "Country", optional: true, fielddesc: "" }, model: "ContactPerson", fielddesc: "RegionDesc" },
                "Country2": { set: "/CountryF4Set", key: "Country", model: "ContactPerson", fielddesc: "CountryDesc" },
                "BankCountry": { set: "/CountryF4Set", key: "Country", "returnProperty": "Country", model: "BankData", fielddesc: "BankCountryDesc" },
                "StructureGroup": { set: "/StructureGroupF4Set", key: "StructureGroup", returnProperty: "StructurGroup", fielddesc: "StructurGroupDesc" },
                "Language": { set: "/LanguageF4Set", key: "Language", fielddesc: "LanguageDesc" },
                "IncotermsLocation": { set: "/Incoterms1F4Set", key: "Incoterms1", returnProperty: "Incoterms1", fielddesc: "Incoterms1Desc" },
                "Incoterms1": { set: "/Incoterms1F4", key: "Incoterms1", returnProperty: "Incoterms1", fielddesc: "Description" },
                "Currency": { set: "/CurrencyF4Set", key: "Currency", fielddesc: "CurrencyDesc" },
                "CompanyCode": { set: "/CompanyCodeF4Set", key: "CompanyCode", "description": "CompanyName", model: "CompanyCodeData", fielddesc: "CompanyCodeDesc" },
                "SortKey": { set: "/SortKeyF4Set", key: "SortKey", model: "CompanyCodeData", fielddesc: "SortKeyDesc" },
                "PlanningGroup": { set: "/PlanningGroupF4Set", key: "PlanningGroup", model: "CompanyCodeData", fielddesc: "PlanningGroupDesc" },
                "PaymenttermsC": { set: "/PaymentTermsF4Set", key: "PaymenttermsC", returnProperty: "PaymentTerms", model: "CompanyCodeData", fielddesc: "PaymenttermsCDesc" },
                "DunningProcedure": { set: "/DunningProcedureF4Set", key: "DunningProcedure", fielddesc: "" },
                "AccountingClerk": { set: "/AccountingClerkF4Set", returnProperty: "ClerkAbbrev", filterBy: { field: "CompanyCode", filterProperty: "CompanyCode", fielddesc: "" }, model: "CompanyCodeData", fielddesc: "" },
                "CountryComp": { set: "/CertificateCountryF4Set", key: "CountryComp", returnProperty: "Country", model: "Certificates", fielddesc: "CountryCompDesc" },
                "CertificateID": { set: "/CertificateIdF4Set", key: "CertificateID", returnProperty: "CertificationId", description: "Country", filterBy: { field: "CountryComp", filterProperty: "Country", fielddesc: "" }, model: "", fielddesc: "" },
                "RegionCity": { set: "/RegionF4Set", returnProperty: "Region", filterBy: { field: "CountryComp", filterProperty: "Country", optional: true, fielddesc: "" }, model: "Certificates", fielddesc: "RegionCityDesc" },
                "ExemptionType": { set: "/ExemptionTypeF4Set", key: "ExemptionType", model: "Certificates", fielddesc: "ExemptionTypeDesc" },
                "BankKey": { set: "/HBanklSet", key: "Banks", returnProperty: "Bankl", filterBy: { field: "BankCountry", filterProperty: "Banks", optional: true, fielddesc: "" }, description: "Banka", model: "BankData", fielddesc: "BankKeyDesc" },
                "Currency": { set: "/CurrencyF4Set", key: "Currency", model: "PurchaseOrgData", fielddesc: "CurrencyDesc" },
                "Incoterms1": { set: "/Incoterms1F4Set", key: "Incoterms1", fielddesc: "" },
                // "PaymentTerms": { set: "/PaymentTermsF4Set", key: "PaymentTerms", fielddesc: "" },
                "Type": { set: "/IdentificationTypeF4Set", key: "IdentificationType", returnProperty: "IdentificationType", description: "Text", model: "IdentifiNumbers", fielddesc: "TypeDesc" },
                "TaxType": { set: "/TaxTypeF4Set", key: "TaxType", model: "TaxNumbersData", fielddesc: "TaxTypeDesc" },
                "TaxStatus": { set: "/TaxStatusF4Set", key: "TaxStatus", model: "TaxNumbersData", fielddesc: "TaxStatusDesc" },
                "POrg": { set: "/PurchaseOrgF4Set", key: "PurchaseOrg", returnProperty: "PurchaseOrg", model: "PurchaseOrgData", fielddesc: "Description" },
                "RequestNumber": { set: "/RequestNumberF4Set", key: "RequestNumber", fielddesc: "" },
                "Calculation": { set: "/SchemaF4Set", key: "Schema", returnProperty: "Schema", model: "PurchaseOrgData", fielddesc: "CalculationDesc" },
                "Vendor": { set: "/VendorF4Set", key: "Vendor", fielddesc: "Name", description: "Name" },
                "Contact": { set: "/PartnerF4Set", key: "Contact", returnProperty: "Partner", description: "Name", model: "ContactPerson", fielddesc: "PartnerFunctionDesc" },
                "Partner": { set: "/PartnerF4Set", key: "Contact", returnProperty: "Partner", description: "Name", model: "ContactPerson", fielddesc: "PartnerFunctionDesc" },
                "Authority": { set: "/AuthorityF4Set", key: "Authority", returnProperty: "Authority", model: "ContactPerson", fielddesc: "AuthorityDesc" },
                "Department": { set: "/DepartmentF4Set", key: "Department", returnProperty: "Department", model: "ContactPerson", fielddesc: "DepartmentDesc" },
                "Department": { set: "/DepartmentF4Set", key: "Department", returnProperty: "Department", model: "ContactPerson", fielddesc: "DepartmentDesc" },
                "PartnerFunction": { set: "/FunctionF4Set", key: "PartnerFunction", returnProperty: "PartnerFunction", model: "ContactPerson", fielddesc: "PartnerFunctionDesc" },
                "RelType": { set: "/RelTypeF4Set", key: "RelType", returnProperty: "RelKind", model: "ContactPerson", fielddesc: "RelTypeDesc" },
                "Vip": { set: "/VipF4Set", key: "Vip", returnProperty: "Vip", model: "ContactPerson", fielddesc: "VipDesc" }
            };

            return oF4Mapping;
        },

        onValueHelpRequest: function (oEvent) {
            var oInput = oEvent.getSource();
            var sBindingPath = oInput.getBindingPath("value");
            var sFieldName = sBindingPath.split("/").pop();

            // Get the row's binding context
            var oContext = oInput.getBindingContext("dataModel");
            if (oContext !== undefined) {
                var oRowData = oContext.getObject();
                var sPath = oContext.getPath();
                this.iRowIndex = parseInt(sPath.split("/").pop(), 10);
                this.stblmodel = sPath.split("/")[1];
            }



            var oConfig = this.oF4Mapping[sFieldName];
            if (!oConfig) {
                sap.m.MessageToast.show("Value help not mapped for field: " + sFieldName);
                return;
            }

            var aInitialFilters = [];
            if (oConfig.filterBy) {
                var aDependencies = Array.isArray(oConfig.filterBy) ? oConfig.filterBy : [oConfig.filterBy];

                for (var i = 0; i < aDependencies.length; i++) {
                    var oDep = aDependencies[i];
                    // var sParentValue = oInput.getBindingContext() ? oInput.getBindingContext().getProperty(oDep.field) : this.getView().getModel().getProperty("/" + oDep.field);
                    var smodelpath1 = oInput.getBindingInfo("value").parts[0].path.split("/")[1];
                    if (smodelpath1 !== undefined) {
                        var sParentValue = this.getView().getModel("dataModel").getProperty("/" + smodelpath1 + "/" + oDep.field);
                    }
                    else {
                        var sParentValue = this.getView().getModel("dataModel").getProperty("/" + this.stblmodel + "/" + this.iRowIndex + "/" + oDep.field);
                    }

                    if (sParentValue) {
                        sParentValue = this._extractKey(sParentValue);
                        aInitialFilters.push(new sap.ui.model.Filter(oDep.filterProperty, sap.ui.model.FilterOperator.EQ, sParentValue));
                    } else if (!oDep.optional) {
                        sap.m.MessageToast.show("Please fill '" + oDep.field + "' first.");
                        return;
                    }

                }
            }
            if (oConfig.key === "RequestNumber") {
                aInitialFilters.push(new sap.ui.model.Filter('Status', sap.ui.model.FilterOperator.EQ, 'I'));
            }


            var oModel = this.getOwnerComponent().getModel();
            var oMetaModel = oModel.getMetaModel();

            oInput.setBusy(true);

            oMetaModel.loaded().then(function () {
                oInput.setBusy(false);

                var sEntitySetName = oConfig.set.substring(1);
                var oEntitySet = oMetaModel.getODataEntitySet(sEntitySetName);
                if (!oEntitySet) {
                    sap.m.MessageToast.show("No backend metadata found for " + sEntitySetName);
                    return;
                }

                var oEntityType = oMetaModel.getODataEntityType(oEntitySet.entityType);
                var aColumns = [];
                var aCells = [];

                oEntityType.property.forEach(function (oProp) {
                    var sLabel = oProp["sap:label"] || oProp.name;
                    aColumns.push(new sap.m.Column({
                        header: new sap.m.Label({ text: sLabel })
                    }));
                    aCells.push(new sap.m.Text({ text: "{" + oProp.name + "}" }));
                });

                var oTableSelectDialog = new sap.m.TableSelectDialog({
                    title: "Select " + sFieldName,
                    columns: aColumns,
                    search: function (oEvt) {
                        var sValue = oEvt.getParameter("value");
                        var oBinding = oEvt.getSource().getBinding("items");

                        if (!sValue) {
                            oBinding.filter(aInitialFilters.length > 0 ? aInitialFilters : []);
                            return;
                        }

                        var aFilters = [];
                        oEntityType.property.forEach(function (oProp) {
                            if (oProp.type === "Edm.String") {
                                aFilters.push(new sap.ui.model.Filter({
                                    path: oProp.name,
                                    operator: sap.ui.model.FilterOperator.Contains,
                                    value1: sValue
                                }));
                            }
                        });

                        var oCombinedSearch = new sap.ui.model.Filter({ filters: aFilters, and: false });

                        if (aInitialFilters.length > 0) {
                            var aAllFilters = aInitialFilters.slice();
                            aAllFilters.push(oCombinedSearch);
                            oBinding.filter([new sap.ui.model.Filter({ filters: aAllFilters, and: true })]);
                        } else {
                            oBinding.filter([oCombinedSearch]);
                        }

                    },
                    confirm: function (oEvt) {
                        var svaluepath = oInput.getBindingInfo("value").parts[0];
                        var smodelinput = svaluepath.model;
                        var smodelpath = svaluepath.path.split("/");

                        var oSelectedItem = oEvt.getParameter("selectedItem").getBindingContext().getObject();
                        if (oSelectedItem) {
                            if (smodelpath[2] !== undefined) {
                                var sSelectedValue = oSelectedItem[smodelpath[2]];
                            } else {
                                var sSelectedValue = oSelectedItem[smodelpath[0]];
                            }
                            var sSlectedDesc = oSelectedItem.Description;

                            if (sSelectedValue === undefined) {
                                sSelectedValue = oSelectedItem[this.oF4Mapping[sFieldName].returnProperty];
                            }
                            if (sSlectedDesc === undefined) {
                                sSlectedDesc = oSelectedItem[oConfig.description];
                            }

                            if (!sSelectedValue) {
                                //sSelectedValue = oSelectedItem.getCells()[0].getText();
                            }
                            if (oConfig.key !== 'RequestNumber' && oConfig.key !== 'Vendor' && sSlectedDesc !== undefined) {
                                sSelectedValue = sSlectedDesc + "(" + sSelectedValue + ")";
                            }
                            if (oContext !== undefined) {
                                if (smodelpath.length > 1) {
                                    smodelpath = smodelpath[1];
                                }
                                else if (smodelpath.length === 1) {
                                    smodelpath = smodelpath[0];
                                }
                                this.getView().getModel("dataModel").setProperty(oContext.sPath + "/" + smodelpath, sSelectedValue);
                                this.getView().getModel("dataModel").refresh(true);
                            } else {
                                this.getView().getModel("dataModel").getData()[smodelpath[1]][smodelpath[2]] = sSelectedValue;
                                this.getView().getModel(smodelinput).refresh(true);
                            }
                            // var oContext = oInput.getBindingContext();
                            // if (oContext) {
                            //     this.getView().getModel().setProperty(oContext.getPath() + "/" + sFieldName, sSelectedValue);
                            // } else {
                            //     this.getView().getModel().setProperty("/" + sFieldName, sSelectedValue);
                            // }

                            oInput.setValueState(sap.ui.core.ValueState.None);
                            if (oConfig.key === 'RequestNumber' || oConfig.key === 'Vendor') {
                                // var aFilters = [
                                //     new sap.ui.model.Filter(
                                //         "RequestNumber",
                                //         sap.ui.model.FilterOperator.EQ,
                                //         sSelectedValue
                                //     )
                                // ];
                                var stype = "";
                                if (oConfig.key === 'Vendor') {
                                    stype = this.getOwnerComponent().getModel("LocalModel").getData().RequestType;
                                    this.getOwnerComponent().getModel("LocalModel").setProperty("/VendorName", sSlectedDesc);
                                    this.getOwnerComponent().getModel("LocalModel").refresh(true);
                                }
                                else if (oConfig.key === 'RequestNumber') {
                                    stype = 'CR';
                                }
                                this.onReadOData("/VendorCreateSet(RequestNumber='" + sSelectedValue + "')", null).then((oresponse) => {
                                    this.getDescription(oresponse);
                                    this.getOwnerComponent().getModel("LocalModel").setProperty("/RequestNumber", this.getView().getModel("dataModel").getData().VendorCreate.RequestNumber);

                                    this.getView().getModel("dataModel").getData().VendorCreate.Status = 'DRAFT';
                                    this.getView().getModel("dataModel").getData().VendorCreate.RequestNumber = "";
                                    this.getView().getModel("dataModel").refresh(true);


                                    this.getOwnerComponent().getModel("LocalModel").setProperty("/RequestType", stype);
                                    this.getOwnerComponent().getModel("LocalModel").refresh(true);
                                });
                            }
                        }
                        oEvt.getSource().destroy();
                    }.bind(this)
                });

                oTableSelectDialog.attachCancel(function (oEvent) {
                    oEvent.getSource().destroy();
                });

                oTableSelectDialog.setModel(oModel);

                var oTemplate = new sap.m.ColumnListItem({
                    cells: aCells
                });


                this.getView().addDependent(oTableSelectDialog);
                // oTableSelectDialog.open();
                var sFilterKey = aInitialFilters.map(function (oF) {
                    return oF.sPath + "=" + oF.oValue1;
                }).join("&");
                var sCacheKey = oConfig.set + "__" + sFilterKey;
                this._oF4Cache = this._oF4Cache || {};

                var fnBindAndOpen = function (aResults) {
                    var oDialogJsonModel = new sap.ui.model.json.JSONModel({ results: aResults });
                    oTableSelectDialog.setModel(oDialogJsonModel);
                    oTableSelectDialog.bindAggregation("items", {
                        path: "/results",
                        template: oTemplate,
                        filters: aInitialFilters,
                        templateShareable: false
                    });
                    oTableSelectDialog.open();
                };

                if (this._oF4Cache[sCacheKey]) {
                    fnBindAndOpen(this._oF4Cache[sCacheKey]);
                } else {
                    oInput.setBusy(true);
                    oModel.read(oConfig.set, {
                        filters: aInitialFilters,
                        success: function (oData) {
                            oInput.setBusy(false);
                            var aResults = (oData && oData.results) ? oData.results : [];
                            this._oF4Cache[sCacheKey] = aResults;
                            fnBindAndOpen(aResults);
                        }.bind(this),
                        error: function () {
                            oInput.setBusy(false);
                            oTableSelectDialog.destroy();
                            sap.m.MessageToast.show("Failed to load F4 data for " + sFieldName);
                        }
                    });
                }

            }.bind(this)).catch(function () {
                oInput.setBusy(false);
                sap.m.MessageToast.show("Failed to load OData metadata.");
            });
        },

        getDescription: function (oresponse) {
            debugger;
            var aInitialFilters = [];
            var obank = [];
            var ocontactbank = [];
            if (oresponse.BankDetails.results.length > 0) {
                oresponse.BankDetails.results.forEach(r => {
                    if (r.Indicator !== undefined && r.Indicator === "") {
                        r.Indicator = false;
                    }
                    if (r.Type === "C") {
                        ocontactbank.push(r);
                    } else {
                        obank.push(r);
                    }
                })
            }
            else {
                oresponse.BankDetails.results = this.getModel("dataModelCpy").getData().BankData;
            }

            if (oresponse.PurchaseOrg.results.length > 0) {
                if (oresponse.PurchaseOrg.results[0].Indicator !== undefined && oresponse.PurchaseOrg.results[0].Indicator === "X") {
                    oresponse.PurchaseOrg.results[0].Indicator = true;
                } else {
                    oresponse.PurchaseOrg.results[0].Indicator = false;
                }
            } else {
                var oprg = [];
                oprg.push(this.getModel("dataModelCpy").getData().PurchaseOrgData);
                oresponse.PurchaseOrg.results = oprg;//this.getModel("dataModelCpy").getData().PurchaseOrgData;
            }

            if (oresponse.Certicates.results.length > 0) {
                oresponse.Certicates.results.forEach(r => {
                    if (r.MainCert !== undefined && r.MainCert === "X") {
                        r.MainCert = true;
                    } else {
                        r.MainCert = false;
                    }
                })
            } else {
                oresponse.Certicates.results = this.getModel("dataModelCpy").getData().Certificates;
            }

            if (oresponse.CompanyCode.results.length > 0) {
                // oresponse.CompanyCode.results[0].ReconAccout = this.removeLeadingZero(oresponse.CompanyCode.results[0].ReconAccout);
                if (oresponse.CompanyCode.results[0].ClrgWithVend !== undefined && oresponse.CompanyCode.results[0].ClrgWithVend === "X") {
                    oresponse.CompanyCode.results[0].ClrgWithVend = true;
                } else {
                    oresponse.CompanyCode.results[0].ClrgWithVend = false;
                }

                if (oresponse.CompanyCode.results[0].ChkDoubleInv !== undefined && oresponse.CompanyCode.results[0].ChkDoubleInv === "X") {
                    oresponse.CompanyCode.results[0].ChkDoubleInv = true;
                } else {
                    oresponse.CompanyCode.results[0].ChkDoubleInv = false;
                }
            }
            else {
                var orr = [];
                orr.push(this.getModel("dataModelCpy").getData().CompanyCodeData);
                oresponse.CompanyCode.results = orr;
            }

            if (oresponse.IdentficationNumbers.results.length === 0) {
                oresponse.IdentficationNumbers.results = this.getModel("dataModelCpy").getData().IdentifiNumbers;
            }
            if (oresponse.TaxNumbers.results.length === 0) {
                oresponse.TaxNumbers.results = this.getModel("dataModelCpy").getData().TaxNumbersData;
            }

            if (oresponse.ContactDetails.results.length > 0) {

            } else {
                oresponse.ContactDetails.results = this.getModel("dataModelCpy").getData().ContactPerson;
            }
            this.getOwnerComponent().getModel("dataModel").setProperty("/VendorCreate", oresponse);
            this.getOwnerComponent().getModel("dataModel").setProperty("/CompanyCodeData", oresponse.CompanyCode.results[0]);
            this.getOwnerComponent().getModel("dataModel").setProperty("/BankData", obank);
            this.getOwnerComponent().getModel("dataModel").setProperty("/ContactBankData", ocontactbank);
            this.getOwnerComponent().getModel("dataModel").setProperty("/PurchaseOrgData", oresponse.PurchaseOrg.results[0]);
            this.getOwnerComponent().getModel("dataModel").setProperty("/IdentifiNumbers", oresponse.IdentficationNumbers.results);
            this.getOwnerComponent().getModel("dataModel").setProperty("/TaxNumbersData", oresponse.TaxNumbers.results);
            this.getOwnerComponent().getModel("dataModel").setProperty("/Certificates", oresponse.Certicates.results);
            this.getOwnerComponent().getModel("dataModel").setProperty("/ContactPerson", oresponse.ContactDetails.results);
            this.getOwnerComponent().getModel("dataModel").refresh(true);

            var aF4Fields = Object.keys(this.oF4Mapping);
            aF4Fields.forEach(sField => {
                var aInitialFilters = [];
                var ofields = this.oF4Mapping[sField];
                var skey = sField;
                var skeyDesc = ofields.fielddesc;
                var svalue = "";
                var smodel = "VendorCreate";

                // if (sField === "Partner") {
                //     debugger;
                // }


                if (sField === 'Country1' || sField === 'Region1') {
                    sField = sField.split("1")[0];
                    skey = sField;
                }
                if (sField === 'Country2' || sField === 'Region2') {
                    sField = sField.split("2")[0];
                    skey = sField;
                }

                if (skeyDesc !== "") {
                    if (ofields.model !== undefined) {
                        smodel = ofields.model;
                    }

                    // if (smodel === "ContactPerson") {
                    //     debugger;
                    // }
                    if (smodel === "BankData" || smodel === "IdentifiNumbers" || smodel === "TaxNumbersData" || smodel === "Certificates" || smodel === "ContactPerson") {
                        for (var idx = 0; idx < this.getOwnerComponent().getModel("dataModel").getData()[smodel].length; idx++) {
                            if (this.getOwnerComponent().getModel("dataModel").getData()[smodel][idx][skeyDesc] !== undefined) {
                                if (this.getOwnerComponent().getModel("dataModel").getData()[smodel][idx][skey] !== "" && this.getOwnerComponent().getModel("dataModel").getData()[smodel][idx][skeyDesc] !== "") {
                                    svalue = this.getOwnerComponent().getModel("dataModel").getData()[smodel][idx][skeyDesc] + "(" + this.getOwnerComponent().getModel("dataModel").getData()[smodel][idx][sField] + ")";
                                    this.getOwnerComponent().getModel("dataModel").getData()[smodel][idx][skey] = svalue;
                                }
                                else if (this.getOwnerComponent().getModel("dataModel").getData()[smodel][idx][skey] === "" && this.getOwnerComponent().getModel("dataModel").getData()[smodel][idx][skeyDesc] !== "") {
                                    svalue = this.getOwnerComponent().getModel("dataModel").getData()[smodel][idx][skeyDesc] + "( )";
                                    this.getOwnerComponent().getModel("dataModel").getData()[smodel][idx][skey] = svalue;
                                }
                                else if (this.getOwnerComponent().getModel("dataModel").getData()[smodel][idx][skey] !== "" && this.getOwnerComponent().getModel("dataModel").getData()[smodel][idx][skeyDesc] === "") {
                                    svalue = this.getOwnerComponent().getModel("dataModel").getData()[smodel][idx][skeyDesc] + "(" + this.getOwnerComponent().getModel("dataModel").getData()[smodel][idx][sField] + ")";
                                    this.getOwnerComponent().getModel("dataModel").getData()[smodel][idx][skey] = svalue;
                                }
                            }
                        }
                    }
                    else {
                        if (this.getOwnerComponent().getModel("dataModel").getData()[smodel] !== undefined
                            && this.getOwnerComponent().getModel("dataModel").getData()[smodel][skeyDesc] !== undefined) {
                            if (this.getOwnerComponent().getModel("dataModel").getData()[smodel][skeyDesc] !== "") {
                                svalue = this.getOwnerComponent().getModel("dataModel").getData()[smodel][skeyDesc] + "(" + this.getOwnerComponent().getModel("dataModel").getData()[smodel][sField] + ")";
                                this.getOwnerComponent().getModel("dataModel").getData()[smodel][skey] = svalue;
                            }
                        }
                    }
                }
            })
        },
        onReadOData: function (sPath, oFiltersp, f4flag, oFiltersp1, sdec) {
            var sPath = sPath;
            var oFilters = oFiltersp;
            var oFiltersp = oFiltersp;
            if (f4flag === 'X') {
                var oFilters = [];
            }
            this.sdec = sdec;
            var sexpand = '';
            this.f4flag = f4flag;
            if (sPath.indexOf("VendorCreateSet") !== -1) {
                sexpand = "CompanyCode,BankDetails,PurchaseOrg,IdentficationNumbers,TaxNumbers,Certicates,ContactDetails,Attachments";
            }
            return new Promise(function (resolve, reject) {
                var oModel = this.getOwnerComponent().getModel("odata1");
                oModel.read(sPath, {
                    filters: oFiltersp || [],
                    urlParameters: {
                        "$expand": sexpand
                    },
                    success: function (oData) {

                        if (this.f4flag === 'X') {
                            this.f4flag = '';
                            if (oFiltersp1[0] !== undefined && oFiltersp1[0].sPath === "StructureGroup") {
                                oFiltersp1[0].sPath = "StructurGroup";
                            }
                            var sfltvl = [];
                            if (oFiltersp1[0].sPath === 'Region') {
                                var sfiltervalue = oData.results.filter(filtr => filtr[oFiltersp[0].sPath] === oFiltersp[0].oValue1);
                                if (sfiltervalue.length > 0) {
                                    var sdec = "";

                                    if (sfiltervalue[0].Description !== undefined) {
                                        var sdec = sfiltervalue[0].Description;
                                    } else {
                                        var sdec = sfiltervalue[0][this.sdec];
                                    }
                                    var svl = {
                                        "field": sfiltervalue[0][oFiltersp1[0].sPath],
                                        "description": sdec
                                    };
                                    sfltvl.push(svl);
                                    resolve(sfltvl);
                                } else {
                                    resolve("E-Incorrect Entry");
                                }
                            }
                            else {
                                var sfiltervalue = oData.results.filter(filtr => filtr[oFiltersp1[0].sPath] === oFiltersp1[0].oValue1);
                                if (sfiltervalue.length > 0) {
                                    var sdec = "";

                                    if (sfiltervalue[0].Description !== undefined) {
                                        var sdec = sfiltervalue[0].Description;
                                    } else {
                                        var sdec = sfiltervalue[0][this.sdec];
                                    }
                                    var svl = {
                                        "field": sfiltervalue[0][oFiltersp1[0].sPath],
                                        "description": sdec
                                    };
                                    sfltvl.push(svl);
                                    resolve(sfltvl);
                                } else {
                                    resolve("E-Incorrect Entry");
                                }
                            }
                        } else {
                            resolve(oData);
                        }
                    }.bind(this),
                    error: function (oError) {
                        var oMsg = JSON.parse(oError.responseText);
                        resolve("E-" + oMsg.error.message.value);
                    }.bind(this)
                });
            }.bind(this));
        },

        formatDescription: function (sreturn, sreturndesc) {
            var sreturn = sreturndesc + "(" + sreturn + ")";
            return sreturn;
        },

        onPostRequest: function (saction, svalidate, stype) {
            var oLocalModel = this.getView().getModel("dataModel");
            var sreno = oLocalModel.getData().VendorCreate.RequestNumber;
            var oRawData = JSON.parse(JSON.stringify(oLocalModel.getData()));
            var oPayload = oRawData.VendorCreate;
            var oporg = [];
            oporg.push(oRawData.PurchaseOrgData);


            oPayload.CompanyCode = oRawData.CompanyCodeData;
            oPayload.BankDetails = oRawData.BankData;
            oPayload.PurchaseOrg = oporg;
            oPayload.IdentficationNumbers = oRawData.IdentifiNumbers;
            oPayload.TaxNumbers = oRawData.TaxNumbersData;
            oPayload.Certicates = oRawData.Certificates;
            oPayload.ContactDetails = oRawData.ContactPerson;

            oPayload.ContactDetails.forEach((r, idbx) => {
                if (r.ValidTo !== undefined && r.ValidTo.indexOf("-") !== -1) {
                    r.ValidTo = r.ValidTo.replace(/-/g, "");
                }
            })

            //begin bank data from contacts
            oRawData.ContactBankData.forEach((r, idbx) => {
                r.Type = "C";
                if (r.BankCountry !== '' && r.BankKey != "") {
                    oPayload.BankDetails.push(r);
                }
            })
            // oPayload.BankDetails.concat(oRawData.ContactBankData);
            //begin bank data from contacts

            oPayload.BankDetails.forEach((r, idbx) => {
                r.BankId = idbx.toString();
                if (r.Indicator === false) {
                    r.Indicator = "";
                } else if (r.Indicator === true) {
                    r.Indicator = "X";
                }
            })

            oPayload.PurchaseOrg.forEach(r => {
                if (r.Indicator === false) {
                    r.Indicator = "";
                } else if (r.Indicator === true) {
                    r.Indicator = "X";
                }
            })

            oPayload.Certicates.forEach(r => {
                if (r.MainCert === false) {
                    r.MainCert = "";
                } else if (r.MainCert === true) {
                    r.MainCert = "X";
                }

                if (r.CreditValidTo !== undefined && r.CreditValidTo.indexOf("-") !== -1) {
                    r.CreditValidTo = r.CreditValidTo.replace(/-/g, "");
                }
            })

            oPayload.IdentficationNumbers.forEach(r => {
                if (r.EntryDate === null) {
                    r.EntryDate = "";
                }
                if (r.ValidTo === null) {
                    r.ValidTo = "";
                }
            })

            oPayload.Certicates.forEach(r => {
                if (r.CreditValidFrom === null) {
                    r.CreditValidFrom = "";
                }
                if (r.CreditValidTo === null) {
                    r.CreditValidTo = "";
                }
                if (r.DateOfIssue === null) {
                    r.DateOfIssue = "";
                }
                if (r.Date1 === null) {
                    r.Date1 = "";
                }
                if (r.Date2 === null) {
                    r.Date2 = "";
                }
            })


            var oarrc = [];
            oarrc.push(oPayload.CompanyCode);
            oPayload.CompanyCode = oarrc;

            //BEGIN of remove the description SAUDI(SA) to SA
            var aF4Fields = Object.keys(this.oF4Mapping);
            aF4Fields.forEach(function (sField) {
                if (typeof oPayload[sField] === "string" && oPayload[sField]) {
                    oPayload[sField] = this._extractKey(oPayload[sField]);
                }
            }.bind(this));

            Object.keys(oPayload.CompanyCode[0]).forEach(function (sField) {
                if (typeof oPayload.CompanyCode[0][sField] === "string" && oPayload.CompanyCode[0][sField]) {
                    oPayload.CompanyCode[0][sField] = this._extractKey(oPayload.CompanyCode[0][sField]);
                }
            }.bind(this));

            Object.keys(oPayload.PurchaseOrg[0]).forEach(function (sField) {
                if (typeof oPayload.PurchaseOrg[0][sField] === "string" && oPayload.PurchaseOrg[0][sField]) {
                    oPayload.PurchaseOrg[0][sField] = this._extractKey(oPayload.PurchaseOrg[0][sField]);
                }
            }.bind(this));

            ["BankDetails", "IdentficationNumbers", "TaxNumbers", "Certicates", "ContactDetails"].forEach(function (sTableKey) {
                if (Array.isArray(oPayload[sTableKey])) {
                    oPayload[sTableKey].forEach(function (oRow) {
                        aF4Fields.forEach(function (sField) {
                            if (typeof oRow[sField] === "string" && oRow[sField]) {
                                oRow[sField] = this._extractKey(oRow[sField]);
                            }
                        }.bind(this));
                    }.bind(this));
                }
            }.bind(this));

            if (oPayload.Vendor === "") {
                oPayload.Vendor = this.getView().getModel("dataModel").getData().VendorCreate.Vendor;
            }
            oPayload.TitleKey = this._extractKey(oPayload.TitleKey);
            //END 
            oPayload.SaveAction = saction;

            if (stype === "CR") {//Create New
                // if (oPayload.RequestNumber !== "") {
                //     oPayload.Action = "C";
                // } else {
                //     oPayload.Action = "I";
                // }
                oPayload.Action = "I";
            }

            if (stype === "CH") {//Change
                oPayload.Action = "C";
            }
            if (stype === "EX") {//Change
                oPayload.Action = "E";
            }

            this.saction = saction;
            if (svalidate !== "" && svalidate === 'V') {
                oPayload.SaveAction = "V";
                this.saction = "V";
            }
            oPayload.Attachments = [];

            if (this.getOwnerComponent().getModel("LocalModel").getData().RequestType === "CH" ||
                this.getOwnerComponent().getModel("LocalModel").getData().RequestType === "EX") {
                if (this.getView().getModel("HeaderCpy").getData().BankDataEnable === false) {
                    delete oPayload.BankDetails;
                }
                if (this.getView().getModel("HeaderCpy").getData().PurchaseOrgDataEnable === false) {
                    delete oPayload.PurchaseOrg;
                }
                if (this.getView().getModel("HeaderCpy").getData().IdentifiNumbersEnable === false) {
                    delete oPayload.IdentficationNumbers;
                }
                if (this.getView().getModel("HeaderCpy").getData().TaxNumbersDataEnable === false) {
                    delete oPayload.TaxNumbers;
                }
                if (this.getView().getModel("HeaderCpy").getData().CertificatesEnable === false) {
                    delete oPayload.Certicates;
                }
                if (this.getView().getModel("HeaderCpy").getData().ContactDetailsEnable === false) {
                    delete oPayload.ContactDetails;
                }

                if (this.getView().getModel("HeaderCpy").getData().VendorCreateEnable === false) {
                    Object.keys(oPayload).forEach(r => {
                        if (Array.isArray(oPayload[r]) === false) {
                            if (r !== "RequestNumber"
                                && r !== "SaveAction"
                                && r !== "Action"
                                && r !== "Vendor") {
                                oPayload[r] = "";
                            }
                        }
                    })
                }
                delete oPayload.__metadata;
                delete oPayload.ValidateData;
            }

            if (oPayload.CompanyCode[0].ChkDoubleInv === true) {
                oPayload.CompanyCode[0].ChkDoubleInv = "X";
            } else {
                oPayload.CompanyCode[0].ChkDoubleInv = "";
            }
            if (oPayload.CompanyCode[0].ClrgWithVend === true) {
                oPayload.CompanyCode[0].ClrgWithVend = "X";
            } else {
                oPayload.CompanyCode[0].ClrgWithVend = "";
            }

            // if(oPayload.RequestNumber === "" && this.getOwnerComponent().getModel("LocalModel").getData().RequestNumber !== ""){
            //     oPayload.RequestNumber = this.getOwnerComponent().getModel("LocalModel").getData().RequestNumber;
            // }
            oPayload.RequestNumber = sreno;
            var oODataModel = this.getOwnerComponent().getModel();
            this.getView().setBusy(true);
            debugger;
            oODataModel.create("/VendorCreateSet", oPayload, {
                success: function (oData, response) {
                    debugger;
                    this.getView().setBusy(false);
                    if (this.saction === 'V') {
                        if (oData.Message !== "") {
                            MessageBox.error(oData.Message);
                            var oViewModel = this.getView().getModel("ui");
                            oViewModel.setProperty("/isEditable", true);
                            oViewModel.setProperty("/isValidated", true);
                            this.getView().getModel("ui").setProperty("/isSubmit", false);
                        } else {
                            MessageBox.success("Validation successfull");
                            var oViewModel = this.getView().getModel("ui");
                            oViewModel.setProperty("/isEditable", true);
                            oViewModel.setProperty("/isValidated", true);
                            this.getView().getModel("ui").setProperty("/isSubmit", true);
                        }
                    }
                    if (oData.RequestNumber !== '' && this.saction !== 'V') {
                        var smsg = "Vendor Request ";
                        if (this.saction === 'S') {
                            smsg = smsg + "submitted with request no." + oData.RequestNumber;
                        } else if (this.saction === 'D') {
                            smsg = smsg + "saved with request no." + oData.RequestNumber;
                        }
                        if (this.saction === 'S' || this.saction === 'D') {
                            var that = this;
                            MessageBox.information(smsg, {
                                onClose: function (oAction) {
                                    if (oAction === MessageBox.Action.OK) {
                                        that.onNavBack();
                                    }
                                }
                            });
                        }
                    }
                    // var sNewRecordNo = oData.RecordNo;
                    // var aPendingFiles = this.getView().getModel("ui").getProperty("/pendingFiles");

                    // if (aPendingFiles && aPendingFiles.length > 0) {
                    //     sap.m.MessageToast.show("Request created! Uploading attachments...");
                    //     this._uploadFilesInSequence(sNewRecordNo, aPendingFiles, 0);
                    // } else {
                    //     this.getView().setBusy(false);
                    //     sap.m.MessageToast.show("Request successfully created!");
                    //     this.onNavBack();
                    // }
                }.bind(this),
                error: function (oError) {
                    debugger;
                    this.getView().setBusy(false);
                    try {
                        var oMsg = JSON.parse(oError.responseText);
                        sap.m.MessageBox.error(oMsg.error.message.value);
                    } catch (e) {
                        sap.m.MessageBox.error("An error occurred while creating the request.");
                    }
                }.bind(this)
            });
        },

        onRequestNumberF4: function (oEvent) {
            var oInput = oEvent.getSource();
            // This grabs your backend OData model
            var oModel = this.getOwnerComponent().getModel();

            if (!this._oReqNumDialog) {
                this._oReqNumDialog = new sap.m.TableSelectDialog({
                    title: "Select Request Number",
                    columns: [
                        new sap.m.Column({ header: new sap.m.Label({ text: "Request Number" }) }),
                        new sap.m.Column({ header: new sap.m.Label({ text: "Status" }) }),
                        new sap.m.Column({ header: new sap.m.Label({ text: "Description" }) })
                    ],
                    search: function (oEvt) {
                        var sValue = oEvt.getParameter("value");
                        var aFilters = sValue ? [new sap.ui.model.Filter("RequestNumber", sap.ui.model.FilterOperator.Contains, sValue)] : [];
                        oEvt.getSource().getBinding("items").filter(aFilters);
                    },
                    confirm: function (oEvt) {
                        var oSelectedItem = oEvt.getParameter("selectedItem");
                        if (oSelectedItem && this._oActiveReqInput) {
                            var sReqId = oSelectedItem.getCells()[0].getText();
                            this._oActiveReqInput.setValue(sReqId);
                            this._oActiveReqInput.setValueState(sap.ui.core.ValueState.None);
                            this._fetchRequestData(sReqId);
                        }
                    }.bind(this)
                });
                this.getView().addDependent(this._oReqNumDialog);
                this._oReqNumDialog.setModel(oModel);
            }

            this._oActiveReqInput = oInput;
            var stype = this.getOwnerComponent().getModel("LocalModel").getData().RequestType;
            var aInitialFilters = [];
            aInitialFilters.push(new sap.ui.model.Filter('Status', sap.ui.model.FilterOperator.EQ, stype))
            this._oReqNumDialog.bindAggregation("items", {
                path: "/RequestNumberF4Set",
                template: new sap.m.ColumnListItem({
                    cells: [
                        new sap.m.Text({ text: "{RequestNumber}" }),
                        new sap.m.Text({ text: "{Status}" }),
                        new sap.m.Text({ text: "{Description}" })
                    ]
                }),
                filters: aInitialFilters
                // parameters: { operationMode: sap.ui.model.odata.OperationMode.Client }
            });

            this._oReqNumDialog.open();
        },

        _fetchRequestData: function (sReqId) {
            this.onReadOData("/VendorCreateSet(RequestNumber='" + sReqId + "')", null).then((oresponse) => {
                this.getDescription(oresponse);
                this.getView().getModel("dataModel").getData().VendorCreate.Status = 'DRAFT';
                this.getView().getModel("dataModel").refresh(true);

                this.getOwnerComponent().getModel("LocalModel").setProperty("/RequestNumber", this.getView().getModel("dataModel").getData().VendorCreate.RequestNumber);
                var svl = this.getOwnerComponent().getModel("LocalModel").getData().RequestType;
                this.getOwnerComponent().getModel("LocalModel").setProperty("/RequestType", svl);
                this.getOwnerComponent().getModel("LocalModel").refresh(true);
            });
        },

        _extractKey: function (vValue) {
            if (typeof vValue !== "string") {
                return vValue;
            }
            var aMatch = vValue.match(/\(([^()]+)\)$/);
            return aMatch ? aMatch[1].trim() : vValue.trim();
        },

        onAddContact: function () {
            var oModel = this.getView().getModel("dataModel");
            var aContacts = oModel.getProperty("/ContactPerson") || [];
            var ocpy = this.getModel("dataModelCpy").getData().ContactPerson[0];
            aContacts.push(ocpy);
            oModel.setProperty("/ContactPerson", aContacts);
            oModel.refresh(true);
        },

        onDeleteContact: function (oEvent) {
            var oModel = this.getView().getModel("dataModel");
            var aContacts = oModel.getProperty("/ContactDetails") || [];

            if (aContacts.length <= 1) {
                sap.m.MessageToast.show("You must have at least one contact.");
                return;
            }

            var sPath = oEvent.getSource().getBindingContext("dataModel").getPath();
            var iIndex = parseInt(sPath.split("/").pop(), 10);
            aContacts.splice(iIndex, 1);
            oModel.setProperty("/ContactDetails", aContacts);
            oModel.refresh(true);
        },

        formatRequestType: function (svalue) {
            var svalue = svalue;
            if (svalue === "CR") {
                svalue = "Create Request"
            }
            else if (svalue === "CH") {
                svalue = "Change Request"
            }
            else if (svalue === "EX") {
                svalue = "Extend Request"
            }
            return svalue;
        }


    })
});