"use strict";

function Task(tasktxt) {
	this.orig = tasktxt;
	this.text = this.get_text(tasktxt);
	this.priority = this.match_regex(this.priority_regex, tasktxt);
	this.orig_priority = this.priority;
	this.contexts = this.match_regex_g(this.contexts_regex, tasktxt);
	this.projects = this.match_regex_g(this.projects_regex, tasktxt);
	this.done = this.done_regex.test(tasktxt);
	this.parse_dates();
}

Task.prototype.contexts_regex = /(?:\s+|^)@\w+/gi;
Task.prototype.priority_regex = /^x?\s?\(([a-z])\)\s+/i;
Task.prototype.projects_regex = /(?:\s+|^)\+\w+/gi;
Task.prototype.date_regex = /(?:\s+|^)(\d{4})-(\d{2})-(\d{2})/i;
// Completed date and due date included.
Task.prototype.both_dates_regex = /(?:\s+|^)(\d{4}-\d{2}-\d{2})\s+(\d{4}-\d{2}-\d{2})/i;
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
Task.prototype.parse_dates = function() {
	this.due_date = null;
	this.completed_date = null;
	if (this.done) {
		var match = this.both_dates_regex.exec(this.orig);
		if (match) {
			this.completed_date = this.parse_date(match[1]);
			this.due_date = this.parse_date(match[2]);
		} else {
			this.completed_date = this.parse_date(this.orig);
		}
	} else {
		this.due_date = this.parse_date(this.orig);
	}
}
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
	this.priority = null;
};
Task.prototype.not_complete = function() {
	this.done = false;
	this.completed_date = null;
	this.priority = this.orig_priority;
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
Task.prototype.toString = function() {
	var ret = [];
	if (this.done) ret.push('x');
	if (this.priority) ret.push('('+this.priority+')');
	if (this.completed_date) ret.push(this.completed_date.toISOString().substring(0, 10));
	if (this.due_date) ret.push(this.due_date.toISOString().substring(0, 10));
	if (this.text) ret.push(this.text);
	if (this.projects.length > 0) ret.push(this.projects.join(' '));
	if (this.contexts.length > 0) ret.push(this.contexts.join(' '));
	return ret.join(' ').trim();
}

module.exports = Task;