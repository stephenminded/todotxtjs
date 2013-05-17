"use strict";

function Task(tasktxt) {
	this.origtxt = tasktxt;
	this.priority = this.priority_regex.test(tasktxt) ? tasktxt[1] : null;
	this.contexts = this.match_regex(this.contexts_regex, tasktxt);
}

Task.prototype.contexts_regex = /(?:\s+|^)@\w+/g
Task.prototype.priority_regex = /^\([A-Za-z]\)\s+/
Task.prototype.match_regex = function(re, str) {
	var ret = [];
	var match = re.exec(str);
	while (match != null) {
		ret.push(match[0].trim());
		match = re.exec(str);
	}
	return ret;
};

module.exports = Task;