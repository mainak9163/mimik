import { JobListing } from "@/constants/jobs";
import { ChevronRight } from "lucide-react";
import Link from "next/link";

export default function JobsComponent({ job }: { job: JobListing }) {
    return (
        <Link href={`/jobs/${job.id}`}>
        <div className="group lg:flex hidden max-w-[90%] border-b-2 border-zinc-900 mx-auto py-8 hover:bg-zinc-900 transition-all rounded-lg rounded-b-none">
                <div className="w-[30%] px-3 font-semibold text-lg text-white">{job.position}</div>
                <div className="w-[20%] px-3 font-semibold text-lg text-white">{job.company}</div>
                <div className="w-[20%] px-3 font-semibold text-lg text-white">{job.department}</div>
                <div className="w-[20%] px-3 font-semibold text-lg text-white">{job.location}</div>
                <div className="w-[10%] group-hover:translate-2 transition-all justify-center flex"><ChevronRight color="white"/></div>
            </div>
            </Link>
    )
}