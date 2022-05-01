import { GlobalContainer } from '../../container/global-container'
import { PlatformType } from '../../domain/constant/platform-type'
import { Platform } from '../../domain/entities/platform'
import logging from '../../config/logging'

const NAMESPACE = 'Career24JobStoreImporter'
export class Career24JobStoreImporter {
  constructor (private globalContainer: GlobalContainer) {
  }

  public async import (): Promise<void> {
    const that = this
    return await new Promise<void>(async (resolve, reject) => {
      const linksList: string[] = []
      await that.globalContainer.getScrapperContainer().getCareers24JobStoreScrapper().getLinks()
        .then((linksListRes) => {
          linksList.push(...linksListRes)
        })
        .catch((error) => {
          logging.error(NAMESPACE, `An error occured while getting links for ${NAMESPACE}`, error)
          return reject(new Error(`An error occured while getting job store links for ${NAMESPACE}, error::${error}`))
        })

      if (linksList.length === 0) {
        logging.info(NAMESPACE, `No links found for processing for ${NAMESPACE}`)
        return resolve()
      }

      let platform: Platform
      await that.globalContainer.getRepoContainer().getPatormRepo().getPlatformInfo(PlatformType.CAREERS24)
        .then((platformRes: Platform) => {
          platform = platformRes
        })
        .catch((error) => {
          logging.error(NAMESPACE, `An error occured while getting platform for ${NAMESPACE}`, error)
          return reject(new Error(`An error occured while getting platform record for ${NAMESPACE}, error::${error}`))
        })

      await that.globalContainer.getJobSaverContainer().getJobStoreSaver()
        .saveJobStores(linksList, platform.platformId, platform.name)
        .then(() => {
          logging.info(NAMESPACE, `Successfully imported job stores for ${NAMESPACE}`)
          return resolve()
        }).catch((error) => {
          logging.error(NAMESPACE, `An error occured while processing links to job stores for ${NAMESPACE}`, error)
          return reject(new Error(`An error occured while processing links to job stores for ${NAMESPACE}, error::${error}`))
        })

      return resolve()
    })
  }
}
