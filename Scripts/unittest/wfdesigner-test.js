QUnit.module("class WfDesigner", {
    setup: function () {
        $('#qunit-fixture').append(
          '<div class="wfdesigner"></div>'
          );
    }
});

test('create the wfdesigner widget instance', function () {
    seq = 'a'
    wfdesigner = $('.wfdesigner').WfDesigner({
        matedatas: [{
            GetActivityMetadatas: function () {
                seq += 'b';
            },
            GetToolboxItems: function () {
                seq += 'c';
            }
        }]
    });
    seq += 'z'
    equal(seq, 'abcz');
    widget = wfdesigner.data('WfDesigner');
    notEqual(widget.activityBuilder, null);
    notEqual(widget.viewer, null);
    notEqual(widget.toolbox, null);
    notEqual(widget.toolbar, null);
    notEqual(widget.statusbar, null);
});


QUnit.module('ActivityBuilder', function () {

});

test('RegisterActivity', function () {
    ab = new ActivityBuilder();
    notEqual(ab, null);
    ab.RegisterActivity({
        namespace: 'http://test',
        defaultPrefix: 'x',
        name: 'TestActivity',
        render: function () {
        }
    });

    equal(ab.namespaceTable['http://test'], 'x');
    notEqual(ab.metadatas['x:TestActivity'], undefined);
});

test('RegisterActivity with same namespace but different prefix', function () {
    ab = new ActivityBuilder();
    notEqual(ab, null);
    ab.RegisterActivity({
        namespace: 'http://test',
        defaultPrefix: 'x',
        name: 'TestActivity1',
        render: function () {
        }
    });
    ab.RegisterActivity({
        namespace: 'http://test',
        defaultPrefix: 'z',
        name: 'TestActivity2',
        render: function () {
        }
    });
    equal(ab.namespaceTable['http://test'], 'x');
    notEqual(ab.metadatas['x:TestActivity1'], undefined);
    notEqual(ab.metadatas['x:TestActivity2'], undefined);
    equal(ab.metadatas['z:TestActivity2'], undefined);
});

test('RegisterActivity with different namespace', function () {
    ab = new ActivityBuilder();

    ab.RegisterActivity({
        namespace: 'http://test1',
        defaultPrefix: 'x',
        name: 'TestActivity1',
        render: function () {
        }
    });
    ab.RegisterActivity({
        namespace: 'http://test2',
        defaultPrefix: 'z',
        name: 'TestActivity2',
        render: function () {
        }
    });

    equal(ab.namespaceTable['http://test1'], 'x');
    equal(ab.namespaceTable['http://test2'], 'z');

    notEqual(ab.metadatas['x:TestActivity1'], undefined);
    equal(ab.metadatas['z:TestActivity1'], undefined);

    notEqual(ab.metadatas['z:TestActivity2'], undefined);
    equal(ab.metadatas['x:TestActivity2'], undefined);
});

test('RegisterActivity with empty namespace and empty prefix', function () {
    ab = new ActivityBuilder();
    ab.RegisterActivity({
        name: 'TestActivity',
        render: function () {
        }
    });
    equal(ab.namespaceTable[''], '');
    notEqual(ab.metadatas['TestActivity'], undefined);
});

test('RegisterActivity with namespace and empty prefix', function () {
    ab = new ActivityBuilder();
    ab.RegisterActivity({
        namespace: 'http://test',
        name: 'TestActivity',
        render: function () {
        }
    });
    equal(ab.namespaceTable['http://test'], '');
    notEqual(ab.metadatas['TestActivity'], undefined);

});
test('CreateActivity', function () {
    ab = new ActivityBuilder();
    ab.RegisterActivity({
        namespace: 'http://test',
        name: 'TestActivity',
        render: function () {
        }
    });

    a = ab.CreateActivity({
            name: 'TestActivity'
        });
    notEqual(a, undefined);
    equal(a.GetXaml(), '<TestActivity/>')
});

