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
import { type CreateCommentFormValues, createCommentSchema } from '../validations/create-comment.schema';

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
		<form onSubmit={handleSubmit(onSubmit)} className="pb-3">
			<div className="flex items-start gap-2">
				<UserAvatar
					anonName={me?.anonName ?? ''}
					avatarUrl={me?.avatarUrl}
					className="mt-0.5 size-7 text-xs"
				/>
				<div className="min-w-0 flex-1 rounded-xl bg-background/40 p-2.5 ring-1 ring-border">
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
						className="max-h-40 min-h-[1.5rem] w-full resize-none bg-transparent text-sm leading-relaxed text-foreground placeholder:text-muted-foreground focus:outline-none"
						onInput={handleTextareaInput}
						onKeyDown={handleKeyDown}
					/>
					<div className="mt-1.5 flex justify-end">
						<Button
							type="submit"
							size="sm"
							disabled={!content?.trim() || mutation.isPending}
							className="cursor-pointer gap-1.5"
						>
							<SendIcon className="size-3.5" />
							{t('submit')}
						</Button>
					</div>
				</div>
			</div>
			{formState.errors.content ? (
				<p className="mt-1.5 pl-9 text-xs text-destructive">
					{formState.errors.content.message}
				</p>
			) : null}
		</form>
	);
}
