import { JobDetailsSaver } from '../business/saver/job_details_saver'
import { JobStoreSaver } from '../business/saver/job_store_saver'
import { RepoContainer } from '../container/repo_container'
import { GlobalContainer } from '../container/global_container'

export class JobSaverContainer {
    private jobDetailsSaver: JobDetailsSaver
    private jobStoreSaver: JobStoreSaver

    constructor(private globalContainer: GlobalContainer) {
        this.init()
    }

    private init(): void {
        this.jobDetailsSaver = new JobDetailsSaver(this.globalContainer)
        this.jobStoreSaver = new JobStoreSaver(this.globalContainer)
    }

    public getJobDetailsSaver(): JobDetailsSaver {
        return this.jobDetailsSaver
    }

    public getJobStoreSaver(): JobStoreSaver {
        return this.jobStoreSaver
    }
}