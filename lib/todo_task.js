"use strict";

function Task(tasktxt) {
	this.orig = tasktxt;
	this.priority = this.match_regex(this.priority_regex, tasktxt);
	this.contexts = this.match_regex_g(this.contexts_regex, tasktxt);
	this.projects = this.match_regex_g(this.projects_regex, tasktxt);
	this.done = this.done_regex.test(tasktxt);
	this.due_date = this.parse_date(tasktxt);
	this.completed_date = null;
	this.text = this.get_text(tasktxt);
}

Task.prototype.contexts_regex = /(?:\s+|^)@\w+/gi;
Task.prototype.priority_regex = /^x?\s?\(([a-z])\)\s+/i;
Task.prototype.projects_regex = /(?:\s+|^)\+\w+/gi;
Task.prototype.date_regex = /(?:\s+|^)([0-9]{4})-([0-9]{2})-([0-9]{2})/i;
Task.prototype.done_regex = /^x\s/i;
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
Task.prototype.is_overdue = function() {
	if (this.due_date == null) {
		return false;
	}
	var now = new Date();
	return now > this.due_date;
};
Task.prototype.complete = function() {
	this.done = true;
	this.completed_date = new Date();
};
Task.prototype.not_complete = function() {
	this.done = false;
	this.completed_date = null;
};
Task.prototype.toggle = function() {
	(this.done) ? this.not_complete() : this.complete();
};
Task.prototype.get_text = function(str) {
	return str
		.replace(this.contexts_regex, '')
		.replace(this.priority_regex, '')
		.replace(this.projects_regex, '')
		.replace(this.date_regex, '')
		.replace(this.done_regex)
		.trim();
};

module.exports = Task;