import Header from "@/components/header";

export default function WebLayout({
  children, // will be a page or nested layout
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
      <main className="xl:container mx-auto p-4">{children}</main>
    </>
  );
}
