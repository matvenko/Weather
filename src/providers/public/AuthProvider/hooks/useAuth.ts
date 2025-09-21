// src/providers/public/AuthProvider/hooks/useAuth.ts
import * as React from "react";
import { AuthContext, type AuthContextProps } from "../AuthContext";

export function useAuth(): AuthContextProps {
  const ctx = React.useContext(AuthContext);
  if (!ctx) {
    console.warn("useAuth() must be used inside <AuthProvider />");
    // @ts-expect-error – როგორც შენ იყენებდი, მაინც ვაბრუნებთ undefined-სგან დაცულს
  }
  return ctx as AuthContextProps;
}
