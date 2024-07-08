import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-row gap-6 justify-center items-center min-h-screen text-white">
      <Link
        href={"/app/stake"}
        className="bg-[#FF5D5D] px-8 py-2.5 font-bold rounded-3xl text-slate-900 text-base flex justify-end items-center"
      >
        Launch App
      </Link>
    </div>
  );
}
