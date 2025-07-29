import { expect, jest } from '@jest/globals';

// ✅ Mock all modules used inside the controller
jest.unstable_mockModule('../src/models/user.model.js', () => {
  const UserMock = jest.fn().mockImplementation(() => ({
    save: jest.fn().mockResolvedValue(true),
    _id: 'mockId',
    name: 'John Doe',
    email: 'john@example.com',
    profilePic: '',
  }));

  // Add static methods on the constructor
  UserMock.findOne = jest.fn();
  UserMock.findByIdAndUpdate = jest.fn();

  return { default: UserMock };
});

jest.unstable_mockModule('bcryptjs', () => ({
  default: {
    genSalt: jest.fn(),
    hash: jest.fn(),
    compare: jest.fn(),
  },
}));

jest.unstable_mockModule('../src/lib/utils.js', () => ({
  generateToken: jest.fn(),
}));

jest.unstable_mockModule('../src/lib/cloudinary.js', () => ({
  default: { uploader: { upload: jest.fn() } },
}));

jest.unstable_mockModule('../src/lib/stream.js', () => ({
  upsertStreamUser: jest.fn(),
}));



// ✅ Dynamic imports after mocks
const { signup, login, logout, updateProfile, beAdmin, cancelAdmin } = await import('../src/controllers/auth.controller.js');
const User = (await import('../src/models/user.model.js')).default;
const bcrypt = (await import('bcryptjs')).default;
const { generateToken } = await import('../src/lib/utils.js');
const cloudinary = (await import('../src/lib/cloudinary.js')).default;
const { upsertStreamUser } = await import('../src/lib/stream.js');


describe('Auth Controller', () => {
  let req, res, next;

  beforeEach(() => {
    req = { body: {} };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      cookie: jest.fn(),
    };
    next = jest.fn();
    jest.clearAllMocks();
  });

  // ✅ TEST SIGNUP
  describe('signup', () => {
    it('should create a new user and return user data', async () => {
      req.body = { name: 'John Doe', email: 'john@example.com', password: '12345' };

      User.findOne.mockResolvedValue(null);
      bcrypt.genSalt.mockResolvedValue('salt');
      bcrypt.hash.mockResolvedValue('hashedPassword');
      generateToken.mockReturnValue('token');
      upsertStreamUser.mockResolvedValue(true);

      // Mock constructor behavior for User
      User.mockImplementation(() => ({
        save: jest.fn().mockResolvedValue(true),
        _id: 'mockId',
        name: req.body.name,
        email: req.body.email,
        profilePic: '',
      }));

      await signup(req, res, next);

      expect(User.findOne).toHaveBeenCalledWith({ email: 'john@example.com' });
      expect(bcrypt.hash).toHaveBeenCalledWith('12345', 'salt');
      expect(generateToken).toHaveBeenCalledWith('mockId', res);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        _id: 'mockId',
        name: 'John Doe',
        email: 'john@example.com',
        profilePic: '',
      });
    });
  });

  // ✅ TEST LOGIN
  describe('login', () => {
    it('should login user with valid credentials', async () => {
      req.body = { email: 'john@example.com', password: '12345' };
      const userMock = {
        _id: 'mockId',
        name: 'John Doe',
        email: 'john@example.com',
        password: 'hashedPassword',
      };

      User.findOne.mockResolvedValue(userMock);
      bcrypt.compare.mockResolvedValue(true);
      generateToken.mockReturnValue('token');

      await login(req, res, next);

      expect(User.findOne).toHaveBeenCalledWith({ email: 'john@example.com' });
      expect(bcrypt.compare).toHaveBeenCalledWith('12345', 'hashedPassword');
      expect(generateToken).toHaveBeenCalledWith('mockId', res);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        _id: 'mockId',
        name: 'John Doe',
        email: 'john@example.com',
      }));
    });
  });

  // ✅ TEST LOGOUT
  describe('logout', () => {
    it('should clear jwt cookie and return success', async () => {
      await logout(req, res, next);
      expect(res.cookie).toHaveBeenCalledWith('jwt', '', { maxAge: 0 });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ message: 'User logged out successfully' });
    });
  });

  // ✅ TEST UPDATE PROFILE
  describe('updateProfile', () => {
    it('should update user profile and return updated data', async () => {
      req.user = { _id: 'mockId' };
      req.body = { profilePic: 'imageData', description: 'New Bio' };

      cloudinary.uploader.upload.mockResolvedValue({ secure_url: 'http://img.com/test.jpg' });
      User.findByIdAndUpdate.mockResolvedValue({
        _id: 'mockId',
        name: 'John',
        email: 'john@example.com',
        profilePic: 'http://img.com/test.jpg',
        description: 'New Bio',
      });

      await updateProfile(req, res, next);

      expect(cloudinary.uploader.upload).toHaveBeenCalledWith('imageData');
      expect(User.findByIdAndUpdate).toHaveBeenCalledWith('mockId', {
        profilePic: 'http://img.com/test.jpg',
        description: 'New Bio',
      }, { new: true });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        _id: 'mockId',
        name: 'John',
        email: 'john@example.com',
        profilePic: 'http://img.com/test.jpg',
        description: 'New Bio',
      })
    });
  });

  // ✅ TEST BE ADMIN

  //if password mismatch
  describe('beAdminFakePass', () => {
    it('should throw 403 cause wrong credentials', async () => {
      req.user = { isAdmin: false, save: jest.fn() };
      req.body = { password: 'wrong' };
      process.env.ADMIN_PASSWORD = 'correct';

      await beAdmin(req, res, next);

      expect(req.user.isAdmin).toBe(false);
      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith({ message: "Invalid password" });
    });
  });

  //if already admin
  describe('beAdminAlreadyAdmin', () => {
    it('should throw 400 already admin', async () => {
      req.user = { isAdmin: true, save: jest.fn() };
      req.body = { password: 'correct' };
      process.env.ADMIN_PASSWORD = 'correct';

      await beAdmin(req, res, next);

      expect(req.user.isAdmin).toBe(true);//already admin thatswhy
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({  message: "User is already an admin"  });
    });
  });

  //actually becomes admin
  describe('beAdmin', () => {
    it('should promote user to admin', async () => {
      req.user = { isAdmin: false, save: jest.fn() };
      req.body = { password: 'correct' };
      process.env.ADMIN_PASSWORD = 'correct';

      await beAdmin(req, res, next);

      expect(req.user.isAdmin).toBe(true);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ message: "User promoted to admin"  });
    });
  });


  // ✅ TEST CANCEL ADMIN
  describe('cancelAdmin', () => {
    it('should demote admin user', async () => {
      req.user = { isAdmin: true, save: jest.fn() };

      await cancelAdmin(req, res, next);

      expect(req.user.isAdmin).toBe(false);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ message: 'User demoted to regular user' });
    });
  });
});
