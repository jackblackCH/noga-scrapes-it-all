# Noga Scrapes It All

Working draft on a fully representation of https://altproteincareers.com/

## Setup

- npm install
- AirTable Access
- Vercel Access
  - Set Maximum Duration on Vercel to 60 (for long API calls and scraping)

## TODO

- Upload logos or write a service to find it. https://airtable.com/developers/web/api/upload-attachment
- Harmless Harvest: Adding jobs is not unique when title is the same. e.g 3 different project managers from different cities.
- Job Adding: E.g Mooji Meats: Jobs with same title and cannot be added. Unique key generation needed e.g Title + Location

## Done

- [x] Revalidate sidebar
- [x] @Noga: Question how often should jobs be parsed? 24h.

## Test Cases with a lot of jobs, working

- Pulmuone Foods USA, Inc.
- Sabra Dipping Company

## Test Cases Not working

- The Hershey Company: Huge list.
- Coperion: Rate Limiter LinkedIn

## Difficulties (Source code too big)

- Amy's Kitchen (too many tokens)
- Coperion (too many tokens)
- GEA (too many tokens)

## Companies not on LinkedIn anymore

- New School Foods
- Bond Pet Foods

## Scraping Services

### Currently Testing

- ZenScrape (https://app.zenscrape.com/)

Test LinkedIn Urls:

1. [Amy's Kitchen](https://www.linkedin.com/jobs/search/?currentJobId=4049677943&f_C=34358&geoId=92000000&origin=COMPANY_PAGE_JOBS_CLUSTER_EXPANSION&originToLandingJobPostings=4049677943%2C4052867861%2C4019409912%2C4049692986%2C4061912020%2C4057230090%2C4040091593%2C3994082416%2C4063306773)

2. [Pulmuone Foods](https://www.linkedin.com/jobs/search/?currentJobId=4054964044&f_C=1318584&geoId=92000000&origin=COMPANY_PAGE_JOBS_CLUSTER_EXPANSION&originToLandingJobPostings=4054964044%2C4040856705%2C4060223759%2C4040861611%2C4070140186%2C4065929319%2C4045539869%2C4065929258%2C4060225094)

### Services is evaluation

1. https://app.getapihub.cloud/billing?billing=true super fast. Entry is 30$ per month, Basic 120$
1. Apify: https://console.apify.com/actors/BHzefUZlZRKWxkTck/integrations
1. Jina AI Markdown Parser: Free API endpoint: https://r.jina.ai/https://missionbarns.com/careers/

### Services to Evaluate

1. https://github.com/apify/crawlee
2. Sraperapi.com: 49$/m 100'000 Credits, 20 concurrent threads, 30 credits per request.

3. ZenRows Browser
   - URL: https://app.zenrows.com/scraping-browser

### Sucks harder than hard

- ScrapingBee

## Nice but wrong technology

- 1. AgentQL
  - URL: https://agentql.com
  - Demo video: https://www.youtube.com/watch?v=7kbQnLN2y_I&t=292s
