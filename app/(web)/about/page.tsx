import Image from 'next/image';

export default function About() {
  return (
    <>
      <h1 className="text-2xl max-w-2xl mb-4 mx-auto font-bold">About</h1>

      <div className="space-y-8 max-w-2xl mx-auto">
        <section className="space-y-4">
          <h2 className="text-lg font-semibold">
            We provide career resources, job postings, and recruiting services to the alt protein
            industry.
          </h2>
          <h2 className="font-bold text-xl text-emerald-600">For Professionals</h2>
          <p>
            <strong>Join our community.</strong> Join our community so that we can let you know if
            jobs relevant to your experience and location come up. Follow us on
            <a href="https://www.linkedin.com" className="hover:underline text-emerald-600">
              LinkedIn
            </a>{' '}
            and{' '}
            <a href="https://www.instagram.com" className="hover:underline text-emerald-600">
              Instagram
            </a>{' '}
            to stay up to date with hiring trends, new job openings, and career resources.
          </p>

          <p>
            <strong>Polish your resume.</strong> Use these tips to tailor your resume to the alt
            protein industry. Use any of our resume templates to get started, or work with one of
            our professionals to make sure your application stands out.
          </p>

          <p>
            <strong>Find a job.</strong>{' '}
            <a href="/jobs" className="hover:underline text-emerald-600">
              Search all jobs
            </a>
            , or use filters and tags to refine your search. Stay abreast of new jobs by subscribing
            to new job alerts (at the bottom of the jobs page.)
          </p>

          <p>
            <strong>Gain expertise.</strong> Review career resources specific to the alt protein
            industry. Become more knowledgeable about the industry or gain specific skills that will
            set you apart from other job applicants by exploring the resources on our{' '}
            <a href="/education" className="hover:underline text-emerald-600">
              education page
            </a>
            .
          </p>

          <p>
            <strong>Learn how to break into the alt protein industry.</strong> Be strategic with
            your transition: start with these resources for professionals with backgrounds in
            engineering, biotech, and large food corporations. If you&apos;re not sure where to
            start,{' '}
            <a href="/resources" className="hover:underline text-emerald-600">
              start here
            </a>
            . Check out additional resources, or reach out to us for more specific help.
          </p>

          <p>
            <strong>Interview prep.</strong> Work with one of our professionals to optimize your
            resume, your professional online profile, decide where and how to apply, and prepare for
            interviews with alt protein companies.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="font-bold text-xl text-emerald-600">For Employers</h2>
          <p>
            Post a job. Post a featured job to get exposure to hundreds of highly relevant job
            seekers. Featured job posts on Alt Protein Careers get ~3x visibility compared to
            regular posts.
          </p>

          <p>
            <strong>Get help with targeted search.</strong> We headhunt top talent to the alt
            protein companies we work with. We are ruthlessly determined, creative and meticulous
            when it comes to finding and hiring them. Learn more about our recruiting services{' '}
            <a href="/recruiting" className="hover:underline text-emerald-600">
              here
            </a>
            .
          </p>

          <p>
            <strong>Get specialized leadership coaching for yourself or for your team.</strong> We
            specialize in leadership coaching for founders and executives specifically in the
            alternative protein space.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="font-bold text-xl text-emerald-600">Who we are</h2>
          <div>
            <h2 className="font-bold text-lg">Noga Golan, Founder</h2>
            <Image
              src="/about/noga.png"
              alt="Noga Golan"
              width={450}
              height={300}
              style={{ height: 'auto', width: '100%' }}
              className="rounded-lg"
              priority
            />
            <p>
              Noga&apos;s professional experience spans several years in private equity and venture
              investing to working as a marketing leader in financial technology. Noga holds an
              M.B.A. from the Stanford Graduate School of Business. Additionally, she served three
              years in the Israeli military as a commanding officer (rank: Lieutenant.)
            </p>
          </div>

          <div>
            <h2 className="font-bold text-lg">Sam Fisher, Podcast Host and Executive Coach</h2>
            <Image
              src="/about/sam.png"
              alt="Sam Fisher"
              width={450}
              height={300}
              style={{ height: 'auto', width: '100%' }}
              className="rounded-lg"
            />
            <p>
              Sam is an experienced executive coach in the alt protein, business, and technology
              industries. As a graduate of Stanford Business School and former startup founder, Sam
              has a unique understanding of the demands and challenges that come with high-impact
              roles. Sam has helped numerous founders, young professionals, and young executives
              discover fulfilling career paths, prepare for interviews, and set and achieve goals
              while prioritizing personal well-being.
            </p>
          </div>

          <div>
            <h2 className="font-bold text-lg">Anna Heslop, Recruitment Director</h2>
            <Image
              src="/about/anna.png"
              alt="Anna Heslop"
              width={450}
              height={300}
              style={{ height: 'auto', width: '100%' }}
              className="rounded-lg"
            />
            <p>
              Anna has been at the nexus of recruiting and alternative proteins, biomanufacturing,
              and agri-food tech for nearly a decade. She is a passionate, well-known global
              recruiter in the alternative protein and future food space, with extensive recruiting
              and leadership experience at firms like Charlton Morris and CSG Global. Anna resides
              in the UK and serves as the London Ambassador for Food Hack. Anna holds a BA in
              Business and Management from Leeds Beckett University.
            </p>
          </div>

          <div>
            <h2 className="font-bold text-lg">Daniel Conway, Business Development Analyst</h2>
            <Image
              src="/about/daniel.png"
              alt="Daniel Conway"
              width={450}
              height={300}
              style={{ height: 'auto', width: '100%' }}
              className="rounded-lg"
            />
            <p>
              Daniel is a true future of food enthusiast! He was the Founder and President of the
              Berkeley Chapter of the Plant Futures Initiative, an alumnus of the Alt:Meat Lab,
              voyaged on a self-guided tour of cultivated and plant-based meat companies in Israel,
              and collaborated on the launch of Beyond Meat&apos;s pilot campus ambassador program
              at UC Berkeley. Daniel holds a BS in Environmental Economics and Policy and a
              certificate in Entrepreneurship & Technology, from the University of California,
              Berkeley.
            </p>
          </div>

          <div>
            <h2 className="font-bold text-lg">Sacha Langer, Career Consultant</h2>
            <Image
              src="/about/sacha.png"
              alt="Sacha Langer"
              width={450}
              height={300}
              style={{ height: 'auto', width: '100%' }}
              className="rounded-lg"
            />
            <p>
              Sacha spent several years working in advertising at Google before pursuing her M.B.A.
              at Harvard Business School. Since graduating from Harvard, she has spent time with
              cultivated meat and foodtech companies in business and operations leadership roles.
              Sacha is a successful MBA Admissions Consultant and is passionate about applying her
              experience to helping others find careers they&apos;re excited about in the alt
              protein space.
            </p>
          </div>

          <div>
            <h2 className="font-bold text-lg">Jennifer Wynn, HR Strategy Partner</h2>
            <Image
              src="/about/jennifer.png"
              alt="Jennifer Wynn"
              width={450}
              height={300}
              style={{ height: 'auto', width: '100%' }}
              className="rounded-lg"
            />
            <p>
              Over her two-decade-long career, Jennifer has become an established thought leader,
              her influence spanning diverse organizational landscapes from Fortune 500 corporations
              to grassroots nonprofits. As a long-time advocate for environmental and animal
              protection, her personal mission is to enable the proliferation of sustainable, humane
              solutions for the masses, with a key focus on alternative proteins and materials.
              Jennifer holds an M.B.A in Business & Sustainability from Yale School of Management
              and an M.A. in Industrial/Organizational Psychology from The University of Tulsa.
            </p>
          </div>

          <div>
            <h2 className="font-bold text-lg">Sarah Meadows, Brand & Social Media Fellow</h2>
            <Image
              src="/about/sarah.png"
              alt="Sarah Meadows"
              width={450}
              height={300}
              style={{ height: 'auto', width: '100%' }}
              className="rounded-lg"
            />
            <p>
              Sarah is a graduate student at the University of Michigan, where she is pursuing her
              Master&apos;s in Sustainability and Environmental Policy. Sarah is passionate about
              making the world a better place by understanding environmental change: she attended
              COP 27 in Egypt, where she researched sustainable food production, and worked on
              global energy research for the Atlantic Council. Sarah holds a BA in International
              Studies, with a certificate in Jewish Studies and a minor in Environmental Science,
              from Indiana University.
            </p>
          </div>

          <div>
            <h2 className="font-bold text-lg">Shimoi Kalra, Marketing & Communications Fellow</h2>
            <Image
              src="/about/shimoi.png"
              alt="Shimoi Kalra"
              width={450}
              height={300}
              style={{ height: 'auto', width: '100%' }}
              className="rounded-lg"
            />
            <p>
              Shimoi is motivated to build a more eco-friendly planet for humans, animals, and the
              planet, and is especially enthusiastic about battling food insecurity and
              malnutrition, and diving into the details of cultivated meat. In addition to her work
              with Alt Protein Careers, Shimoi is a fellow at From Fauna, a non-profit dedicated to
              advancing the field of cultivated meat, and a full-time high school student in
              Toronto, Canada.
            </p>
          </div>

          <div>
            <h2 className="font-bold text-lg">Ruvi, Pawject Manager</h2>
            <Image
              src="/about/ruvi.jpeg"
              alt="Ruvi"
              width={450}
              height={300}
              style={{ height: 'auto', width: '100%' }}
              className="rounded-lg"
            />
            <p>
              Ruvi brings 7 years of cuteness, pawsitivity, and fetch skills to the team. He is an
              excellent recruiter, networker, and motivator. Ruvi&apos;s primary areas of focus at
              Alt Protein Careers are bringing people together and managing pawjects.
            </p>
          </div>
        </section>
      </div>
    </>
  );
}
