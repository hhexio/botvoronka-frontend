import { baseApi } from './baseApi';
import type { AuthResponse, User } from '@/types';

export const authApi = baseApi.injectEndpoints({
  endpoints: builder => ({
    telegramLogin: builder.mutation<AuthResponse, { initData: string }>({
      query: body => ({ url: '/auth/telegram', method: 'POST', body }),
      invalidatesTags: ['User'],
    }),
    getMe: builder.query<User, void>({
      query: () => '/users/me',
      providesTags: ['User'],
    }),
    demoLogin: builder.mutation<AuthResponse, void>({
      query: () => ({ url: '/auth/demo', method: 'POST' }),
      invalidatesTags: ['User'],
    }),
  }),
});

export const { useTelegramLoginMutation, useGetMeQuery, useDemoLoginMutation } = authApi;
