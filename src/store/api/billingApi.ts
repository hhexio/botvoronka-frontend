import { baseApi } from './baseApi';
import type { Subscription } from '@/types';

export const billingApi = baseApi.injectEndpoints({
  endpoints: builder => ({
    getSubscription: builder.query<Subscription, void>({
      query: () => '/billing/subscription',
      providesTags: ['Subscription'],
    }),
    subscribe: builder.mutation<{ paymentUrl?: string; subscription?: Subscription }, { plan: 'FREE' | 'PRO' }>({
      query: body => ({ url: '/billing/subscribe', method: 'POST', body }),
      invalidatesTags: ['Subscription'],
    }),
    confirmDemo: builder.mutation<void, string>({
      query: id => ({ url: `/billing/demo/confirm/${id}`, method: 'POST' }),
      invalidatesTags: ['Subscription'],
    }),
  }),
});

export const { useGetSubscriptionQuery, useSubscribeMutation, useConfirmDemoMutation } = billingApi;
