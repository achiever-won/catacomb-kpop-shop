import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User, LoginResult, RegistrationData, RegistrationResult } from '../types';
import { demoUser, demoPassword } from '../data/demo';
import { validateEmail, validatePassword } from '../utils/validators';

interface RegisteredUser {
  email: string;
  password: string;
  user: User;
}

interface AuthStore {
  user: User | null;
  isAuthenticated: boolean;
  registeredUsers: RegisteredUser[];
  login: (email: string, password: string) => LoginResult;
  register: (data: RegistrationData) => RegistrationResult;
  logout: () => void;
  initDemoSession: () => void;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      registeredUsers: [],

      login: (email: string, password: string): LoginResult => {
        // Check against demo credentials
        if (email === demoUser.email && password === demoPassword) {
          set({ user: demoUser, isAuthenticated: true });
          return { success: true };
        }

        // Check against registered users
        const { registeredUsers } = get();
        const matchedUser = registeredUsers.find(
          (ru) => ru.email === email && ru.password === password
        );

        if (matchedUser) {
          set({ user: matchedUser.user, isAuthenticated: true });
          return { success: true };
        }

        // Generic error - not field-specific
        return { success: false, error: '이메일 또는 비밀번호가 올바르지 않습니다' };
      },

      register: (data: RegistrationData): RegistrationResult => {
        const errors: Record<string, string> = {};

        // Validate email
        const emailResult = validateEmail(data.email);
        if (!emailResult.valid) {
          errors.email = emailResult.error!;
        }

        // Validate password
        const passwordResult = validatePassword(data.password);
        if (!passwordResult.valid) {
          errors.password = passwordResult.error!;
        }

        // If there are validation errors, return them
        if (Object.keys(errors).length > 0) {
          return { success: false, errors };
        }

        // Check if email is already registered
        const { registeredUsers } = get();
        if (
          registeredUsers.some((ru) => ru.email === data.email) ||
          data.email === demoUser.email
        ) {
          return { success: false, errors: { email: '이미 등록된 이메일입니다' } };
        }

        // Create the new user
        const newUser: User = {
          email: data.email,
          name: data.name,
          shippingAddress: data.shippingAddress,
        };

        const newRegisteredUser: RegisteredUser = {
          email: data.email,
          password: data.password,
          user: newUser,
        };

        // Store the user and authenticate
        set({
          registeredUsers: [...registeredUsers, newRegisteredUser],
          user: newUser,
          isAuthenticated: true,
        });

        return { success: true };
      },

      logout: () => {
        set({ user: null, isAuthenticated: false });
      },

      initDemoSession: () => {
        const { isAuthenticated } = get();
        if (!isAuthenticated) {
          set({ user: demoUser, isAuthenticated: true });
        }
      },
    }),
    {
      name: 'catacomb-auth',
    }
  )
);
