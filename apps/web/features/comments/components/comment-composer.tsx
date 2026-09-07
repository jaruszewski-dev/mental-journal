'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { SendIcon } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useMemo, useRef } from 'react';
import { useForm } from 'react-hook-form';

import { Button } from '@/components/ui/button';
import { UserAvatar } from '@/components/user-avatar';
import { useAuthMeStore } from '@/store/auth-me.store';

import { MAX_COMMENT_CONTENT_LENGTH } from '../consts/comment.const';
import { useCreateCommentMutation } from '../hooks/use-create-comment-mutation';
import {
	type CreateCommentFormValues,
	createCommentSchema,
} from '../validations/create-comment.schema';

type CommentComposerProps = {
	postId: string;
};

export function CommentComposer({ postId }: CommentComposerProps) {
	const t = useTranslations('comments');
	const me = useAuthMeStore((s) => s.me);
	const textareaRef = useRef<HTMLTextAreaElement>(null);

	const schema = useMemo(
		() =>
			createCommentSchema({
				contentRequired: t('errors.contentRequired'),
				contentMax: t('errors.contentMax', { max: MAX_COMMENT_CONTENT_LENGTH }),
			}),
		[t],
	);

	const { register, handleSubmit, reset, watch, formState } = useForm<CreateCommentFormValues>({
		resolver: zodResolver(schema),
		defaultValues: { content: '' },
	});

	const content = watch('content');
	const { ref: rhfRef, ...contentRest } = register('content');

	const mutation = useCreateCommentMutation({
		onSuccess: () => {
			reset();
			if (textareaRef.current) {
				textareaRef.current.style.height = 'auto';
			}
		},
	});

	function onSubmit(values: CreateCommentFormValues) {
		mutation.mutate({
			postId,
			content: values.content.trim(),
		});
	}

	function handleTextareaInput() {
		const el = textareaRef.current;
		if (!el) return;
		el.style.height = 'auto';
		el.style.height = `${el.scrollHeight}px`;
	}

	function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
		if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
			e.preventDefault();
			void handleSubmit(onSubmit)();
		}
	}

	return (
		<form
			onSubmit={handleSubmit(onSubmit)}
			className="border-t border-border/60 pt-3"
		>
			<div className="flex items-end gap-2">
				<UserAvatar
					anonName={me?.anonName ?? ''}
					avatarUrl={me?.avatarUrl}
					className="mb-1 size-7 text-xs"
				/>
				<div className="min-w-0 flex-1">
					<textarea
						{...contentRest}
						ref={(el) => {
							rhfRef(el);
							(
								textareaRef as React.MutableRefObject<HTMLTextAreaElement | null>
							).current = el;
						}}
						rows={1}
						placeholder={t('placeholder')}
						maxLength={MAX_COMMENT_CONTENT_LENGTH}
						className="max-h-40 min-h-9 w-full resize-none overflow-y-auto border-0 border-b border-border/60 bg-transparent px-0 py-2 text-sm leading-relaxed text-foreground placeholder:text-muted-foreground focus:border-foreground/40 focus:outline-none [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
						onInput={handleTextareaInput}
						onKeyDown={handleKeyDown}
					/>
					{formState.errors.content ? (
						<p className="mt-1 text-xs text-destructive">
							{formState.errors.content.message}
						</p>
					) : null}
				</div>
				<Button
					type="submit"
					size="icon-sm"
					disabled={!content?.trim() || mutation.isPending}
					className="mb-1 cursor-pointer"
					aria-label={t('submit')}
				>
					<SendIcon className="size-3.5" />
				</Button>
			</div>
		</form>
	);
}
