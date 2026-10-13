export const metadata = {
  title: "Admin Login — Homestay Nepal",
  description: "Secure administrator login for Homestay Nepal management",
};

export default function LoginLayout({ children }) {
  return (
    <div className="min-h-screen w-full bg-admin-bg flex items-center justify-center p-4">
      {children}
    </div>
  );
}
