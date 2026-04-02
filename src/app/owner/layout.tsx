import AdminNavbar from "./_components/AdminNavbar";
import AdminSidebar from "./_components/AdminSidebar";

const AdminLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex flex-col">
      <AdminNavbar />
      <div className="flex w-full overflow-hidden">
        <AdminSidebar />
        <div className="flex-1 overflow-x-auto p-4 pt-10 md:px-10">
          {children}
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
