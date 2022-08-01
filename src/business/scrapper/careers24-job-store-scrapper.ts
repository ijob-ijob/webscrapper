import { PlatformType } from '../../domain/constant/platform-type'
import * as puppeteer from 'puppeteer'

export class Careers24JobStoreScrapper {
    platform = PlatformType.CAREERS24;
    private url = 'https://www.careers24.com/'

    public async getLinks (): Promise<string[]> {
      const browser = await puppeteer.launch({
        args: ['--disable-dev-shm-usage'],
        headless: true
      })
      const page = await browser.newPage()
      await page.goto(this.url)

      const btnSearchSelector = '#btnSearch'
      await page.waitForSelector(btnSearchSelector)
      await page.click(btnSearchSelector)

      await page.waitForSelector('#pagination')
      const totPages = await page.evaluate('document.querySelector("#pagination").getAttribute("data-total-pages")');

      const linkAccum: string[] = []

      await (async () => {
        for (let i = 0; i < totPages; i++) {
          await page.waitForSelector('#divSearchResults')
          const unfilteredLinksList = await this.getPageLinks(page)
          for (let j = 0; j < unfilteredLinksList.length; j++) {
            if (!linkAccum.includes(unfilteredLinksList[j])) {
              linkAccum.push(unfilteredLinksList[j])
            }
          }

          const nextPageClickSelector = 'li.page-item:nth-child(6) > a:nth-child(1)'

          await page.evaluate((selector) => {
            return document.querySelector(selector).click()
          }, nextPageClickSelector)

        }
        await page.close()
        await browser.close()
      })()

      return linkAccum
    }

    private async getPageLinks (page: puppeteer.Page) {
      const divSearchResultsSelector = 'divSearchResults'
      return await page.evaluate((divSearchResultsSelector) => {
        const links: string[] = []

        /**
         * div.job-card -> div.row -> div.job-card-head -> aref
         */
        const divSearchResults = document.getElementById(divSearchResultsSelector)

        const eLinks = divSearchResults.querySelectorAll('a')
        for (let i = 0; i < eLinks.length; i++) {
          const iElement = eLinks[i].href

          if (iElement.includes('adverts') && !links.includes(eLinks[i].href)) {
            links.push(eLinks[i].href)
          }
        }

        return links
      }, divSearchResultsSelector)
    }
}
