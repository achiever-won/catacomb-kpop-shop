import { describe, it, expect, beforeEach } from 'vitest';
import { useAuthStore } from '../../../stores/authStore';
import { demoUser, demoPassword } from '../../../data/demo';

describe('Auth Store', () => {
  beforeEach(() => {
    // Reset store state before each test
    useAuthStore.setState({
      user: null,
      isAuthenticated: false,
      registeredUsers: [],
    });
  });

  describe('initDemoSession', () => {
    it('should auto-authenticate as demo user when not authenticated', () => {
      useAuthStore.getState().initDemoSession();

      const state = useAuthStore.getState();
      expect(state.isAuthenticated).toBe(true);
      expect(state.user).toEqual(demoUser);
    });

    it('should not override existing authenticated user', () => {
      const customUser = {
        email: 'custom@test.com',
        name: 'Custom User',
        shippingAddress: {
          recipientName: 'Custom',
          street: '123 St',
          city: 'Seoul',
          postalCode: '12345',
          phone: '010-0000-0000',
        },
      };

      useAuthStore.setState({ user: customUser, isAuthenticated: true });
      useAuthStore.getState().initDemoSession();

      const state = useAuthStore.getState();
      expect(state.user).toEqual(customUser);
    });
  });

  describe('login', () => {
    it('should authenticate with demo credentials', () => {
      const result = useAuthStore.getState().login(demoUser.email, demoPassword);

      expect(result).toEqual({ success: true });
      const state = useAuthStore.getState();
      expect(state.isAuthenticated).toBe(true);
      expect(state.user).toEqual(demoUser);
    });

    it('should authenticate with registered user credentials', () => {
      // First register a user
      useAuthStore.getState().register({
        email: 'test@example.com',
        password: 'password123',
        name: 'Test User',
        shippingAddress: {
          recipientName: 'Test',
          street: '456 Ave',
          city: 'Busan',
          postalCode: '67890',
          phone: '010-9999-9999',
        },
      });

      // Logout
      useAuthStore.getState().logout();

      // Login with registered credentials
      const result = useAuthStore.getState().login('test@example.com', 'password123');

      expect(result).toEqual({ success: true });
      expect(useAuthStore.getState().isAuthenticated).toBe(true);
      expect(useAuthStore.getState().user?.email).toBe('test@example.com');
    });

    it('should return generic error for invalid credentials', () => {
      const result = useAuthStore.getState().login('wrong@email.com', 'wrongpassword');

      expect(result).toEqual({
        success: false,
        error: '이메일 또는 비밀번호가 올바르지 않습니다',
      });
      expect(useAuthStore.getState().isAuthenticated).toBe(false);
    });

    it('should return generic error for correct email with wrong password', () => {
      const result = useAuthStore.getState().login(demoUser.email, 'wrongpassword');

      expect(result).toEqual({
        success: false,
        error: '이메일 또는 비밀번호가 올바르지 않습니다',
      });
    });
  });

  describe('register', () => {
    it('should register a valid user and authenticate', () => {
      const result = useAuthStore.getState().register({
        email: 'newuser@example.com',
        password: 'securepass123',
        name: 'New User',
        shippingAddress: {
          recipientName: 'New User',
          street: '789 Blvd',
          city: 'Incheon',
          postalCode: '11111',
          phone: '010-1111-1111',
        },
      });

      expect(result).toEqual({ success: true });
      const state = useAuthStore.getState();
      expect(state.isAuthenticated).toBe(true);
      expect(state.user?.email).toBe('newuser@example.com');
      expect(state.user?.name).toBe('New User');
      expect(state.registeredUsers).toHaveLength(1);
    });

    it('should return field-specific error for invalid email', () => {
      const result = useAuthStore.getState().register({
        email: 'invalid-email',
        password: 'securepass123',
        name: 'Test',
        shippingAddress: {
          recipientName: 'Test',
          street: '123 St',
          city: 'Seoul',
          postalCode: '12345',
          phone: '010-0000-0000',
        },
      });

      expect(result.success).toBe(false);
      expect(result.errors?.email).toBe('올바른 이메일 형식이 아닙니다');
    });

    it('should return field-specific error for short password', () => {
      const result = useAuthStore.getState().register({
        email: 'valid@example.com',
        password: 'short',
        name: 'Test',
        shippingAddress: {
          recipientName: 'Test',
          street: '123 St',
          city: 'Seoul',
          postalCode: '12345',
          phone: '010-0000-0000',
        },
      });

      expect(result.success).toBe(false);
      expect(result.errors?.password).toBe('비밀번호는 최소 8자 이상이어야 합니다');
    });

    it('should return field-specific error for long password', () => {
      const result = useAuthStore.getState().register({
        email: 'valid@example.com',
        password: 'a'.repeat(65),
        name: 'Test',
        shippingAddress: {
          recipientName: 'Test',
          street: '123 St',
          city: 'Seoul',
          postalCode: '12345',
          phone: '010-0000-0000',
        },
      });

      expect(result.success).toBe(false);
      expect(result.errors?.password).toBe('비밀번호는 최대 64자까지 가능합니다');
    });

    it('should reject duplicate email registration', () => {
      // Register first user
      useAuthStore.getState().register({
        email: 'existing@example.com',
        password: 'password123',
        name: 'First User',
        shippingAddress: {
          recipientName: 'First',
          street: '123 St',
          city: 'Seoul',
          postalCode: '12345',
          phone: '010-0000-0000',
        },
      });

      // Try to register same email
      const result = useAuthStore.getState().register({
        email: 'existing@example.com',
        password: 'password456',
        name: 'Second User',
        shippingAddress: {
          recipientName: 'Second',
          street: '456 St',
          city: 'Busan',
          postalCode: '67890',
          phone: '010-1111-1111',
        },
      });

      expect(result.success).toBe(false);
      expect(result.errors?.email).toBe('이미 등록된 이메일입니다');
    });

    it('should reject registration with demo email', () => {
      const result = useAuthStore.getState().register({
        email: demoUser.email,
        password: 'password123',
        name: 'Impersonator',
        shippingAddress: {
          recipientName: 'Test',
          street: '123 St',
          city: 'Seoul',
          postalCode: '12345',
          phone: '010-0000-0000',
        },
      });

      expect(result.success).toBe(false);
      expect(result.errors?.email).toBe('이미 등록된 이메일입니다');
    });
  });

  describe('logout', () => {
    it('should clear user and set isAuthenticated to false', () => {
      // First authenticate
      useAuthStore.getState().initDemoSession();
      expect(useAuthStore.getState().isAuthenticated).toBe(true);

      // Then logout
      useAuthStore.getState().logout();

      const state = useAuthStore.getState();
      expect(state.user).toBeNull();
      expect(state.isAuthenticated).toBe(false);
    });
  });
});
