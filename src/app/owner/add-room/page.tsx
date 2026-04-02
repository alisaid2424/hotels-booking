import Title from "@/components/Title";
import RoomForm from "../_components/RoomForm";

const AddRoomPage = () => {
  return (
    <>
      <Title
        align="left"
        font="outfit"
        title="Add Room"
        subTitle="Fill in the details carefully and accurate room details, pricing ,and amenities , to enhance the user booking experience."
      />

      <RoomForm />
    </>
  );
};

export default AddRoomPage;
