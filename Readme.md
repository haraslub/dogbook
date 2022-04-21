# Dogbook

This is my first NodeJS project. This project was created only for training purposes and it was inspired by STRV project, in particular by STRV online course (for more details, see: [nodejs-open-knowledge](https://github.com/haraslub/dogbook.git)).

---

## Issues

### 1: Workers and Rekognition

**General description:**

Workers have been implemented but rekognition does not work.

**Specification:**

The image rekognition is not executed (see the comment in the module.export):

```
module.exports = {
  isDogRecognized: async photoUrl => {
    log.info('Starting isDogRecognized()')
    log.info(`photoUrl: ${photoUrl}`)

    const labelsResponse = await getLabels(photoUrl)

    // It never passes the getLabels function, thus the following lines are not executed.

    log.info(`labelsResponse: ${labelsResponse}`)

    const dogLabel = R.find(R.propEq(PROP_NAME, PROP_VALUE))(labelsResponse.Labels)
    log.info(`dogLabel: ${dogLabel}`)
    log.info(`dogLabel.Confidence: ${dogLabel.Confidence}`)

    return Boolean(dogLabel && dogLabel.Confidence > awsConfig.rekognition.minConfidence)
  },
}
```

Links:

- [rekognition.js](./src/services/rekognition.js)

---

### 2: Database in Testing environment

**General description:**

Database does not work in the test environment.

**Specification:**

Once I run `NODE_ENV=test npm run db:migrate` it returns:

```
database "nodejs-nights-test" does not exist
error: database "nodejs-nights-test" does not exist
```

Links:

- [docker-compose.yaml](./docker-compose.yaml)
- [config/env/test.js](./config/env/test.js)

---
