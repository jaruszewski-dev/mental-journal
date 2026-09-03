import { useMutation } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { toast } from "sonner";

import { resolveApiErrorMessage } from "@/lib/api-error";

import { createEntry } from "../api/create-entry";

export function useCreateEntryMutation(options?: { onSuccess?: () => void }) {
  const tApi = useTranslations("apiErrors");

  return useMutation({
    mutationFn: createEntry,
    onSuccess: () => {
      options?.onSuccess?.();
    },
    onError: (error) => {
      toast.error(resolveApiErrorMessage(error, tApi));
    },
  });
}
