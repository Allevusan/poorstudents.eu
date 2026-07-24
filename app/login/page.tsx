import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import LoginForm from "./LoginForm";

export const metadata: Metadata = {
  title: "Sign in — poorstudents.eu",
};

export default async function LoginPage() {
  const user = await getCurrentUser();
  if (user) redirect("/account");

  return (
    <div className="mx-auto flex max-w-md flex-col px-4 py-16">
      <h1 className="text-center font-display text-3xl font-extrabold">
        One email. That&apos;s it.
      </h1>
      <p className="mt-3 text-center font-medium text-ink/60">
        We&apos;ll send you a magic link. No password, no documents, no student ID photos.
      </p>
      <div className="card mt-8 p-6 sm:p-8">
        <LoginForm />
      </div>
    </div>
  );
}
