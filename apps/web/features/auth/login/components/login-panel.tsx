import { LoginForm } from "@/features/auth/login/components/login-form";

type LoginPanelProps = {
  verified: boolean;
};

export function LoginPanel({ verified }: LoginPanelProps) {
  return <LoginForm verified={verified} />;
}
