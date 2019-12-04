import axios from 'axios';

import actionTypes from './actionTypes';

// var urlPrefix = "http://localhost:3001/";
var urlPrefix = "http://ec2-54-175-100-18.compute-1.amazonaws.com:3001/";
// console.log("me:", urlPrefix);

const getData = (start, count) => {
    let payload = axios.get(`${urlPrefix}api/v1/data?start=${start}&count=${count}`)
    return {
        type: actionTypes.GET_DATA,
        payload: payload,
    };
}

const getYears = () => {
    return {
        type: actionTypes.GET_DATA,
        payload: axios.get(`${urlPrefix}api/v1/years`),
    };
}


const downloadExcel = (start, count, queryObject, orderObj) => {
    var ordering = _buildOrderString(orderObj);
    var queryString = _buildQueryString(queryObject);
    var DownloadEndpoint = `${urlPrefix}api/v1/download-excel?start=${start}&count=${count}${queryString}${ordering}`;
    return {
        type: actionTypes.DOWNLOAD_RESULT,
        payload: DownloadEndpoint,

    }
}
   

const setCount = (n) => {
    return {
        type: actionTypes.SET_COUNT,
        payload: n,
    };
}

const pagination = (start, n, queryObject, orderObj) => {
    // i.e. currently at start. fetch n from start + n
    // negative n ~ previous page
    var ordering = _buildOrderString(orderObj);
    var queryString = _buildQueryString(queryObject);
    var payload = axios.get(`${urlPrefix}api/v1/data/query?start=${Math.max(start + n, 0)}&count=${Math.abs(n)}${queryString}${ordering}`);
    return {
        type: n > 0 ? actionTypes.PAGINATION_NEXT : actionTypes.PAGINATION_PREV,
        payload: payload
    }
}

const buildQuery = (filter, value) => {
    return {
        type: actionTypes.BUILD_QUERY,
        payload: {
            filter: filter,
            value: value
        }
    }
}

const applyFilters = () => {
    return {
        type: actionTypes.APPLY_FILTERS,
    }
}

const clearFilters = (count) => {
    return {
        type: actionTypes.CLEAR_FILTERS,
    };
}


const setOrder = (id) => {
    return {
        type: actionTypes.SET_ORDER,
        payload: id
    }
}

const search = (name, col_name="search_name") => {
    return {
        type: actionTypes.SEARCH,
        column_name: col_name,
        payload: name
    };
    
}

const removeFromSearch = (name) => {
    return {
        type: actionTypes.REMOVE_FROM_SEARCH,
        payload: name
    };
}

const update = (start, count, queryObject, orderObj) => {
    var ordering = _buildOrderString(orderObj);
    var queryString = _buildQueryString(queryObject);
    var endpoint = `${urlPrefix}api/v1/data/query?start=${start}&count=${count}${queryString}${ordering}`;
    return {
        type: actionTypes.UPDATE,
        payload: axios.get(endpoint),
    }
}

// HELPER METHODS
const _buildQueryString = (queryObject) => {
    let filters_query = [];

    var filters = Object.keys(queryObject).filter((x) => {
        if(x != "search" && queryObject[x] !=null){
            return x
        }
    });

    if(filters.length != 0){
        filters.map((item, index)=>{
            filters_query.push(item+"="+queryObject[item]) 

        });
    }

     if("search" in queryObject && Object.keys(queryObject['search']).length > 0){
        queryObject['search'].map((item, index)=>{
            filters_query.push("searchFilters[filter_"+index+"][]="+item['column']+"&searchFilters[filter_"+index+"][]="+item['specificity']+"&searchFilters[filter_"+index+"][]="+item['search'])
        });
     }
    

     if (filters_query.length == 0){
         return ""
     }else{
         console.log("&"+filters_query.join("&"))
         return "&"+filters_query.join("&")
     }


    var filters = Object.keys(queryObject).filter((x) => {
        if(x === 'search') {
            // search maps to an object. If object has no keys, no search terms were entered by the user
            return Object.keys(queryObject[x]).length !== 0;
        }
        return queryObject[x]
    });

    console.log(filters)

    if(filters.length === 0) return ""; //i.e. applied no filters
    filters = filters.map((x) => {
        if(x === 'search') {
            // speacial functionallity for search since, value of "search" key is an object unlike other keys of query object
            const searchParams = Object.keys(queryObject[x]).map(searchTerm => `search[]=${searchTerm}`);
            console.log(searchParams)
            return searchParams.join('&');
        }
        console.log(`${x}=${queryObject[x]}`)
        return `${x}=${queryObject[x]}`;
    });

    console.log("&"+filters.join('&'))
    return "&"+filters.join('&');
} 

const _buildOrderString = (orderObj) => {
    var ordering = "";
    Object.keys(orderObj).forEach((col) => {
        switch (orderObj[col]) {
            case 1:
                ordering += `&asc[]=${col}`;
                break;

            case 2:
                ordering += `&desc[]=${col}`;
                break;

            default:
                break;
        }
    })
    return ordering;
}

const updateSearchFilter = (filter_obj) => {
    return {
        type: actionTypes.UPDATE_SEARCH_COLUMN,
        column_name: filter_obj['column_name'],
        search_specificity: filter_obj['specificity'],
        filter_index: 0
    }
}

// MAKE SURE TO EXPORT YOUR ACTIONS
export default  {
    updateSearchFilter,
    getData,
    getYears,
    setCount,
    pagination,
    buildQuery,
    applyFilters,
    clearFilters,
    setOrder,
    search,
    update,
    removeFromSearch,
    downloadExcel
};