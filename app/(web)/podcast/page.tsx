import Image from 'next/image';

export default function Podcast() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Podcast</h1>

      <div className="mx-auto max-w-2xl space-y-8">
        <Image
          className="rounded-lg"
          src="/podcast.jpeg"
          alt="Alt Protein Careers Podcast"
          width={700}
          height={400}
        />
        <p>
          Join us as we dive into the world of alternative proteins through the lens of career
          journeys. Hosted by Sam Fisher, a seasoned{' '}
          <a
            href="https://www.altproteinpartners.com/executive-coaching"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:underline text-emerald-600"
          >
            Career and Executive Coach
          </a>
          , this podcast aims to inspire and empower listeners to pursue fulfilling careers in the
          alt protein industry. ✓ Gain insights and actionable advice from professionals across
          various roles in the alt protein sector. ✓ Discover diverse career paths and learn how to
          navigate your own journey within or related to alt proteins. ✓ Get motivated to pursue
          your career aspirations with stories of success, challenges, and lessons learned.
        </p>

        <iframe
          src="https://podcasters.spotify.com/pod/show/alt-protein-careers/embed/episodes/Isaac-Goldman-of-Eclipse-Foods-e2k6dl4"
          height="102px"
          width="100%"
          style={{ borderRadius: '12px', border: 'none', overflow: 'hidden' }}
          scrolling="no"
          frameBorder={0}
        ></iframe>

        <div>
          <p>Listen to the Full Series:</p>
          <ul className="list-disc list-inside">
            <li>
              <a
                href="https://podcasts.apple.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline text-emerald-600"
              >
                Listen on Apple Podcasts
              </a>
            </li>
            <li>
              <a
                href="https://spotify.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline text-emerald-600"
              >
                Listen on Spotify
              </a>
            </li>
            <li>
              <a
                href="https://podcasters.spotify.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline text-emerald-600"
              >
                Listen on Spotify for Podcasters
              </a>
            </li>
          </ul>
        </div>

        <Image
          className="rounded-lg"
          src="/podcast-dude.jpeg"
          alt="Alt Protein Careers Podcast Dude"
          width={700}
          height={400}
        />

        <h2 className="text-emerald-600 font-bold text-lg">About the Podcast</h2>
        <p>
          Each episode delves into the unique experiences and insights of individuals within the alt
          protein sector, offering a rich tapestry of stories and perspectives. Whether you are just
          starting your career journey or seeking to advance to new heights, you&apos;ll find
          inspiration and guidance in our 20-30 minute episodes. Experience a light-hearted yet
          informative tone that keeps you entertained while you learn.
        </p>

        <h2 className="text-emerald-600 font-bold text-lg">Meet the Host</h2>
        <p>
          Sam Fisher is your guide through the world of building a career in alt proteins. Known for
          asking great questions and uncovering hidden insights, Sam brings a unique perspective to
          each episode.
          <a
            href="https://www.altproteinpartners.com/executive-coaching"
            target="_blank"
            rel="noopener noreferrer"
          >
            Sam is a respected Career and Executive Coach with expertise in the alt
          </a>
          protein sector, and a graduate of the Stanford Graduate School of Business.
        </p>

        <h2 className="text-emerald-600 font-bold text-lg">Join the Community</h2>
        <div>
          <p>
            <a
              href="https://docs.google.com/forms/d/e/1FAIpQLSfR8VH9-6WnXM2z6yKUXmeHYv0pBqDx5fQnpxfHTXyL7rYTzg/viewform?usp=sf_link"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:underline text-emerald-600"
            >
              Join the Alt Protein Careers community
            </a>{' '}
            to connect with fellow alt protein enthusiasts and professionals. Stay updated on the
            latest podcast episodes, industry news, and career opportunities. Gain exclusive access
            to resources and events to support your career journey.
          </p>
        </div>

        <h2 className="text-emerald-600 font-bold text-lg">Take the Next Step</h2>
        <p>
          Explore our executive coaching services tailored for individuals in the alt protein
          industry. Work with Sam to refine your career goals, develop strategies, and achieve
          success in your career. Reach out to Sam at{' '}
          <a href="mailto:sam@altproteincareers.com" className="text-emerald-600 hover:underline">
            sam@altproteincareers.com
          </a>{' '}
          to set up an initial consultation (please include your availability.)
        </p>
      </div>
    </div>
  );
}
