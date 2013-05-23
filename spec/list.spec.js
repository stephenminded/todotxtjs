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
	it('should filter by priority', function() {
		list.by_priority('A').tasks.forEach(function(task) {
			expect(task.priority).toBe('A');
		});
		expect(list.by_priority('A').tasks.length > 0).toBeTruthy();
	});
	it('should filter by context', function() {
		list.by_context('@context').tasks.forEach(function(task) {
			expect(task.contexts).toContain('@context');
		});
		expect(list.by_context('@context').tasks.length > 0).toBeTruthy();
	});
	it('should filter by project', function() {
		list.by_project('+project').tasks.forEach(function(task) {
			expect(task.projects).toContain('+project');
		});
		expect(list.by_project('+project').tasks.length > 0).toBeTruthy();
	});
	it('should filter by project, context and priority', function() {
		var filtered = list.by_project('+project').
							by_context('@context').
							by_priority('C');
		expect(filtered instanceof List).toBeTruthy();
		filtered.tasks.forEach(function(task) {
			expect(task.priority).toBe('C');
			expect(task.projects).toContain('+project');
			expect(task.contexts).toContain('@context');
		});
		expect(filtered.tasks.length > 0).toBeTruthy();
	});

});