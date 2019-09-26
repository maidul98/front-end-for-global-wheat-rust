import React from 'react';
import { Table, Button, Dropdown, Icon } from 'semantic-ui-react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import DataTableRow from './DataTableRow';
import actions from '../actions';
import TableHeaderCellWrap from './TableHeaderCellWrap';

class DataTable extends React.Component {
    componentDidMount = () => {
        this.props.update(this.props.data.start, this.props.data.count, {}, {});
    }

    handlePaginationDropdown = (e, { value }) => {
        var storeData = this.props.data;
        this.props.setCount(value)
        this.props.update(storeData.start, value, storeData.query, storeData.order);
    }

    handlePagination = (e) => {
        var storeData = this.props.data;
        var queryObj = storeData.applyFilters ? storeData.query : {};
        queryObj = storeData.query
        if(e.target.id === 'next' || e.target.className === 'chevron right icon') {
            this.props.pagination(storeData.start, storeData.count, queryObj, storeData.order);
        } else {
            this.props.pagination(storeData.start, -storeData.count, queryObj, storeData.order);
        }
    }

    render() {
        var dataReducer = this.props.data;

        const paginationOptions = [
            { key: '10', text: '10', value: 10 },
            { key: '25', text: '25', value: 25 },
            { key: '50', text: '50', value: 50 },
            { key: '100', text: '100', value: 100 },
            { key: 'All', text: 'All', value: this.props.data.total},
        ]

        const colHeads = [
            {label: 'Plot ID', id:'Plot_ID'},
            {label: 'CID', id:'CID'},
            {label: 'SID', id: 'SID'}, 
            {label: 'GID', id:'GID'}, 
            {label: 'Name', id: 'Variety'}, 
            {label: 'Selection History', id: 'Pedigree'},
            {label: 'Rust Score 1', id: 'Rust_Score_1'},
            {label: 'Susceptibility Rating 1', id: 'Susceptibility_Rating_1'},
            {label: 'Date 1', id: 'Date_1'},
            {label: 'Rust Score 2', id: 'Rust_Score_2'},
            {label: 'Susceptibility Rating 2', id: 'Susceptibility_Rating_2'},
            {label: 'Date 2', id: 'Date_2'},
        ]
        return (
            <div id="data-table">
                <div id="loading-indicator" className={!this.props.data.working ? 'hide' : ''}>
                    <Icon loading name="spinner" size="big" />
                </div>
                <div>
                    <span>
                        Show me {' '}
                        <Dropdown  
                            onChange={this.handlePaginationDropdown}
                            options={paginationOptions}
                            value={dataReducer.count}
                            upward
                            inline
                        />
                        entries
                    </span>
                </div>
                <Button.Group size="mini">
                    <Button 
                        onClick={this.handlePagination} 
                        disabled={dataReducer.start === 0} 
                        id='prev' 
                        icon='chevron left' 
                    />
                    <Button 
                        onClick={this.handlePagination} 
                        id='next' 
                        disabled={dataReducer.start + dataReducer.count >= dataReducer.total}
                        icon='chevron right' 
                    />
                </Button.Group>
                <Table selectable striped basic="very" celled textAlign='center'>
                    <Table.Header>
                        <Table.Row>
                            {
                                colHeads.map((x, index) => 
                                    <TableHeaderCellWrap key={index}
                                        label={x.label} 
                                        id={x.id}
                                        setOrder={this.props.setOrder}
                                        update={this.props.update}
                                        store={this.props.data}
                                    />
                                )
                            }
                        </Table.Row>
                    </Table.Header>
                    <Table.Body>
                    {
                        dataReducer.data.map((entry, index) => <DataTableRow key={index} dataEntry={entry}/>)
                    }
                    </Table.Body>
                </Table>
                <p>{`Showing ${dataReducer.start + 1} to ${Math.min(dataReducer.start + dataReducer.count, dataReducer.total)} of ${dataReducer.total}`}</p>
                <Button.Group size="mini">
                    <Button 
                        onClick={this.handlePagination} 
                        disabled={dataReducer.start === 0} 
                        id='prev' 
                        icon='chevron left' 
                    />
                    <Button 
                        onClick={this.handlePagination} 
                        id='next' 
                        disabled={dataReducer.start + dataReducer.count > dataReducer.total}
                        icon='chevron right' 
                    />
                </Button.Group>
            </div>
        );
    }
}

function mapStateToProps(state) {
    return {
      data: state.data
    }
}
  
function matchDispatchToProps(dispatch){
    return bindActionCreators({
      pagination: actions.pagination,
      setCount: actions.setCount,
      setOrder: actions.setOrder,
      update: actions.update
    }, dispatch);
}
  
export default connect(mapStateToProps, matchDispatchToProps)(DataTable);