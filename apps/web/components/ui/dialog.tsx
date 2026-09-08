'use client';

import { Dialog as DialogPrimitive } from '@base-ui/react/dialog';
import { XIcon } from 'lucide-react';
import * as React from 'react';

import { cn } from '@/lib/utils';

function Dialog({ ...props }: DialogPrimitive.Root.Props) {
	return <DialogPrimitive.Root data-slot="dialog" {...props} />;
}

function DialogTrigger({ ...props }: DialogPrimitive.Trigger.Props) {
	return <DialogPrimitive.Trigger data-slot="dialog-trigger" {...props} />;
}

function DialogPortal({ ...props }: DialogPrimitive.Portal.Props) {
	return <DialogPrimitive.Portal data-slot="dialog-portal" {...props} />;
}

function DialogClose({ ...props }: DialogPrimitive.Close.Props) {
	return <DialogPrimitive.Close data-slot="dialog-close" {...props} />;
}

function DialogBackdrop({
	className,
	...props
}: DialogPrimitive.Backdrop.Props) {
	return (
		<DialogPrimitive.Backdrop
			data-slot="dialog-backdrop"
			className={cn(
				'fixed inset-0 z-50 bg-black/40 backdrop-blur-[2px] transition-opacity data-ending-style:opacity-0 data-starting-style:opacity-0',
				className,
			)}
			{...props}
		/>
	);
}

function DialogContent({
	className,
	children,
	showCloseButton = true,
	...props
}: DialogPrimitive.Popup.Props & {
	showCloseButton?: boolean;
}) {
	return (
		<DialogPortal>
			<DialogBackdrop />
			<DialogPrimitive.Viewport className="fixed inset-0 z-50 flex items-end justify-center p-4 sm:items-center">
				<DialogPrimitive.Popup
					data-slot="dialog-content"
					className={cn(
						'relative z-50 flex max-h-[min(90dvh,40rem)] w-full max-w-lg flex-col overflow-hidden rounded-xl bg-card text-card-foreground shadow-lg ring-1 ring-foreground/10 outline-none',
						'transition-all data-ending-style:scale-95 data-ending-style:opacity-0 data-starting-style:scale-95 data-starting-style:opacity-0',
						className,
					)}
					{...props}
				>
					{children}
					{showCloseButton ? (
						<DialogPrimitive.Close
							type="button"
							className={cn(
								'absolute top-3 right-3 inline-flex size-7 cursor-pointer items-center justify-center rounded-md text-muted-foreground',
								'transition-colors hover:bg-muted hover:text-foreground',
								'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
							)}
						>
							<XIcon className="size-4 stroke-[1.5]" />
							<span className="sr-only">Close</span>
						</DialogPrimitive.Close>
					) : null}
				</DialogPrimitive.Popup>
			</DialogPrimitive.Viewport>
		</DialogPortal>
	);
}

function DialogHeader({ className, ...props }: React.ComponentProps<'div'>) {
	return (
		<div
			data-slot="dialog-header"
			className={cn('flex flex-col gap-1 px-4 pt-4 pr-12 pb-2', className)}
			{...props}
		/>
	);
}

function DialogFooter({ className, ...props }: React.ComponentProps<'div'>) {
	return (
		<div
			data-slot="dialog-footer"
			className={cn(
				'flex flex-col-reverse gap-2 border-t border-border px-4 py-3 sm:flex-row sm:justify-end',
				className,
			)}
			{...props}
		/>
	);
}

function DialogTitle({ className, ...props }: DialogPrimitive.Title.Props) {
	return (
		<DialogPrimitive.Title
			data-slot="dialog-title"
			className={cn('text-base font-medium text-foreground', className)}
			{...props}
		/>
	);
}

function DialogDescription({
	className,
	...props
}: DialogPrimitive.Description.Props) {
	return (
		<DialogPrimitive.Description
			data-slot="dialog-description"
			className={cn('text-sm text-muted-foreground', className)}
			{...props}
		/>
	);
}

export {
	Dialog,
	DialogBackdrop,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogPortal,
	DialogTitle,
	DialogTrigger,
};
