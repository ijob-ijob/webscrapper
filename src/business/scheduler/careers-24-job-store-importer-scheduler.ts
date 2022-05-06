import { schedule, ScheduledTask } from 'node-cron'
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

    constructor (private globalContainer: GlobalContainer) {}

    public setIsProcessing (isProcessing: boolean): void {
      this.isProcessingInternal = isProcessing
    }

    public getCron (): string {
      return this.cron
    }

    public getLastProcessedAt (): Date {
      return this.lastProcessedAt
    }

    public start (identifier: string, cron: string): void {
      this.run(identifier, cron)
    }

    public stop (): void {
      this.cronJob.stop()
    }

    public getIdentifier (): string {
      return this.identifier
    }

    private setIdentifier (identifier: string): void {
      this.identifier = identifier
    }

    public isProcessing (): boolean {
      return this.isProcessingInternal
    }

    public run (identifier: string, cron: string): void {
      if (!this.identifier || identifier) {
        this.setIdentifier(identifier)
      }

      if (!this.cron || cron) {
        this.cron = cron
      }
      logging.info(NAMESPACE, 'STARTING::Careers24JobStoreImporterScheduler')
      this.cronJob = schedule(this.cron,
        () => {
          if (!this.isProcessingInternal) {
            this.lastProcessedAt = new Date()
            this.isProcessingInternal = true
            this.globalContainer.getImporterContainer().getCareer24JobStoreImporter().import()
              .then(() => {
                this.isProcessingInternal = false
                logging.info(NAMESPACE, 'Finished processing job store import')
              }).catch((error) => {
                this.isProcessingInternal = false
                logging.error(NAMESPACE, `An error occurred while processing job store import::${error}`)
              })
          } else {
            logging.info(NAMESPACE, 'RUNNING::Processing job store imports')
          }
        })

      logging.info(NAMESPACE, 'STARTED::Careers24JobStoreImporterScheduler')
    }
}
