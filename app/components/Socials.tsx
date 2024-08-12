import Image from "next/image";
import SocialsData from "../data/Socials.json";
import Link from "next/link";
export default function Socials() {
  return (
    <div className="flex flex-row justify-center items-center gap-8">
      {SocialsData.map((social, s) => (
        <Link
          key={s}
          href={social.link}
          target="_blank"
          rel="noreferrer"
          className="text-slate-200"
        >
          <Image
            src={social.image}
            alt={social.name}
            width={"50"}
            height={"50"}
          />
        </Link>
      ))}
    </div>
  );
}
