import { Scheduler } from './scheduler'
import { schedule, ScheduledTask } from 'node-cron'
import { GlobalContainer } from '../../container/global-container'
import logging from '../../config/logging'

const NAMESPACE = 'DuplicateCleanerScheduler'
export class DuplicateCleanerScheduler implements Scheduler{
    private isProcessingInternal: boolean = false
    private cronJob: ScheduledTask
    private identifier: string
    private lastProcessedAt: Date
    private cron: string

    constructor(private globalContainer: GlobalContainer) {}

    setIsProcessing(isProcessing: boolean): void {
        this.isProcessingInternal = isProcessing
    }

    public getLastProcessedAt(): Date {
        return this.lastProcessedAt
    }

    public getCron(): string {
        return this.cron
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

    public isProcessing(): boolean {
        return this.isProcessingInternal
    }

    private setIdentifier(identifier: string): void {
        this.identifier = identifier
    }

    public run(identifier: string, cron: string): void {
        if (!this.identifier || identifier) {
            this.setIdentifier(identifier)
        }

        if (!this.cron || cron) {
            this.cron = cron
        }

        logging.info(NAMESPACE, 'STARTING::DuplicateCleanerScheduler')
        let scheduledTask: ScheduledTask = schedule(this.cron,
            () => {
                if (!this.isProcessingInternal) {
                    this.lastProcessedAt = new Date()
                    this.isProcessingInternal = true
                    this.globalContainer.getCleanerContainer().getDuplicateCleaner().cleanDuplicates()
                        .then(() => {
                            this.isProcessingInternal = false
                            logging.info(NAMESPACE, 'Finsihed processing job store/details duplicates')
                        }).catch((error) => {
                        this.isProcessingInternal = false
                        logging.error(NAMESPACE, 'An error occured while processing store/details duplicates')
                    })
                } else {
                   logging.info(NAMESPACE, 'RUNNING::Processing job store/details duplicates')
                }
            })

        this.cronJob = scheduledTask

        logging.info(NAMESPACE, 'STARTED::DuplicateCleanerScheduler')
    }

}