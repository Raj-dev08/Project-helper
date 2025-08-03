import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import supertest from "supertest";
import jwt from "jsonwebtoken";
import { describe, expect, jest } from "@jest/globals";

// ✅ Set longer timeout for all tests
jest.setTimeout(20000);

// ✅ Mock Cloudinary
jest.mock("../src/lib/cloudinary.js", () => ({
  default: {
    uploader: {
      upload: jest.fn().mockResolvedValue({ secure_url: "http://img.com/test.jpg" }),
    },
  },
}));


// ✅ Mock Redis
jest.unstable_mockModule("../src/lib/redis.js", () => ({
  redis: {
    get: jest.fn(),
    set: jest.fn(),
    del: jest.fn(),
    publish: jest.fn(),
    duplicate: jest.fn().mockReturnThis(),
    quit: jest.fn().mockResolvedValue(true),
    on: jest.fn(),
  },
}));

// ✅ Mock BullMQ
jest.unstable_mockModule("bullmq", () => ({
  Queue: jest.fn().mockImplementation(() => ({
    add: jest.fn().mockResolvedValue({ id: "mock-job-id" }),
    close: jest.fn().mockResolvedValue(true),
  })),
  Worker: jest.fn().mockImplementation(() => ({
    on: jest.fn(),
  })),
}));

// ✅ Mock Call Queue
jest.unstable_mockModule("../src/lib/callqueues.js", () => ({
  videocallQueue: {
    add: jest.fn().mockResolvedValue({ id: "mock-job-id" }),
    close: jest.fn().mockResolvedValue(true),
  },
}));

// ✅ Import after mocks
const app = (await import("../src/server.js")).default;
const { redis } = await import("../src/lib/redis.js");
import User from "../src/models/user.model.js";


redis.get.mockResolvedValue(null);
redis.set.mockResolvedValue(true);
redis.del.mockResolvedValue(true);

let mongoServer;
let mockUserId;
let mockProjectId;
let mockIssueId;
let mockTaskId;

const projetcPayLoad={
  name: "Test Project",
  description: "Test Description",
  githubLink: "https://github.com/test/test",
  usedLanguages: "JavaScript",
}

const projectIssue={
  issueName:"issue",
  issueDescription:"test"
}


const UpdatedProject={
  usedLanguages: "JavaScript TypeScript",
}

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  await mongoose.connect(mongoServer.getUri());
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoose.connection.close();
  await mongoServer.stop();
});

describe("Project Controller", () => {

  //actually creates the project
  it("should create a project when user is authenticated", async () => {
    // ✅ Create user in DB
    const user = await User.create({
      name: "Test User",
      email: "test@example.com",
      password: "hashedpassword", // It won't be checked in test
    });

    // ✅ Generate JWT
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET || "testsecret");

    mockUserId=user._id;

    // ✅ Send request with JWT in cookie
    const response = await supertest(app)
      .post("/api/projects/create-project")
      .set("Cookie", [`jwt=${token}`])
      .send(projetcPayLoad);

    mockProjectId=response.body.newProject._id;

    expect(response.status).toBe(201);
    expect(response.body.message).toBe("project created successfully");
    expect(response.body.newProject).toMatchObject(projetcPayLoad)
  });

  // sending no jwt
  it("should return 401 if JWT is missing", async () => {
    const response = await supertest(app)
      .post("/api/projects/create-project")
      .send({
        name: "Project Without Auth",
        description: "Description",
        githubLink: "https://github.com/test/test",
        usedLanguages: "JavaScript",
      });

    expect(response.status).toBe(401);
    expect(response.body.message).toBe("Unauthorized -no token");
  });

  //missing fields
  it("should return 400 if required fields are missing", async () => {
    const user = await User.create({
      name: "Test User 2",
      email: "test2@example.com",
      password: "hashedpassword",
    });

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET || "testsecret");

    const response = await supertest(app)
      .post("/api/projects/create-project")
      .set("Cookie", [`jwt=${token}`])
      .send({
        name: "", // Missing required fields
      });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("All fields required");
  });
});

//get projects
describe("Get project and contribute", () => {
  it("should fetch projects" , async()=>{
    const token = jwt.sign({ userId: mockUserId }, process.env.JWT_SECRET || "testsecret");

    const res= await supertest(app)
    .get("/api/projects")
    .set("Cookie", [`jwt=${token}`])

    // console.log(res.body.projects[0])

    expect(res.status).toBe(200)

    expect(res.body.projects[0]).toMatchObject(projetcPayLoad)
    expect(res.body.HasMore).toBe(false)
  })

  it("should contribute to projects" , async()=>{
     const user = await User.create({
      name: "Test User 3",
      email: "test3@example.com",
      password: "hashedpassword",
    });
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET || "testsecret");

    const res= await supertest(app)
    .post(`/api/projects/contribute/${mockProjectId}`)
    .set("Cookie", [`jwt=${token}`])


    expect(res.status).toBe(200)

    expect(res.body.message).toBe("Succesfully joined as contributor")

  })

 
})

