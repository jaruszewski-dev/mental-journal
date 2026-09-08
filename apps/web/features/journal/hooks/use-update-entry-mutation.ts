import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { toast } from 'sonner';

import { resolveApiErrorMessage } from '@/lib/api-error';

import { updateEntry, type UpdateEntryPayload } from '../api/update-entry';
import { journalQueryKey } from '../consts/journal-query-key';

type UpdateEntryVariables = {
	entryId: string;
	payload: UpdateEntryPayload;
};

export function useUpdateEntryMutation(options?: { onSuccess?: () => void }) {
	const t = useTranslations('entryActions');
	const tApi = useTranslations('apiErrors');
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({ entryId, payload }: UpdateEntryVariables) =>
			updateEntry(entryId, payload),
		onSuccess: () => {
			void queryClient.invalidateQueries({ queryKey: journalQueryKey });
			toast.success(t('editSuccess'), { position: 'bottom-center' });
			options?.onSuccess?.();
		},
		onError: (error) => {
			toast.error(resolveApiErrorMessage(error, tApi));
		},
	});
}
