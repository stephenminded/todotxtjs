"use strict";

var Task = require('./todo_task');

function List(str) {
	var items;
	this.tasks = [];
	items = str.split(/\n/);
	for (var i = 0; i < items.length; i++) {
		this.tasks.push(new Task(items[i]));
	}
}

module.exports = List;