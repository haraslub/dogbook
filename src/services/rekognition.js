'use strict'

const url = require('url')
const AWS = require('aws-sdk')
const Bluebird = require('bluebird')
const R = require('ramda')
const awsConfig = require('../config').aws
const log = require('../utils/logger')

const rekognition = new AWS.Rekognition()
const detectLabels = Bluebird.promisify(rekognition.detectLabels, { context: rekognition })

// COMMENTED OUT AS 'url.parse' HAS BEEN DEPRECATED
// const pathFromUrl = photoUrl => url.parse(photoUrl).pathname
const pathFromUrl = photoUrl => new url.URL(photoUrl).pathname
const getS3KeyFromPathname = pathName => pathName.replace(/^\/|\/$/gu, '')

const PROP_NAME = 'Name'
const PROP_VALUE = 'Dog'

const getLabels = async photoUrl => {
  log.info('Getting Labels')
  const nameGot = getS3KeyFromPathname(pathFromUrl(photoUrl))

  log.info(`getS3KeyFromPathname: ${nameGot}`)

  const params = {
    Image: {
      S3Object: {
        Bucket: awsConfig.s3.bucketName,
        Name: getS3KeyFromPathname(pathFromUrl(photoUrl)),
      },
    },
  }

  return detectLabels(params)
}

module.exports = {
  isDogRecognized: async photoUrl => {
    log.info('Starting isDogRecognized()')
    log.info(`photoUrl: ${photoUrl}`)

    const labelsResponse = await getLabels(photoUrl)
    log.info(`labelsResponse: ${labelsResponse}`)

    const dogLabel = R.find(R.propEq(PROP_NAME, PROP_VALUE))(labelsResponse.Labels)
    log.info(`dogLabel: ${dogLabel}`)
    log.info(`dogLabel.Confidence: ${dogLabel.Confidence}`)

    return Boolean(dogLabel && dogLabel.Confidence > awsConfig.rekognition.minConfidence)
  },
}