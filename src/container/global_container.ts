import { ScrapperContainer } from './scrapper_container'
import { RepoContainer } from './repo_container'
import { JobSaverContainer } from './job_saver_container'

export class GlobalContainer {
    private scrapperContainer: ScrapperContainer
    private repoContiner: RepoContainer
    private jobSaverContainer: JobSaverContainer

    constructor() {
        this.repoContiner = new RepoContainer();
        this.scrapperContainer = new ScrapperContainer()
        this.jobSaverContainer = new JobSaverContainer(this)
    }

    public getScrapperContainer(): ScrapperContainer {
        return this.scrapperContainer
    }

    public getRepoContainer(): RepoContainer {
        return this.repoContiner
    }

    public getJobSaverContainer(): JobSaverContainer {
        return this.jobSaverContainer
    }
}