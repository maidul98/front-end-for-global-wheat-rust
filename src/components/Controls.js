import React from 'react';
import { Form, Button, Popup } from 'semantic-ui-react';
import { connect } from 'react-redux';
import { bindActionCreators }  from 'redux';

import Search from './Search';
import actions from '../actions';



class Controls extends React.Component {
    constructor(props){
        super(props);
        this.state ={'yearsOptions':[]}
    }

    componentWillMount = () =>  {
        let yearsObject = [];
        yearsObject.push({ key: null, text: "---", value: null })
        this.props.getYears().then((res) => {
            let years = res.value.data.response;
            years.forEach((element) => {
                yearsObject.push({ key: String(element['year']), text: String(element['year']), value: Number(element['year']) })
            });
            // this.fukinVar = yearsObject
            this.setState({'yearsOptions': yearsObject})
        }).catch(function(e){
            console.log(e)
        });
    }

    handleQueryDropdown = (e, { value }) => {
        // console.log(e.currentTarget.parentNode.parentNode);
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

    render() {
        const dataReducer = this.props.data;
        const nullOpt = { key: null, text: "---", value: null };
        
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
            { key: 'R', text: 'R', value: 'R' },
            { key: 'TR', text: 'TR', value: 'TR' },
            { key: 'MR', text: 'MR', value: 'MR' },
            { key: 'MS', text: 'MS', value: 'MS' },
            { key: 'M', text: 'M', value: 'M' },
            { key: 'MSS', text: 'MSS', value: 'MSS' },
            { key: 'TS', text: 'TS', value: 'TS' },
            { key: 'S', text: 'S', value: 'S' },
            { key: 'TMS', text: 'TMS', value: 'TMS' },
            { key: 'TMR', text: 'TMR', value: 'TMR' },
            { key: 'RMR', text: 'RMR', value: 'RMR' },
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
                        {/* <Form.Dropdown id= "crop"
                            placeholder="Select Crop Type" 
                            options={countryOptions}
                            onChange={this.handleQueryDropdown}
                            value={dataReducer.query.crop}
                        /> */}
                        <Form.Dropdown id="susceptibility" 
                            placeholder="Select Susceptibility Rating" 
                            options={susceptibilityOptions}
                            onChange={this.handleQueryDropdown}
                            value={dataReducer.query.susceptibility}
                        />
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
                <Search 
                    storeData={this.props.data}
                    searchAction={this.props.search}
                    removeFromSearchAction={this.props.removeFromSearch}
                    updateAction={this.props.update}
                />
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
      downloadExcel: actions.downloadExcel
    }, dispatch);
}
  
export default connect(mapStateToProps, matchDispatchToProps)(Controls);
