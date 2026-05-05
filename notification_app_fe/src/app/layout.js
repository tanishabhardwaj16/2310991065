import "./globals.css";
import Providers from "@/components/Providers";
import AppLayout from "@/components/AppLayout";

export const metadata = {
  title: "Notification System",
  description: "Stage 7 Frontend Implementation",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <AppLayout>
            {children}
          </AppLayout>
        </Providers>
      </body>
    </html>
  );
}
