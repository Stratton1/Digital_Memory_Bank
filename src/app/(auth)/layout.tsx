export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4 py-12">
      <div className="mb-8 text-center">
        <h1 className="font-serif text-3xl font-bold tracking-tight text-foreground">
          Memory Bank
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Preserve your family&apos;s story
        </p>
      </div>
      <div className="w-full max-w-md">{children}</div>
    </div>
  );
}
