"use strict";

var Task = require('./todo_task');

function List(str) {
	var items;
	this.tasks = [];
	if (str == null) {
		return;
	}
	items = str.split(/\n/);
	for (var i = 0; i < items.length; i++) {
		this.tasks.push(new Task(items[i]));
	}
}

List.create = function(tasks) {
	var l = new List(null);
	tasks.forEach(function(el) {
		l.tasks.push(new Task(el.toString()));
	});
	return l;
};
List.prototype.by_priority = function(priority) {
	return List.create(this.tasks.filter(function(el) {
		return (el.priority == priority);
	}));
};
List.prototype.by_project = function(project) {
	return List.create(this.tasks.filter(function(el) {
		return (el.projects.indexOf(project) > -1);
	}));
};
List.prototype.by_context = function(context) {
	return List.create(this.tasks.filter(function(el) {
		return (el.contexts.indexOf(context) > -1);
	}));
};

module.exports = List;