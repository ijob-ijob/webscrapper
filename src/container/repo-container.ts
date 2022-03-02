import { SchedulerConfRepo } from '../database/scheduler-conf-repo'
import { PlatformRepo } from '../database/platform-repo'
import { JobStoreRepo } from '../database/job-store-repo'
import { JobDetailsRepo } from '../database/job-details-repo'
import { DetailsStoreJobRepo } from '../database/details-store-job-repo'

export class RepoContainer {
    private schedulerConfRepo: SchedulerConfRepo
    private platformRepo: PlatformRepo
    private jobStoreRepo: JobStoreRepo
    private jobDetailsRepo: JobDetailsRepo
    private detailsStoreJobRepo: DetailsStoreJobRepo

    constructor() {
        this.init()
    }

    private init() {
        this.schedulerConfRepo = new SchedulerConfRepo()
        this.platformRepo = new PlatformRepo()
        this.jobStoreRepo = new JobStoreRepo()
        this.jobDetailsRepo = new JobDetailsRepo()
        this.detailsStoreJobRepo = new DetailsStoreJobRepo()
    }

    public getSchedulerConfigRepo(): SchedulerConfRepo {
        return this.schedulerConfRepo
    }

    public getPatormRepo(): PlatformRepo {
        return this.platformRepo
    }

    public getJobStoreRepo(): JobStoreRepo {
        return this.jobStoreRepo
    }

    public getJobDetailsRepo(): JobDetailsRepo {
        return this.jobDetailsRepo
    }

    public getDetailsStorreJobRepo(): DetailsStoreJobRepo {
        return this.detailsStoreJobRepo
    }
}