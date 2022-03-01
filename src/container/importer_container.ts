import { Career24JobStoreImporter } from '../business/importer/careers24_job_store_importer'
import { GlobalContainer } from '../container/global_container'
import logging from '../config/logging'

export class ImporterContainer {
    private careers24JobStoreImporter: Career24JobStoreImporter

    constructor(private globalContainer: GlobalContainer) {
        this.init()
    }

    private init(): void {
        this.careers24JobStoreImporter = new Career24JobStoreImporter(this.globalContainer)
    }

    public getCareer24JobStoreImporter(): Career24JobStoreImporter {
        console.log('######################################## 22222')
        return this.careers24JobStoreImporter
    }
}