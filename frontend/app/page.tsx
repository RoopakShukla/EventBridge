"use client";

import { useEffect, useState } from "react";
import { authService, eventsService } from "@/lib/axios";

export default function Home() {
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    setIsAdmin(authService.isAdmin());
  }, [authService.isAuthenticated()]);

  useEffect(() => {
    setData(eventsService.getEvents({ is_admin: isAdmin }));
  }, [isAdmin]);

  useEffect(() => {
    console.log(data);
  }, [data]);

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
        <div className="grid grid-cols-4">
          {data !== null && data.map((event: any) => (
            <div
              key={event.id}
              className="p-4 border rounded-md shadow-md bg-white dark:bg-gray-800"
            >
              <h2 className="text-xl font-semibold">{event.title}</h2>
              <p className="text-gray-600 dark:text-gray-300">
                {event.description}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {new Date(event.date).toLocaleDateString()}
              </p>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
