import matchRoutes from 'react-router/lib/matchRoutes'
import { createRoutes } from 'react-router'
export const UPDATE_LOCATION_WITH_PARAMS = "@@router/UPDATE_LOCATION_WITH_PARAMS"
export * from 'react-router-redux'

const initialState = {
  location: undefined,
  params: {}
}

// default action creator, you can also use your own by passing it as fourth parameter to syncParams,
// just remember to use a matching reducer
function updateLocationWithParams(location, state) {
  return {
    type: UPDATE_LOCATION_WITH_PARAMS,
    payload: {
      location: location,
      params: state ? state.params : {}
    }
  }
}

const updateParams = (store, routesArray, actionCreator) => location => {
  matchRoutes(routesArray, location, (error, state) => {
    if (!error) {
      store.dispatch(actionCreator(location, state))
    }
  })
}

export function syncParams(store, routes, history, actionCreator = updateLocationWithParams) {
  const routesArray = createRoutes(routes)
  const updateDispatcher = updateParams(store, routesArray, actionCreator)

  // dispatch the initial params manually
  updateDispatcher(history.getCurrentLocation())

  return history.listen(updateDispatcher)
}

export function routeParamsReducer(state = initialState, { type, payload }) {
  if (type === UPDATE_LOCATION_WITH_PARAMS) {
    return {
      ...state,
      location: payload.location,
      params: payload.params
    }
  }
  return state
}
