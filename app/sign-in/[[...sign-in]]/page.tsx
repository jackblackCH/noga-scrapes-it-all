import { SignIn } from "@clerk/nextjs";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign In",
  description: "Sign in to your account",
};

export default function SignInPage() {
  return (
    <div className="flex h-screen items-center justify-center">
      <SignIn
        appearance={{
          elements: {
            rootBox: "w-full mx-auto max-w-[440px]",
            card: "shadow-none bg-background",
            headerTitle: "text-2xl font-semibold",
            headerSubtitle: "text-muted-foreground",
            formButtonPrimary:
              "bg-primary hover:bg-primary/90 text-primary-foreground",
            footerAction: "text-muted-foreground",
            formFieldLabel: "text-foreground",
            formFieldInput:
              "bg-background border border-input rounded-md focus:ring-2 focus:ring-ring",
          },
        }}
      />
    </div>
  );
} 