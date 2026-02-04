import { baseApi } from './baseApi';
import type { FunnelAnalytics, UserAnalytics } from '@/types';

export const analyticsApi = baseApi.injectEndpoints({
  endpoints: builder => ({
    getUserAnalytics: builder.query<UserAnalytics, void>({
      query: () => '/analytics',
      providesTags: ['Analytics'],
    }),
    getFunnelAnalytics: builder.query<FunnelAnalytics, string>({
      query: id => `/analytics/funnel/${id}`,
      providesTags: (_r, _e, id) => [{ type: 'Analytics', id }],
    }),
  }),
});

export const { useGetUserAnalyticsQuery, useGetFunnelAnalyticsQuery } = analyticsApi;
