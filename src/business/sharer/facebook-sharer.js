let FB = require('fb')

module.exports = function post(token, pageIdAndFeed, jobPostLink) {
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
