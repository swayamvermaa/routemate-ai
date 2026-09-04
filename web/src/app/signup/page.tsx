import AuthShell from "@/components/auth/AuthShell";
import SignupForm from "@/components/auth/SignupForm";

export default function SignupPage() {
  return (
    <AuthShell
      eyebrow="Create your account"
      title="Start your smarter commute."
      description="Join RouteMate and discover people travelling your way."
    >
      <SignupForm />
    </AuthShell>
  );
}