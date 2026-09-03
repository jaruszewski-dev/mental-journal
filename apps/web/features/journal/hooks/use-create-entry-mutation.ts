import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { toast } from "sonner";

import { feedQueryKey } from "@/features/feed/consts/feed-query-key";
import { resolveApiErrorMessage } from "@/lib/api-error";

import { createEntry } from "../api/create-entry";

export function useCreateEntryMutation(options?: { onSuccess?: () => void }) {
  const tApi = useTranslations("apiErrors");
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createEntry,
    onSuccess: (_data, variables) => {
      if (variables.publish) {
        void queryClient.invalidateQueries({ queryKey: feedQueryKey });
      }
      options?.onSuccess?.();
    },
    onError: (error) => {
      toast.error(resolveApiErrorMessage(error, tApi));
    },
  });
}
