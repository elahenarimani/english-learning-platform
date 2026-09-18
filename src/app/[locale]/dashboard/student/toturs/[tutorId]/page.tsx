// import { notFound } from "next/navigation";

// import { getTutorServer } from "@/feature/dashboard/api/dashboard.api";
// import TutorProfile from "@/feature/dashboard/components/toturs/TutorProfile";

// interface TutorPageProps {
//   params: Promise<{
//     tutorId: string;
//   }>;
// }

// export default async function TutorPage({
//   params,
// }: TutorPageProps) {
//   const { tutorId } = await params;

//   const tutor = await getTutorServer(tutorId);

//   if (!tutor) {
//     notFound();
//   }

//   return <TutorProfile tutor={tutor} />;
// }