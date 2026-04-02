import RoomForm from "@/app/owner/_components/RoomForm";
import Title from "@/components/Title";
import { getRoom } from "@/server/db/room";
import { notFound } from "next/navigation";

interface EditRoomPageProps {
  params: Promise<{ roomId: string }>;
}

const EditRoomPage = async ({ params }: EditRoomPageProps) => {
  const { roomId } = await params;

  const room = await getRoom(roomId);
  if (!room) notFound();

  return (
    <>
      <Title
        align="left"
        font="outfit"
        title="Edit Room"
        subTitle="Update the room details carefully, including pricing and amenities, to ensure accurate information and provide the best booking experience."
      />

      <RoomForm key={room.id} room={room} />
    </>
  );
};

export default EditRoomPage;
