import { JobListing } from "@/constants/jobs";
import { ChevronRight } from "lucide-react";
import Link from "next/link";

export default function JobsMobileComponent({ job }: { job: JobListing }) {
  return (
    <Link href={`/jobs/${job.id}`}>
      <div className="lg:hidden flex justify-between max-w-[90%] border-b-2 border-gray-200 mx-auto p-4 hover:bg-gray-50 transition-all rounded-lg rounded-b-none">
        <div className="flex flex-col gap-y-2">
          <span className="text-gray-900 font-bold text-lg">
            {job.position}
          </span>
          <div className="flex text-gray-600 text-base">{`${job.company} | ${job.department} | ${job.location}`}</div>
        </div>
        <div className="flex items-center px-4">
          <ChevronRight color="#111827" />
        </div>
      </div>
    </Link>
  );
}
