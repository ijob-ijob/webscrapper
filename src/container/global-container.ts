import { ScrapperContainer } from './scrapper-container'
import { RepoContainer } from './repo-container'
import { JobSaverContainer } from './job-saver-container'
import { SchedulerContainer } from './scheduler-container'
import { ImporterContainer } from '../container/importer-container'
import { CleanerContainer } from '../container/cleaner-container'

export class GlobalContainer {
    private readonly scrapperContainer: ScrapperContainer
    private readonly repoContainer: RepoContainer
    private readonly jobSaverContainer: JobSaverContainer
    private readonly schedulerContainer: SchedulerContainer
    private readonly importerContainer: ImporterContainer
    private readonly cleanerContainer: CleanerContainer

    constructor () {
      this.repoContainer = new RepoContainer()
      this.scrapperContainer = new ScrapperContainer()
      this.jobSaverContainer = new JobSaverContainer(this)
      this.schedulerContainer = new SchedulerContainer(this)
      this.importerContainer = new ImporterContainer(this)
      this.cleanerContainer = new CleanerContainer(this)
    }

    public getScrapperContainer (): ScrapperContainer {
      return this.scrapperContainer
    }

    public getRepoContainer (): RepoContainer {
      return this.repoContainer
    }

    public getJobSaverContainer (): JobSaverContainer {
      return this.jobSaverContainer
    }

    public getSchedulerContainer (): SchedulerContainer {
      return this.schedulerContainer
    }

    public getImporterContainer (): ImporterContainer {
      return this.importerContainer
    }

    public getCleanerContainer (): CleanerContainer {
      return this.cleanerContainer
    }
}
