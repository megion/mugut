/**
 * string serialization
 */
tabaga.historyMaster = (function() {
	
	function splitStr(str) {
		return str.split('/');//decodeURIComponent(str).split(';');
	}
	
	function joinParts(parts) {
		return parts.join('/');
	}
	
	function parsePart(part) {
		var keyValueSplitIndex = part.indexOf(">");
		if (keyValueSplitIndex<1) {
			// key not found
			return null;
		}
		return {
			key: part.substring(0, keyValueSplitIndex),
			value: part.substring(keyValueSplitIndex+1, part.length)
		};
	}
	
	function toPart(entry) {
		return entry.key + ">" + entry.value;
	}
	
	return {

		getValue : function(key, str) {
			var parts = splitStr(str);
			for (var i = 0; i < parts.length; i++) {
				var part = parts[i];
				var entry = parsePart(part);
				if (entry && entry.key==key) {
					return entry.value;
				}
			}
			return null;
		},
		
		putValue : function(key, value, str) {
			//if(str.length==0) {
				//return toPart({key: key, value: value});
			//}
			
			var parts = splitStr(str);
			
			for (var i = 0; i < parts.length; i++) {
				var part = parts[i];
				var entry = parsePart(part);
				if (entry && entry.key==key) {
					// update
					entry.value = value;
					parts[i] = toPart(entry);
					return joinParts(parts);
				}
			}
			
			// put new
			parts.push(toPart({key: key, value: value}));
			return joinParts(parts);
		},
		
		removeValue : function(key, str) {
			var parts = splitStr(str);
			for (var i = 0; i < parts.length; i++) {
				var part = parts[i];
				var entry = parsePart(part);
				if (entry && entry.key==key) {
					// remove
					parts.splice(i, 1);
					return joinParts(parts);
				}
			}
			return str;
		} 
	};
}());

tabaga.historyControlsMap = {};

/**
 * History call back. Load new content form server by AJAX.
 * 
 * @param anchor
 */
tabaga.pageload = function(hash) {
	for ( var controlId in tabaga.historyControlsMap) {
		var control = tabaga.historyControlsMap[controlId];
		control.detectAnchor(hash);
	}
};

tabaga.enableHistoryControl = function(control, enable) {
	if (enable) {
		tabaga.historyControlsMap[control.id] = control;
		control.disableHistory = false;
	} else {
		delete tabaga.historyControlsMap[control.id];
		control.disableHistory = true;
	}
};

/**
 * Initialize and use browser history
 */
$(document).ready(function() {
	$.history.init(tabaga.pageload);
});

// tree
(function($) {
	$.fn.createTreeControl = function(id, config, rootNodes) {
		var tree = $(this);

		config.TreeControlConstructor = config.TreeControlConstructor
				|| tabaga.TreeControl;
		var treeControl = new config.TreeControlConstructor(id, tree[0]);
		treeControl.configure(config);
		treeControl.init(rootNodes);

		if (!config.disableHistory) {
			tabaga.historyControlsMap[id] = treeControl;
		}

		return treeControl;
	}
})(jQuery);

// tree table
(function($) {
	$.fn.createTreetableControl = function(id, config, rootNodes) {
		var tree = $(this);

		config.TreetableControlConstructor = config.TreetableControlConstructor
				|| tabaga.TreetableControl;
		var treeControl = new config.TreetableControlConstructor(id, tree[0]);
		treeControl.configure(config);
		treeControl.init(rootNodes);

		if (!config.disableHistory) {
			tabaga.historyControlsMap[id] = treeControl;
		}

		return treeControl;
	}
})(jQuery);