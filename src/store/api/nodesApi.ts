import { baseApi } from './baseApi';
import type { Node } from '@/types';

export const nodesApi = baseApi.injectEndpoints({
  endpoints: builder => ({
    getNodes: builder.query<Node[], string>({
      query: funnelId => `/funnels/${funnelId}/nodes`,
      providesTags: (_r, _e, funnelId) => [{ type: 'Node', id: funnelId }],
    }),
    createNode: builder.mutation<Node, { funnelId: string; data: Partial<Node> }>({
      query: ({ funnelId, data }) => ({ url: `/funnels/${funnelId}/nodes`, method: 'POST', body: data }),
      invalidatesTags: (_r, _e, { funnelId }) => [
        { type: 'Node', id: funnelId },
        { type: 'Funnel', id: funnelId },
      ],
    }),
    updateNode: builder.mutation<Node, { id: string; data: Partial<Node> }>({
      query: ({ id, data }) => ({ url: `/nodes/${id}`, method: 'PATCH', body: data }),
      invalidatesTags: ['Node'],
    }),
    deleteNode: builder.mutation<void, { id: string; funnelId: string }>({
      query: ({ id }) => ({ url: `/nodes/${id}`, method: 'DELETE' }),
      invalidatesTags: ['Node', 'Funnel'],
    }),
  }),
});

export const { useGetNodesQuery, useCreateNodeMutation, useUpdateNodeMutation, useDeleteNodeMutation } = nodesApi;
