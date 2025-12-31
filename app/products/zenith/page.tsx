import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Footer from "@/components/Footer";

export default function ZenithPage() {
  return (
    <main>
      <Navbar />
      <section className="py-24 bg-gradient-to-b from-light-bg to-dark-bg">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl font-bold mb-6 text-gradient">Zenith DAW</h1>
            <p className="text-xl text-gray-300 mb-8">
              Professional music production software that doesn't break the bank
            </p>
            
            <div className="glass rounded-3xl p-8 md:p-12">
              <h2 className="text-3xl font-bold mb-6">Professional Features</h2>
              <ul className="text-left space-y-4">
                <li className="flex items-start gap-3">
                  <svg className="w-6 h-6 text-accent-green mt-1" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M20 6L9 17L4 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <span>Full DAW functionality at $100 vs $200-900 for competitors</span>
                </li>
                <li className="flex items-start gap-3">
                  <svg className="w-6 h-6 text-accent-green mt-1" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M20 6L9 17L4 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <span>Wingman AI your creative partner for inspiration</span>
                </li>
                <li className="flex items-start gap-3">
                  <svg className="w-6 h-6 text-accent-green mt-1" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M20 6L9 17L4 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <span>Real-time collaboration with friends</span>
                </li>
                <li className="flex items-start gap-3">
                  <svg className="w-6 h-6 text-accent-green mt-1" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M20 6L9 17L4 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <span>Runs beautifully on any hardware</span>
                </li>
                <li className="flex items-start gap-3">
                  <svg className="w-6 h-6 text-accent-green mt-1" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M20 6L9 17L4 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <span>Windows, macOS, and Linux support</span>
                </li>
                <li className="flex items-start gap-3">
                  <svg className="w-6 h-6 text-accent-green mt-1" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M20 6L9 17L4 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <span>No forced subscriptions ever</span>
                </li>
                <li className="flex items-start gap-3">
                  <svg className="w-6 h-6 text-accent-green mt-1" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M20 6L9 17L4 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <span>Professional workflow simplified</span>
                </li>
                <li className="flex items-start gap-3">
                  <svg className="w-6 h-6 text-accent-green mt-1" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M20 6L9 17L4 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <span>Built by producers for producers</span>
                </li>
              </ul>
              
              <div className="mt-8 p-6 bg-yellow-500/20 border-2 border-yellow-500 rounded-full">
                <p className="text-yellow-400 font-semibold">
                  Status: UI Development → Backend Integration → Beta → Release
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}
