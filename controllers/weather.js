import {failAction, successAction} from '../utilities'
import axios from 'axios'
import _ from 'lodash'
import moment from 'moment'

const getWeatherStack = async place => {
  try {
    const w = await axios.get(
      'http://api.weatherstack.com/current?access_key=42ba92dcec52edad2ba9a3472d5bd80e&query=' +
        place,
    )
    if (!_.get(w, 'data.current.wind_speed') || !_.get(w, 'data.current.temperature'))
      throw 'Invalid WeatherStack results'
    return {
      source: 'WeatherStack',
      wind_speed: _.get(w, 'data.current.wind_speed'),
      temperature_degrees: _.get(w, 'data.current.temperature'),
    }
  } catch (ex) {
    console.log('getWeatherStack err ->', ex.message)
    return null
  }
}

const getOpenWeatherMap = async place => {
  try {
    const w = await axios.get(
      'http://api.openweathermap.org/data/2.5/weather?q=' +
        place +
        '&appid=2326504fb9b100bee21400190e4dbe6d',
    )
    return {
      source: 'OpenWeatherMap',
      //m/s -> km/h
      wind_speed: Math.round(_.get(w, 'data.wind.speed') * 3.6),
      //Kelvin to Celsius
      temperature_degrees: Math.round(_.get(w, 'data.main.temp') - 273.15),
    }
  } catch (ex) {
    console.log('getOpenWeatherMap err ->', ex.message)
    return null
  }
}

export const lastWeather = {}

export const index = async request => {
  try {
    const {query} = request

    const q = query.city || 'melbourne,AU'

    let w = null

    if (lastWeather[q] && moment.duration(moment().diff(lastWeather[q].cached)).asSeconds() <= 3) {
      //return cached
      console.log('return cached')
      w = {...lastWeather[q].data, cached: lastWeather[q].cached.format('YYYY-MM-DD hh:mm:ss')}
    } else {
      console.log('query')
      //query api
      lastWeather[q] = null
      w = await getWeatherStack(q)
      console.log('query 1', w)
      if (w == null) {
        console.log('query 2', w)
        w = await getOpenWeatherMap(q)
      }
      if (w)
        lastWeather[q] = {
          data: w,
          cached: moment(),
        }
    }

    return successAction(w || {message: 'Unable to get weather'})
  } catch (error) {
    console.log(error)
    failAction(error.message)
  }
}
