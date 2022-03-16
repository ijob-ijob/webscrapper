import { SchedulerConfPlatform } from '../../domain/entities/scheduler-conf'
import { schedule, ScheduledTask } from 'node-cron'
import { Careers24JobDetailsScrapper } from '../scrapper/careers24-job-details-scrapper'
import { Scheduler } from './scheduler'
import { GlobalContainer } from '../../container/global-container'
import logging from '../../config/logging'

const NAMESPACE = 'Careers24ScrapperScheduler'
export class Careers24JobStoreImporterScheduler implements Scheduler {
    private isProcessingInternal: boolean = false
    private cronJob: ScheduledTask
    private identifier: string
    private lastProcessedAt: Date
    private cron: string

    constructor(private globalContainer: GlobalContainer) {}

    public setIsProcessing(isProcessing: boolean): void {
        this.isProcessingInternal = isProcessing
    }

    public getCron(): string {
        return this.cron
    }

    public getLastProcessedAt(): Date {
        return this.lastProcessedAt
    }

    public start(identifier: string, cron: string): void {
        this.run(identifier, cron)
    }

    public stop(): void {
        this.cronJob.stop()
    }

    public getIdentifier(): string {
        return this.identifier
    }

    private setIdentifier(identifier: string): void {
        this.identifier = identifier
    }

    public isProcessing(): boolean {
        return this.isProcessingInternal
    }

    public run(identifier: string, cron: string): void {
        if (!this.identifier || identifier) {
            this.setIdentifier(identifier)
        }

        if (!this.cron || cron) {
            this.cron = cron
        }
        logging.info(NAMESPACE, 'STARTING::Careers24JobStoreImporterScheduler')
        let scheduledTask: ScheduledTask = schedule(this.cron,
            () => {
                if (!this.isProcessingInternal) {
                    this.lastProcessedAt = new Date()
                    this.isProcessingInternal = true
                    this.globalContainer.getImporterContainer().getCareer24JobStoreImporter().import()
                        .then(() => {
                            this.isProcessingInternal = false
                            logging.info(NAMESPACE, 'Finsihed processing job store import')
                        }).catch((error) => {
                        this.isProcessingInternal = false
                        logging.error(NAMESPACE, 'An error occured while processing job store import')
                    })
                } else {
                   logging.info(NAMESPACE, 'RUNNING::Processing job store imports')
                }
            })

        this.cronJob = scheduledTask

        logging.info(NAMESPACE, 'STARTED::Careers24JobStoreImporterScheduler')
    }
}