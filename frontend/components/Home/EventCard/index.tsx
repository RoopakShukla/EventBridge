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
  fetchEvents,
}: {
  event: any;
  fetchEvents: () => void;
}) => {
  const router = useRouter();

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
        <p className="flex flex-row gap-1 text-sm text-gray-600 dark:text-gray-300">
          <MapPin className="w-4" />
          {event.location}
        </p>
      </div>
    </div>
  );
};

export default EventCard;
