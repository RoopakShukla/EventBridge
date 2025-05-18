"use client";

import { useEffect, useState } from "react";
import { authService, eventsService } from "@/lib/axios";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { format, parseISO } from "date-fns";
import { MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [data, setData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchEvents = async () => {
    try {
      setIsLoading(true);
      const isAuthenticated = authService.isAuthenticated();
      const isAdminUser = isAuthenticated && authService.isAdmin();
      setIsAdmin(isAdminUser);

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

  const handleApprove = async (eventId: string) => {
    try {
      await eventsService.approveEvent(eventId);
      toast.success("Event approved successfully");
      fetchEvents();
    } catch (error: any) {
      toast.error("Failed to approve event", { description: error.message });
    }
  };

  const handleReject = async (eventId: string) => {
    try {
      await eventsService.rejectEvent(eventId);
      toast.success("Event rejected successfully");
      fetchEvents();
    } catch (error: any) {
      toast.error("Failed to reject event", { description: error.message });
    }
  };

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
        <div className="flex justify-center max-w-[1280px] w-full mx-auto">
          <div className="grid grid-cols-4 w-full gap-4">
            {data.map((event: any) => (
              <div
                key={event.id}
                className="p-4 border h-fit rounded-md shadow-md bg-white dark:bg-gray-800"
              >
                <div className="flex items-center justify-between mb-4 gap-4">
                  <Badge className="bg-green-300/20 text-green-500">
                    {event.category}
                  </Badge>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {format(parseISO(event.start_datetime), "LLL dd")}
                  </p>
                </div>
                <div className="flex flex-col gap-4">
                  <div className="flex flex-col gap-2">
                    <Link href={`/event/${event.id}`}>
                      <h2 className="text-xl font-semibold hover:underline underline-offset-1">
                        {event.name}
                      </h2>
                    </Link>
                    <p className="text-gray-600 dark:text-gray-300">
                      {event.description}
                    </p>
                  </div>
                  {isAdmin ? (
                    <div className="flex gap-2">
                      {event.status === "approved" ? (
                        <Button
                          className="flex-1 bg-green-500 hover:bg-green-600"
                          size="sm"
                          disabled
                        >
                          Approved
                        </Button>
                      ) : event.status === "rejected" ? (
                        <Button
                          className="flex-1 bg-red-500 hover:bg-red-600"
                          size="sm"
                          disabled
                        >
                          Rejected
                        </Button>
                      ) : (
                        <>
                          <Button
                            onClick={() => handleApprove(event.id)}
                            className="flex-1 bg-green-500 hover:bg-green-600"
                            size="sm"
                          >
                            Approve
                          </Button>
                          <Button
                            onClick={() => handleReject(event.id)}
                            variant="destructive"
                            className="flex-1"
                            size="sm"
                          >
                            Reject
                          </Button>
                        </>
                      )}
                    </div>
                  ) : (
                    <p className="flex flex-row gap-1 text-sm text-gray-600 dark:text-gray-300">
                      <MapPin className="w-4" />
                      {event.location}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
