import { SchedulerConf } from '../entities/scheduler_conf'

export interface SchedulerConfCronJob {
    schedulerConf: SchedulerConf
    cronJob: any
}