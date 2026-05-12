"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";

export function useAdminAuth({ redirectOnFail = true } = {}) {
  const [isAuth, setIsAuth] = useState<boolean | null>(null);
  const router = useRouter();

  const checkAuth = useCallback(async () => {
    try {
      const res = await fetch("/api/auth/me", { credentials: "same-origin" });
      if (res.ok) {
        setIsAuth(true);
      } else {
        setIsAuth(false);
        if (redirectOnFail) router.push("/admin/login");
      }
    } catch {
      setIsAuth(false);
      if (redirectOnFail) router.push("/admin/login");
    }
  }, [redirectOnFail, router]);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const logout = useCallback(async () => {
    await fetch("/api/auth", { method: "DELETE", credentials: "same-origin" });
    setIsAuth(false);
    router.push("/admin/login");
  }, [router]);

  return { isAuth, logout, checkAuth };
}
