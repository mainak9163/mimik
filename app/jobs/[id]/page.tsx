import allJobs from "@/constants/jobs";

export default async function SpecificJobPage({
    params,
}: {
    params: Promise<{ id: string }>
}) {
    const { id } = await params;
    const job = allJobs.listings.find(job => job.id === id);
    if (!job) {
        return <div className="h-screen flex justify-center items-center"><span>Job not found</span></div>;
    }

    return (
        <div className="min-h-screen bg-white flex flex-col">
            <div className="bg-gray-50 px-8 py-10 pb-16 flex flex-col gap-y-8">
                <div className="text-xl text-gray-900 font-semibold tracking-widest">{job.department.toUpperCase()}</div>
                <div className="text-4xl font-semibold text-gray-900">{job.position} ({job.requisitionId})</div>
            </div>
            <div className="flex flex-col md:flex-row p-4 pt-10">
                <div className="px-6 md:w-[300px] flex gap-x-4 flex-wrap md:flex-col gap-y-3">
                    <div className="flex flex-col">
                        <span className="text-gray-900 font-semibold text-base">Department</span>
                        <span className="text-gray-600 font-semibold text-sm">{job.department}</span>
                    </div>
                    <div className="flex flex-col">
                        <span className="text-gray-900 font-semibold text-base">Location</span>
                        <span className="text-gray-600 font-semibold text-sm">{job.location}</span>
                    </div>
                    <div className="flex flex-col">
                        <span className="text-gray-900 font-semibold text-base">Company</span>
                        <span className="text-gray-600 font-semibold text-sm">{job.company}</span>
                    </div>
                    <div className="flex flex-col">
                        <span className="text-gray-900 font-semibold text-base">Requisition Id</span>
                        <span className="text-gray-600 font-semibold text-sm">{job.requisitionId}</span>
                    </div>
                </div>
                <div className="w-[90%] mt-6 md:mt-0 mx-auto md:ml-0 md:w-[60%]">
                    {job.description}
                </div>
            </div>
        </div>
    )
}