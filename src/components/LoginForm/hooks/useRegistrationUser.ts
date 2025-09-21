import {
    useMutation,
    UseMutationResult,
    useQueryClient
} from '@tanstack/react-query';
import privateAxios from "@src/api/privateAxios.jsx";


export const registrationUser = async (userObj) => {
    const response = await privateAxios.post<any>(`/api/v1/auth/register`, userObj);
    return response.data;
};

export function useRegistrationUser(): UseMutationResult {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (postQuery: any) => registrationUser(postQuery),
        onSuccess: () => {
            queryClient
                .invalidateQueries({
                    queryKey: ['users']
                })
                .then();
        }
    });
}
