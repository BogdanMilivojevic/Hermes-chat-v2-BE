const { S3 } = require('@aws-sdk/client-s3')
const dotenv = require('dotenv')

dotenv.config({ path: '../.env' })

let s3Client = ''
if (process.env.NODE_ENV === 'test') {
  s3Client = {
    send () {
      return true
    }
  }
} else {
  s3Client = new S3({
    forcePathStyle: false,
    endpoint: process.env.S3_ENDPOINT,
    region: process.env.S3_REGION,
    credentials: {
      accessKeyId: process.env.S3_KEY,
      secretAccessKey: process.env.S3_SECRET
    }
  })
}

module.exports = { s3Client }
