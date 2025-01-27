export default function WinesLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="container mx-auto pt-1 pb-6 sm:py-6">
      {children}
    </div>
  );
} 