import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24 bg-[#864def]">
      <div className="z-10 w-full max-w-5xl items-center justify-between font-mono text-sm lg:flex">
        <p className="fixed left-0 top-0 flex w-full justify-center border-b border-gray-300 bg-gradient-to-b from-zinc-200 pb-6 pt-8 backdrop-blur-2xl dark:border-neutral-800 dark:bg-zinc-800/30 dark:from-inherit lg:static lg:w-auto lg:rounded-xl lg:border lg:bg-gray-200 lg:p-4 lg:dark:bg-zinc-800/30">
          Welcome to&nbsp;
          <Link href="https://telex-newsletter.duckdns.org">
            <code className="font-mono font-bold">Newsletter Form</code>
          </Link>
        </p>
        <div className="fixed bottom-0 left-0 flex h-48 w-full items-end justify-center bg-gradient-to-t from-white via-white dark:from-black dark:via-black lg:static lg:h-auto lg:w-auto lg:bg-none">
          <a
          className="pointer-events-none flex place-items-center gap-2 p-8 lg:pointer-events-auto lg:p-0"
          href="https://telex-newsletter.duckdns.org"
          target="_blank"
          rel="noopener noreferrer"
          >
          By{" "}
            <Image
              src="https://telex-newsletter.duckdns.org/emb.svg"
              alt="Newsletter Logo"
              className="dark:invert"
              width={24}
              height={24}
              priority
            />
          </a>
        </div>
      </div>

      <div className="relative flex place-items-center">
        <h1 className="text-4xl font-bold text-white mb-8">
          Subscribe to Our Newsletter
        </h1>
      </div>

      <div className="mb-32 grid text-center lg:mb-0 lg:grid-cols-2 lg:text-left gap-8">
        <div className="group rounded-lg border border-transparent px-5 py-4 transition-colors">
          <h2 className={`mb-3 text-2xl font-semibold text-white`}>
          Stay Updated
          </h2>
          <p className={`m-0 max-w-[30ch] text-sm text-white opacity-80`}>
          Get the latest news and updates delivered directly to your inbox.
          </p>
        </div>

        <div className="group rounded-lg border border-transparent px-5 py-4 transition-colors">
          <h2 className={`mb-3 text-2xl font-semibold text-white`}>
          Customize Preferences
          </h2>
          <p className={`m-0 max-w-[30ch] text-sm text-white opacity-80`}>
          Choose your preferred content and frequency of newsletters.
          </p>
        </div>
      </div>
    </main>
  );
}
