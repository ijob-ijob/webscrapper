import * as puppeteer from 'puppeteer';
import { JobDetails } from '../../domain/entities/job-details'
import logging from '../../config/logging'

const NAMESPACE = 'Careers24Scrapper'

export class Careers24JobDetailsScrapper {
  public async getJobDetails (jobLink: string, jobStoreId: number, platformId: number): Promise<JobDetails> {
    const browser = await puppeteer.launch({
      args: ['--disable-dev-shm-usage'],
      headless: true
    })
    const page = await browser.newPage()
    try {
      await page.goto(jobLink)

      await page.waitForSelector('h1.mb-0 > span:nth-child(2)')
      const title = await page.$$eval('h1.mb-0 > span:nth-child(2)', (inputs) => inputs.map(input => input.textContent));
      const location = await page.$$eval('.small-text > li:nth-child(1) > a:nth-child(2)', (inputs) => inputs.map((input) => input.textContent));
      const type = await page.$$eval('.small-text > li:nth-child(3)', (inputs) => inputs.map((input) => input.textContent));
      const employer = await page.$$eval('p.mb-15:nth-child(2) > a:nth-child(1)', (inputs) => inputs.map((input) => input.textContent));
      const reference = await page.$$eval('.small-text > li:nth-child(7)', (inputs) => inputs.map((input) => input.textContent));
      const closingDate = await page.$$eval('.smallest-text > div:nth-child(1) > p:nth-child(1)', (inputs) => inputs.map((input) => input.textContent));
      const salary = await page.$$eval('li.elipses:nth-child(2)', (inputs) => inputs.map((input) => {
        const text = input.textContent
        return text.substring(text.indexOf(':') + 1).trim()
      }))

      const jobDetails: JobDetails = {
        id: null,
        title: title[0],
        type: type[0].toString().substring(reference.toString().indexOf(':') + 1).trim(),
        platformId,
        reference: reference.toString().substring(reference.toString().indexOf(':') + 1).trim(),
        salaryMin: salary.toString().replace(/[\r\n]+/gm, ''),
        salaryMax: salary.toString().replace(/[\r\n]+/gm, ''),
        location: location[0],
        closingDate: closingDate.toString().substring(closingDate.toString().indexOf('before') + 6, closingDate.toString().indexOf('|')).trim(),
        employer: employer[0],
        jobStoreId: jobStoreId,
        link: jobLink
      }

      await page.close()
      await browser.close()
      return new Promise((resolve) => resolve(jobDetails))
    } catch (error) {
      await page.close()
      await browser.close()
      logging.error(NAMESPACE, 'An error occurred while getting job details', [jobLink, jobStoreId, error])
      return new Promise((resolve, reject) => {
        return reject(new Error(`An error occurred while getting job details, ${JSON.stringify(jobLink)}, ${jobStoreId}::${error}`))
      })
    }
  }
}
