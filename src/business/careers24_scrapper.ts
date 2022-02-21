import * as puppeteer from 'puppeteer';
import {JobDetails} from '../domain/entities/job_details'
import logging from '../config/logging'

const NAMESPACE = 'Careers24Scrapper'

export class Careers24Scrapper {

    //todo get from the database or cache
    private url = 'https://www.careers24.com/'

    async getJobDetails(jobLink: string, jobStoreId: number, platformId: number): Promise<JobDetails> {
        return new Promise<JobDetails>(async function (resolve, reject) {
            const browser = await puppeteer.launch()
            const page = await browser.newPage()
            try {
                await page.goto(jobLink);

                await page.waitForSelector('h1.mb-0 > span:nth-child(2)')
                const title = await page.$$eval('h1.mb-0 > span:nth-child(2)', (inputs) => inputs.map(input => input.textContent));
                const location = await page.$$eval('.small-text > li:nth-child(1) > a:nth-child(2)', (inputs) => inputs.map((input) => input.textContent));
                const type = await page.$$eval('.small-text > li:nth-child(3)', (inputs) => inputs.map((input) => input.textContent));
                const employer = await page.$$eval('p.mb-15:nth-child(2) > a:nth-child(1)', (inputs) => inputs.map((input) => input.textContent));
                const reference = await page.$$eval('.small-text > li:nth-child(7)', (inputs) => inputs.map((input) => input.textContent));
                const closingDate = await page.$$eval('.smallest-text > div:nth-child(1) > p:nth-child(1)', (inputs) => inputs.map((input) => input.textContent));
                const salary = await page.$$eval('li.elipses:nth-child(2)', (inputs) => inputs.map((input) => {
                    let text = input.textContent
                    return text.substring(text.indexOf(':') + 1).trim()
                }));

                let jobDetails: JobDetails = {
                    id: null,
                    title: title[0],
                    type: type[0].toString().substring(reference.toString().indexOf(':') + 1).trim(),
                    platformId,
                    reference: reference.toString().substring(reference.toString().indexOf(':') + 1).trim(),
                    salaryMin: salary.toString().replace(/[\r\n]+/gm, ""),
                    salaryMax: salary.toString().replace(/[\r\n]+/gm, ""),
                    location: location[0],
                    closingDate: closingDate.toString().substring(closingDate.toString().indexOf('before') + 6, closingDate.toString().indexOf('|')).trim(),
                    employer: employer[0],
                    jobStoreId: jobStoreId,
                    link: jobLink
                }

                page.close()
                browser.close()
                return resolve(jobDetails)
            } catch (error) {
                page.close()
                browser.close()
                logging.error(NAMESPACE, 'An error occured while getting job details', [jobLink, jobStoreId, error])
                return reject({
                    error: error,
                    message: `An error occured while getting job details, ${JSON.stringify(jobLink)}, ${jobStoreId}`
                })
            }
        })
    }

    async getLinks(): Promise<string[]> {

        const browser = await puppeteer.launch()
        const page = await browser.newPage()
        await page.goto(this.url);

        const btnSearchSelector = '#btnSearch'
        await page.waitForSelector(btnSearchSelector)
        await page.click(btnSearchSelector)

        await page.waitForSelector('#pagination');
        const totPages = await page.evaluate('document.querySelector("#pagination").getAttribute("data-total-pages")');

        let linkAccum: string[] = [];

        (async () => {
            //todo use totPages here
            for (let i = 0; i < totPages; i++) {
                await page.waitForSelector("#divSearchResults");
                let unfilteredLinksList = await this.getPageLinks(page)
                for (let j = 0; j < unfilteredLinksList.length; j++) {
                    if (!linkAccum.includes(unfilteredLinksList[j])) {
                        linkAccum.push(unfilteredLinksList[j]);
                    }
                }

                const nextPageClickSelector = 'li.page-item:nth-child(6) > a:nth-child(1)'

                await page.waitForXPath("/html/body/section/section/main/div[4]/div[3]/div[2]/div[4]/nav/ul/li[6]/a");
                await page.click(nextPageClickSelector)
            }
        })()

        page.close()
        browser.close()
        return linkAccum
    }

    private async getPageLinks(page: puppeteer.Page) {
        const divSearchResultsSelector = 'divSearchResults';
        return await page.evaluate((divSearchResultsSelector) => {
            const links: string[] = [];

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