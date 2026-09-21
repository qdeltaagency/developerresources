import { notFound } from "next/navigation";
import { cookies } from "next/headers";
import { AdminStudio } from "@/components/AdminStudio";
import { isValidAdminKey, isValidSessionToken, COOKIE_NAME } from "@/lib/auth";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Not Found",
  robots: {
    index: false,
    follow: false,
  },
};

interface ManagePageProps {
  searchParams: Promise<{ key?: string }>;
}

export default async function ManagePage({ searchParams }: ManagePageProps) {
  const { key } = await searchParams;
  const cookieStore = await cookies();
  const session = cookieStore.get(COOKIE_NAME);

  const isKeyValid = isValidAdminKey(key);
  const isSessionValid = isValidSessionToken(session?.value);

  // Deceptive 404: If neither key nor session is valid, render real 404
  if (!isKeyValid && !isSessionValid) {
    notFound();
  }

  return (
    <>
      {/* If accessed via ?key=..., exchange for session cookie and clean URL immediately */}
      {isKeyValid && (
        <script
          dangerouslySetInnerHTML={{
            __html: `(async function() {
              try {
                await fetch('/api/admin/auth', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ key: ${JSON.stringify(key)} })
                });
                if (window.location.search) {
                  window.history.replaceState(null, '', window.location.pathname);
                }
              } catch (e) {
                console.error('Admin session initialization error', e);
              }
            })();`,
          }}
        />
      )}
      <AdminStudio adminKey={key} />
    </>
  );
}
