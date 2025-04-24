import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { JwtService } from '@nestjs/jwt';
import { getModelToken } from '@nestjs/mongoose';

import { AppModule } from '../src/app.module';
import { User } from '../src/modules/user/schemas/user.schema';

jest.mock('bcrypt', () => {
  return {
    genSalt: jest.fn().mockResolvedValue('salt'),
    hash: jest
      .fn()
      .mockResolvedValue(
        '$2y$10$5wmNsE5QwU4VO2v8rRt/0uoR5LcvdpMKgg.ruh4ghF6WrRc3fyaGS',
      ),
    compare: jest.fn().mockImplementation(() => Promise.resolve(true)),
  };
});

describe('Auth Endpoints (e2e)', () => {
  let app: INestApplication;
  let jwtService: JwtService;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let authToken: string;

  const testUser = {
    _id: 'test-id-123',
    name: 'Test User',
    email: 'test@example.com',
    password: '$2y$10$5wmNsE5QwU4VO2v8rRt/0uoR5LcvdpMKgg.ruh4ghF6WrRc3fyaGS',
  };

  const mockUserModel = function () {
    this.save = jest.fn().mockResolvedValue({
      _id: 'test-id-123',
      email: 'test@example.com',
      name: 'Test User',
      password: '$2y$10$5wmNsE5QwU4VO2v8rRt/0uoR5LcvdpMKgg.ruh4ghF6WrRc3fyaGS',
    });
  };

  mockUserModel.findOne = jest.fn();
  mockUserModel.findById = jest.fn();

  beforeEach(async () => {
    mockUserModel.findOne.mockReset();
    mockUserModel.findById.mockReset();

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(getModelToken(User.name))
      .useValue(mockUserModel)
      .compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        transform: true,
      }),
    );
    app.setGlobalPrefix('api');
    jwtService = moduleFixture.get<JwtService>(JwtService);

    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });
  it('should register a new user', () => {
    mockUserModel.findOne.mockReturnValue({
      exec: jest.fn().mockResolvedValue(null),
    });

    return request(app.getHttpServer())
      .post('/api/auth/signup')
      .send({
        name: 'Test User',
        email: 'test@example.com',
        password: 'wassup-easygenerator1@',
      })
      .expect(201)
      .expect((res) => {
        expect(res.body.user).toBeDefined();
        expect(res.body.token).toBeDefined();
        expect(res.body.user.email).toEqual('test@example.com');
        expect(res.body.user.name).toEqual('Test User');

        expect(res.body.user.password).toBeUndefined();
      });
  });

  it('should authenticate user and return a token', () => {
    mockUserModel.findOne.mockReturnValue({
      exec: jest.fn().mockResolvedValue(testUser),
    });

    return request(app.getHttpServer())
      .post('/api/auth/signin')
      .send({
        email: 'test@example.com',
        password: 'wassup-easygenerator1@',
      })
      .expect(201)
      .expect((res) => {
        expect(res.body.user).toBeDefined();
        expect(res.body.token).toBeDefined();
        authToken = res.body.token;
      });
  });

  it('should get user profile with valid token', () => {
    const token = jwtService.sign({ sub: testUser._id });

    mockUserModel.findById.mockReturnValue({
      exec: jest.fn().mockResolvedValue(testUser),
    });

    return request(app.getHttpServer())
      .get('/api/auth/profile')
      .set('Authorization', `Bearer ${token}`)
      .expect(200)
      .expect((res) => {
        expect(res.body.email).toEqual(testUser.email);
        expect(res.body.name).toEqual(testUser.name);
      });
  });

  it('should reject unauthorized access to protected route', () => {
    return request(app.getHttpServer()).get('/api/auth/profile').expect(401);
  });
});
