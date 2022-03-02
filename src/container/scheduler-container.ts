import { Careers24JobStoreImporterScheduler } from '../business/scheduler/careers-24-job-store-importer-scheduler'
import { Careers24JobDetailsImporterScheduler } from '../business/scheduler/careers24-job-details-importer-scheduler'
import { GlobalContainer } from '../container/global-container'

export class SchedulerContainer {
    private careers24JobStoreImporterScheduler: Careers24JobStoreImporterScheduler
    private careers24JobDetailsImporterScheduler: Careers24JobDetailsImporterScheduler

    constructor(private globalContainer: GlobalContainer) {
        this.init()
    }
    private init() {
        this.careers24JobStoreImporterScheduler = new Careers24JobStoreImporterScheduler(this.globalContainer)
        this.careers24JobDetailsImporterScheduler = new Careers24JobDetailsImporterScheduler(this.globalContainer)
    }

    public getCareers24JobStoreImporterScheduler(): Careers24JobStoreImporterScheduler {
        return this.careers24JobStoreImporterScheduler
    }

    public getCareers24JobDetailsImporterScheduler(): Careers24JobDetailsImporterScheduler {
        return this.careers24JobDetailsImporterScheduler
    }
}