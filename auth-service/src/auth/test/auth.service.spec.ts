import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from '../auth.service';
import { JwtService } from '@nestjs/jwt';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { User } from '../entities/user.entity';
import { CACHE_MANAGER } from '@nestjs/cache-manager';

jest.mock('bcryptjs');

describe('AuthService', () => {
    let authService: AuthService;
    let userRepoMock: jest.Mocked<Repository<User>>;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                AuthService,
                JwtService,
                {
                    provide: getRepositoryToken(User),
                    useValue: {
                        save: jest.fn(),
                        findOne: jest.fn(),
                        create: jest.fn(),
                    },
                },
                {
                    provide: CACHE_MANAGER,
                    useValue: {
                        get: jest.fn(),
                        set: jest.fn(),
                        del: jest.fn(),
                    },
                },
            ],
        }).compile();

        authService = module.get<AuthService>(AuthService);
        userRepoMock = module.get(getRepositoryToken(User));
    });

    describe('register', () => {
        it('should create a new user and save it', async () => {
            const newUser = {
                username: 'testUser',
                email: 'test@example.com',
                password: 'rawPassword',
                firstName: 'manwa',
                lastName: 'rabaya',
            };

            const hashedPassword = 'hashedPassword123';
            (bcrypt.hash as jest.Mock).mockResolvedValue(hashedPassword);

            userRepoMock.findOne.mockResolvedValue(null); // No existing user
            userRepoMock.create.mockImplementation((data) => ({ ...data, id: 1 } as User));
            userRepoMock.save.mockResolvedValue({ ...newUser, password: hashedPassword, id: 1 });

            const result = await authService.register(newUser);

            expect(result).toEqual({ message: 'User registered successfully' });
            expect(userRepoMock.create).toHaveBeenCalledWith({ ...newUser, password: hashedPassword });
            expect(userRepoMock.save).toHaveBeenCalled();
        });
    });

    describe('login', () => {
        it('should throw an error if credentials are invalid', async () => {
            const loginData = { username: 'testUser', password: 'wrongPassword' };

            userRepoMock.findOne.mockResolvedValue({
                id: 1,
                username: 'testUser',
                email: 'test@example.com',
                password: 'hashedPassword123',
            } as User);

            (bcrypt.compare as jest.Mock).mockResolvedValue(false);

            await expect(authService.login(loginData)).rejects.toThrow('Invalid credentials');
        });

        it('should throw an error if user does not exist', async () => {
            const loginData = { username: 'unknownUser', password: 'anyPassword' };

            userRepoMock.findOne.mockResolvedValue(null); // User not found

            await expect(authService.login(loginData)).rejects.toThrow('Invalid credentials');
        });
    });
});
