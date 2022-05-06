import { DuplicateCleaner } from '../business/cleaner/duplicate-cleaner'
import { GlobalContainer } from '../container/global-container'

export class CleanerContainer {
    private duplicateCleaner: DuplicateCleaner

    constructor (private globalContainer: GlobalContainer) {
      this.init()
    }

    private init (): void {
      this.duplicateCleaner = new DuplicateCleaner(this.globalContainer)
    }

    public getDuplicateCleaner (): DuplicateCleaner {
      return this.duplicateCleaner
    }
}
