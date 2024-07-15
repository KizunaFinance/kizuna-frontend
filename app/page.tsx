import Link from "next/link";
import Image from "next/image";
export default function Home() {
  return (
    <div className="flex flex-col gap-12 justify-center items-center min-h-screen text-slate-200 text-center">
      <Image src="/daiko-white.svg" alt="logo" width={300} height={300} />
      <div className="flex flex-col items-center gap-6">
        <h1 className="text-5xl font-bold">Welcome to the Daiko Bridge</h1>
        <p className="text-xl max-w-4xl">
          Daiko Finance is a DeFi platform that bridges Ethereum and Taiko,
          enabling seamless asset transfers between the two networks. Users can
          stake their assets to earn attractive rewards, leveraging the
          strengths of both ecosystems.
        </p>
      </div>
      <Link
        href={"/app/bridge"}
        className="bg-[#FF5D5D] px-8 py-2.5 font-bold rounded-3xl text-slate-800 text-xl flex justify-end items-center mt-10"
      >
        Launch App
      </Link>
    </div>
  );
}
