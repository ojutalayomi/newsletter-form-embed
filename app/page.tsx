import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-purple-600 to-blue-500 py-16 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <nav className="flex justify-between items-center mb-16">
          <Link href="https://telex-newsletter.duckdns.org" className="text-white hover:opacity-80 transition">
            <code className="font-mono text-lg font-bold">Newsletter Form</code>
          </Link>
          <a
            href="https://telex-newsletter.duckdns.org"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-white hover:opacity-80 transition"
          >
            <span>Powered by</span>
            <Image
              src="https://telex-newsletter.duckdns.org/emb.svg"
              alt="Newsletter Logo"
              className="dark:invert"
              width={20}
              height={20}
              priority
            />
          </a>
        </nav>

        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-white mb-6">
            Subscribe to Our Newsletter
          </h1>
          <p className="text-xl text-white/80">
            Stay informed with our latest updates and exclusive content
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 hover:bg-white/20 transition">
            <h2 className="text-2xl font-semibold text-white mb-4">
              Stay Updated
            </h2>
            <p className="text-white/80">
              Get the latest news and updates delivered directly to your inbox. Never miss out on important announcements.
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 hover:bg-white/20 transition">
            <h2 className="text-2xl font-semibold text-white mb-4">
              Customize Preferences
            </h2>
            <p className="text-white/80">
              Choose your preferred content and frequency of newsletters. Tailor your experience to your interests.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
