export interface Scheduler {
    run(identifier: string, cron: string): void
    start(identifier?: string, cron?: string): void
    stop(): void
    isProcessing(): boolean
    getIdentifier(): string
    getLastProcessedAt(): Date
    setIsProcessing(isProcesing: boolean): void
    getCron(): string
}