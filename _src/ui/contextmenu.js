//dropmenu 类
UE.ui.define('contextmenu',{
    tmpl:'<a tabindex="-1" href="#"><em class="edui-contextmenu-icon"><%if(icon){%><i class="edui-icon icon-<%=icon%>"></i><%}%></em><span class="edui-item-label"><%=label%></span><%if(shortkey){%><span class="muted edui-item-back"><%=shortkey%></span><span class="muted edui-item-right"><%=shortkey%><%}%></span></a>',
    defaultItem:{
        icon:'',
        label:'',
        shortkey:''
    },
    init : function(data){
        var emptyFn = function(){return 0};
        var me = this;
        var $root = this.root($('<ul class="dropdown-menu edui-contextmenu"></ul>'));
        $.each(data,function(i,v){
            if(v.divider){
                $root.append($('<li class="divider"></li>'));
            }else{
                if(v.data){
                    $('<li class="dropdown-submenu edui-contextsubmenu"><em class="edui-contextmenu-icon"></em><a tabindex="-1" href="#"><em class="edui-contextmenu-icon"></em>'+ v.label+'</a></li>').appendTo($root).data('submenu-data', v.data);
                }else {
                    var $li = $('<li '+( 'data-value="'+ (v.value|| v.label)+'" ')+'>'+ $.parseTmpl(me.tmpl, $.extend2(v,me.defaultItem,true)) +'</li>').appendTo($root).data('exec', v.exec||emptyFn).data('query', v.query||emptyFn);
                    if(v.widget){
                        $li.data('widget', v.widget)
                    }
                }

            }
        });
        $root.children('li').mouseover(function( evt ){
            var $this = $(this),widget,$submenu;
            if($this.hasClass('dropdown-submenu') || (widget = $this.data('widget'))){
                if(widget[0]){
                    if(!$.contains(this,widget[0])){
                        widget.appendTo($this)
                    }
                    $submenu = widget;
                }else{
                    var subdata = $this.data('submenu-data');

                    if(subdata){
                        $this.data('submenu-data','').data('submenu',$.eduicontextmenu(subdata).appendTo($root))
                    }
                    $submenu = $this.data('submenu');
                    $submenu.data('parentmenu',$this.parent());
                }
                if(!$this.hasClass('disabled')){

                    if( !$.contains( this, evt.fromElement ) ) {

                        $submenu.edui().show($this,'right','position',5,2);
                        $root.data('activesubmenu',$submenu);

                    }

                }

            }else{
                var sub = $root.data('activesubmenu');
                if(sub)
                    sub.edui().hide();
            }
        });
        me.register('mouseover',$root,function(){
//            var sub = $root.data('activesubmenu');
//            if(sub){
//                sub.edui().hide()
//            }
        });

        $root.children('li[class!="disabled divider dropdown-submenu"]').click(function(){
            me.hide(true);
            var $this = $(this);
            //增加一个参数， 传递当前的item dom对象
            $this.data('exec')($this.data('value'), this);

        });

        this.on('beforeshow',function(){
            this.root().children('li[class!="divider dropdown-submenu"]').each(function(i,li){
                var query = $(li).data('query');
                $(li)[query && query($(li).data('value')) == -1 ?'addClass':'removeClass']('disabled');
            })
        });

    }
},'menu');