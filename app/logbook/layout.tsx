export default function LogbookLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Parchment background scoped to /logbook, layered above the root body.
  return (
    <div className="bg-parchment min-h-screen w-full">
      {children}
    </div>
  );
}
