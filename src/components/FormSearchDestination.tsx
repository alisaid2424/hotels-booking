"use client";

import { Calendar, Search } from "lucide-react";
import { Button } from "./ui/button";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { storeRecentSearchedCity } from "@/server/actions/user";
import { useToast } from "@/hooks/use-toast";
import * as motion from "motion/react-client";

const FormSearchDestination = ({ cities }: { cities: string[] }) => {
  const router = useRouter();
  const { toast } = useToast();
  const [destination, setDestination] = useState<string>("");
  const [searchedCities, setSearchedCities] = useState<string[]>(cities);

  const onSearch = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const city = destination.trim().toLowerCase();

    try {
      const res = await storeRecentSearchedCity(city);

      if (!res.success) {
        toast({
          title: "Error",
          description: res.message,
          className: "bg-red-100 text-red-600",
        });
        return;
      }

      if (res.alreadyExists) {
        toast({
          title: "Info",
          description: "City already exists",
          className: "bg-blue-100 text-blue-700",
        });
      } else {
        toast({
          title: "Success 🎉",
          description: "City added",
          className: "bg-green-100 text-green-600",
        });
      }

      router.push(`/rooms?destination=${city}`);

      setSearchedCities((prev) => {
        const filtered = prev.filter((c) => c.toLowerCase() !== city);
        return [city, ...filtered].slice(0, 3);
      });
    } catch {
      toast({
        title: "Error",
        description: "Something went wrong",
        className: "bg-red-100 text-red-600",
      });
    }
  };

  return (
    <motion.form
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.2 }}
      onSubmit={onSearch}
      className="bg-white text-gray-500 rounded-lg px-6 py-4 mt-8 flex flex-col md:flex-row max-md:items-start gap-4 max-md:mx-auto"
    >
      <div className="flex-1 w-full">
        <div className="flex items-center gap-2">
          <Calendar className="h-4" />
          <label htmlFor="destinationInput">Destination</label>
        </div>
        <input
          value={destination}
          onChange={(e) => setDestination(e.target.value)}
          list="destinations"
          id="destinationInput"
          autoComplete="off"
          type="text"
          className="w-full rounded border border-gray-200 px-3 py-1.5 mt-1.5 text-sm outline-none"
          placeholder="Cairo,dubai..."
          required
        />
        <datalist id="destinations">
          {searchedCities.map((city, index) => (
            <option
              value={city.charAt(0).toUpperCase() + city.slice(1)}
              key={index}
            />
          ))}
        </datalist>
      </div>

      <div className="flex-1 w-full">
        <div className="flex items-center gap-2">
          <Calendar className="h-4" />
          <label htmlFor="checkIn">Check in</label>
        </div>
        <input
          id="checkIn"
          type="date"
          className="w-full rounded border border-gray-200 px-3 py-1.5 mt-1.5 text-sm outline-none"
        />
      </div>

      <div className="flex-1 w-full">
        <div className="flex items-center gap-2">
          <Calendar className="h-4" />
          <label htmlFor="checkOut">Check out</label>
        </div>
        <input
          id="checkOut"
          type="date"
          className="w-full rounded border border-gray-200 px-3 py-1.5 mt-1.5 text-sm outline-none"
        />
      </div>

      <div className="flex flex-1 w-full md:flex-col max-md:gap-2 max-md:items-center">
        <label htmlFor="guests">Guests</label>
        <input
          min={1}
          max={4}
          id="guests"
          type="number"
          className="w-full rounded border border-gray-200 px-3 py-1.5 mt-1.5 text-sm outline-none md:max-w-16"
          placeholder="0"
        />
      </div>

      <Button className="my-auto !py-5">
        <Search className="h-7" />
        <span>Search</span>
      </Button>
    </motion.form>
  );
};

export default FormSearchDestination;
