export default function JobListingHeader() {
  return (
    <div className="relative bg-black text-white">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-[url('/placeholder.svg?height=800&width=1600')] bg-cover bg-center opacity-10"></div>
      </div>
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
        <div className="max-w-3xl">
          <h1 className="font-montserrat text-4xl md:text-5xl font-bold tracking-tight mb-6">
            Join the P3CO Team
          </h1>
          <p className="font-merriweather text-xl md:text-2xl text-gray-300 mb-8">
            Help build one of the first agentic cozy multiplayers that&apos;s
            actually fun to play!
          </p>
        </div>
      </div>
    </div>
  );
}
