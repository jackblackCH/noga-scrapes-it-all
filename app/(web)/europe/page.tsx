import Image from 'next/image';
import Link from 'next/link';

export default function Europe() {
  return (
    <div className="space-y-4 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Now in Europe</h1>
      <div className="text-center">
        <Image
          className="inline-block mb-4 rounded-lg"
          src="/europe.jpg"
          alt="Europe"
          width={400}
          height={400}
        />
      </div>
      <p>
        We’re thrilled to announce that we’ve expanded our job board and recruiting services to
        Europe! ﻿﻿﻿﻿Search all Europe-based jobs🌍 With this expansion, we’re proud to share that
        UK-based Anna Heslop has joined our team as Recruitment Director. Heslop has nearly a decade
        of recruiting experience in food sustainability, biomanufacturing, and alternative protein.
        If your company is hiring, connect with us to see how we can help.
      </p>
      <div className="text-center">
        <Link href="/jobs?location=Europe" className="text-blue-500">
          Search all Europe-based jobs🌍
        </Link>
      </div>
      <p>
        With this expansion, we’re proud to share that UK-based Anna Heslop has joined our team as
        Recruitment Director. Heslop has nearly a decade of recruiting experience in food
        sustainability, biomanufacturing, and alternative protein. If your company is hiring,
        connect with us to see how we can help.
      </p>
      <Image
        className="inline-block mb-4 rounded-lg"
        src="/info-graphic-europe.png"
        alt="Info graphic Europe"
        width={700}
        height={400}
      />
      <p>
        You can now find European-based jobs and career resources on the Alt Protein Careers site,
        and European employers in the alternative protein sector seeking to expand their team are
        encouraged to reach out to us via our recruiting arm, Alt Protein Partners, to explore
        tailored executive search and recruiting services.
      </p>

      <p>
        <Link href="/jobs?location=Europe" className="text-blue-500">
          Search all Europe-based jobs🌍
        </Link>
        , or search jobs by city or country, such as: Berlin London Paris Amsterdam Wageningen
        Zurich Denmark Vienna Sweden Hamburg Istanbul Remote positions (in Europe and North America)
        All Europe and more!
      </p>

      <Image
        className="inline-block mb-4 rounded-lg"
        src="/dog.jpeg"
        alt="Dog"
        width={700}
        height={400}
      />
    </div>
  );
}
