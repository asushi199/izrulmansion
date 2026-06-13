"use client";

import Link from "next/link";
import { useFormState, useFormStatus } from "react-dom";
import { loginAction } from "../actions";
import { initialLoginState } from "../../../lib/action-states";

function LoginButton() {
  const { pending } = useFormStatus();

  return (
    <button className="primaryButton fullWidth" disabled={pending} type="submit">
      {pending ? "Menyemak..." : "Log masuk"}
    </button>
  );
}

export default function AdminLoginPage() {
  const [state, formAction] = useFormState(loginAction, initialLoginState);

  return (
    <main className="authShell">
      <section className="authCard">
        <p className="eyebrow">Admin PKG Pantai Remis</p>
        <h1>Log Masuk Admin</h1>
        <p>Masukkan kata laluan admin untuk mengurus tempahan bilik.</p>
        <form action={formAction} className="stackForm">
          <label>
            Kata laluan
            <input autoComplete="current-password" name="password" required type="password" />
          </label>
          {state.message ? <div className="notice error">{state.message}</div> : null}
          <LoginButton />
        </form>
        <Link className="textLink" href="/">
          Kembali ke jadual
        </Link>
      </section>
    </main>
  );
}
