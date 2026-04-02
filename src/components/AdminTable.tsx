"use client";

import { FC } from "react";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import Image from "next/image";
import { Edit } from "lucide-react";
import { BOOKINGS_PER_PAGE, ROOMS_PER_PAGE } from "@/constants/enums";
import Pagination from "./Pagination";
import LottieHandler from "./LottieHandler";
import RoomAvailabilitySwitch from "@/app/owner/list-rooms/components/RoomAvailabilitySwitch";
import DeleteRoomButton from "@/app/owner/list-rooms/components/DeleteRoomButton";
import DeleteBookingButton from "@/app/owner/_components/DeleteBookingButton";
import { Button } from "./ui/button";
import * as motion from "motion/react-client";

interface AdminTableProps {
  data: any[]; // eslint-disable-line @typescript-eslint/no-explicit-any
  columns: Array<{ key: string; name: string }>;
  pageNumber: string;
  totalCount: number;
  type: "list-rooms" | "list-bookings";
}

const AdminTable: FC<AdminTableProps> = ({
  data,
  columns,
  pageNumber,
  totalCount,
  type,
}) => {
  const router = useRouter();
  const [, startTransition] = useTransition();
  const currentPage = parseInt(pageNumber);

  const itemsPerPage =
    type === "list-rooms" ? ROOMS_PER_PAGE : BOOKINGS_PER_PAGE;

  const pages =
    type === "list-rooms"
      ? Math.ceil(totalCount / ROOMS_PER_PAGE)
      : Math.ceil(totalCount / BOOKINGS_PER_PAGE);

  const handleDeleteSuccess = () => {
    const isLastItemOnPage = data.length === 1;
    if (isLastItemOnPage && currentPage > 1) {
      router.push(`/admin/${type}?pageNumber=${currentPage - 1}`);
    } else {
      startTransition(() => {
        router.refresh();
      });
    }
  };

  return data.length > 0 ? (
    <div className="max-w-full mt-6 overflow-x-auto">
      <table className="w-full border-collapse rounded-md overflow-hidden max-lg:text-nowrap">
        <thead>
          <tr className="bg-primary text-left text-white">
            <th className="p-2 font-medium pl-5">#</th>

            {columns.map((column) => (
              <th
                key={column.key}
                className={`p-2 font-medium capitalize ${column.name === "Images" ? "max-xl:hidden" : ""}`}
              >
                {column.name}
              </th>
            ))}

            {type === "list-rooms" && (
              <th className="p-2 font-medium">isAvailable</th>
            )}
            <th className="px-4 font-medium">Actions</th>
          </tr>
        </thead>

        <tbody className="text-sm font-medium">
          {data.map((item, index) => {
            const isBooked = item.bookings && item.bookings.length > 0;
            return (
              <motion.tr
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
                key={item.id}
                className="border-b border-primary/10 bg-primary/20 even:bg-primary/30"
              >
                <td className="p-2 pl-5">
                  {(currentPage - 1) * itemsPerPage + index + 1}
                </td>

                {columns.map((column) => {
                  const value = item[column.key];

                  // IMAGE HANDLING
                  if (column.key === "images") {
                    return (
                      <td key={column.key} className="pe-5 max-xl:hidden">
                        <div className="flex gap-1">
                          {value.map((img: string, i: number) => (
                            <Image
                              key={i}
                              src={img}
                              alt="room image"
                              width={40}
                              height={40}
                              className="rounded-md object-cover bg-white"
                            />
                          ))}
                        </div>
                      </td>
                    );
                  }

                  return (
                    <td
                      key={column.key}
                      className="p-2 lg:break-words lg:whitespace-normal"
                    >
                      {value}
                    </td>
                  );
                })}

                {type === "list-rooms" && (
                  <td className="px-6 py-2">
                    <RoomAvailabilitySwitch
                      checked={item?.isAvailable}
                      roomId={item.id}
                      isBooked={isBooked}
                    />
                  </td>
                )}

                <td className="p-2">
                  {type === "list-rooms" ? (
                    <div className="flex items-center text-center gap-2">
                      <Button
                        onClick={() =>
                          router.push(`/owner/${type}/edit/${item.id}`)
                        }
                        size="icon"
                        disabled={isBooked}
                      >
                        <Edit size={18} color="white" />
                      </Button>

                      <DeleteRoomButton
                        roomId={item.id}
                        onSuccess={handleDeleteSuccess}
                        isBooked={isBooked}
                      />
                    </div>
                  ) : type === "list-bookings" ? (
                    <DeleteBookingButton
                      bookingId={item.id}
                      onSuccess={handleDeleteSuccess}
                    />
                  ) : null}
                </td>
              </motion.tr>
            );
          })}
        </tbody>
      </table>

      <Pagination
        pageNumber={currentPage}
        pages={pages}
        route={`/admin/${type}`}
      />
    </div>
  ) : (
    <div className="flex items-center justify-center min-h-[calc(100vh-72px)]">
      <LottieHandler type="empty" message={`No  ${type} found`} />
    </div>
  );
};

export default AdminTable;
