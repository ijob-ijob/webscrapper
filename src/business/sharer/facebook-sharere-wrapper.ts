import { JobDetails } from '../../domain/job_details'
import { post } from './facebook-sharer'
import logging from '../../config/logging'

export class FacebookSharereWrapper {
    //todo add read access token and page into feed from db
    private accessToken: string = ''
    private pageIdAndFeed: string = ''
    private namespace = 'FacebookSharereWrapper'

    async post(jobDetails: JobDetails) : Promise<boolean> {
        return new Promise<boolean>((resolve, reject) => {

            let postPromise: Promise<string> = post(this.accessToken, this.pageIdAndFeed, jobDetails.frontendLink)

            postPromise.then(function(){
                logging.info(this.namespace, 'Job details posted successfully', jobDetails)
                resolve(true)
            }).catch((error) => {
                logging.error(this.namespace, 'Failed to post job details', error)
                reject(false)
            })
        })
    }
}