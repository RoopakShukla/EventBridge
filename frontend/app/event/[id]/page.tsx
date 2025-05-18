"use client";

import {
  Check,
  Mail,
  Phone,
  Loader2,
  CalendarDays,
  MapPin,
} from "lucide-react";
import { format, parseISO } from "date-fns";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { usePathname, useRouter } from "next/navigation";
import { eventsService } from "@/lib/axios";
import { toast } from "sonner";

const EventPage = () => {
  const pathname = usePathname();
  const router = useRouter();
  const [id, setId] = useState<string | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState<any>(null);
  const [isRegistering, setIsRegistering] = useState(false);

  useEffect(() => {
    const eventId = pathname.split("/").pop();
    if (!eventId) {
      router.push("/");
      return;
    }
    setId(eventId);
  }, [pathname]);

  useEffect(() => {
    const fetchEventData = async () => {
      if (!id) return;

      setIsLoading(true);
      try {
        const res = await eventsService.getEventById(id);
        setData(res);
      } catch (err: any) {
        toast.error("Error loading event", { description: err.message });
        router.push("/");
      } finally {
        setIsLoading(false);
      }
    };

    fetchEventData();
  }, [id]);

  const handleRegister = async () => {
    if (!id) return;

    setIsRegistering(true);
    try {
      await eventsService.registerForEvent(id);
      toast.success("Successfully registered for the event!");
      // Refresh event data to update registration status
      const updatedEvent = await eventsService.getEventById(id);
      setData(updatedEvent);
    } catch (err: any) {
      toast.error("Failed to register", { description: err.message });
    } finally {
      setIsRegistering(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!data) {
    return null;
  }

  return (
    <main className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="flex flex-row w-full h-auto p-6">
        <div className="flex flex-col w-full">
          <div className="relative">
            {data.is_registered && (
              <div className="absolute left-4 top-4 rounded-full bg-green-100 px-3 py-1 text-sm text-green-800 z-10">
                <div className="flex items-center">
                  <Check className="mr-1 h-4 w-4" />
                  Registered
                </div>
              </div>
            )}
            <div className="relative h-72 w-full">
              <Image
                src={data.banner_url || "/placeholder.svg"}
                alt={`${data.name} banner`}
                fill
                className="object-cover brightness-50"
                priority
              />
              <div className="absolute bottom-0 left-0 p-6 text-white">
                <h1 className="text-4xl font-bold">{data.name}</h1>
                <p className="mt-2 text-gray-200">{data.short_description}</p>
              </div>
            </div>
          </div>

          <div className="">
            {/* Event Description */}
            <div className="md:col-span-2 space-y-6">
              <div className="prose dark:prose-invert max-w-none">
                <h2 className="text-2xl font-semibold mb-4">
                  About this event
                </h2>
                <div className="text-gray-600 dark:text-gray-300 whitespace-pre-wrap">
                  {data.description}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Event Details */}
        <div className="space-y-6 bg-white dark:bg-gray-800 p-6 rounded-lg h-fit">
          <div className="right-4 top-4 z-10 w-full">
            <Button
              className="bg-green-700 hover:bg-green-800 w-full"
              onClick={handleRegister}
              disabled={data.is_registered || isRegistering}
            >
              {isRegistering ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Registering...
                </>
              ) : data.is_registered ? (
                "Registered"
              ) : (
                "Register Now"
              )}
            </Button>
          </div>
          {/* Date and Time */}
          <div className="flex items-start gap-3">
            <CalendarDays className="h-5 w-5 text-gray-500" />
            <div>
              <h3 className="font-medium">Date and Time</h3>
              <p className="text-gray-500">
                {format(parseISO(data.start_datetime), "PPP")}
              </p>
              <p className="text-gray-500">
                {format(parseISO(data.start_datetime), "p")} -{" "}
                {format(parseISO(data.end_datetime), "p")}
              </p>
            </div>
          </div>

          {/* Location */}
          <div className="flex items-start gap-3">
            <MapPin className="h-5 w-5 text-gray-500" />
            <div>
              <h3 className="font-medium">Location</h3>
              <p className="text-gray-500 whitespace-pre-wrap">
                {data.location}
              </p>
            </div>
          </div>

          {/* Organizer */}
          <div className="border-t pt-6">
            <h3 className="font-medium mb-2">Organizer Contact</h3>
            {data.organizer_phone && (
              <div className="flex items-center text-gray-500 mb-2">
                <Phone className="mr-2 h-4 w-4" />
                {data.organizer_phone}
              </div>
            )}
            {data.organizer_email && (
              <div className="flex items-center text-gray-500">
                <Mail className="mr-2 h-4 w-4" />
                {data.organizer_email}
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
};

export default EventPage;
