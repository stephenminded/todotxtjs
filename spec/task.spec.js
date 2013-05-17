"use strict";

var Task = require("../lib/todo_task");

describe("task", function() {
	it("should recognize priorities", function() {
		var task = new Task("(A) Hello world!");
		expect(task.priority).toBe("A");
	});
	it("should only recognize priorities at the start of a task", function() {
		var task = new Task("Hello world! (A)");
		expect(task.priority).toBe(null);
	});
	it("should default to no contexts", function() {
		var task = new Task("Hello world!");
		expect(task.contexts).toEqual([]);
	});
	it("should recognize contexts", function() {
		var task = new Task("Hello world! @test");
		expect(task.contexts).toEqual(["@test"]);
	});
	it("should recognize multiple contexts", function() {
		var task = new Task("Hello world! @test1 @test2");
		expect(task.contexts).toEqual(["@test1", "@test2"]);
	});
});