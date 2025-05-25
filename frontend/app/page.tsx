"use client";

import { useEffect, useState } from "react";
import { authService, eventsService } from "@/lib/axios";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { format, parseISO } from "date-fns";
import { MapPin, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import EventCard from "@/components/Home/EventCard";
import AdminEventCard from "@/components/Home/Admin/EventCard";

export default function Home() {
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [data, setData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchEvents = async () => {
    try {
      setIsLoading(true);
      const isAuthenticated = await authService.isAuthenticated();
      let isAdminUser = false;

      if (isAuthenticated) {
        isAdminUser = await authService.isAdmin();
        setIsAdmin(isAdminUser);
      }

      const response = isAdminUser
        ? await eventsService.getAdminEvents()
        : await eventsService.getEvents();

      setData(response);
    } catch (error: any) {
      toast.error("Error loading events", { description: error.message });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 dark:border-white" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-grow flex p-8 bg-gray-50 dark:bg-gray-900">
        <div className="fixed bottom-4 right-4">
          <Button variant={"outline"} size={"lg"} className="cursor-pointer">
            <Plus />
            Add Event
          </Button>
        </div>
        <div className="flex justify-center max-w-[1280px] w-full mx-auto">
          <div className="grid grid-cols-4 w-full gap-4">
            {data.map((event: any) => (
              <div key={event.id}>
                {isAdmin ? (
                  <AdminEventCard
                    key={event.id}
                    event={event}
                    fetchEvents={fetchEvents}
                  />
                ) : (
                  <EventCard
                    key={event.id}
                    event={event}
                    fetchEvents={fetchEvents}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
