"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { verifyPin } from "@/lib/auth";

export default function LoginPage() {
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (pin.length !== 6) {
      setError("Please enter a 6-digit PIN");
      return;
    }

    startTransition(async () => {
      const result = await verifyPin(pin);
      if (result.success) {
        router.push("/");
        router.refresh();
      } else {
        setError("Incorrect PIN. Please try again.");
        setPin("");
      }
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-sm">
        <CardHeader className="text-center pb-2">
          <div className="mx-auto w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-3">
            <ShieldCheck className="w-6 h-6 text-primary" />
          </div>
          <h1 className="text-xl font-semibold tracking-tight">
            InsureWright Onboarding
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Enter your PIN to continue
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Input
                type="password"
                inputMode="numeric"
                maxLength={6}
                placeholder="Enter 6-digit PIN"
                value={pin}
                onChange={(e) => {
                  const v = e.target.value.replace(/\D/g, "").slice(0, 6);
                  setPin(v);
                  setError("");
                }}
                className="text-center text-lg tracking-[0.3em] font-mono"
                autoFocus
              />
              {error && (
                <p className="text-sm text-destructive mt-2 text-center">
                  {error}
                </p>
              )}
            </div>
            <Button
              type="submit"
              className="w-full"
              disabled={isPending || pin.length !== 6}
            >
              {isPending ? "Verifying..." : "Sign In"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
