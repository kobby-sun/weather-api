import {index as handler} from '../../controllers/weather'

export default {
  method: 'GET',
  path: '/api/v1/weather',
  config: {},
  handler,
}
