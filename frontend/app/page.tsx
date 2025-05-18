import { ThemeToggle } from "@/components/theme/theme-toggle";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-grow flex items-center justify-center p-4 bg-gray-50 dark:bg-gray-900">
        {/* <div className="text-center space-y-4 max-w-md">
          <h1 className="text-4xl font-bold">Welcome to Community Pulse</h1>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            Connect with your community and stay informed about local events and
            news.
          </p>
          <div className="pt-4">
            <Link
              href="/register"
              className="px-6 py-3 bg-brand-green text-white rounded-md hover:bg-opacity-90 transition-all text-lg font-medium"
            >
              Get Started
            </Link>
          </div>
        </div> */}
      </main>
    </div>
  );
}
