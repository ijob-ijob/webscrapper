let FB = require('fb')

export function post(token: string, pageIdAndFeed: string, jobPostLink: string): Promise<string> {
    let promise = new Promise(function(resolve, reject) {
        FB.api(
            pageIdAndFeed,
            'POST',
            { "message": link },
            function(response) {
                if (response.error) {
                    reject(error)
                } else {
                    resolve('success')
                }
            }
        )
    })
}
