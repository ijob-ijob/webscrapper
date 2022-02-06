import * as puppeteer from 'puppeteer';

export class Careers24Scrapper {

    private url = 'https://www.careers24.com/'

    async getLinks(): Promise<string[]> {

        const browser = await puppeteer.launch()
        const page = await browser.newPage()
        await page.goto(this.url);

        const btnSearchSelector = '#btnSearch'
        await page.waitForSelector(btnSearchSelector)
        await page.click(btnSearchSelector)

        await page.waitForSelector('#pagination');
        const totPages = await page.evaluate('document.querySelector("#pagination").getAttribute("data-total-pages")');

        let linkAccum = [];

        //todo use totPages here
        for (let i = 0; i < totPages; i++) {
            await page.waitForSelector("#divSearchResults");
            let unfilteredLinksList = await this.getPageLinks(page)
            for (let j = 0; j < unfilteredLinksList.length; j++) {
                if (!linkAccum.includes(unfilteredLinksList[j])) {
                    linkAccum.push(unfilteredLinksList[j]);
                }
            }

            const nextPageClickSelector = 'li.page-item:nth-child(6) > a:nth-child(1)';

            await page.waitForXPath("/html/body/section/section/main/div[4]/div[3]/div[2]/div[4]/nav/ul/li[6]/a");
            await page.click(nextPageClickSelector);
            console.log(unfilteredLinksList)
        }

        // let jobTitleList: string[] = [];
        // for (let j = 0; j < linkAccum.length; j++) {
        //     await page.goto(linkAccum[j]);
        //     await page.waitForSelector('h1.mb-0 > span:nth-child(2)');
        //
        //     const jobTitle = await page.$$eval('h1.mb-0 > span:nth-child(2)', (inputs) => inputs.map(input => input.textContent));
        //     jobTitleList.push(...jobTitle);
        // }

        return linkAccum;;
    }

    private async getPageLinks(page) {
        const divSearchResultsSelector = 'divSearchResults';
        return await page.evaluate((divSearchResultsSelector) => {
            const links = [];

            /**
             * div.job-card -> div.row -> div.job-card-head -> aref
             */
            const divSearchResults = document.getElementById(divSearchResultsSelector);

            const eLinks = divSearchResults.querySelectorAll('a');
            for (let i = 0; i < eLinks.length; i++) {
                let iElement = eLinks[i].href;

                if (iElement.includes('adverts') && !links.includes(eLinks[i].href)) {
                    links.push(eLinks[i].href);
                }
            }

            return links;
        }, divSearchResultsSelector);
    }

}