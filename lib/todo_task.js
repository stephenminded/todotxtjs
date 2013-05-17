"use strict";

function Task(tasktxt) {
	this.orig = tasktxt;
	this.priority = this.match_regex(this.priority_regex, tasktxt);
	this.contexts = this.match_regex_g(this.contexts_regex, tasktxt);
	this.projects = this.match_regex_g(this.projects_regex, tasktxt);
	this.done = this.done_regex.test(tasktxt);
	this.date = this.parse_date(tasktxt);
}

Task.prototype.contexts_regex = /(?:\s+|^)@\w+/g;
Task.prototype.priority_regex = /^x?\s?\(([A-Za-z])\)\s+/;
Task.prototype.projects_regex = /(?:\s+|^)\+\w+/g;
Task.prototype.date_regex = /(?:\s+|^)([0-9]{4})-([0-9]{2})-([0-9]{2})/;
Task.prototype.done_regex = /^x\s/;
Task.prototype.match_regex = function(re, str) {
	var match = re.exec(str);
	if (match) {
		return match[1];
	}
	return null;
}
Task.prototype.match_regex_g = function(re, str) {
	var ret = [];
	var match = re.exec(str);
	while (match != null) {
		ret.push(match[0].trim());
		match = re.exec(str);
	}
	return ret;
};
Task.prototype.parse_date = function(str) {
	var match = this.date_regex.exec(str);
	if (match == null) {
		return null;
	}
	return new Date(match[1], parseInt(match[2]) - 1, parseInt(match[3]));
};
Task.prototype.isOverdue = function() {
	if (this.date == null) {
		return false;
	}
	var now = new Date();
	return now > this.date;
};
Task.prototype.complete = function() {
	this.done = true;
};

module.exports = Task;