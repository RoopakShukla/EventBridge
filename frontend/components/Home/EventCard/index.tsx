import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { eventsService } from "@/lib/axios";
import { capitalizeWords } from "@/lib/utils";
import { format, parseISO } from "date-fns";
import { Flag, MapPin } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React from "react";
import { toast } from "sonner";

const EventCard = ({
  event,
  isAdmin,
  fetchEvents,
}: {
  event: any;
  isAdmin: Boolean;
  fetchEvents: () => void;
}) => {
  const router = useRouter();

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

  const handleFlag = async (eventId: string, status: boolean) => {
    try {
      if (status) {
        await eventsService.unflagEvent(eventId);
        toast.success("Event unflagged successfully");
      } else {
        await eventsService.flagEvent(eventId);
        toast.success("Event flagged successfully");
      }
      fetchEvents();
    } catch (error: any) {
      toast.error("Failed to flag event", { description: error.message });
    }
  };

  return (
    <div
      key={event.id}
      className="px-3 pt-3 pb-2.5 border h-fit rounded-lg shadow-md bg-white dark:bg-gray-800 hover:cursor-pointer hover:scale-105 transition-all"
      onClick={() => {
        router.push(`/event/${event.id}`);
      }}
    >
      <div className="flex items-center justify-between mb-4 gap-4">
        <Badge className="flex items-center justify-center rounded-sm bg-green-300/10 text-green-500 border-1 border-green-500">
          {capitalizeWords(event.category)}
        </Badge>
        <div className="flex items-center gap-1">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {format(parseISO(event.start_datetime), "LLL dd")}
          </p>
          {isAdmin && (
            <Tooltip>
              <TooltipTrigger
                className="hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer rounded-sm p-1"
                onClick={(e) => {
                  e.stopPropagation();
                  handleFlag(event.id, event.flag);
                }}
              >
                <Flag
                  className="w-3.5 h-3.5"
                  fill={event.flag ? "#fff" : "transparent"}
                />
              </TooltipTrigger>
              <TooltipContent>
                {event.flag ? "Flagged inappropriate" : "Flag inappropriate"}
              </TooltipContent>
            </Tooltip>
          )}
        </div>
      </div>
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <Link href={`/event/${event.id}`}>
            <h2 className="text-xl font-semibold">{event.name}</h2>
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
  );
};

export default EventCard;
