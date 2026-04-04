import AdminTable from "@/components/AdminTable";
import Title from "@/components/Title";
import { formatCurrency } from "@/lib/formatters";
import { getBookingsOwner } from "@/server/db/booking";
import { auth } from "@clerk/nextjs/server";
import { ChartLineIcon, CircleDollarSignIcon } from "lucide-react";
import { notFound } from "next/navigation";

interface OwnerPageProps {
  searchParams: Promise<{ pageNumber: string }>;
}

const OwnerPage = async ({ searchParams }: OwnerPageProps) => {
  const { pageNumber } = await searchParams;
  const page = Number(pageNumber) || 1;
  const { userId } = await auth();
  if (!userId) notFound();

  const dashboardData = await getBookingsOwner(userId, page);

  const dashboardCards = [
    {
      title: "Total Bookings",
      value: dashboardData.totalBookings || 0,
      icon: ChartLineIcon,
    },
    {
      title: "Total Revenue",
      value: formatCurrency(dashboardData.totalRevenue || 0),
      icon: CircleDollarSignIcon,
    },
  ];

  const columns = [
    { key: "userName", name: "User Name" },
    { key: "roomName", name: "Room Name" },
    { key: "totalAmount", name: "Total Amount" },
    { key: "paymentStatus", name: "Payment Status" },
  ];

  const formattedBookings = dashboardData.bookings.map((item) => ({
    id: item.id,
    userName: item.user.name,
    roomName: item.room.roomType,
    totalAmount: formatCurrency(item.totalPrice),
    paymentStatus: item.isPaid ? "Completed" : "Pending",
  }));

  return (
    <>
      <Title
        align="left"
        font="outfit"
        title="Dashboard"
        subTitle="Monitor your room listings, track bookings and analyze revenue—all in one place. Stay updated with real-time insights to ensure smooth operations."
      />

      <div className="flex flex-wrap gap-4 w-full my-8">
        {dashboardCards.map((card, idx) => (
          <div
            key={idx}
            className="flex items-center justify-between px-4 py-3 bg-primary/10 border border-primary/20 rounded-md sm:max-w-52 w-full"
          >
            <div>
              <h3 className="text-base text-primary">{card.title}</h3>
              <p className="text-lg font-medium text-gray-800 mt-1">
                {card.value}
              </p>
            </div>
            <card.icon className="w-6 h-6 text-primary" />
          </div>
        ))}
      </div>

      <h2 className="text-xl text-gray-600 font-medium mb-5">
        Recent Bookings
      </h2>

      <AdminTable
        data={formattedBookings}
        columns={columns}
        pageNumber={pageNumber}
        totalCount={formattedBookings.length}
        type="list-bookings"
      />
    </>
  );
};

export default OwnerPage;
