import { baseApi } from './baseApi';
import type { Funnel, FunnelTemplate, PaginatedResponse } from '@/types';

export const funnelsApi = baseApi.injectEndpoints({
  endpoints: builder => ({
    getFunnels: builder.query<PaginatedResponse<Funnel>, { page?: number; limit?: number; search?: string }>({
      query: params => ({ url: '/funnels', params }),
      providesTags: ['Funnel'],
    }),
    getFunnel: builder.query<Funnel, string>({
      query: id => `/funnels/${id}`,
      providesTags: (_r, _e, id) => [{ type: 'Funnel', id }],
    }),
    getTemplates: builder.query<FunnelTemplate[], void>({
      query: () => '/funnels/templates',
    }),
    createFromTemplate: builder.mutation<Funnel, { templateId: string; name?: string }>({
      query: body => ({ url: '/funnels/from-template', method: 'POST', body }),
      invalidatesTags: ['Funnel'],
    }),
    updateFunnel: builder.mutation<Funnel, { id: string; data: Partial<Funnel> }>({
      query: ({ id, data }) => ({ url: `/funnels/${id}`, method: 'PATCH', body: data }),
      invalidatesTags: (_r, _e, { id }) => [{ type: 'Funnel', id }],
    }),
    publishFunnel: builder.mutation<Funnel & { botLink: string }, string>({
      query: id => ({ url: `/funnels/${id}/publish`, method: 'PATCH' }),
      invalidatesTags: (_r, _e, id) => [{ type: 'Funnel', id }],
    }),
    deleteFunnel: builder.mutation<void, string>({
      query: id => ({ url: `/funnels/${id}`, method: 'DELETE' }),
      invalidatesTags: ['Funnel'],
    }),
  }),
});

export const {
  useGetFunnelsQuery,
  useGetFunnelQuery,
  useGetTemplatesQuery,
  useCreateFromTemplateMutation,
  useUpdateFunnelMutation,
  usePublishFunnelMutation,
  useDeleteFunnelMutation,
} = funnelsApi;
