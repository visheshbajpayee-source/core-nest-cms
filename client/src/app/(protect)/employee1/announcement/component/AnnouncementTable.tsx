// "use client";

// interface Announcement {
//   id: string;
//   title: string;
//   description: string;
//   date: string;
//   priority: "High" | "Medium" | "Low";
// }

// interface Props {
//   announcements: Announcement[];
// }

// const priorityStyles = {
//   High: "bg-red-100 text-red-600",
//   Medium: "bg-yellow-100 text-yellow-700",
//   Low: "bg-green-100 text-green-700",
// };

// export default function AnnouncementTable({
//   announcements,
// }: Props) {
//   return (
//     <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
//       <table className="w-full text-left">
//         {/* Header */}
//         <thead className="bg-gray-100 text-gray-600 text-sm">
//           <tr>
//             <th className="px-6 py-4 font-semibold">Date</th>
//             <th className="px-6 py-4 font-semibold">Title</th>
//             <th className="px-6 py-4 font-semibold">Description</th>
//             <th className="px-6 py-4 font-semibold">Priority</th>
//           </tr>
//         </thead>

//         {/* Body */}
//         <tbody>
//           {announcements.map((item) => (
//             <tr
//               key={item.id}
//               className="border-t hover:bg-gray-50 transition"
//             >
//               <td className="px-6 py-4 text-gray-700">
//                 {item.date}
//               </td>

//               <td className="px-6 py-4 font-medium text-gray-900">
//                 {item.title}
//               </td>

//               <td className="px-6 py-4 text-gray-600">
//                 {item.description}
//               </td>

//               <td className="px-6 py-4">
//                 <span
//                   className={`px-3 py-1 text-sm rounded-full font-medium ${priorityStyles[item.priority]}`}
//                 >
//                   {item.priority}
//                 </span>
//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// }




"use client";

// import { AnnouncementUI } from "@/types/announcement";
interface AnnouncementAPI {
  id: string;
  title: string;
  content: string;
  priority: string;
  publishedAt: string;
}

export interface AnnouncementUI {
  id: string;
  title: string;
  description: string;
  date: string;
  priority: "High" | "Medium" | "Low" | "important";
}

interface Props {
  announcements: AnnouncementUI[];
}

const priorityStyles = {
  High: "bg-red-100 text-red-600",
  Medium: "bg-yellow-100 text-yellow-700",
  Low: "bg-green-100 text-green-700",
  important: "bg-red-100 text-red-600"
};

export default function AnnouncementTable({
  announcements,
}: Props) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <table className="w-full text-left">
        <thead className="bg-gray-100 text-gray-600 text-sm">
          <tr>
            <th className="px-6 py-4 font-semibold">Date</th>
            <th className="px-6 py-4 font-semibold">Title</th>
            <th className="px-6 py-4 font-semibold">Description</th>
            <th className="px-6 py-4 font-semibold">Priority</th>
          </tr>
        </thead>

        <tbody>
          {announcements.map((item) => (
            <tr
              key={item.id}
              className="border-t hover:bg-gray-50 transition"
            >
              <td className="px-6 py-4 text-gray-700">
                {item.date}
              </td>

              <td className="px-6 py-4 font-medium text-gray-900">
                {item.title}
              </td>

              <td className="px-6 py-4 text-gray-600">
                {item.description}
              </td>

              <td className="px-6 py-4">
                <span
                  className={`px-3 py-1 text-sm rounded-full font-medium ${
                    priorityStyles[item.priority]
                  }`}
                >
                  {item.priority}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}