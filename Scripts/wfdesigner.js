
    /*
    DesignerMetadata
    */
    DesignerMetadata = function(){
    };
    DesignerMetadata.prototype = {

    };
    /*
    Activity
    */
    Activity = function (xmlNode) {
        this.xmlNode = xmlNode;
		
    }
    Activity.prototype = {

        GetXaml: function () {
            return this.xmlNode.xml || (new XMLSerializer()).serializeToString(this.xmlNode);
        }
    }
    /*
    ActivityBuilder
    */
    ActivityBuilder = function () {
        this.xmlDoc = $.parseXML('<Activity mva:VisualBasic.Settings="Assembly references and imported namespaces for internal implementation" xmlns="http://schemas.microsoft.com/netfx/2009/xaml/activities" xmlns:mv="clr-namespace:Microsoft.VisualBasic;assembly=System" xmlns:mva="clr-namespace:Microsoft.VisualBasic.Activities;assembly=System.Activities"  xmlns:s="clr-namespace:System;assembly=mscorlib" xmlns:s1="clr-namespace:System;assembly=System" xmlns:s2="clr-namespace:System;assembly=System.Xml" xmlns:s3="clr-namespace:System;assembly=System.Core" xmlns:scg="clr-namespace:System.Collections.Generic;assembly=System" xmlns:scg1="clr-namespace:System.Collections.Generic;assembly=System.ServiceModel" xmlns:scg2="clr-namespace:System.Collections.Generic;assembly=System.Core" xmlns:scg3="clr-namespace:System.Collections.Generic;assembly=mscorlib" xmlns:sd="clr-namespace:System.Data;assembly=System.Data" xmlns:sl="clr-namespace:System.Linq;assembly=System.Core" xmlns:st="clr-namespace:System.Text;assembly=mscorlib" xmlns:x="http://schemas.microsoft.com/winfx/2006/xaml" />');
        this.rootActivity = new Activity(this.xmlDoc.documentElement);
        this.metadatas = {};
        this.namespaceTable = {};
    };
    ActivityBuilder.prototype = {
        metadatas: {},
        namespaceTable: {},
        RegisterActivity: function (metadata) {
            namespace = metadata.namespace;
            if (typeof (namespace) == 'undefined') {
                namespace = '';
            }
            prefix = metadata.defaultPrefix;
            if (typeof (prefix) == 'undefined') {
                prefix = '';
            }
            if (typeof (this.namespaceTable[namespace]) == 'undefined') {
                this.namespaceTable[namespace] = prefix;
            } else {
                prefix = this.namespaceTable[namespace];
            }
            metaKey = metadata.name;
            if (prefix != '') {
                metaKey = prefix + ':' + metaKey;
            }

            this.metadatas[metaKey] = metadata;
        },
        CreateActivity: function (option) {
            activityName = option.name
            prefix = '';
            if (typeof (option.namespace) != 'undefined') {
                if (typeof (this.namespaceTable[option.namespace]) != 'undefined') {
                    prefix = this.namespaceTable[option.namespace]
                }
            }
            parentNode = null;
            if (typeof (option.parent) != 'undefined') {
                parentNode = option.parent.xmlNode;
            }
            xmlNode = null;
            if (parentNode === null) {
                parentNode = this.rootActivity.xmlNode;
            }

            qname = activityName;
            if (prefix != '') {
                qname = prefix + ':' + activityName;
                ns = this.rootActivity.xmlNode.getAttribute('xmlns:' + prefix);
                if (ns == null) {
                    this.rootActivity.xmlNode.setAttribute('xmlns:' + prefix, option.namespace);
                }
            }

            xmlNode = this.xmlDoc.createElement(qname);
            parentNode.appendChild(xmlNode);
            return new Activity(xmlNode);
        }
    }

    /*
    WfViewer
    */
    WfViewer = {
		RenderActivity: function(activity){
			html = activity.Render();
			this.element.html(html);
		}
    };
    WfToolbox = {
    };
    WfToolbar = {
    };
    WfStatusbar = {
    };
    WfDesigner = {
        activityBuilder: null,
        viewer: null,
        toolbox: null,
        toolbar: null,
        statusbar: null,
        _init: function () {
            this.activityBuilder = new ActivityBuilder();
            this.viewer = WfViewer;
            this.toolbox = WfToolbox;
            this.toolbar = WfToolbar;
            this.statusbar = WfStatusbar;
            if(this.options.matedatas.length > 0){
                for(var i=0; i<this.options.matedatas.length; i++){
                    meta = this.options.matedatas[i];
                    if(typeof(meta.GetActivityMetadatas) != 'undefined'){
                        activityMetas = meta.GetActivityMetadatas();
                        if (typeof(activityMetas) != 'undefined' && activityMetas.length > 0){
                            for(var n=0; n<activityMetas.length; n++){
                                this.activityBuilder.RegisterActivity(activityMetas[n]);
                            }
                        }
                    }
                    if(typeof(meta.GetToolboxItems) != 'undefined'){
                        toolboxItems = meta.GetToolboxItems();
                        if (typeof(toolboxItems) != 'undefined' && toolboxItems.length > 0){
                            for(var n=0; n<toolboxItems.length; n++){
                                this.toolbox.AddItem(toolboxItems[n]);
                            }
                        }
                    }
                }
            }
        },
        options:{
            metadatas : []
        }
    };
    $.widget('ui.WfDesigner', WfDesigner);
    $.widget('ui.WfViewer', WfViewer);