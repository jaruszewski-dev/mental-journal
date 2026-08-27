export { registerUser, type RegisterResponse } from "./api/register";
export { verifyEmail, type VerifyEmailResponse } from "./api/verify-email";
export { AuthShell } from "./components/auth-shell";
export { AuthVideo } from "./components/auth-video";
export { LoginView } from "./components/login-view";
export { RegisterForm } from "./components/register-form";
export { RegisterView } from "./components/register-view";
export { VerifyEmailView } from "./components/verify-email-view";
export {
  createRegisterSchema,
  type RegisterFormValues,
} from "./validations/register.schema";
