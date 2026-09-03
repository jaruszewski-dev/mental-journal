"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { SendIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";

import { useCreateEntryMutation } from "../hooks/use-create-entry-mutation";
import {
  createEntrySchema,
  type EntryFormValues,
  type JournalTag,
} from "../validations/entry.schema";
import { MoodPicker } from "./mood-picker";
import { TagPicker } from "./tag-picker";
import { VisibilityToggle } from "./visibility-toggle";

export function Composer() {
  const t = useTranslations("composer");
  const [expanded, setExpanded] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const schema = useMemo(
    () =>
      createEntrySchema({
        contentRequired: t("errors.contentRequired"),
        contentMax: t("errors.contentMax"),
        tagsMax: t("errors.tagsMax"),
      }),
    [t],
  );

  const { register, handleSubmit, reset, watch, setValue, formState } =
    useForm<EntryFormValues>({
      resolver: zodResolver(schema),
      defaultValues: {
        content: "",
        mood: undefined,
        tags: [],
        publish: false,
      },
    });

  const content = watch("content");
  const mood = watch("mood");
  const tags = watch("tags");
  const publish = watch("publish");

  const { ref: rhfRef, ...contentRest } = register("content");

  const collapse = useCallback(() => {
    reset();
    setExpanded(false);
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
  }, [reset]);

  const mutation = useCreateEntryMutation({
    onSuccess: () => {
      toast.success(t("success"));
      collapse();
    },
  });

  useEffect(() => {
    if (!expanded) return;

    function handleClickOutside(e: MouseEvent) {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(e.target as Node) &&
        !content.trim()
      ) {
        collapse();
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [expanded, content, collapse]);

  function onSubmit(values: EntryFormValues) {
    mutation.mutate({
      content: values.content.trim(),
      mood: values.mood,
      tags: values.tags.length > 0 ? values.tags : undefined,
      publish: values.publish || undefined,
    });
  }

  function handleTextareaInput() {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${el.scrollHeight}px`;
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      handleSubmit(onSubmit)();
    }
  }

  return (
    <>
      {expanded ? (
        <div
          className="fixed inset-0 z-10 bg-background/60 backdrop-blur-[2px] md:hidden"
          onClick={() => {
            if (!content.trim()) collapse();
          }}
        />
      ) : null}

      <div
        ref={wrapperRef}
        className="relative z-20 border-b border-border bg-card px-4 py-4"
      >
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="rounded-xl bg-background/40 ring-1 ring-border p-3 transition-all">
            <div
              className="cursor-text"
              onClick={() => textareaRef.current?.focus()}
            >
              <textarea
                {...contentRest}
                ref={(el) => {
                  rhfRef(el);
                  (
                    textareaRef as React.MutableRefObject<HTMLTextAreaElement | null>
                  ).current = el;
                }}
                rows={1}
                placeholder={t("placeholder")}
                className={`w-full resize-none bg-transparent text-sm leading-relaxed text-foreground placeholder:text-muted-foreground focus:outline-none transition-[min-height] duration-150 ease-out ${expanded ? "min-h-[4.5rem]" : "min-h-[1.5rem]"}`}
                onFocus={() => setExpanded(true)}
                onInput={handleTextareaInput}
                onKeyDown={handleKeyDown}
              />
            </div>

            {expanded ? (
              <div className="mt-3 flex flex-col gap-3">
                <TagPicker
                  value={tags}
                  onChange={(next) =>
                    setValue("tags", next as JournalTag[], {
                      shouldValidate: true,
                    })
                  }
                />

                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <MoodPicker
                      value={mood}
                      onChange={(v) => setValue("mood", v)}
                    />
                    <VisibilityToggle
                      isPublic={publish}
                      onChange={(v) => setValue("publish", v)}
                    />
                  </div>

                  <Button
                    type="submit"
                    size="sm"
                    disabled={!content.trim() || mutation.isPending}
                    className="cursor-pointer gap-1.5"
                  >
                    <SendIcon className="size-3.5" />
                    {t("submit")}
                  </Button>
                </div>
              </div>
            ) : null}
          </div>

          {formState.errors.content ? (
            <p className="mt-1.5 px-1 text-xs text-destructive">
              {formState.errors.content.message}
            </p>
          ) : null}
          {formState.errors.tags ? (
            <p className="mt-1.5 px-1 text-xs text-destructive">
              {formState.errors.tags.message}
            </p>
          ) : null}
        </form>
      </div>
    </>
  );
}
