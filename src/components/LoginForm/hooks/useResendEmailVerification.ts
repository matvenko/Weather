import {
    useMutation,
    UseMutationResult,
    useQueryClient
} from '@tanstack/react-query';
import privateAxios from "@src/api/privateAxios.jsx";


export const resendEmail = async (data) => {
    const response = await privateAxios.post<any>(`/api/v1/email/resend-verification-notification`, data);
    return response.data;
};

export function useResendEmailVerification(): UseMutationResult {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: any) => resendEmail(data),
        onSuccess: () => {
            queryClient
                .invalidateQueries({
                    queryKey: ['users']
                })
                .then();
        }
    });
}
