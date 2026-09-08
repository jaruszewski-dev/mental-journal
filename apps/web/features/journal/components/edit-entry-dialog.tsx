'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import { useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';

import { Button } from '@/components/ui/button';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog';

import { useUpdateEntryMutation } from '../hooks/use-update-entry-mutation';
import {
	updateEntrySchema,
	type JournalTag,
	type UpdateEntryFormValues,
} from '../validations/entry.schema';
import { MoodPicker } from './mood-picker';
import { TagPicker } from './tag-picker';

export type EditEntryValues = {
	content: string;
	mood?: number;
	tags: string[];
};

type EditEntryDialogProps = {
	entryId: string;
	entry: EditEntryValues;
	open: boolean;
	onOpenChange: (open: boolean) => void;
};

export function EditEntryDialog({
	entryId,
	entry,
	open,
	onOpenChange,
}: EditEntryDialogProps) {
	const t = useTranslations('entryActions');
	const tComposer = useTranslations('composer');

	const schema = useMemo(
		() =>
			updateEntrySchema({
				contentRequired: tComposer('errors.contentRequired'),
				contentMax: tComposer('errors.contentMax'),
				tagsMax: tComposer('errors.tagsMax'),
			}),
		[tComposer],
	);

	const { register, handleSubmit, reset, watch, setValue, formState } =
		useForm<UpdateEntryFormValues>({
			resolver: zodResolver(schema),
			defaultValues: {
				content: entry.content,
				mood: entry.mood,
				tags: entry.tags as JournalTag[],
			},
		});

	const content = watch('content');
	const mood = watch('mood');
	const tags = watch('tags');

	useEffect(() => {
		if (!open) return;
		reset({
			content: entry.content,
			mood: entry.mood,
			tags: entry.tags as JournalTag[],
		});
	}, [open, entry, reset]);

	const mutation = useUpdateEntryMutation({
		onSuccess: () => onOpenChange(false),
	});

	function onSubmit(values: UpdateEntryFormValues) {
		mutation.mutate({
			entryId,
			payload: {
				content: values.content.trim(),
				mood: values.mood,
				tags: values.tags,
			},
		});
	}

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>{t('editTitle')}</DialogTitle>
					<DialogDescription>{t('editDescription')}</DialogDescription>
				</DialogHeader>

				<form
					id="edit-entry-form"
					onSubmit={handleSubmit(onSubmit)}
					className="flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto px-4 py-2"
				>
					<textarea
						{...register('content')}
						rows={5}
						placeholder={tComposer('placeholder')}
						className="w-full resize-y rounded-lg bg-background/40 px-3 py-2 text-sm leading-relaxed text-foreground ring-1 ring-border placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
					/>

					{formState.errors.content ? (
						<p className="text-xs text-destructive">
							{formState.errors.content.message}
						</p>
					) : null}

					<TagPicker
						value={tags}
						onChange={(next) =>
							setValue('tags', next as JournalTag[], {
								shouldValidate: true,
							})
						}
					/>

					{formState.errors.tags ? (
						<p className="text-xs text-destructive">
							{formState.errors.tags.message}
						</p>
					) : null}

					<MoodPicker
						value={mood}
						onChange={(v) => setValue('mood', v)}
					/>
				</form>

				<DialogFooter>
					<Button
						type="button"
						variant="outline"
						size="sm"
						className="cursor-pointer"
						onClick={() => onOpenChange(false)}
					>
						{t('cancel')}
					</Button>
					<Button
						type="submit"
						form="edit-entry-form"
						size="sm"
						disabled={!content.trim() || mutation.isPending}
						className="cursor-pointer"
					>
						{t('save')}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
