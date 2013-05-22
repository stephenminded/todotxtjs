"use strict";

var fs = require('fs');
var path = require('path');
var List = require('../lib/todo_list');
var Task = require('../lib/todo_task');

describe("list", function() {
	var list;
	var data = fs.readFileSync(path.resolve(__dirname, 'data', 'todo.txt')).toString();
	beforeEach(function() {
		list = new List(data);
	});
	it("should create a list of tasks", function() {
		for (var i = 0; i < list.tasks.length; i++) {
			expect(list.tasks[i] instanceof Task).toBeTruthy();
		}
		expect(list.tasks.length > 0).toBeTruthy();
	});
});