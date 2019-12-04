import React from 'react';
import { Form, Button } from 'semantic-ui-react';
import { connect } from 'react-redux';
import { bindActionCreators }  from 'redux';

import actions from '../actions';
import SearchFilters from './SearchFilters';



class Controls extends React.Component {
    constructor(props){
        super(props);
        this.state ={
            'yearsOptions':[],
            "filters": [{"specificity":'contains', "column":"Variety", "search": ""}]
            
        }

    }

    componentWillMount = () =>  {
        let yearsObject = [];
        yearsObject.push({ key: null, text: "---", value: null })
        this.props.getYears().then((res) => {
            let years = res.value.data.response;
            years.forEach((element) => {
                yearsObject.push({ key: String(element['year']), text: String(element['year']), value: Number(element['year']) })
            });
            this.setState({'yearsOptions': yearsObject})
        }).catch(function(e){
            console.log(e)
        });
    }

    handleQueryDropdown = (e, { value }) => {
        this.props.buildQuery(e.currentTarget.parentNode.parentNode.id, value)
    }

    clearFilters = () => {
        var keys = Object.keys(this.props.data.query);
        var wasFiltered = false; // true if at least one filter else null/falsey
        keys.forEach(key => {
            if(key !== "search") {
                // clear filters button should not affect or take into acount search
                return wasFiltered = wasFiltered || this.props.data.query[key];
            }
        });
        if(wasFiltered) {
            this.props.clearFilters();
            var {start, count, query, order} = this.props.data;
            this.props.update(start, count, {search: query.search}, order); // clear filters should clear all query params except search right
        } 
    }

    applyFilters = () => {
        var keys = Object.keys(this.props.data.query);
        var filersSelected = false; // true if at least one filter else null/falsey
        keys.forEach((key) => filersSelected = filersSelected || this.props.data.query[key]);
        if(filersSelected){
            this.props.applyFilters();
            this.props.update(this.props.data.start, this.props.data.count, this.props.data.query, this.props.data.order)
        }
    }

    downloadExcel =() => {
        this.props.downloadExcel(0, this.props.data.total, this.props.data.query, this.props.data.order)
    }

    updateColumn = (index, blank, event) => {
        let copyState = [...this.state['filters']]
        copyState[index]['column'] = event.target.value
        this.setState({'filters': copyState})
    }

    updateSpecificity = (index, blank, event) => {
        let copyState = [...this.state['filters']]
        copyState[index]['specificity'] = event.target.value
        this.setState({'filters': copyState})
    }

    updateSearchTerm = (index, blank, event) => {
        let copyState = [...this.state['filters']]
        copyState[index]['search'] = event.target.value
        this.setState({'filters': copyState})
    }

    addFilter = (index)=>{
        let copyFilters = [...this.state['filters']];
        if(index== null){
            copyFilters.push({"specificity":'contains', "column":"Variety", "search": ""})
            this.setState({'filters': copyFilters})
        }else{
            index = index+1 // append in front of current index
            let left = copyFilters.slice(0, index)
            let right = copyFilters.slice(index)
            let newFilterArray = left.concat({"specificity":'contains', "column":"Variety", "search": ""}, right )
            this.setState({'filters': newFilterArray})
        }

    }

    deleteFilter = (index)=>{
        let copyFilters = this.state['filters']
        copyFilters.splice(index, 1)
        this.setState({"filters": copyFilters})
    }

    searchSubmitHandle = () => {
        this.props.data.query.search = this.state.filters
        this.props.update(this.props.data.start, this.props.data.count, this.props.data.query, this.props.data.order);
    }

    clearFiltersHandle = () => {
        this.props.data.query.search = {}
        this.state.filters = [{"specificity":'contains', "column":"Variety", "search": ""}]
    
        let copyFilters = this.state['filters']
        this.setState({"filters": copyFilters})

        this.props.update(this.props.data.start, this.props.data.count, this.props.data.query, this.props.data.order);
    }




