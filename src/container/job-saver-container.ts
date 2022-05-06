import { JobDetailsSaver } from '../business/saver/job-details-saver'
import { JobStoreSaver } from '../business/saver/job-store-saver'
import { GlobalContainer } from '../container/global-container'

export class JobSaverContainer {
    private jobDetailsSaver: JobDetailsSaver
    private jobStoreSaver: JobStoreSaver

    constructor (private globalContainer: GlobalContainer) {
      this.init()
    }

    private init (): void {
      this.jobDetailsSaver = new JobDetailsSaver(this.globalContainer)
      this.jobStoreSaver = new JobStoreSaver(this.globalContainer)
    }

    public getJobDetailsSaver (): JobDetailsSaver {
      return this.jobDetailsSaver
    }

    public getJobStoreSaver (): JobStoreSaver {
      return this.jobStoreSaver
    }
}
