/**
 * @file xssFilter.js
 * @desc xss过滤器
 * @author robbenmu
 */

UM.plugins.xssFilter = function() {

	var config = UMEDITOR_CONFIG;
	var whiteList = config.whiteList;

	function filter(node) {

		var tagName = node.tagName;
		var attrs = node.attrs;

		if (!whiteList.hasOwnProperty(tagName)) {
			node.parentNode.removeChild(node);
			return false;
		}

		UM.utils.each(attrs, function (val, key) {

			if (UM.utils.indexOf(whiteList[tagName], key) === -1) {
				node.setAttr(key);
			}
		});
	}

	// 添加inserthtml\paste等操作用的过滤规则
	if (whiteList && config.xssFilterRules) {
		this.options.filterRules = function () {

			var result = {};

			UM.utils.each(whiteList, function(val, key) {
				result[key] = function (node) {
					return filter(node);
				};
			});

			return result;
		}();
	}

	var tagList = [];

	UM.utils.each(whiteList, function (val, key) {
		tagList.push(key);
	});

	// 添加input过滤规则
	//
	if (whiteList && config.inputXssFilter) {
		this.addInputRule(function (root) {

			root.traversal(function(node) {
				if (node.type !== 'element') {
					return false;
				}
				filter(node);
			});
		});
	}
	// 添加output过滤规则
	//
	if (whiteList && config.outputXssFilter) {
		this.addOutputRule(function (root) {

			root.traversal(function(node) {
				if (node.type !== 'element') {
					return false;
				}
				filter(node);
			});
		});
	}

};
