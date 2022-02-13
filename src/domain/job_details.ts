
export class JobDetails {
    id: number
    title: string
    type: string
    platformId: number
    reference: string
    salaryMin: string
    salaryMax: string
    location: string
    closingDate: string
    employer: string
    jobStoreId: number
    link: string
}

export class JobDetailsDb {
    JOB_DETAILS_ID: number
    TITLE: string
    TYPE: string
    PLATFORM_ID: number
    REFERENCE: string
    SALAMY_MIN: string
    SALAMY_MAX: string
    LOCATION: string
    CLOSING_DATE: string
    EMPLOYER: string
    LINK: string
    JOB_STORE_ID: number

    public getJobDetails(): JobDetails {
        return {
            id: this.JOB_DETAILS_ID,
            type: this.TYPE,
            title: this.TITLE,
            platformId: this.PLATFORM_ID,
            reference: this.REFERENCE,
            salaryMin: this.SALAMY_MIN,
            salaryMax: this.SALAMY_MAX,
            location: this.LOCATION,
            closingDate: this.CLOSING_DATE,
            employer: this.EMPLOYER,
            link: this.LINK,
            jobStoreId: this.JOB_STORE_ID
        }
    }
}