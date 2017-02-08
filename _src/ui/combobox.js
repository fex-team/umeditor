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
        HOVER_CLASS = 'edui-combobox-item-hover',
        ICON_CLASS = 'edui-combobox-checked-icon',
        labelClassName = 'edui-combobox-item-label';

    UM.ui.define( widgetName, ( function(){

        return {
            tpl: "<ul class=\"dropdown-menu edui-combobox-menu<%if: ${comboboxName} !==''%> edui-combobox-${comboboxName}<%/if%>\" unselectable=\"on\" onmousedown=\"return false\" role=\"menu\" aria-labelledby=\"dropdownMenu\">" +
                "<%if: ${autoRecord} %>" +
                "<%for : ${recordStack} as ${recordItem}, ${index}%>" + 
                "<%var : style = ${itemStyles}[${recordItem}]%><%var : record = ${items}[${recordItem}]%>" +
                "<li class=\"${itemClassName}<%if: ${selected} == ${recordItem}%> edui-combobox-checked<%/if%>\" data-item-index=\"${recordItem}\" unselectable=\"on\" onmousedown=\"return false\">" +
                "<span class=\"edui-combobox-icon\" unselectable=\"on\" onmousedown=\"return false\"></span>" +
                "<label class=\"${labelClassName}\" style=\"${style}\" unselectable=\"on\" onmousedown=\"return false\">${record}</label>" +
                "</li>" +
                "<%/for%>" +
                "<%if: ${index} %>" +
                "<li class=\"edui-combobox-item-separator\"></li>" +
                "<%/if%>" +
                "<%/if%>" +
                "<%for: ${items} as ${item}, ${itemIndex}%>" +
                "<%var : labelStyle = ${itemStyles}[${itemIndex}]%>" + 
                "<li class=\"${itemClassName}<%if: ${selected} == ${item} %> edui-combobox-checked<%/if%> edui-combobox-item-${itemIndex}\" data-item-index=\"${itemIndex}\" unselectable=\"on\" onmousedown=\"return false\">" +
                "<span class=\"edui-combobox-icon\" unselectable=\"on\" onmousedown=\"return false\"></span>" +
                "<label class=\"${labelClassName}\" style=\"${labelStyle}\" unselectable=\"on\" onmousedown=\"return false\">${item}</label>" +
                "</li>" +
                "<%/for%>" +
                "</ul>",
            defaultOpt: {
                //记录栈初始列表
                recordStack: [],
                //可用项列表
                items: [],
		        //item对应的值列表
                value: [],
                comboboxName: '',
                selected: '',
                //自动记录
                autoRecord: true,
                //最多记录条数
                recordCount: 5
            },
            init: function( options ){

                var me = this;

                $.extend( me._optionAdaptation( options ), me._createItemMapping( options.recordStack, options.items ), {
                    itemClassName: itemClassName,
                    iconClass: ICON_CLASS,
                    labelClassName: labelClassName
                } );

                this._transStack( options );
                
                me.root( $( UM.utils.render(me.tpl, options) ) );

                this.data( 'options', options ).initEvent();

            },
            initEvent: function(){

                var me = this;

                me.initSelectItem();

                this.initItemActive();

            },
            /**
             * 初始化选择项
             */
            initSelectItem: function(){

                var me = this,
                    labelClass = "."+labelClassName;

                me.root().delegate('.' + itemClassName, 'click', function(){

                    var $li = $(this),
                        index = $li.attr('data-item-index');

                    me.trigger('comboboxselect', {
                        index: index,
                        label: $li.find(labelClass).text(),
                        value: me.data('options').value[ index ]
                    }).select( index );

                    me.hide();

                    return false;

                });

            },
            initItemActive: function(){
                var fn = {
                    mouseenter: 'addClass',
                    mouseleave: 'removeClass'
                };
                if ($.IE6) {
                    this.root().delegate( '.'+itemClassName,  'mouseenter mouseleave', function( evt ){
                        $(this)[ fn[ evt.type ] ]( HOVER_CLASS );
                    }).one('afterhide', function(){
                    });
                }
            },
            /**
             * 选择给定索引的项
             * @param index 项索引
             * @returns {*} 如果存在对应索引的项，则返回该项；否则返回null
             */
            select: function( index ){

                var itemCount = this.data('options').itemCount,
                    items = this.data('options').autowidthitem;

                if ( items && !items.length ) {
                    items = this.data('options').items;
                }

                if( itemCount == 0 ) {
                    return null;
                }

                if( index < 0 ) {

                    index = itemCount + index % itemCount;

                } else if ( index >= itemCount ) {

                    index = itemCount-1;

                }

                this.trigger( 'changebefore', items[ index ] );

                this._update( index );

                this.trigger( 'changeafter', items[ index ] );

                return null;

            },
            selectItemByLabel: function( label ){

                var itemMapping = this.data('options').itemMapping,
                    me = this,
                    index = null;

                !$.isArray( label ) && ( label = [ label ] );

                $.each( label, function( i, item ){

                    index = itemMapping[ item ];

                    if( index !== undefined ) {

                        me.select( index );
                        return false;

                    }

                } );

            },
            /**
             * 转换记录栈
             */
            _transStack: function( options ) {

                var temp = [],
                    itemIndex = -1,
                    selected = -1;

                $.each( options.recordStack, function( index, item ){

                    itemIndex = options.itemMapping[ item ];

                    if( $.isNumeric( itemIndex ) ) {

                        temp.push( itemIndex );

                        //selected的合法性检测
                        if( item == options.selected ) {
                            selected = itemIndex;
                        }

                    }

                } );

                options.recordStack = temp;
                options.selected = selected;
                temp = null;

            },
            _optionAdaptation: function( options ) {

                if( !( 'itemStyles' in options ) ) {

                    options.itemStyles = [];

                    for( var i = 0, len = options.items.length; i < len; i++ ) {
                        options.itemStyles.push('');
                    }

                }

                options.autowidthitem = options.autowidthitem || options.items;
                options.itemCount = options.items.length;

                return options;

            },
            _createItemMapping: function( stackItem, items ){

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
                        result.recordStack.push( temp[ item ] );
                        result.mapping[ item ] = temp[ item ];
                    }

                } );

                return result;

            },
            _update: function ( index ) {

                var options = this.data("options"),
                    newStack = [],
                    newChilds = null;

                $.each( options.recordStack, function( i, item ){

                    if( item != index ) {
                        newStack.push( +item );
                    }

                } );

                //压入最新的记录
                newStack.unshift( +index );

                if( newStack.length > options.recordCount ) {
                    newStack.length = options.recordCount;
                }

                options.recordStack = newStack;
                options.selected = +index;
                newChilds = $( UM.utils.render(this.tpl, options ) );

                //重新渲染
                this.root().html( newChilds.html() );

                newChilds = null;
                newStack = null;

            }
        };

    } )(), 'menu' );

})();
