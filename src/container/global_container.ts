import { ScrapperContainer } from './scrapper_container'
import { RepoContainer } from './repo_container'
import { JobSaverContainer } from './job_saver_container'
import { SchedulerContainer } from './scheduler-container'
import { ImporterContainer } from '../container/importer_container'

export class GlobalContainer {
    private scrapperContainer: ScrapperContainer
    private repoContiner: RepoContainer
    private jobSaverContainer: JobSaverContainer
    private schedulerContainer: SchedulerContainer
    private importerContainer: ImporterContainer

    constructor() {
        this.repoContiner = new RepoContainer()
        this.scrapperContainer = new ScrapperContainer()
        this.jobSaverContainer = new JobSaverContainer(this)
        this.schedulerContainer = new SchedulerContainer(this)
        this.importerContainer = new ImporterContainer(this)
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

    public getSchedulerContainer(): SchedulerContainer {
        return this.schedulerContainer
    }

    public getImporterContainer(): ImporterContainer {
        console.log('##############################################')
        return this.importerContainer
    }
}