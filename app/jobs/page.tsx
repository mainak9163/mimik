import JobsComponent from "@/components/jobs-component";
import JobsMobileComponent from "@/components/jobs-mobile-component";
import allJobs from "@/constants/jobs";

export default function JobsPage() {
    return (
        <div className="flex-1 min-h-screen bg-black">
            <div className="flex flex-col gap-y-2 xl:gap-y-6">
            {
                    allJobs.listings.map((job, index) => (
                    <>
                            <JobsComponent job={job} key={index} />
                            <JobsMobileComponent job={job} key={index} />
                            </>
                ))
                }
                </div>
        </div>
    )
}