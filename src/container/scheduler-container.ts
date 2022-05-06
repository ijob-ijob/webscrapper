import { Careers24JobStoreImporterScheduler } from '../business/scheduler/careers-24-job-store-importer-scheduler'
import { Careers24JobDetailsImporterScheduler } from '../business/scheduler/careers24-job-details-importer-scheduler'
import { GlobalContainer } from '../container/global-container'
import { DuplicateCleanerScheduler } from '../business/scheduler/duplicate-cleaner-scheduler'
import { SchedulerReseter } from '../business/scheduler/scheduler-reseter'
import { ResetScheduler } from '../domain/model/reset-scheduler.model'
import { SchedulerConfType } from '../domain/constant/scheduler-conf-types'

export class SchedulerContainer {
    private careers24JobStoreImporterScheduler: Careers24JobStoreImporterScheduler
    private careers24JobDetailsImporterScheduler: Careers24JobDetailsImporterScheduler
    private duplicateCleanerScheduler: DuplicateCleanerScheduler
    private schedulerReseter: SchedulerReseter

    constructor (private globalContainer: GlobalContainer) {
      this.init()
    }

    private init () {
      this.careers24JobStoreImporterScheduler = new Careers24JobStoreImporterScheduler(this.globalContainer)
      this.careers24JobDetailsImporterScheduler = new Careers24JobDetailsImporterScheduler(this.globalContainer)
      this.duplicateCleanerScheduler = new DuplicateCleanerScheduler(this.globalContainer)
      this.schedulerReseter = new SchedulerReseter(this.globalContainer)
    }

    public reset (resetScheduler: ResetScheduler): void {
      switch (resetScheduler.identifier) {
        case SchedulerConfType.CAREERS24JONDETAILSRESOLVER:
          this.careers24JobDetailsImporterScheduler = null
          this.careers24JobDetailsImporterScheduler = new Careers24JobDetailsImporterScheduler(this.globalContainer)
          break
        case SchedulerConfType.DUPLICATECLEANER:
          this.duplicateCleanerScheduler = null
          this.duplicateCleanerScheduler = new DuplicateCleanerScheduler(this.globalContainer)
          break
        case SchedulerConfType.CAREERS24JOBSTOREIMPORTER:
          this.careers24JobStoreImporterScheduler = null
          this.careers24JobStoreImporterScheduler = new Careers24JobStoreImporterScheduler(this.globalContainer)
          break
      }
    }

    public getCareers24JobStoreImporterScheduler (): Careers24JobStoreImporterScheduler {
      return this.careers24JobStoreImporterScheduler
    }

    public getCareers24JobDetailsImporterScheduler (): Careers24JobDetailsImporterScheduler {
      return this.careers24JobDetailsImporterScheduler
    }

    public getDuplicateCleanerScheduler (): DuplicateCleanerScheduler {
      return this.duplicateCleanerScheduler
    }

    public getSchedulerReseter (): SchedulerReseter {
      return this.schedulerReseter
    }
}
