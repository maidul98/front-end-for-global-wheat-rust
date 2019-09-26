import { combineReducers } from 'redux';

import actionTypes from '../actions/actionTypes';

const init = {
    applyFilters: false,
    query: {
        country: null,
        crop: null, 
        susceptibility: null, 
        year: null, 
        season: null,
        search: {},
    },
    data: [],
    start: 0,
    count: 10,
    total: 0,
    order: {},
    working: false,
    download_link: null
}

const data = (state=init, action) => {
    var nextState = {...state};
    switch (action.type) {
        case actionTypes.SET_COUNT:
            nextState.count = action.payload;
            break;
        
        case actionTypes.PAGINATION_NEXT + '_FULFILLED':
            // console.log("next");
            nextState.start = nextState.start + nextState.count;
            nextState.data = action.payload.data.response;
            break;

        case actionTypes.PAGINATION_PREV + '_FULFILLED':
            // console.log("prev");
            nextState.start = Math.max(nextState.start - nextState.count, 0);
            nextState.data = action.payload.data.response;
            break;

        case actionTypes.BUILD_QUERY:
            nextState.query[action.payload.filter] = action.payload.value;
            break;

        case actionTypes.APPLY_FILTERS:
            nextState.start = 0;
            nextState.applyFilters = true;
            break;
        
        case actionTypes.CLEAR_FILTERS:
            nextState.query = {}
            nextState.query.search = state.query.search // clear filters should not affect search query
            nextState.applyFilters = false
            nextState.start = 0
            break;
            
        case actionTypes.SET_ORDER:
            nextState.order[action.payload] = !nextState.order[action.payload] && nextState.order[action.payload] !== 0 
            ? 1 : (nextState.order[action.payload] + 1)%3
            break;

        case actionTypes.SEARCH:
            nextState.query.search[action.payload]=action.payload;
            break;

        case actionTypes.REMOVE_FROM_SEARCH:
            // remove term from search object within query object
            delete nextState.query.search[action.payload];
            break;

        case actionTypes.UPDATE + '_PENDING':
            nextState.working = true;
            break;

        case actionTypes.UPDATE + '_FULFILLED':
            nextState.working = false;
            nextState.data = action.payload.data.response;
            nextState.total = action.payload.data.total[0]["COUNT(*)"];
            // nextState.download_link = action.downloadUrl;
            break;

        case actionTypes.DOWNLOAD_RESULT:
            nextState.download_link = action.payload;
            break;

        default:
            return nextState;
    }
    return nextState;
}

var allReducers = combineReducers({
    data: data
});

export default allReducers;
