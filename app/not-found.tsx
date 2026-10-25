import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center bg-[#f7f1e8] px-4 py-16">
      <div className="max-w-md w-full text-center border border-[#e5dcd0] bg-white p-8 sm:p-10 shadow-none">
        <span className="font-mono text-[10px] font-semibold tracking-[0.25em] uppercase text-[#2d5508] block mb-2">
          404 &bull; Not Found
        </span>
        <h1 className="text-3xl font-serif text-[#131010] font-normal mb-4">
          Botanical Pathway Not Found
        </h1>
        <p className="text-[#524b42] text-xs leading-relaxed mb-8">
          The formulation or page you are searching for might have been moved or is currently unavailable. 
          Return to our natural collection or reach out via consultation.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
          <Link
            href="/"
            className="w-full sm:w-auto px-6 py-3 bg-[#131010] hover:bg-[#2d5508] text-[#f7f1e8] text-xs font-mono uppercase tracking-[0.18em] transition-colors border border-[#131010] hover:border-[#2d5508]"
          >
            Return to Collection
          </Link>
          <a
            href="https://wa.me/2348035650299"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto px-6 py-3 border border-[#e5dcd0] text-[#131010] bg-white hover:bg-[#faf6f0] text-xs font-mono uppercase tracking-[0.18em] transition-colors"
          >
            Ask Mary on WhatsApp ↗
          </a>
        </div>
      </div>
    </div>
  );
}
