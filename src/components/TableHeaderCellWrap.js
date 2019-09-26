import React from 'react';
import { Table } from 'semantic-ui-react';
import PropTypes from 'prop-types';

const symbols = ["", '↑', '↓']

export default class TableHeaderCellWrap extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            orderBy: 0,
        }
        // 0 - none, 1 - asc, 2 - desc
    }

    onClick = (e) => {
        var store = this.props.store
        this.props.setOrder(this.props.id)
        // this.props.update(store.start, store.count, store.applyFilters ? store.query : {}, store.order)
        this.props.update(store.start, store.count, store.query, store.order)
        this.setState({
            orderBy: (this.state.orderBy + 1)%3,
        })
    }

    render() {
        return (
            <Table.HeaderCell onClick={this.onClick} id={this.props.id}>
                {this.props.label + symbols[this.state.orderBy]}
            </Table.HeaderCell>
        );
    }
}

TableHeaderCellWrap.propTypes = {
    label: PropTypes.string.isRequired,
    id: PropTypes.string
};
