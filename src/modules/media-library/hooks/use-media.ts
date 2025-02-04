import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";
import { rpcClient } from "@/lib/rpc";
import { toast } from "@/hooks/use-toast";
import { ErrorResponse, SuccessResponse } from "@/lib/api-types";

type MediaAllResponse = InferResponseType<typeof rpcClient.api.media.all.$get>;
type MediaAllRequest = InferRequestType<typeof rpcClient.api.media.all.$get>['query'];
type MediaResponse = InferResponseType<typeof rpcClient.api.media[":id"]["$get"]>;
type CreateMediaRequest = InferRequestType<typeof rpcClient.api.media.create.$post>['json'];
type UpdateMediaRequest = InferRequestType<typeof rpcClient.api.media[":id"]["$put"]>['json'];

export const useMediaAll = (params?: Omit<MediaAllRequest, 'page' | 'limit'> & {
    page?: number;
    limit?: number;
}) => {
    const queryParams: MediaAllRequest = {
        ...params,
        page: params?.page?.toString() ?? '1',
        limit: params?.limit?.toString() ?? '10'
    };

    return useQuery<MediaAllResponse, Error>({
        queryKey: ["media", "all", params],
        queryFn: async () => {
            const response = await rpcClient.api.media.all.$get({ query: queryParams });
            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error);
            }
            return response.json();
        }
    });
};

export const useMediaGet = (mediaId: number) => {
    return useQuery<MediaResponse, Error>({
        queryKey: ["media", "get", mediaId],
        queryFn: async () => {
            const response = await rpcClient.api.media[":id"].$get({
                param: { id: mediaId.toString() }
            });
            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error);
            }
            return response.json();
        },
        enabled: !!mediaId
    });
};

export const useMediaCreate = () => {
    const queryClient = useQueryClient();

    return useMutation<MediaResponse, Error, CreateMediaRequest>({
        mutationFn: async (mediaData) => {
            const response = await rpcClient.api.media.create.$post({ json: mediaData });
            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error);
            }
            return response.json();
        },
        onSuccess: () => {
            toast({ title: "Medio creado exitosamente" });
            queryClient.invalidateQueries({ queryKey: ["media", "all"] });
        }
    });
};

export const useMediaUpdate = () => {
    const queryClient = useQueryClient();

    return useMutation<MediaResponse, Error, { id: number; data: UpdateMediaRequest }>({
        mutationFn: async ({ id, data }) => {
            const response = await rpcClient.api.media[":id"].$put({
                param: { id: id.toString() },
                json: data
            });
            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error);
            }
            return response.json();
        },
        onSuccess: (_, variables) => {
            toast({ title: "Medio actualizado exitosamente" });
            queryClient.invalidateQueries({ queryKey: ["media", "all"] });
            queryClient.invalidateQueries({ queryKey: ["media", "get", variables.id] });
        }
    });
};

export const useMediaDelete = () => {
    const queryClient = useQueryClient();

    return useMutation<SuccessResponse, Error, number>({
        mutationFn: async (mediaId) => {
            const response = await rpcClient.api.media[":id"].$delete({
                param: { id: mediaId.toString() }
            });

            if (!response.ok) {
                const error = await response.json() as ErrorResponse;
                throw new Error(error.error);
            }

            return await response.json() as unknown as SuccessResponse;
        },
        onSuccess: (_, mediaId) => {
            toast({ title: "Medio eliminado exitosamente" });
            queryClient.invalidateQueries({ queryKey: ["media", "all"] });
            queryClient.invalidateQueries({ queryKey: ["media", "get", mediaId] });
        }
    });
};