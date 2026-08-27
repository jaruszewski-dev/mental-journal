import { cn } from "@/lib/utils";

const AUTH_VIDEO_BASE = "/auth/mental-journal-auth-movie";
const AUTH_POSTER = "/auth/mental-journal-auth-poster.webp";

type AuthVideoProps = {
  className?: string;
};

export function AuthVideo({ className }: AuthVideoProps) {
  return (
    <video
      className={cn("h-full w-full object-cover", className)}
      poster={AUTH_POSTER}
      autoPlay
      muted
      loop
      playsInline
      preload="metadata"
      aria-hidden
    >
      <source src={`${AUTH_VIDEO_BASE}.webm`} type="video/webm" />
      <source src={`${AUTH_VIDEO_BASE}.mp4`} type="video/mp4" />
    </video>
  );
}
