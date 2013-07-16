
(function(){

    var widgetName = 'gmap';

    UE.registerWidget(widgetName,{

        tpl: "<style type=\"text/css\">" +
            ".edui-gmap-content{width:530px; height: 350px;margin: 10px auto;}" +
            ".edui-gmap-content table{width: 100%}" +
            ".edui-gmap-content table td{vertical-align: middle;}" +
            ".edui-gmap-button{float: left; cursor: default; height: 24px; width: 96px; margin: 0 10px; background-image: url(\"<%=theme_url%>/images/icons-all.gif\") ; background-position:0 0; font-size: 12px; line-height: 24px; text-align: center;}" +
            ".edui-gmap-button:hover {background-position:0 -30px;}" +
            "#eduiGMapAddress{width:220px;height:21px;background: #FFF;border:1px solid #d7d7d7; line-height: 21px;}" +
            "</style>" +
            "<div class=\"edui-gmap-content\">" +
            "<table>" +
            "<tr>" +
            "<td><label for=\"eduiGMapAddress\"><%=lang_input_address%></label></td>" +
            "<td><input id=\"eduiGMapAddress\" type=\"text\" value=\"<%=address.value%>\"/></td>" +
            "<td><a id=\"eduiGMapDoSearch\" class=\"edui-gmap-button\"><%=lang_input_search%></a></td>" +
            "</tr>" +
            "</table>" +
            "<div id=\"eduiGMapContainer\" style=\"width: 100%; height: 340px;margin: 5px auto; border: 1px solid gray;\"></div>" +
            "</div>" +
            "<iframe style=\"display: none;\" src=\"<%=gmap_home_url%>/proxy.html\"></iframe>",
        initContent:function( editor, $widget ){

            var me = this,
                lang = editor.getLang( widgetName ),
                options = $.extend( {}, lang['static'], {
                    theme_url: editor.options.themePath + editor.options.theme,
                    gmap_home_url: UEDITOR_CONFIG.UEDITOR_HOME_URL + '/dialogs/gmap/'
                } );

            me.lang = lang;
            me.editor = editor;
            me.root().html( $.parseTmpl( me.tpl, options ) );

        },
        initGMap: function( google ){

            var map = new google.maps.Map( $("#eduiGMapContainer")[0], {
                zoom: 3,
                streetViewControl: false,
                scaleControl: true,
                mapTypeId: google.maps.MapTypeId.ROADMAP
            }),
            me = this,
            imgcss,
            point,
            marker = new google.maps.Marker({
                map: map,
                draggable: true
            }),
            img = $(me.editor.selection.getRange().getClosedNode());
            if(img.length && img.attr("src").indexOf("http://maps.google.com/maps/api/staticmap")!=-1){
                var url = img.attr("src");
                var centerPos = me.getPars(url,"center").split(","),
                    markerPos = me.getPars(url,"markers").split(",");
                point = new google.maps.LatLng(Number(centerPos[0]),Number(centerPos[1]));
                map.setCenter(point);
                map.setZoom(Number(me.getPars(url,"zoom")));
                marker.setPosition(new google.maps.LatLng(Number(markerPos[0]),Number(markerPos[1])));
                imgcss = img.attr('style');
            }else{
                setTimeout(function(){
                    me.doSearch();
                },30)
            }

            me.google = google;
            me.map = map;
            me.marker = marker;
            me.imgcss = imgcss;

        },
        doSearch: function(){
            var address = $("#eduiGMapAddress").val(),
                me = this,
                google = me.google,
                geocoder = new google.maps.Geocoder();

            geocoder.geocode( { 'address': address}, function (results, status) {
                if (status == google.maps.GeocoderStatus.OK) {
                    var bounds = results[0].geometry.viewport;
                    me.map.fitBounds(bounds);
                    me.marker.setPosition(results[0].geometry.location);
                    me.marker.setTitle(address);
                } else alert(me.lang.searchError);
            });
        },
        getPars: function(str,par){
            var reg = new RegExp(par+"=((\\d+|[.,])*)","g");
            return reg.exec(str)[1];
        },
        initEvent:function(){

            var me = this;

            $('#eduiGMapAddress').keydown(function (evt){
                evt = evt || event;
                if (evt.keyCode == 13) {
                    me.doSearch();
                }
            });

            $("#eduiGMapDoSearch").click(function(){
                me.doSearch();
            });

        },
        width:580,
        height:498,
        buttons: {
            ok: {
                exec: function( editor ){

                    var widget = UE.getWidgetData(widgetName),
                        center = widget.map.getCenter(),
                        point = widget.marker.getPosition(),
                        url = "http://maps.google.com/maps/api/staticmap?center=" + center.lat() + ',' + center.lng() + "&zoom=" + widget.map.zoom + "&size=520x340&maptype=" + widget.map.getMapTypeId() + "&markers=" + point.lat() + ',' + point.lng() + "&sensor=false";

                    editor.execCommand('inserthtml', '<img width="520" height="340" src="' + url + '"' + (widget.imgcss ? ' style="' + widget.imgcss + '"' :'') + '/>');

                }
            },
            cancel: {}
        }
    });

})();

