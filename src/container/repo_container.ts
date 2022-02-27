import { SchedulerConfRepo } from '../database/scheduler_conf_repo'
import { PlatformRepo } from '../database/platform_repo'
import { JobStoreRepo } from '../database/job_store_repo'
import { JobDetailsRepo } from '../database/job_details_repo'
import { DetailsStoreJobRepo } from '../database/details_store_job_repo'

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