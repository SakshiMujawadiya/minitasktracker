const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../server');
const Task = require('../models/Task');
const { connectDb, disconnectDb } = require('../config/db');

jest.setTimeout(20000);

describe('Task API Integration Tests with MongoDB', () => {
  beforeAll(async () => {
    process.env.NODE_ENV = 'test';
    await connectDb();
  });

  afterAll(async () => {
    await Task.deleteMany({});
    await disconnectDb();
  });

  beforeEach(async () => {
    await Task.deleteMany({});
  });

  // ==========================================
  // Test 1: Mandatory Invalid Task Creation
  // ==========================================
  test('Test 1: Invalid task creation with an empty title should return HTTP 400', async () => {
    const res = await request(app)
      .post('/tasks')
      .send({
        title: '',
        description: 'Testing empty title validation',
        status: 'todo',
        priority: 'medium',
      });

    expect(res.statusCode).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toMatch(/title.*(required|cannot be empty)/i);

    // Verify that NO invalid task was saved to MongoDB
    const count = await Task.countDocuments();
    expect(count).toBe(0);
  });

  // ==========================================
  // Test 2: Mandatory Successful Status Update
  // ==========================================
  test('Test 2: Successful status update should return HTTP 200 and persist the updated status', async () => {
    // 1. Create a valid task
    const createRes = await request(app)
      .post('/tasks')
      .send({
        title: 'Status Update Test Task',
        description: 'Verify status transition in database',
        status: 'todo',
        priority: 'high',
      });

    expect(createRes.statusCode).toBe(201);
    const taskId = createRes.body.data ? createRes.body.data.id : createRes.body.id;
    expect(taskId).toBeDefined();

    // 2. Send PATCH /tasks/:id with status = 'done'
    const patchRes = await request(app)
      .patch(`/tasks/${taskId}`)
      .send({ status: 'done' });

    expect(patchRes.statusCode).toBe(200);
    expect(patchRes.body.success).toBe(true);

    const updatedStatus = patchRes.body.data ? patchRes.body.data.status : patchRes.body.status;
    expect(updatedStatus).toBe('done');

    // 3. Verify the database contains the updated status directly
    const dbTask = await Task.findById(taskId);
    expect(dbTask).not.toBeNull();
    expect(dbTask.status).toBe('done');
  });

  // ==========================================
  // Additional Comprehensive Tests
  // ==========================================

  test('POST /tasks: Successfully creates a new task and returns HTTP 201', async () => {
    const payload = {
      title: 'Complete Project Documentation',
      description: 'Write comprehensive README and architectural docs',
      status: 'in_progress',
      priority: 'high',
    };

    const res = await request(app).post('/tasks').send(payload);

    expect(res.statusCode).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.title).toBe(payload.title);
    expect(res.body.data.status).toBe('in_progress');
    expect(res.body.data.priority).toBe('high');
    expect(res.body.data.id).toBeDefined();

    const dbTask = await Task.findById(res.body.data.id);
    expect(dbTask).not.toBeNull();
    expect(dbTask.title).toBe(payload.title);
  });

  test('POST /tasks: Rejects title exceeding 100 characters with HTTP 400', async () => {
    const longTitle = 'a'.repeat(101);
    const res = await request(app).post('/tasks').send({
      title: longTitle,
      status: 'todo',
    });

    expect(res.statusCode).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toMatch(/cannot exceed 100 characters/i);
  });

  test('POST /tasks: Rejects request missing title field with HTTP 400', async () => {
    const res = await request(app).post('/tasks').send({
      description: 'Missing title property',
    });

    expect(res.statusCode).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toMatch(/title.*required/i);
  });

  test('POST /tasks: Rejects invalid status enum value with HTTP 400', async () => {
    const res = await request(app).post('/tasks').send({
      title: 'Valid Title',
      status: 'non_existent_status',
    });

    expect(res.statusCode).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toMatch(/invalid status/i);
  });

  test('POST /tasks: Rejects invalid priority enum value with HTTP 400', async () => {
    const res = await request(app).post('/tasks').send({
      title: 'Valid Title',
      priority: 'super_urgent',
    });

    expect(res.statusCode).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toMatch(/invalid priority/i);
  });

  test('GET /tasks: Returns all tasks sorted newest first', async () => {
    await Task.create({ title: 'Task 1', createdAt: new Date(Date.now() - 5000) });
    await Task.create({ title: 'Task 2', createdAt: new Date(Date.now() - 2000) });
    await Task.create({ title: 'Task 3', createdAt: new Date() });

    const res = await request(app).get('/tasks');

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.length).toBe(3);
    // Newest first
    expect(res.body.data[0].title).toBe('Task 3');
    expect(res.body.data[2].title).toBe('Task 1');
  });

  test('GET /tasks?status=in_progress: Correctly filters tasks by status', async () => {
    await Task.create({ title: 'Task To Do', status: 'todo' });
    await Task.create({ title: 'Task Working', status: 'in_progress' });
    await Task.create({ title: 'Task Finished', status: 'done' });

    const res = await request(app).get('/tasks?status=in_progress');

    expect(res.statusCode).toBe(200);
    expect(res.body.data.length).toBe(1);
    expect(res.body.data[0].title).toBe('Task Working');
  });

  test('GET /tasks?priority=high: Correctly filters tasks by priority', async () => {
    await Task.create({ title: 'Low priority', priority: 'low' });
    await Task.create({ title: 'High priority', priority: 'high' });

    const res = await request(app).get('/tasks?priority=high');

    expect(res.statusCode).toBe(200);
    expect(res.body.data.length).toBe(1);
    expect(res.body.data[0].title).toBe('High priority');
  });

  test('GET /tasks?search=Feature: Matches task title case-insensitively', async () => {
    await Task.create({ title: 'Build New Feature' });
    await Task.create({ title: 'Fix CSS Bug' });

    const res = await request(app).get('/tasks?search=feature');

    expect(res.statusCode).toBe(200);
    expect(res.body.data.length).toBe(1);
    expect(res.body.data[0].title).toBe('Build New Feature');
  });

  test('GET /tasks: Rejects invalid status filter query with HTTP 400', async () => {
    const res = await request(app).get('/tasks?status=invalid_filter');

    expect(res.statusCode).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toMatch(/invalid status filter/i);
  });

  test('PATCH /tasks/:id: Successfully updates task title, description, and priority', async () => {
    const task = await Task.create({
      title: 'Initial Title',
      description: 'Initial Description',
      status: 'todo',
      priority: 'low',
    });

    const res = await request(app)
      .patch(`/tasks/${task._id}`)
      .send({
        title: 'Updated Task Title',
        description: 'Updated Task Description',
        priority: 'high',
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.title).toBe('Updated Task Title');
    expect(res.body.data.description).toBe('Updated Task Description');
    expect(res.body.data.priority).toBe('high');

    const inDb = await Task.findById(task._id);
    expect(inDb.title).toBe('Updated Task Title');
    expect(inDb.priority).toBe('high');
  });

  test('PATCH /tasks/:id: Rejects payload with unexpected fields with HTTP 400', async () => {
    const task = await Task.create({ title: 'Payload check task' });

    const res = await request(app)
      .patch(`/tasks/${task._id}`)
      .send({
        status: 'done',
        unauthorizedField: 'Illegal Property',
      });

    expect(res.statusCode).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toMatch(/only supported fields/i);
  });

  test('PATCH /tasks/:id: Rejects empty update payload with HTTP 400', async () => {
    const task = await Task.create({ title: 'Missing fields payload' });

    const res = await request(app).patch(`/tasks/${task._id}`).send({});

    expect(res.statusCode).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toMatch(/at least one field/i);
  });

  test('PATCH /tasks/:id: Rejects malformed ObjectId with HTTP 400', async () => {
    const res = await request(app).patch('/tasks/invalid-mongo-id-123').send({ status: 'done' });

    expect(res.statusCode).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toMatch(/invalid task id/i);
  });

  test('PATCH /tasks/:id: Returns HTTP 404 for nonexistent ObjectId', async () => {
    const nonExistentId = new mongoose.Types.ObjectId();
    const res = await request(app).patch(`/tasks/${nonExistentId}`).send({ status: 'done' });

    expect(res.statusCode).toBe(404);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toMatch(/not found/i);
  });

  test('DELETE /tasks/:id: Rejects malformed ObjectId with HTTP 400', async () => {
    const res = await request(app).delete('/tasks/not-a-valid-id');

    expect(res.statusCode).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toMatch(/invalid task id/i);
  });

  test('DELETE /tasks/:id: Returns HTTP 404 for nonexistent ObjectId', async () => {
    const nonExistentId = new mongoose.Types.ObjectId();
    const res = await request(app).delete(`/tasks/${nonExistentId}`);

    expect(res.statusCode).toBe(404);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toMatch(/not found/i);
  });

  test('DELETE /tasks/:id: Successfully deletes task from MongoDB and returns HTTP 200', async () => {
    const task = await Task.create({ title: 'Task to be deleted' });

    const res = await request(app).delete(`/tasks/${task._id}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.message).toMatch(/deleted successfully/i);

    // Verify task is removed from MongoDB
    const checkDb = await Task.findById(task._id);
    expect(checkDb).toBeNull();
  });

  test('GET /tasks/stats: Returns accurate count and completion metrics', async () => {
    await Task.create({ title: 'T1', status: 'todo' });
    await Task.create({ title: 'T2', status: 'in_progress' });
    await Task.create({ title: 'T3', status: 'done' });

    const res = await request(app).get('/tasks/stats');

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.total).toBe(3);
    expect(res.body.data.todo).toBe(1);
    expect(res.body.data.inProgress).toBe(1);
    expect(res.body.data.done).toBe(1);
    expect(res.body.data.completionPercentage).toBe(33);
  });
});
