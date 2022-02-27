import { ScrapperContainer } from './scrapper_container'
import { RepoContainer } from './repo_container'

export class GlobalContainer {
    private scrapperContainer: ScrapperContainer
    private repoContiner: RepoContainer
    constructor() {
    }

    public getScrapperContainer(): ScrapperContainer {
        return this.scrapperContainer
    }

    public getRepoContainer(): RepoContainer {
        return this.repoContiner
    }
}