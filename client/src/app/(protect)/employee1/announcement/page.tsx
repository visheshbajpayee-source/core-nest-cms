import AnnouncementClient from "../announcement/services/AnnouncementClient";

export default function AnnouncementPage() {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">
          Announcements
        </h1>
        <p className="text-gray-500 text-sm">
          Latest company updates and notices
        </p>
      </div>

      <AnnouncementClient />
    </div>
  );
}