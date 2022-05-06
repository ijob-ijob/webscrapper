import { SchedulerConfRepo } from '../../database/scheduler-conf-repo'
import { SchedulerConfPlatform } from '../../domain/entities/scheduler-conf'
import { SchedulerConfType } from '../../domain/constant/scheduler-conf-types'
import { Scheduler } from './scheduler'
import { GlobalContainer } from '../../container/global-container'
import logging from '../../config/logging'

export interface SchedulerJobDetails {
    identifier: string
    isProcessing: boolean
}

const NAMESPACE = 'SchedulerBuilder'
export class SchedulerBuilder {
    private careers24JobStoreImporterScheduler: Scheduler
    private careers24JobDetailsImporterScheduler: Scheduler
    private duplicateCleanerScheduler: Scheduler
    private schedulerReseter: Scheduler

    constructor (private globalContainer: GlobalContainer) {
      this.careers24JobStoreImporterScheduler = this.globalContainer.getSchedulerContainer().getCareers24JobStoreImporterScheduler()
      this.careers24JobDetailsImporterScheduler = this.globalContainer.getSchedulerContainer().getCareers24JobDetailsImporterScheduler()
      this.duplicateCleanerScheduler = this.globalContainer.getSchedulerContainer().getDuplicateCleanerScheduler()
      this.schedulerReseter = this.globalContainer.getSchedulerContainer().getSchedulerReseter()
    }

    public getJobDetails (): SchedulerJobDetails[] {
      return [
        {
          identifier: 'careers24JobStoreImporterScheduler',
          isProcessing: this.careers24JobStoreImporterScheduler.isProcessing()
        },
        {
          identifier: 'careers24JobDetailsImporterScheduler',
          isProcessing: this.careers24JobDetailsImporterScheduler.isProcessing()
        },
        {
          identifier: 'duplicateCleanerScheduler',
          isProcessing: this.duplicateCleanerScheduler.isProcessing()
        },
        {
          identifier: 'schedulerReseter',
          isProcessing: this.schedulerReseter.isProcessing()
        }
      ]
    }

    public async startSchedulers (): Promise<void> {
      const schedulerConfRepo: SchedulerConfRepo = new SchedulerConfRepo()

      schedulerConfRepo.getActiveSchedularConf()
        .then((schedulerConfPlatformList: SchedulerConfPlatform[]) => {
          this.startAndReturnScheduledTasks(schedulerConfPlatformList)
          logging.info(NAMESPACE, 'Finished starting and getting scheduler conf')
        }).catch((error) => {
          logging.error(NAMESPACE, 'An error occurred while getting and starting scheduler conf', error)
          return new Promise((resolve, reject) => reject(new Error(`An error occurred whole getting and starting scheduler conf, ${error}`)))
        })

      return new Promise((resolve) => resolve())
    }

    private startAndReturnScheduledTasks (schedulerConfPlatformList: SchedulerConfPlatform[]): void {
      for (let i = 0; i < schedulerConfPlatformList.length; i++) {
        const schedulerConfPlatform: SchedulerConfPlatform = schedulerConfPlatformList[i]

        switch (schedulerConfPlatform.identifier) {
          case SchedulerConfType.CAREERS24JONDETAILSRESOLVER:
            this.careers24JobDetailsImporterScheduler.start(schedulerConfPlatform.identifier, schedulerConfPlatform.cron)
            break
          case SchedulerConfType.DUPLICATECLEANER:
            this.duplicateCleanerScheduler.start(schedulerConfPlatform.identifier, schedulerConfPlatform.cron)
            break
          case SchedulerConfType.SCHEDULERRESETER:
            this.schedulerReseter.start(schedulerConfPlatform.identifier, schedulerConfPlatform.cron)
            break
          case SchedulerConfType.CAREERS24JOBSTOREIMPORTER:
            this.careers24JobStoreImporterScheduler.start(schedulerConfPlatform.identifier, schedulerConfPlatform.cron)
            break
          default:
            logging.warn(NAMESPACE, 'Could not find configured scheduler conf', schedulerConfPlatform)
            break
        }
      }
      logging.info(NAMESPACE, 'Finished starting and returning scheduled tasks', schedulerConfPlatformList)
    }
}
