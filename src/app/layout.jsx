import "./global.css";
import QueryProvider from "@/components/providers/QueryProvider";

export const metadata = {
  title: "HomestayNepal — Admin",
  description: "Homestay Nepal Administrator Dashboard",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-admin-bg text-admin-text antialiased">
        <QueryProvider>{children}</QueryProvider>
      </body>
    </html>
  );
}

