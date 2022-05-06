import { Career24JobStoreImporter } from '../business/importer/careers24-job-store-importer'
import { GlobalContainer } from '../container/global-container'
import { Careers24JobDetailsImporter } from '../business/importer/careers24-job-details-importer'

export class ImporterContainer {
    private careers24JobStoreImporter: Career24JobStoreImporter
    private careers24JobDetailsImporter: Careers24JobDetailsImporter

    constructor (private globalContainer: GlobalContainer) {
      this.init()
    }

    private init (): void {
      this.careers24JobStoreImporter = new Career24JobStoreImporter(this.globalContainer)
      this.careers24JobDetailsImporter = new Careers24JobDetailsImporter(this.globalContainer)
    }

    public getCareer24JobStoreImporter (): Career24JobStoreImporter {
      return this.careers24JobStoreImporter
    }

    public getCareers24JobDetailsImporter (): Careers24JobDetailsImporter {
      return this.careers24JobDetailsImporter
    }
}
