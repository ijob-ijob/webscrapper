import { SchedulerConfPlatform } from '../entities/scheduler_conf'
import { ScheduledTask } from 'node-cron'

export interface SchedulerConfCronJob {
    schedulerConfPlatform: SchedulerConfPlatform
    cronJob: ScheduledTask
}