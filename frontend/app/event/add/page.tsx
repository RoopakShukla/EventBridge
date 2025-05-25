"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { Calendar, ChevronDown, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { format } from "date-fns";
import { toast } from "sonner";
import { eventsService } from "@/lib/axios";
import { useRouter } from "next/navigation";

type EventFormData = {
  eventName: string;
  location: string;
  description: string;
  startDate: Date;
  endDate: Date;
  category: string;
  registrationStart: Date;
  registrationEnd: Date;
  photos: FileList | null;
};

export default function EventForm() {
  const router = useRouter();
  const [startDate, setStartDate] = useState<Date | undefined>(new Date());
  const [endDate, setEndDate] = useState<Date | undefined>(new Date());
  const [registrationStart, setRegistrationStart] = useState<Date | undefined>(
    new Date()
  );
  const [registrationEnd, setRegistrationEnd] = useState<Date | undefined>(
    new Date()
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<EventFormData>({
    defaultValues: {
      eventName: "",
      location: "",
      description: "",
      category: "sports matches",
    },
  });

  const onSubmit = async (data: EventFormData) => {
    const loadingToast = toast.loading("Creating event...");

    try {
      const formData = {
        name: data.eventName,
        location: data.location,
        description: data.description,
        category: data.category,
        start_datetime: startDate?.toISOString(),
        end_datetime: endDate?.toISOString(),
        registration_start_datetime: registrationStart?.toISOString(),
        registration_end_datetime: registrationEnd?.toISOString(),
        photos: data.photos ? Array.from(data.photos) : [],
      };

      await eventsService.createEvent(formData);

      toast.dismiss(loadingToast);

      toast.success("Event created successfully", {
        description: "Your event has been created!",
      });
    } catch (error: any) {
      toast.dismiss(loadingToast);

      toast.error("Failed to create event", {
        description: error.message,
      });
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center p-4">
      <div className="w-full max-w-3xl rounded-lg border border-border bg-card text-card-foreground">
        <div className="border-b border-border p-4">
          <h1 className="text-xl font-medium">Add New Event</h1>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-6">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {/* Event Name */}
            <div className="space-y-2">
              <label htmlFor="eventName" className="block text-sm font-medium">
                Event Name
              </label>
              <Input
                id="eventName"
                className="border-input bg-background text-foreground"
                placeholder="Garage sale..."
                {...register("eventName", {
                  required: "Event name is required",
                })}
              />
              {errors.eventName && (
                <p className="text-xs text-red-500">
                  {errors.eventName.message}
                </p>
              )}
            </div>

            {/* Location */}
            <div className="space-y-2">
              <label htmlFor="location" className="block text-sm font-medium">
                Location
              </label>
              <Input
                id="location"
                className="border-input bg-background text-foreground"
                placeholder="123 Main St, City..."
                {...register("location", { required: "Location is required" })}
              />
              {errors.location && (
                <p className="text-xs text-red-500">
                  {errors.location.message}
                </p>
              )}
            </div>

            {/* Description */}
            <div className="space-y-2 md:col-span-2">
              <label
                htmlFor="description"
                className="block text-sm font-medium"
              >
                Description
              </label>
              <Textarea
                id="description"
                className="min-h-[100px] border-input bg-background text-foreground"
                placeholder="A brief description of the event..."
                {...register("description", {
                  required: "Description is required",
                })}
              />
              {errors.description && (
                <p className="text-xs text-red-500">
                  {errors.description.message}
                </p>
              )}
            </div>

            {/* Start Date */}
            <div className="space-y-2">
              <label className="block text-sm font-medium">Start Date</label>
              <div className="space-y-2">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start border-input bg-background text-left font-normal text-foreground"
                    >
                      <Calendar className="mr-2 h-4 w-4" />
                      {startDate
                        ? format(startDate, "dd/MM/yyyy h:mm a")
                        : "Select date and time"}
                      <ChevronDown className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto bg-popover p-0">
                    <CalendarComponent
                      mode="single"
                      selected={startDate}
                      onSelect={setStartDate}
                      initialFocus
                      className="border-border"
                    />
                    <div className="border-t border-border p-3">
                      <Input
                        type="time"
                        className="border-input bg-background text-foreground"
                        defaultValue="13:30"
                        onChange={(e) => {
                          if (startDate) {
                            const [hours, minutes] = e.target.value
                              .split(":")
                              .map(Number);
                            const newDate = new Date(startDate);
                            newDate.setHours(hours, minutes);
                            setStartDate(newDate);
                          }
                        }}
                      />
                    </div>
                  </PopoverContent>
                </Popover>

                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start border-input bg-background text-left font-normal text-foreground"
                    >
                      <Calendar className="mr-2 h-4 w-4" />
                      {endDate
                        ? format(endDate, "dd/MM/yyyy h:mm a")
                        : "Select end time"}
                      <ChevronDown className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto bg-popover p-0">
                    <CalendarComponent
                      mode="single"
                      selected={endDate}
                      onSelect={setEndDate}
                      initialFocus
                      className="border-border"
                    />
                    <div className="border-t border-border p-3">
                      <Input
                        type="time"
                        className="border-input bg-background text-foreground"
                        defaultValue="17:30"
                        onChange={(e) => {
                          if (endDate) {
                            const [hours, minutes] = e.target.value
                              .split(":")
                              .map(Number);
                            const newDate = new Date(endDate);
                            newDate.setHours(hours, minutes);
                            setEndDate(newDate);
                          }
                        }}
                      />
                    </div>
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            {/* Photos */}
            <div className="space-y-2">
              <label className="block text-sm font-medium">Photos</label>
              <Button
                type="button"
                variant="outline"
                className="w-full border-input hover:opacity-80 cursor-pointer"
                onClick={() => document.getElementById("photo-upload")?.click()}
              >
                <Upload className="mr-2 h-4 w-4" />
                Upload Photos
              </Button>
              <input
                id="photo-upload"
                type="file"
                multiple
                className="hidden"
                {...register("photos")}
              />
            </div>

            {/* Category */}
            <div className="space-y-2">
              <label className="block text-sm font-medium">Category</label>
              <Select defaultValue="sports matches">
                <SelectTrigger className="border-input bg-background text-foreground">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent className="bg-popover text-popover-foreground">
                  <SelectItem value="garage sales">Garage Sales</SelectItem>
                  <SelectItem value="sports matches">Sports Matches</SelectItem>
                  <SelectItem value="community classes">
                    Community Classes
                  </SelectItem>
                  <SelectItem value="volunteer opportunities">
                    Volunteer Opportunities
                  </SelectItem>
                  <SelectItem value="exhibitions">Exhibitions</SelectItem>
                  <SelectItem value="workshop">Workshop</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Registration start */}
            <div className="space-y-2 md:col-span-2">
              <label className="block text-sm font-medium">
                Registration start
              </label>
              <div className="space-y-2">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start border-input bg-background text-left font-normal text-foreground"
                    >
                      <Calendar className="mr-2 h-4 w-4" />
                      {registrationStart
                        ? format(registrationStart, "dd/MM/yyyy h:mm a")
                        : "Select date and time"}
                      <ChevronDown className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto bg-popover p-0">
                    <CalendarComponent
                      mode="single"
                      selected={registrationStart}
                      onSelect={setRegistrationStart}
                      initialFocus
                      className="border-border"
                    />
                    <div className="border-t border-border p-3">
                      <Input
                        type="time"
                        className="border-input bg-background text-foreground"
                        defaultValue="07:00"
                        onChange={(e) => {
                          if (registrationStart) {
                            const [hours, minutes] = e.target.value
                              .split(":")
                              .map(Number);
                            const newDate = new Date(registrationStart);
                            newDate.setHours(hours, minutes);
                            setRegistrationStart(newDate);
                          }
                        }}
                      />
                    </div>
                  </PopoverContent>
                </Popover>

                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start border-input bg-background text-left font-normal text-foreground"
                    >
                      <Calendar className="mr-2 h-4 w-4" />
                      {registrationEnd
                        ? format(registrationEnd, "dd/MM/yyyy h:mm a")
                        : "Select end time"}
                      <ChevronDown className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto bg-popover p-0">
                    <CalendarComponent
                      mode="single"
                      selected={registrationEnd}
                      onSelect={setRegistrationEnd}
                      initialFocus
                      className="border-border"
                    />
                    <div className="border-t border-border p-3">
                      <Input
                        type="time"
                        className="border-input bg-background text-foreground"
                        defaultValue="23:30"
                        onChange={(e) => {
                          if (registrationEnd) {
                            const [hours, minutes] = e.target.value
                              .split(":")
                              .map(Number);
                            const newDate = new Date(registrationEnd);
                            newDate.setHours(hours, minutes);
                            setRegistrationEnd(newDate);
                          }
                        }}
                      />
                    </div>
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="mt-8 flex justify-center">
            <Button
              type="submit"
              className="w-40 bg-primary text-primary-foreground hover:bg-primary/90"
            >
              Submit Event
            </Button>
          </div>
        </form>
      </div>
    </main>
  );
}
