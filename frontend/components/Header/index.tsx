"use client";

import Link from "next/link";
import React, { useEffect, useState } from "react";
import { ThemeToggle } from "../theme/theme-toggle";
import { authService } from "@/lib/axios";
import { User } from "lucide-react";
import { Button } from "../ui/button";
import { usePathname } from "next/navigation";

const header = () => {
  const pathname = usePathname();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    setIsAuthenticated(authService.isAuthenticated());
  }, [authService.isAuthenticated()]);

  const handleLogout = () => {
    authService.logout();
    setIsAuthenticated(false);
  };

  return (
    <header className="w-full p-4 border-b">
      <div className="flex justify-between items-center">
        <Link href="/" className="text-xl font-semibold">
          Community Pulse
        </Link>
        <div className="flex items-center gap-4">
          {isAuthenticated && (
            <Link
              href="/event/add"
              className="px-4 py-2 border rounded-md hover:bg-gray-50 dark:hover:bg-gray-800 transition-al"
            >
              Add Event
            </Link>
          )}
          <ThemeToggle />
          <div className="space-x-2">
            {isAuthenticated ? (
              <Button
                onClick={handleLogout}
                variant="outline"
                className="cursor-pointer"
              >
                <User className="w-6 h-6 text-gray-800 dark:text-gray-200" />
              </Button>
            ) : (
              <>
                {pathname === "/login" || pathname === "/register" ? (
                  <Link
                    href="/"
                    className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-opacity-90 transition-all"
                  >
                    Home
                  </Link>
                ) : (
                  <>
                    <Link
                      href="/login"
                      className="px-4 py-2 border rounded-md hover:bg-gray-50 dark:hover:bg-gray-800 transition-all"
                    >
                      Login
                    </Link>
                    <Link
                      href="/register"
                      className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-opacity-90 transition-all"
                    >
                      Register
                    </Link>
                  </>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default header;
