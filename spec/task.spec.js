"use strict";

var Task = require("../lib/todo_task");

describe("task", function() {
	it("should recognize priorities", function() {
		var task = new Task("(A) Hello world!");
		expect(task.priority).toBe("A");
	});
	it("should recognize priorities on finished tasks", function() {
		var task = new Task("x (A) Hello world!");
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
	it("should default to no projects", function() {
		var task = new Task("Hello world!");
		expect(task.projects).toEqual([]);
	});
	it("should recognize projects", function() {
		var task = new Task("Hello world! +project");
		expect(task.projects).toEqual(['+project']);
	});
	it("should recognize many projects", function() {
		var task = new Task("Hello world! +project1 +project2");
		expect(task.projects).toEqual(['+project1', '+project2']);
	});
	it("should retain the original text", function() {
		var task = new Task("(A) 2013-05-24 Do something interesting +project @context");
		expect(task.orig).toBe("(A) 2013-05-24 Do something interesting +project @context");
	});
	it("should recognize dates in YYYY-MM-DD format", function() {
		var task = new Task("(A) 2013-05-24 Do something interesting +project @context");
		expect(task.due_date).toEqual(new Date("May 24, 2013"));
		task = new Task("2013-05-24 Do something interesting +project @context");
		expect(task.due_date).toEqual(new Date("May 24, 2013"));
	});
	it("should have a null date if no date present", function() {
		var task = new Task("Hello world! +project1 +project2");
		expect(task.due_date).toBe(null);
		expect(task.completed_date).toBe(null);
	});
	it("should not recognize malformed dates", function() {
		var task = new Task("(A) 20-05-2024 Do something interesting +project @context");
		expect(task.due_date).toBe(null);
		expect(task.completed_date).toBe(null);
	});
	it("should recognize overdue tasks", function() {
		var task = new Task("(A) 2000-05-24 Do something in the past.");
		expect(task.is_overdue()).toBe(true);
		task = new Task("(A) 3000-05-24 Do something in the future.");
		expect(task.is_overdue()).toBe(false);
		task = new Task("(A) Do something in at no particular time.");
		expect(task.is_overdue()).toBe(false);
	});
	it("should recognize completed tasks", function() {
		var task = new Task("x 2013-05-24 This is done.");
		expect(task.done).toBe(true);
		expect(task.completed_date).toEqual(new Date("May 24, 2013"));
	});
	it("should not consider incomplete tasks as done", function() {
		var task = new Task("2013-05-24 This is not done.");
		expect(task.done).toBe(false);
	});
	it("should allow completion of tasks", function() {
		var task = new Task("2013-05-24 This is not done.");
		task.complete();
		expect(task.done).toBe(true);
	});
	it("should provide the text of the task", function() {
		var task = new Task("(A) 2013-05-24 Do something interesting +project @context");
		expect(task.text).toBe("Do something interesting");
	});
	it("should be able to be marked as incomplete", function() {
		var task = new Task("x This is a completed task");
		task.not_complete();
		expect(task.done).toBe(false);
	});
	it("should be able to be toggled", function() {
		var task = new Task("This is an incomplete task");
		task.toggle();
		expect(task.done).toBe(true);
		task.toggle();
		expect(task.done).toBe(false);
	});
	it("should recognize completion dates", function() {
		var task = new Task("x 2013-05-24 This is done.");
		expect(task.due_date).toBe(null);
		expect(task.completed_date).toEqual(new Date("May 24, 2013"));
	});
	it("should set the completion date when completed", function() {
		var task = new Task("2013-05-24 This is not done.");
		var today = new Date();
		task.complete();
		expect(task.completed_date.toDateString()).toBe(today.toDateString());
	});
});