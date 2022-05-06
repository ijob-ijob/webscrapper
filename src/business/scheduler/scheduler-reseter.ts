import { Scheduler } from './scheduler'
import { schedule, ScheduledTask } from 'node-cron'
import { GlobalContainer } from '../../container/global-container'
import logging from '../../config/logging'

const NAMESPACE = 'SchedulerReseter'
export class SchedulerReseter implements Scheduler {
    private isProcessingInternal: boolean = false
    private cronJob: ScheduledTask
    private identifier: string
    private lastProcessedAt: Date
    private cron: string

    constructor (private globalContainer: GlobalContainer) {}

    setIsProcessing (isProcessing: boolean): void {
      this.isProcessingInternal = isProcessing
    }

    public run (identifier: string, cron: string): void {
      if (!this.identifier) {
        this.setIdentifier(identifier)
      }

      if (!this.cron || cron) {
        this.cron = cron
      }
      // return //todo remove
      // const scheduledTask: ScheduledTask = schedule(this.cron,
      // () => {
      //  let schedulerList: Scheduler[] = [
      //      this.globalContainer.getSchedulerContainer().getDuplicateCleanerScheduler(),
      //      this.globalContainer.getSchedulerContainer().getCareers24JobDetailsImporterScheduler()
      //  ]
      // // console.log(schedulerList)
      //
      //  this.lastProcessedAt = new Date()
      //  this.isProcessingInternal = true
      //  const currentTime: Date = new Date()
      //  for (let i = 0; i < schedulerList.length; i++) {
      //      let tempTime: number = currentTime.getTime() - schedulerList[i].getLastProcessedAt().getTime()
      //      let diffInTime: number = Math.round((tempTime / (1000 * 3600)) * 60)
      //      // console.log('++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++')
      //      // console.log(schedulerList[i])
      //      // console.log(schedulerList[i].isProcessing())
      //      // console.log('LastProcessedAt: ' + schedulerList[i].getLastProcessedAt())
      //      // console.log('LastProcessedAt: ' + schedulerList[i].getLastProcessedAt().getTime())
      //      // console.log('currentTime: ' + currentTime)
      //      // console.log('currentTime: ' + currentTime.getTime())
      //
      //      //probably make this configurable, how about part of the scheduler_conf table?
      //      // console.log('++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++')
      //      console.log('diffInTime: '+diffInTime)
      //      if (diffInTime >= 15 && schedulerList[i].isProcessing()) {
      //          console.log('######################################################################################')
      //          console.log(schedulerList[i])
      //          schedulerList[i].setIsProcessing(false)
      //          schedulerList[i].stop()
      //          let cron = schedulerList[i].getCron()
      //          let identifier = schedulerList[i].getIdentifier()
      //          this.globalContainer.getSchedulerContainer().reset({identifier: identifier, cron: cron})
      //
      //      }
      //  }
      // })
    }

    public start (identifier: string, cron: string): void {
      this.run(identifier, cron)
    }

    public getCron (): string {
      return this.cron
    }

    public stop (): void {
      this.cronJob.stop()
    }

    private setIdentifier (identifier: string): void {
      this.identifier = identifier
    }

    public isProcessing (): boolean {
      return this.isProcessingInternal
    }

    public getIdentifier (): string {
      return this.identifier
    }

    public getLastProcessedAt (): Date {
      return this.lastProcessedAt
    }
}
