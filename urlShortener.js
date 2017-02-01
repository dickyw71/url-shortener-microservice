function shortenUrl(originalUrl, host) {
  
    return  (
      { 
        original_url: originalUrl, 
        short_url: host + "/" + Math.floor(1000 + Math.random() * 9000).toString()
      }
    )
}

module.exports = shortenUrl;