test('CreateActivity with namespace prefix', function () {
    ab = new ActivityBuilder();
    ab.RegisterActivity({
        defaultPrefix: 'x',
        namespace: 'http://test',
        name: 'TestActivity',
        render: function () {
        }
    });

    equal(ab.rootActivity.GetXaml(), '<Activity xmlns="http://schemas.microsoft.com/netfx/2009/xaml/activities" xmlns:mv="clr-namespace:Microsoft.VisualBasic;assembly=System" xmlns:mva="clr-namespace:Microsoft.VisualBasic.Activities;assembly=System.Activities" xmlns:s="clr-namespace:System;assembly=mscorlib" xmlns:s1="clr-namespace:System;assembly=System" xmlns:s2="clr-namespace:System;assembly=System.Xml" xmlns:s3="clr-namespace:System;assembly=System.Core" xmlns:scg="clr-namespace:System.Collections.Generic;assembly=System" xmlns:scg1="clr-namespace:System.Collections.Generic;assembly=System.ServiceModel" xmlns:scg2="clr-namespace:System.Collections.Generic;assembly=System.Core" xmlns:scg3="clr-namespace:System.Collections.Generic;assembly=mscorlib" xmlns:sd="clr-namespace:System.Data;assembly=System.Data" xmlns:sl="clr-namespace:System.Linq;assembly=System.Core" xmlns:st="clr-namespace:System.Text;assembly=mscorlib" xmlns:x="http://schemas.microsoft.com/winfx/2006/xaml" mva:VisualBasic.Settings="Assembly references and imported namespaces for internal implementation"/>');
    
    a = ab.CreateActivity({
    name: 'TestActivity',
    namespace: 'http://test'
    });
    notEqual(a, undefined);
    equal(a.GetXaml(), '<x:TestActivity/>')
    equal(ab.rootActivity.GetXaml(), '<Activity xmlns=\"http://schemas.microsoft.com/netfx/2009/xaml/activities\" xmlns:mv=\"clr-namespace:Microsoft.VisualBasic;assembly=System\" xmlns:mva=\"clr-namespace:Microsoft.VisualBasic.Activities;assembly=System.Activities\" xmlns:s=\"clr-namespace:System;assembly=mscorlib\" xmlns:s1=\"clr-namespace:System;assembly=System\" xmlns:s2=\"clr-namespace:System;assembly=System.Xml\" xmlns:s3=\"clr-namespace:System;assembly=System.Core\" xmlns:scg=\"clr-namespace:System.Collections.Generic;assembly=System\" xmlns:scg1=\"clr-namespace:System.Collections.Generic;assembly=System.ServiceModel\" xmlns:scg2=\"clr-namespace:System.Collections.Generic;assembly=System.Core\" xmlns:scg3=\"clr-namespace:System.Collections.Generic;assembly=mscorlib\" xmlns:sd=\"clr-namespace:System.Data;assembly=System.Data\" xmlns:sl=\"clr-namespace:System.Linq;assembly=System.Core\" xmlns:st=\"clr-namespace:System.Text;assembly=mscorlib\" xmlns:x=\"http://schemas.microsoft.com/winfx/2006/xaml\" mva:VisualBasic.Settings=\"Assembly references and imported namespaces for internal implementation\"><x:TestActivity/></Activity>');
    /**/
});    


QUnit.module('WfViewer',  {
    setup: function () {
        $('#qunit-fixture').append(
          '<div class="wfviewer"></div>'
          );
    }
});

test('RenderActivity', function(){
	wfviewer = $('.wfviewer').WfViewer();
	notEqual(wfviewer, undefined);
	widget = wfviewer.data('WfViewer');
	notEqual(widget, undefined);
	seq = 'a';
	activity = {
		Render: function(){
			seq += 'b';
			return '<div id="a1"></div>';
		}
	};
	widget.RenderActivity(activity);
	seq += 'c';	
	equal(seq, 'abc');
	equal(wfviewer.html(), '<div id="a1"></div>');
});
