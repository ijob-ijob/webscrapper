export interface Scheduler {
    run(cron: string): void
    start(cron: string): void
    stop(): void
}