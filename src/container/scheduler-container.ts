import { Careers24JobStoreImporterScheduler } from '../business/scheduler/careers-24-job-store-importer-scheduler'
import { GlobalContainer } from '../container/global_container'

export class SchedulerContainer {
    private careers24JobStoreImporterScheduler: Careers24JobStoreImporterScheduler

    constructor(private globalContainer: GlobalContainer) {
        this.init()
    }
    private init() {
        this.careers24JobStoreImporterScheduler = new Careers24JobStoreImporterScheduler(this.globalContainer)
    }

    public getCareers24JobStoreImporterScheduler(): Careers24JobStoreImporterScheduler {
        return this.careers24JobStoreImporterScheduler
    }
}