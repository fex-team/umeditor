/**
 * Created with JetBrains PhpStorm.
 * User: hn
 * Date: 13-5-29
 * Time: 下午8:01
 * To change this template use File | Settings | File Templates.
 */

(function(){

    var widgetName = 'combobox',
        itemClassName = 'edui-combobox-item',
        stackItemClassName = 'edui-combobox-stack-item';

    UE.ui.define( widgetName, ( function(){

        return {
            tpl: function( options ){

                return  '<ul class="dropdown-menu edui-combobox-menu" role="menu" aria-labelledby="dropdownMenu">' +
                        '<%for( var i=0, len=recordStack.length; i<len; i++ ){%>' +
                        '<li class="' + stackItemClassName + '" data-stack-item-index="<%=mapping[recordStack[i]]%>"><a href="#" class="edui-combobox-link"><em class="edui-combobox-checkbox"><i class="icon-ok"></i></em><span class="edui-combobox-label" style="<%=itemStyles[i]%>"><%=recordStack[i]%></span></a></li>' +
                        '<%}%>' +
                        '<%if(recordStack.length){%>' +
                        '<li class="divider edui-combobox-stack-separator"></li>' +
                        '<%} else {%>' +
                        '<li class="divider edui-combobox-stack-separator edui-common-dis-none"></li>' +
                        '<%}%>' +
                        '<%for( var i=0, len=items.length; i<len; i++){%>' +
                        '<li class="' + itemClassName + '" data-item-index="<%=i%>"><a href="#" class="edui-combobox-link"><em class="edui-combobox-checkbox"><i class="icon-ok"></i></em><span class="edui-combobox-label" style="<%=itemStyles[i]%>"><%=items[i]%></span></a></li>' +
                        '<%}%>' +
                        '</ul>';

            },
            defaultOpt: {
                //记录栈初始列表
                recordStack: [],
                //可用项列表
                items: [],
                itemCount: 0,
		        //item对应的值列表
                value: [],
                //自动记录
                autoRecord: true,
                //最多记录条数
                recordCount: 5
            },
            init: function( options ){

                var me = this;

                //参数适配转换一下
                optionAdaptation( options );

                options.itemCount = options.items.length;

                $.extend( options, createItemMapping( options.recordStack, options.items ) );

                me.root( $( $.parseTmpl( me.tpl(options), options ) ) );

                this.data( 'options', options );

                this.initEvent();

            },
            initEvent: function(){

                var me = this;

                me.root().delegate('li', 'click', function(){

                    var $li = $(this),
                        index = $li.hasClass( itemClassName ) ? $li.attr('data-item-index') : $li.attr('data-stack-item-index');

                    me.trigger('comboboxselect', {
                        index: index,
                        label: $li.find(".edui-combobox-label").text(),
                        value: me.data('options').value[ index ]
                    } );

                    me.selectItem( index );
                    me.hide();

                    return false;

                });

                me.root().on('aftershow', function(){
                    var width = this.offsetWidth;
                    if( width ) {
                        if( !window.XMLHttpRequest ) {
                            width += 25;
                        }
                        me.root().off('aftershow');
                        this.style.width = width + 'px';
                    }
                });

                me.root().on( 'mousedown', function(){
                    return false;
                } );

                //处理ie6以下不支持:hover伪类
                if ($.IE6) {
                    this.root().delegate( '.'+stackItemClassName + ',.'+itemClassName,  'mouseenter mouseleave', function( evt ){
                        var $this = $(this);
                        $this[ evt.type === 'mouseleave' ? 'removeClass' : 'addClass' ]( 'edui-hover' );
                    });
                }


            },
            selectItem: function( index ){

                var itemCount = this.data('options').itemCount,
                    items = this.data('options').autowidthitem,
                    currentItem = null,
                    selector = null;

                if( itemCount == 0 ) {
                    return null;
                }

                if( index < 0 ) {

                    index = itemCount + index % itemCount;

                } else if ( index >= itemCount ) {

                    index = itemCount-1;

                }

                selector = '.'+itemClassName+':eq('+ index +')';

                currentItem = this.root().find( selector );

                if( currentItem.length ) {

                    this.trigger( 'changebefore', items[ index ] );
                    this.selectByItemNode( currentItem[0] );
                    this.trigger( 'changeafter', items[ index ] );

                    return currentItem[0];

                }

                return null;

            },
            selectItemByLabel: function( label ){

                var itemMapping = this.data('options').itemMapping,
                    index = null;

                label = $.isArray( label ) ? label : [ label ];

                for( var i = 0, len = label.length; i<len; i++ ) {

                    index = itemMapping[ label[i] ];

                    if( index !== undefined ) {

                        this.selectItem( index );
                        break;

                    }

                }

            },
            selectByItemNode: function( itemNode ){

                if( !itemNode ) {
                    return null;
                }

                var $itemNode = $(itemNode);

                this.root().find('.edui-combobox-checked').removeClass('edui-combobox-checked');
                $itemNode.find('.edui-combobox-checkbox').addClass('edui-combobox-checked');

                if( this.data('options').autoRecord ) {
                    selectRecordItem.call( this, itemNode );
                }

                return itemNode;

            },
            //更新记录区域
            updaterecordArea: function(){

                var $recordItems = this.root().find('.'+stackItemClassName);

                if( $recordItems.length > this.data('options').recordCount ) {

                    for( var i = $recordItems.length - 1, len = this.data('options').recordCount; i >= len; i-- ) {
                        $( $recordItems.get( i ) ).remove();
                    }

                }

            }
        };

        function optionAdaptation( options ) {

            if( !( 'itemStyles' in options ) ) {

                options.itemStyles = [];

                for( var i = 0, len = options.items.length; i < len; i++ ) {
                    options.itemStyles.push('');
                }

            }

            options.autowidthitem = options.autowidthitem || options.items;

            return options;

        }

        /**
         * 执行宽度自适应
         */
        function wordCountAdaptive( word, hasSuffix ) {

            var tmpNode = document.createElement('span');

            tmpNode.innerHTML = word;

            tmpNode.style.cssText = 'display: inline; position: absolute; top: -10000000px; left: -100000px;';

            document.body.appendChild( tmpNode );

            var width = tmpNode.offsetWidth;

            document.body.removeChild( tmpNode );

            tmpNode = null;

            if( width < 50 ) {

                return word;

            } else {

                word = word.slice( 0, hasSuffix ? -4 : -1 );

                if( word.length ===  0 ) {
                    return '...';
                }

                return wordCountAdaptive( word + '...', true );

            }

        }

        function createItemMapping( stackItem, items ) {

            var temp = {},
                result = {
                    recordStack: [],
                    mapping: {}
                };

            $.each( items, function( index, item ){
                temp[ item ] = index;
            } );

            result.itemMapping = temp;

            $.each( stackItem, function( index, item ){

                if( temp[ item ] !== undefined ) {
                    result.recordStack.push( item );
                    result.mapping[ item ] = temp[ item ];
                }

            } );

            return result;

        }

        function showStackSeparator() {

            this.root().find(".edui-combobox-stack-separator").removeClass("edui-common-dis-none");

        }

        function selectRecordItem( itemNode ) {

            var index = $(itemNode).attr('data-item-index'),
                me = this,
                $stackItem = null,
                selector = null;

            if( !$.isNumeric( index ) ) {
                return null;
            }

            showStackSeparator.call( this );

            selector = '.' + stackItemClassName + '[data-stack-item-index="'+ index +'"]';

            $stackItem = this.root().find( selector );

            if( $stackItem.length ) {

                $stackItem.insertBefore( $stackItem.parent().children()[0] );
                $stackItem.find('.edui-combobox-checkbox').addClass('edui-combobox-checked');

            } else {

                var stackItemTpl = '<li class="' + stackItemClassName + '" data-stack-item-index="<%=recordStackIndex%>"><a href="#" class="edui-combobox-link"><em class="edui-combobox-checkbox edui-combobox-checked"><i class="icon-ok"></i></em><span class="edui-combobox-label" style="<%=style%>"><%=recordStackLabel%></span></a></li>';
                    $newStackItem = $( $.parseTmpl( stackItemTpl , {
                        recordStackIndex: index,
                        recordStackLabel: me.data('options').items[ index ],
                        style: me.data('options').itemStyles[index]
                    } ) );

                $newStackItem.insertBefore( this.root().children().first() );

                this.updaterecordArea();

            }

            return null;

        }

    } )(), 'menu' );

})();
