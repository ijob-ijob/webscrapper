import { SchedulerConfRepo } from '../../database/scheduler-conf-repo'
import { SchedulerConfPlatform } from '../../domain/entities/scheduler-conf'
import logging from '../../config/logging'
import { schedule, ScheduledTask } from 'node-cron'
import { JobDetailsSaver } from '../saver/job-details-saver'
import { SchedulerConfType } from '../../domain/constant/scheduler-conf-types'
import { JobStoreSaver } from '../saver/job-store-saver'
import { Scheduler } from './scheduler'
import { GlobalContainer } from '../../container/global-container'
import { Careers24JobStoreImporterScheduler } from './careers-24-job-store-importer-scheduler'

export interface SchedulerJobDetails {
    identitifier: string
    isProcessing: boolean
}

const NAMESPACE = 'SchedulerBuilder'
export class SchedulerBuilder {
    private careers24JobStoreImporterScheduler: Scheduler
    private careers24JobDetailsImporterScheduler: Scheduler
    private duplicateCleanerScheduler: Scheduler
    private schedulerReseter: Scheduler

    constructor(private globalContainer: GlobalContainer) {
        this.careers24JobStoreImporterScheduler = this.globalContainer.getSchedulerContainer().getCareers24JobStoreImporterScheduler()
        this.careers24JobDetailsImporterScheduler = this.globalContainer.getSchedulerContainer().getCareers24JobDetailsImporterScheduler()
        this.duplicateCleanerScheduler = this.globalContainer.getSchedulerContainer().getDuplicateCleanerScheduler()
        this.schedulerReseter = this.globalContainer.getSchedulerContainer().getSchedulerReseter()
    }

    public getJobDetails(): SchedulerJobDetails[] {
        return [
            {
                identitifier: 'careers24JobStoreImporterScheduler',
                isProcessing: this.careers24JobStoreImporterScheduler.isProcessing()
            },
            {
                identitifier: 'careers24JobDetailsImporterScheduler',
                isProcessing: this.careers24JobDetailsImporterScheduler.isProcessing()
            },
            {
                identitifier: 'duplicateCleanerScheduler',
                isProcessing: this.duplicateCleanerScheduler.isProcessing()
            },
            {
                identitifier: 'schedulerReseter',
                isProcessing: this.schedulerReseter.isProcessing()
            }
        ]
    }

    public async startSchedulers(): Promise<void> {
        const schedulerConfRepo: SchedulerConfRepo = new SchedulerConfRepo()

        let that = this
        return await new Promise<void>(function (resolve, reject) {
            schedulerConfRepo.getActiveSchedularConf()
                .then((schedulerConfPlaformList: SchedulerConfPlatform[]) => {
                    that.startAndReturnScheduledTasks(schedulerConfPlaformList)
                    logging.info(NAMESPACE, 'Finished starting and getting scheduler conf')
                    return resolve()
                }).catch((error) => {
                logging.error(NAMESPACE, 'An error occured while getting and starting scheduler conf', error)
                return reject(`An error occured whole getting and starting scheduler conf, ${error}`)
            })
        })
    }

    private startAndReturnScheduledTasks(schdulerConfPlatformList: SchedulerConfPlatform[]): void {
        for (let i = 0; i < schdulerConfPlatformList.length; i++) {
            let schedulerConfPlaform: SchedulerConfPlatform = schdulerConfPlatformList[i]

            switch (schedulerConfPlaform.identifier) {
                case SchedulerConfType.CAREERS24JONDETAILSRESOLVER:
                    this.careers24JobDetailsImporterScheduler.start(schedulerConfPlaform.identifier, schedulerConfPlaform.cron)
                    break
                case SchedulerConfType.DUPLICATECLEANER:
                    this.duplicateCleanerScheduler.start(schedulerConfPlaform.identifier, schedulerConfPlaform.cron)
                    break
                case SchedulerConfType.SCHEDULERRESETER:
                    this.schedulerReseter.start(schedulerConfPlaform.identifier, schedulerConfPlaform.cron)
                    break
                case SchedulerConfType.CAREERS24JOBSTOREIMPORTER:
                    this.careers24JobStoreImporterScheduler.start(schedulerConfPlaform.identifier, schedulerConfPlaform.cron)
                    break
                default:
                    logging.warn(NAMESPACE, 'Could not find configured scheduler conf', schedulerConfPlaform)
                    break
            }
        }
        logging.info(NAMESPACE, 'Finished starting and returning scheduled tasks', schdulerConfPlatformList)
    }
}