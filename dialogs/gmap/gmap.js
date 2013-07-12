
(function(){

    function $G( id ) {
        return document.getElementById( id );
    }

    UE.registerWidget('gmap',{

        tpl: "<style type=\"text/css\">" +
            ".edui-gmap-content{width:530px; height: 350px;margin: 10px auto;}" +
            ".edui-gmap-content table{width: 100%}" +
            ".edui-gmap-content table td{vertical-align: middle;}" +
            "#eduiGMapAddress{width:220px;height:21px;background: #FFF;border:1px solid #d7d7d7; line-height: 21px;}" +
            "</style>" +
            "<div class=\"edui-gmap-content\">" +
            "<table>" +
            "<tr>" +
            "<td><label for=\"eduiGMapAddress\"><%=lang_input_address%></label></td>" +
            "<td><input id=\"eduiGMapAddress\" type=\"text\" value=\"<%=address.value%>\"/></td>" +
            "<td><a id=\"eduiGMapDoSearch\" href=\"javascript:void(0)\" class=\"edui-gmap-button\"><%=lang_input_search%></a></td>" +
            "</tr>" +
            "</table>" +
            "<div id=\"eduiGMapContainer\" style=\"width: 100%; height: 340px;margin: 5px auto; border: 1px solid gray;\"></div>" +
            "</div>" +
            "<iframe style=\"display: none;\" src=\"<%=gmap_home_url%>/proxy.html\"></iframe>",
        initContent:function( editor, $widget ){

            var me = this,
                lang = editor.getLang( 'gmap' ),
                options = $.extend( {}, lang['static'], {
                    gmap_home_url: UEDITOR_CONFIG.UEDITOR_HOME_URL + '/dialogs/gmap/'
                } );

            me.lang = lang;
            me.editor = editor;
            me.root().html( $.parseTmpl( me.tpl, options ) );

        },
        initGMap: function( google ){

            var map = new google.maps.Map( $G("eduiGMapContainer"), {
                zoom: 3,
                streetViewControl: false,
                scaleControl: true,
                mapTypeId: google.maps.MapTypeId.ROADMAP
            }),
            me = this,
            imgcss,
            marker = new google.maps.Marker({
                map: map,
                draggable: true
            }),
            img = me.editor.selection.getRange().getClosedNode();

            me.google = google;
            me.map = map;
            me.marker = marker;

            if(img && img.src.indexOf("http://maps.google.com/maps/api/staticmap")!=-1){
                var url = img.getAttribute("src");
                var centers = me.getPars(url,"center").split(",");
                point = new google.maps.LatLng(Number(centers[0]),Number(centers[1]));
                map.setCenter(point);
                map.setZoom(Number(getPars(url,"zoom")));
                centers = me.getPars(url,"markers").split(",");
                marker.setPosition(new google.maps.LatLng(Number(centers[0]),Number(centers[1])));
                imgcss = img.style.cssText;
            }else{
                setTimeout(function(){
                    me.doSearch();
                },30)
            }

        },
        doSearch: function(){
            var address = $G("eduiGMapAddress").value,
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

            $G('eduiGMapAddress').onkeydown = function (evt){
                evt = evt || event;
                if (evt.keyCode == 13) {
                    me.doSearch();
                }
            };

            $G("eduiGMapDoSearch").onclick = function(){
                me.doSearch();
            };

        },
        width:580,
        height:498,
        buttons: {
            ok: {
                exec: function( editor, $widget ){


                    debugger;
                    var widget = $widget.edui(),
                        center = widget.map.getCenter(),
                        point = widget.marker.getPosition(),
                        url = "http://maps.google.com/maps/api/staticmap?center=" + center.lat() + ',' + center.lng() + "&zoom=" + map.zoom + "&size=520x340&maptype=" + map.getMapTypeId() + "&markers=" + point.lat() + ',' + point.lng() + "&sensor=false";

                    editor.execCommand('inserthtml', '<img width="520" height="340" src="' + url + '"' + (imgcss ? ' style="' + imgcss + '"' :'') + '/>');

                }
            },
            cancel: {}
        }
    });

})();