    render() {
        const dataReducer = this.props.data;
        const nullOpt = { key: null, text: "all", value: null };
        
        const countryOptions = [
            nullOpt,
            { key: 'KE', text: 'Kenya', value: 'Kenya' },
            { key: 'ET', text: 'Ethiopia', value: 'Ethiopia' },
        ]

        const seasonOptions = [
            nullOpt,
            { key: 'off', text: 'Off Season', value: 'off' },
            { key: 'main', text: 'Main Season', value: 'main' },
        ]

        let yearOptions = this.state.yearsOptions;

        const susceptibilityOptions = [
            nullOpt,
            { key: 'susceptible', text: 'Susceptible', value: 'susceptible' },
            { key: 'resistant', text: 'Resistant', value: 'resistant' }
        ]

        return (
            <div id="controls">
                <div id="query-builder" className="group">
                    <h4 className="heading">Query Builder</h4>
                    <Form>
                        <Form.Dropdown id="country" 
                            placeholder="Select Country" 
                            scrolling
                            options={countryOptions}
                            onChange={this.handleQueryDropdown}
                            value={dataReducer.query.country}
                        />
                        {/* <Form.Dropdown id="susceptibility" 
                            placeholder="Select Susceptibility Rating" 
                            options={susceptibilityOptions}
                            onChange={this.handleQueryDropdown}
                            value={dataReducer.query.susceptibility}
                        /> */}
                        <Form.Dropdown id="year" 
                            placeholder="Select Year" 
                            options={yearOptions}
                            value={dataReducer.query.year}
                            onChange={this.handleQueryDropdown}
                        />
                        <Form.Dropdown id="season" 
                            placeholder="Select Season" 
                            options={seasonOptions}
                            value={dataReducer.query.season}
                            onChange={this.handleQueryDropdown}
                        />
                    </Form>
                </div>
                <div className="group">
                    <Button fluid onClick={this.applyFilters}>
                        Apply Filters
                    </Button>
                    <Button fluid onClick={this.clearFilters}>
                        Clear Filters
                    </Button>

                    <Button fluid target="_blank" href={this.props.data.download_link} onMouseEnter={this.downloadExcel} >Download this search</Button>
                </div>

                <div id="legend" className="group">
                    <h4 className="heading">Legend</h4>
                    <ul>   
                        <li>R = Resistant</li>
                        <li>TR = Trace Resistant</li>
                        <li>MR = Moderately Resistant</li>
                        <li>MS = Moderately Susceptible</li>
                        <li>M = Moderately Resistant and Susceptible</li>
                        <li>MSS = Moderately Susceptible to Susceptible</li>
                        <li>TS = Trace Susceptible</li>
                        <li>S = Susceptible</li>
                    </ul>
                </div>

                {this.state['filters'].map((item, index)=> 
                    <SearchFilters 
                        key={index}
                        storeData={this.props.data} 
                        searchAction={this.props.search} 
                        removeFromSearchAction={this.props.removeFromSearch} 
                        updateAction={this.props.update} 
                        columnToSearch = {this.state.column_name }
                        updateSearchFilter = {this.props.updateSearchFilter}
                        deleteFilter = {this.deleteFilter.bind(this, index)}
                        addFilter = {this.addFilter.bind(this, index)}
                        index = {index}
                        selected_fields = {item}
                        updateSpecificity = {this.updateSpecificity.bind(this, index, null)}
                        updateColumn = {this.updateColumn.bind(this, index, null)}
                        updateSearchTerm = {this.updateSearchTerm.bind(this, index, null)}
                    />
                )}

                <button onClick={this.searchSubmitHandle} className="search_submit_btn">Search</button>
                <button onClick={this.clearFiltersHandle} className="clear_filters">Clear filters</button>
              
            </div>
        )
    }
}

function mapStateToProps(state) {
    return {
      data: state.data
    }
}

  
function matchDispatchToProps(dispatch) {
    return bindActionCreators({
      buildQuery: actions.buildQuery, 
      applyFilters: actions.applyFilters,
      clearFilters: actions.clearFilters,
      search: actions.search,
      removeFromSearch: actions.removeFromSearch,
      update: actions.update,
      getYears: actions.getYears,
      downloadExcel: actions.downloadExcel,
      updateSearchFilter: actions.updateSearchFilter
    }, dispatch);
}
  
export default connect(mapStateToProps, matchDispatchToProps)(Controls);
