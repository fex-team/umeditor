
(function(){

    var widgetName = 'map';

    function $G( id ) {
        return document.getElementById( id );
    }

    UE.registerWidget( widgetName,{

        tpl: "<style type=\"text/css\">" +
            ".edui-map-content{width:530px; height: 350px;margin: 10px auto;}" +
            ".edui-map-content table{width: 100%}" +
            ".edui-map-content table td{vertical-align: middle;}" +
            "#eduiMapCity,#eduiMapAddress{height:21px;background: #FFF;border:1px solid #d7d7d7; line-height: 21px;}" +
            "#eduiMapCity{width:90px}" +
            "#eduiMapAddress{width:220px}" +
            "</style>" +
            "<div class=\"edui-map-content\">" +
            "<table>" +
            "<tr>" +
            "<td><%=lang_city%>:</td>" +
            "<td><input id=\"eduiMapCity\" type=\"text\" /></td>" +
            "<td><%=lang_address%>:</td>" +
            "<td><input id=\"eduiMapAddress\" type=\"text\" value=\"\" /></td>" +
            "<td><a class=\"edui-map-button\"><%=lang_search%></a></td>" +
            "</tr>" +
            "</table>" +
            "<div style=\"width:100%;height:340px;margin:5px auto;border:1px solid gray\" id=\"eduiMapContainer\"></div>" +
            "</div>" +
            "<iframe style=\"display: none;\" src=\"<%=map_home_url%>/proxy.html\"></iframe>",
        initContent:function( editor, $widget ){

            var me = this,
                lang = editor.getLang( widgetName ),
                options = $.extend( {}, lang['static'], {
                    map_home_url: UEDITOR_CONFIG.UEDITOR_HOME_URL + '/dialogs/'+ widgetName +'/'
                } );

            me.lang = lang;
            me.editor = editor;
            me.root().html( $.parseTmpl( me.tpl, options ) );

        },
        requestMapApi: function( src ){

            var me = this;

            if( src.length  ) {

                var _src = src[0];

                src = src.slice( 1 );

                if( _src ) {
                    $.getScript( _src, function(){
                        me.requestMapApi( src );
                    } );
                } else {
                    me.requestMapApi( src );
                }

            } else {

                me.initBaiduMap();

            }


        },
        initBaiduMap: function(){

            var map = new BMap.Map( $G("eduiMapContainer") ),
                me = this,
                marker,
                point,
                imgcss,
                img = me.editor.selection.getRange().getClosedNode();

            map.enableInertialDragging();
            map.enableScrollWheelZoom();
            map.enableContinuousZoom();

            if(img && /api[.]map[.]baidu[.]com/ig.test(img.getAttribute("src"))){
                var url = img.getAttribute("src"),centers;
                centers = me.getPars(url,"center").split(",");
                point = new BMap.Point(Number(centers[0]),Number(centers[1]));
                map.addControl(new BMap.NavigationControl());
                map.centerAndZoom(point, Number(getPars(url,"zoom")));
                imgcss = img.style.cssText;
            }else{
                point = new BMap.Point(116.404, 39.915);    // 创建点坐标
                map.addControl(new BMap.NavigationControl());
                map.centerAndZoom(point, 10);                     // 初始化地图,设置中心点坐标和地图级别。
            }
            marker = new BMap.Marker(point);
            marker.enableDragging();
            map.addOverlay(marker);

            me.initEvent();

        },
        doSearch: function(){
            if (!$G('city').value) {
                alert(lang.cityMsg);
                return;
            }
            var search = new BMap.LocalSearch(document.getElementById('city').value, {
                onSearchComplete: function (results){
                    if (results && results.getNumPois()) {
                        var points = [];
                        for (var i=0; i<results.getCurrentNumPois(); i++) {
                            points.push(results.getPoi(i).point);
                        }
                        if (points.length > 1) {
                            map.setViewport(points);
                        } else {
                            map.centerAndZoom(points[0], 13);
                        }
                        point = map.getCenter();
                        marker.setPoint(point);
                    } else {
                        alert(lang.errorMsg);
                    }
                }
            });
            search.search($G('address').value || $G('city').value);
        },
        getPars: function(str,par){
            var reg = new RegExp(par+"=((\\d+|[.,])*)","g");
            return reg.exec(str)[1];
        },
        initEvent:function(){

            var me = this;

            $G('eduiMapAddress').onkeydown = function (evt){
                evt = evt || event;
                if (evt.keyCode == 13) {
                    me.doSearch();
                }
            };

//            dialog.onok = function (){
//                var center = map.getCenter();
//                var zoom = map.zoomLevel;
//                var size = map.getSize();
//                var point = marker.getPoint();
//                var url = "http://api.map.baidu.com/staticimage?center=" + center.lng + ',' + center.lat +
//                    "&zoom=" + zoom + "&width=" + size.width + '&height=' + size.height + "&markers=" + point.lng + ',' + point.lat;
//                editor.execCommand('inserthtml', '<img width="'+ size.width +'"height="'+ size.height +'" src="' + url + '"' + (imgcss ? ' style="' + imgcss + '"' :'') + '/>');
//            };

            $G("eduiMapAddress").focus();

        },
        width:580,
        height:448
    });

})();

