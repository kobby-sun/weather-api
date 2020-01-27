/* ----------------------------------------------------------------------
   * @ description : Here config all hapi plugIns and custom plugIns.
----------------------------------------------------------------------- */
import api from './api'

export default [
  /* ---------------------------
        Restfull Api's.
      ---------------------------- */
  {
    plugin: {
      name: 'Rest',
      version: '1.0.0',
      register: (server, options) => {
        server.route(api)
      },
    },
    options: {},
  },
]
