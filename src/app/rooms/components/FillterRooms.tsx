"use client";

import { useState } from "react";
import { Label } from "@/components/ui/label";
import { CheckboxWithLabel } from "@/components/inputs/CheckboxWithLabel";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useEffect } from "react";

const FillterRooms = () => {
  const searchParams = useSearchParams();
  const destination = searchParams.get("destination");
  const router = useRouter();
  const pathname = usePathname();
  const [openFillters, setOpenFillters] = useState(false);
  const [selectedRoomTypes, setSelectedRoomTypes] = useState<string[]>([]);
  const [selectedPriceRanges, setSelectedPriceRanges] = useState<string[]>([]);
  const [selectedSortOption, setSelectedSortOption] = useState<string>("");

  const roomTypes = ["Single Bed", "Double Bed", "Luxury Room", "Family Suite"];
  const priceRanges = [
    "0 to 500",
    "500 to 1000",
    "1000 to 2000",
    "2000 to 3000",
  ];
  const sortOptions = [
    "Price Low to High",
    "Price High to Low",
    "Newest First",
  ];

  const toggleSelection = (
    value: string,
    setSelectedArray: React.Dispatch<React.SetStateAction<string[]>>,
  ) => {
    setSelectedArray((prev) =>
      prev.includes(value)
        ? prev.filter((item) => item !== value)
        : [...prev, value],
    );
  };

  useEffect(() => {
    const params = new URLSearchParams();

    if (selectedRoomTypes.length) {
      params.set("roomType", selectedRoomTypes.join(","));
    }

    if (selectedPriceRanges.length) {
      params.set("price", selectedPriceRanges.join(","));
    }

    if (selectedSortOption) {
      params.set("sort", selectedSortOption);
    }
    if (destination) {
      params.set("destination", destination);
    }

    router.push(`${pathname}?${params.toString()}`);
  }, [
    selectedRoomTypes,
    selectedPriceRanges,
    selectedSortOption,
    destination,
    router,
    pathname,
  ]);

  return (
    <div className="bg-white w-80 border border-gray-300 text-gray-600 max-lg:mb-8 lg:mt-16 mx-auto sm:mx-0 rounded-md">
      <div
        className={`flex items-center justify-between px-5 py-2.5 lg:border-b border-gray-300  ${
          openFillters && "border-b"
        }`}
      >
        <p className="text-base font-medium text-gray-800">FILTERS</p>
        <div className="text-xs cursor-pointer">
          <span
            onClick={() => setOpenFillters((prev) => !prev)}
            className="lg:hidden"
          >
            {openFillters ? "HIDE" : "SHOW"}
          </span>
          <span
            className="hidden lg:block cursor-pointer"
            onClick={() => {
              setSelectedRoomTypes([]);
              setSelectedPriceRanges([]);
              setSelectedSortOption("");
            }}
          >
            CLEAR
          </span>
        </div>
      </div>

      <div
        className={`${
          openFillters ? "h-auto" : "h-0 lg:h-auto"
        } overflow-hidden transition-all duration-700`}
      >
        {/* Room Types */}
        <div className="px-5 pt-5">
          <p className="font-medium text-gray-800 pb-2">Popular Filters</p>
          <div className="flex flex-col gap-5 py-4">
            {roomTypes.map((room) => (
              <CheckboxWithLabel
                key={room}
                fieldTitle={room}
                checked={selectedRoomTypes.includes(room)}
                onCheckedChange={() =>
                  toggleSelection(room, setSelectedRoomTypes)
                }
              />
            ))}
          </div>
        </div>

        {/* Price Range */}
        <div className="px-5 pt-5">
          <p className="font-medium text-gray-800 pb-2">Price Range</p>
          <div className="flex flex-col gap-5 py-4">
            {priceRanges.map((range) => (
              <CheckboxWithLabel
                key={range}
                fieldTitle={range}
                checked={selectedPriceRanges.includes(range)}
                onCheckedChange={() =>
                  toggleSelection(range, setSelectedPriceRanges)
                }
              />
            ))}
          </div>
        </div>

        {/* Sort */}
        <div className="px-5 pt-5 pb-7">
          <p className="font-medium text-gray-800 pb-2">Sort By</p>
          <RadioGroup
            value={selectedSortOption}
            onValueChange={setSelectedSortOption}
            className="flex flex-col gap-5 pt-4"
          >
            {sortOptions.map((option, idx) => (
              <div key={idx} className="flex items-center gap-3">
                <RadioGroupItem value={option} id={`sortRoom-${idx}`} />
                <Label htmlFor={`sortRoom-${idx}`} className="cursor-pointer">
                  {option}
                </Label>
              </div>
            ))}
          </RadioGroup>
        </div>
      </div>
    </div>
  );
};

export default FillterRooms;
