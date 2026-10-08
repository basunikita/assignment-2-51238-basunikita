import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: { default: "A Week of Workouts", template: "%s · A Week of Workouts" },
  description: "Three mood boards, three design systems, and a site for a week of workouts.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