//get issue
describe("Issue test", () => {
  it("should create new issue", async()=>{
    const token = jwt.sign({ userId: mockUserId }, process.env.JWT_SECRET || "testsecret");

    const res = await supertest(app)
    .post(`/api/projects/raise-issue/${mockProjectId}`)
    .set("Cookie", [`jwt=${token}`])
    .send(projectIssue)

    

    expect(res.status).toBe(201)
    expect(res.body.message).toBe("Issue raised successfully")
    expect(res.body.issue).toMatchObject(projectIssue)
  })
 
})

//issue test resolve
describe("resolve issue", () => {
   it("should fetch post" , async()=>{
    const token = jwt.sign({ userId: mockUserId }, process.env.JWT_SECRET || "testsecret");

    const res= await supertest(app)
    .get(`/api/projects/get-project/${mockProjectId}`)
    .set("Cookie", [`jwt=${token}`])

    // console.log(res.body.projects[0])
    // console.log(res.body.project)

    mockIssueId=res.body.project.issues[0]._id

    expect(res.status).toBe(200)

    expect(res.body.project).toMatchObject(projetcPayLoad)
  })

   it("should resolve issue", async()=>{
    const token = jwt.sign({ userId: mockUserId }, process.env.JWT_SECRET || "testsecret");

    const res = await supertest(app)
    .put(`/api/projects/resolve-issue/${mockIssueId}/from-project/${mockProjectId}`)
    .set("Cookie", [`jwt=${token}`])

    // console.log(res.body)
    // console.log(mockIssueId)
    
    expect(res.status).toBe(200)
    expect(res.body.message).toBe("Issue resolved successfully")
  })
})

//get user projects 
describe("User Projects", () => {
  it("should fetch user-created projects", async () => {
    const token = jwt.sign({ userId: mockUserId }, process.env.JWT_SECRET || "testsecret");

    const res = await supertest(app)
      .get("/api/projects/user-projects")
      .set("Cookie", [`jwt=${token}`]);

    expect(res.status).toBe(200);
    expect(res.body.projects[0]).toMatchObject(projetcPayLoad)
  });
});

//task tests
describe("Tasks flow", () => {

  it("should create a task for the project", async () => {
    const token = jwt.sign({ userId: mockUserId }, process.env.JWT_SECRET || "testsecret");

    const newTask = { taskName: "New Task", taskDescription: "Task details" };

    const res = await supertest(app)
      .post(`/api/projects/create-tasks/${mockProjectId}`)
      .set("Cookie", [`jwt=${token}`])
      .send(newTask);

    mockTaskId = res.body.task._id;

    expect(res.status).toBe(201);
    expect(res.body.message).toBe("Task created successfully");
    expect(res.body.task).toMatchObject(newTask);
  });

  it("should mark task as completed by contributor", async () => {
    // Create another user to complete task
    const user = await User.create({
      name: "Task User",
      email: "taskuser@example.com",
      password: "hashedpassword",
    });
    const contributorToken = jwt.sign({ userId: user._id }, process.env.JWT_SECRET || "testsecret");

    // First contribute to the project
    await supertest(app)
      .post(`/api/projects/contribute/${mockProjectId}`)
      .set("Cookie", [`jwt=${contributorToken}`]);

    const res = await supertest(app)
      .post(`/api/projects/complete-task/${mockTaskId}`)
      .set("Cookie", [`jwt=${contributorToken}`])
      .send({
        text:"test",
        image:"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUA" +
              "AAAFCAYAAACNbyblAAAAHElEQVQI12P4" +
              "//8/w38GIAXDIBKE0DHxgljNBAAO9TXL0Y4OHwAAAABJRU5ErkJggg=="
       });

    console.log(res.body)

    expect(res.status).toBe(200);
    expect(res.body.message).toBe("task submitted succesfully");
  });

  it("should fetch tasks for the project", async () => {
    const token = jwt.sign({ userId: mockUserId }, process.env.JWT_SECRET || "testsecret");

    const res = await supertest(app)
      .get(`/api/projects/get-task/${mockTaskId}`)
      .set("Cookie", [`jwt=${token}`]);

    expect(res.status).toBe(200);
    expect(res.body.task._id).toBe(mockTaskId);
  });

  it("should resolve a task by owner", async () => {
    const token = jwt.sign({ userId: mockUserId }, process.env.JWT_SECRET || "testsecret");

    const res = await supertest(app)
      .put(`/api/projects/resolve-task/${mockTaskId}/solved-by/${mockUserId}`)
      .set("Cookie", [`jwt=${token}`]);

    expect(res.status).toBe(200);
    expect(res.body.message).toBe("Resolved task succesfully");
  });
});


describe("Update Project and delete", () => {
  it("should update", async() => {
    const token = jwt.sign({ userId: mockUserId }, process.env.JWT_SECRET || "testsecret");

    const res = await supertest(app)
    .put(`/api/projects/update-project/${mockProjectId}`)
    .set("Cookie", [`jwt=${token}`])
    .send(UpdatedProject)

    expect(res.status).toBe(200)

    expect(res.body.message).toBe("Project updated successfully")

  })

   it("should Delete", async() => {
    const token = jwt.sign({ userId: mockUserId }, process.env.JWT_SECRET || "testsecret");

    const res = await supertest(app)
    .delete(`/api/projects/delete-project/${mockProjectId}`)
    .set("Cookie", [`jwt=${token}`])
    .send(UpdatedProject)


    expect(res.status).toBe(200)

    expect(res.body.message).toBe("Project deleted successfully")

  })
})
