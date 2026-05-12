"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export function useAdminAuth() {
  const [isAuth, setIsAuth] = useState<boolean | null>(null);
  const router = useRouter();

  useEffect(() => {
    fetch("/api/settings", { credentials: "same-origin" })
      .then(() => setIsAuth(true))
      .catch(() => {
        setIsAuth(false);
        router.push("/admin/login");
      });
  }, [router]);

  return isAuth;
}
