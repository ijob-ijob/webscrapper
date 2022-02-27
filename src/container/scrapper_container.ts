import { Careers24Scrapper } from '../business/scrapper/careers24_scrapper'
import { RepoContainer } from './repo_container'

export class ScrapperContainer {
    private careers24Scrapper: Careers24Scrapper

    constructor(private repoContainer: RepoContainer) {
    }

    private init(): void {

    }

    public getCareers24Scrapper(): Careers24Scrapper {
        return this.careers24Scrapper
    }
}