import JobListingContent from "@/components/job-listing-component";
import JobListingHeader from "@/components/job-listing-header";
import JobsComponent from "@/components/jobs-component";
import JobsMobileComponent from "@/components/jobs-mobile-component";
import allJobs from "@/constants/jobs";
// import Image from "next/image";
import { Montserrat, Merriweather } from "next/font/google";

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
  display: "swap",
});
const merriweather = Merriweather({
  subsets: ["latin"],
  weight: ["300", "400", "700", "900"],
  variable: "--font-merriweather",
  display: "swap",
});

export default function JobsPage() {
  return (
    <div className="flex-1 min-h-screen bg-white">
      <div
        className={`mb-6 relative ${montserrat.variable} ${merriweather.variable} font-sans`}
      >
        {/* <Image width={400} height={400} className="w-full lg:max-w-[80%] mx-auto rounded-lg h-auto" src="/features/nocheLuna.webp" alt="career-page-image" />
                <div className="absolute bottom-5 left-[50%] top-[60%]" style={{transform:"translate(-50%, -50%)"}}>
                    <div className="text-xl text-white font-bold tracking-widest mb-4 text-center">JOIN THE ASTRAPUFFS</div>
                    <div className="text-4xl text-center text-white font-bold">Careers at P3CO</div>
                </div> */}
        <JobListingHeader />
        <JobListingContent />
      </div>
      <div className="flex flex-col gap-y-2 lg:-mb-2">
        <div className="lg:flex hidden max-w-[90%] w-full border-b-2 border-gray-200 mx-auto py-8 hover:bg-gray-50 transition-all rounded-lg rounded-b-none">
          <div className="w-[30%] px-3 font-semibold text-lg text-gray-900">
            Position
          </div>
          <div className="w-[20%] px-3 font-semibold text-lg text-gray-900">
            Company
          </div>
          <div className="w-[20%] px-3 font-semibold text-lg text-gray-900">
            Department
          </div>
          <div className="w-[20%] px-3 font-semibold text-lg text-gray-900">
            Location
          </div>
          <div className="w-[10%]"></div>
        </div>
        {allJobs.listings.map((job, index) => (
          <>
            <JobsComponent job={job} key={index} />
            <JobsMobileComponent job={job} key={index} />
          </>
        ))}
      </div>
    </div>
  );
}
