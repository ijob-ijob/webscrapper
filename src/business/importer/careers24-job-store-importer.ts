import { GlobalContainer } from '../../container/global-container'
import { PlatformType } from '../../domain/constant/platform-type'
import { Platform } from '../../domain/entities/platform'
import logging from '../../config/logging'

const NAMESPACE = 'Career24JobStoreImporter'
export class Career24JobStoreImporter {
  constructor (private globalContainer: GlobalContainer) {
  }

  public async import (): Promise<void> {
    const linksList: string[] = []
    await this.globalContainer.getScrapperContainer().getCareers24JobStoreScrapper().getLinks()
      .then((linksListRes) => {
        linksList.push(...linksListRes)
      })
      .catch((error) => {
        logging.error(NAMESPACE, `An error occurred while getting links for ${NAMESPACE}`, error)
        return new Promise((resolve, reject) => reject(new Error(`An error occurred while getting job store links for ${NAMESPACE}, error::${error}`)))
      })

    if (linksList.length === 0) {
      logging.info(NAMESPACE, `No links found for processing for ${NAMESPACE}`)
      return new Promise((resolve) => resolve())
    }

    let platform: Platform
    await this.globalContainer.getRepoContainer().getPatormRepo().getPlatformInfo(PlatformType.CAREERS24)
      .then((platformRes: Platform) => {
        platform = platformRes
      })
      .catch((error) => {
        logging.error(NAMESPACE, `An error occurred while getting platform for ${NAMESPACE}`, error)
        return new Promise((resolve, reject) => reject((new Error(`An error occurred while getting platform record for ${NAMESPACE}, error::${error}`))))
      })

    await this.globalContainer.getJobSaverContainer().getJobStoreSaver()
      .saveJobStores(linksList, platform.platformId, platform.name)
      .then(() => {
        logging.info(NAMESPACE, `Successfully imported job stores for ${NAMESPACE}`)
      }).catch((error) => {
        logging.error(NAMESPACE, `An error occurred while processing links to job stores for ${NAMESPACE}`, error)
        return new Promise((resolve, reject) => reject((new Error(`An error occurred while processing links to job stores for ${NAMESPACE}, error::${error}`))))
      })

    return new Promise((resolve) => resolve())
  }
}
