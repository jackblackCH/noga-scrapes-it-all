import { Footer } from '@/components/footer';
import Header from '@/components/header';

export default function WebLayout({
  children, // will be a page or nested layout
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
      <main className="bg-[#fffdf7] min-h-screen">
        <div className="p-4 mx-auto max-w-6xl">{children}</div>
      </main>
      <Footer />
    </>
  );
}
