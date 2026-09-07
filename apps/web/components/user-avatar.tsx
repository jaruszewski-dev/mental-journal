import { cn } from '@/lib/utils';

type UserAvatarProps = {
	anonName: string;
	avatarUrl?: string | null;
	className?: string;
};

export function initialFromAnonName(anonName?: string) {
	const trimmed = anonName?.trim();
	if (!trimmed) return '?';
	return trimmed.charAt(0).toUpperCase();
}

export function UserAvatar({ anonName, avatarUrl, className }: UserAvatarProps) {
	return (
		<span
			className={cn(
				'inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-accent',
				'font-heading font-medium text-foreground',
				className,
			)}
			aria-hidden={avatarUrl ? undefined : true}
		>
			{avatarUrl ? (
				<img src={avatarUrl} alt="" className="size-full object-cover" />
			) : (
				initialFromAnonName(anonName)
			)}
		</span>
	);
}
