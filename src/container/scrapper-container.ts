import { Careers24JobDetailsScrapper } from '../business/scrapper/careers24-job-details-scrapper'
import { Careers24JobStoreScrapper } from '../business/scrapper/careers24-job-store-scrapper'

export class ScrapperContainer {
    private careers24JobDetailsScrapper: Careers24JobDetailsScrapper
    private careers24JobStoreScrapper: Careers24JobStoreScrapper

    constructor () { this.init() }

    private init (): void {
      this.careers24JobDetailsScrapper = new Careers24JobDetailsScrapper()
      this.careers24JobStoreScrapper = new Careers24JobStoreScrapper()
    }

    public getCareers24JobDetailsScrapper (): Careers24JobDetailsScrapper {
      return this.careers24JobDetailsScrapper
    }

    public getCareers24JobStoreScrapper (): Careers24JobStoreScrapper {
      return this.careers24JobStoreScrapper
    }
}
