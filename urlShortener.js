function shortenUrl(originalUrl) {
  
    return  (
      { 
        original_url: originalUrl, 
        short_url: "https://petal-recorder.gomix.me/" + Math.floor(1000 + Math.random() * 9000).toString()
      }
    )
}

module.exports = shortenUrl;