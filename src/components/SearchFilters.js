import React from 'react';
import Search from './Search';

export default class SearchFilters extends React.Component {
    
    constructor(props) {
        super(props);
        
    }

    render() {
        return (
            <div id="search_query_builder">
                    <button id="select_specificity" className="group query_specificity add_filter" onClick={this.props.addFilter}>+</button>
                    {this.props.index == 0 ? <div id="select_specificity" className="group query_specificity delete_filter_placeholder"></div> : <button id="select_specificity" className="group query_specificity" onClick={this.props.deleteFilter}>-</button>}

                    <Search 
                        storeData={this.props.storeData}
                        searchAction={this.props.searchAction}
                        removeFromSearchAction={this.props.removeFromSearchAction}
                        updateAction={this.props.updateAction}
                        searchTerm = {this.props.selected_fields['search']}
                        updateSearchTerm = {this.props.updateSearchTerm}
                    />

                    <select id="select_specificity" value={this.props.selected_fields['specificity']} className="group query_specificity" onChange={this.props.updateSpecificity}>
                        <option value="contains">contains</option>
                        <option value="equals">equals</option>
                        <option value="lessThan">less than</option>
                        <option value="moreThan">more than</option>
                    </select>

                    <select id="select_column" value={this.props.selected_fields['column']} className="group query_column_select" onChange={this.props.updateColumn}>
                        <option value="Variety" >Search by name</option>
                        <option value="CID">Search by CID</option>
                        <option value="SID">Search by SID</option>
                        <option value="GID">Search by GID</option>
                        <option value="Rust_Score_1">Search by rust score 1</option>
                        <option value="Rust_Score_2">Search by rust score 2</option>
                    </select>

            </div>
        );
    }
}
