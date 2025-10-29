import { useMutation, UseMutationResult } from '@tanstack/react-query';
import privateAxios from "@src/api/privateAxios.jsx";

interface EmailCheckResponse {
    available: boolean;
    message?: string;
}

export const checkEmailAvailability = async (email: string): Promise<EmailCheckResponse> => {
    const response = await privateAxios.post<EmailCheckResponse>(`/api/v1/auth/check-email`, { email });
    return response.data;
};

export function useCheckEmailAvailability(): UseMutationResult<EmailCheckResponse, any, string> {
    return useMutation({
        mutationFn: (email: string) => checkEmailAvailability(email),
    });
}
