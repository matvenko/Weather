import {
    useMutation,
    UseMutationResult,
    useQueryClient
} from '@tanstack/react-query';
import privateAxios from "@src/api/privateAxios.jsx";


export const loginUser = async (userObj) => {
    const response = await privateAxios.post<any>(`/api/v1/auth/login`, userObj);
    return response.data;
};

export function useLoginUser(): UseMutationResult {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (postQuery: any) => loginUser(postQuery),
        onSuccess: () => {
            queryClient
                .invalidateQueries({
                    queryKey: ['users']
                })
                .then();
        }
    });
}
