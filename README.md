# Noga Scrapes It All

Working draft on a fully represantion of https://altproteincareers.com/

## Test Cases for LinkedIn

- Coperion: Rate Limiter LinkedIn

## TODO

- Ensure to set Maximum Duration on Vercel to 60 (for long api calls and scraping)
- Check idealist.org
- Frontend: Make it look like altproteincareers.com
- Backend:
  - Parser UI
  - Read from Spreadsheet https://docs.google.com/spreadsheets/d/117ru5qY5ZAfF3QC-6C-edsaCgwVA44RvMnpDkCc00cQ/edit?gid=0#gid=0
  - Export as CSV

## Test Scrapers

0. multiOn.com
1. agentql.com / https://www.youtube.com/watch?v=7kbQnLN2y_I&t=292s
2. Free Markdown Return https://r.jina.ai/https://missionbarns.com/careers/
3. https://www.scrapingbee.com/documentation/data-extraction/
   - https://www.scrapingbee.com/documentation/data-extraction/#extract-all-text-from-a-page
   - List parse needs type list {
     "first_post_title" : {
     "selector": ".post-title",
     "type": "item"
     },
     "all_post_title" : {
     "selector": ".post-title",
     "type": "list"
     },
     }
4. https://app.zenrows.com/scraping-browser
