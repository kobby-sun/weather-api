import Hapi from 'hapi'
import _ from 'lodash'

import plugins from './plugins'

export default async () => {
  const server = new Hapi.Server({
    port: 3000,
    host: 'localhost',
  })

  await server.register(plugins)

  server.events.on('request', function(request) {
    console.info(
      {
        method: request.method.toUpperCase(),
        body: request.payload,
        statusCode: _.get(request, 'response.statusCode', null),
        error: _.get(request, 'response.source.message', null),
      },
      request.path,
    )
  })

  try {
    await server.start()
  } catch (err) {
    console.error(`Error while starting server: ${err.message}`)
  }

  console.info(`+++ Server running at: ${server.info.uri}`)
}
