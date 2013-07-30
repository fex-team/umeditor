
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
            "<script class=\"edui-tpl-container\" type=\"text/plain\">" +
            "<!DOCTYPE html>" +
            "<html>" +
            "<head>" +
            "<title></title>" +
            "</head>" +
            "<body>" +
            "<scr_ipt>" +
            "window.onload = function(){" +
            "if ( window.google && window.google.maps && window.google.maps.Map && !this.loaded ) {" +
            "this.loaded = true;" +
            "parent.UE.getWidgetData(\'gmap\').initGMap( window.google );" +
            "}};" +
            "function mapReadyStateChange ( state ) { " +
            " if ( ( state === 'complete' || state === 'loaded' ) ) {" +
            "document.close();" +
            " } }" +
            "</scr_ipt>" +
            "<scr_ipt onreadystatechange='mapReadyStateChange(this.readyState);' src=\"https://maps.googleapis.com/maps/api/js?v=3.exp&sensor=false\"></scr_ipt>" +
            "<scr_ipt>if (!!+'\v1'){ document.close(); }</scr_ipt>" +
            "</body>" +
            "</html>" +
            "</script>",
        initContent:function( editor, $widget ){

            var me = this,
                lang = editor.getLang( widgetName ),
                options = $.extend( {}, lang['static'], {
                    theme_url: editor.options.themePath + editor.options.theme
                } );

            if( me.inited ) {
                me.preventDefault();
                return false;
            }

            me.inited = true;

            me._defaultCity = options.address.value;
            me.lang = lang;
            me.editor = editor;
            me.root().html( $.parseTmpl( me.tpl, options ) );

            me.initApi();

        },
        initApi: function () {

            var $ifr = $('<iframe style="display: none;"></iframe>');
                ifrdoc = null;

            $ifr.appendTo( this.root() );

            ifrdoc = $ifr[0].contentWindow.document;

            ifrdoc.open();
            ifrdoc.write( this.root().find( '.edui-tpl-container' ).html().replace(/scr_ipt/g, "script") );

        },
        initGMap: function( google ){

            var googleMap = google.maps.Map,
                map = new googleMap( $("#eduiGMapContainer")[0], {
                zoom: 3,
                streetViewControl: false,
                scaleControl: true,
                zoomControl: true,
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
                },30);
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
        reset: function(){
            var me = this,
                google = me.google;

            if( !me._center ) {

                new google.maps.Geocoder().geocode( { 'address': me._defaultCity }, function (results, status) {
                    if (status == google.maps.GeocoderStatus.OK) {
                        if( me._center ) {
                            return;
                        }
                        me._center = new google.maps.LatLng( results[0].geometry.location.jb, results[0].geometry.location.kb );
                        me.map.setCenter(me._center);
                        me.marker.setPosition( me._center );
                        me.map.panTo( me._center );
                    }
                });

            } else {
                me.map.setCenter(me._center);
                me.marker.setPosition( me._center );
                me.map.panTo( me._center );
                me.map.setZoom(3);
            }
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

                    editor.execCommand('inserthtml', '<img width="520" height="340" src="' + url + '"' + (widget.imgcss ? ' style="' + widget.imgcss + '"' :'') + '/>', true);
                }
            },
            cancel: {
                exec: function(){
                    UE.getWidgetData(widgetName).reset();
                }
            }
        }
    });

})();

