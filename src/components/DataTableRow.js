import React from 'react';
import { Table } from 'semantic-ui-react';
import PropTypes from 'prop-types';

export default class DataTableRow extends React.Component {
    constructor(props) {
        super(props);
        // var toolTip = this._initTooltip(this.props.dataEntry); // TODO: Hit up Stefan about what you wnat in here
        this.state = {
            toolTip: null
        }
    }

    _initTooltip = (dataEntry) => {
        var toolTip = document.createElement('div');
        // tooltip style
        var style = toolTip.style
        style.position = 'absolute';
        style.height = '110px';
        style.width = '110px';
        style.backgroundColor = "rgb(255, 231, 152)";
        style.border = "3px solid rgb(255, 196, 0)"
        style.display = 'none';
        style.padding = "8px";

        // text_content
        var summary = document.createTextNode(this.props.dataEntry.Plot_ID);
        toolTip.appendChild(summary);
        return toolTip;
    }

    handleMouseEnter = (e) => {
        var toolTip = this.state.toolTip;
        if(!toolTip) return;
        toolTip.style.top = e.clientY - 130 + 'px'; // so that mouse doesn't have a chance to exit by hovering over the tooltip. TRY: reduce to see the bug
        toolTip.style.left = e.clientX - 55 + 'px';
        toolTip.style.display= 'unset';
        this.setState({toolTip: toolTip}, () => {
            var table = document.getElementById('data-table');
            table.appendChild(toolTip)
        })
    }

    handleMouseMove = (e) => {
        var toolTip = this.state.toolTip;
        if(!toolTip) return;
        toolTip.style.top = e.clientY - 130 + 'px'; // so that mouse doesn't have a chance to exite by hovering over the tooltip. TRY: reduce to see the bug
        toolTip.style.left = e.clientX - 55 + 'px';

        this.setState({toolTip: toolTip})
    }

    handleMouseLeave = (e) => {
        var toolTip = this.state.toolTip;
        if(!toolTip) return;
        toolTip.style.display = 'none'
        this.setState({toolTip: toolTip})
    }

    _formatDate(dateString) {
        if(!dateString) return 'n/a';
        var dateArr = dateString.slice(0, -14).split('-');
        return dateArr[1]+'/'+dateArr[2]+'/'+dateArr[0];
    }

    render() {
        const entry = this.props.dataEntry;
        return (
            <Table.Row key={entry.Plot_ID} onMouseLeave={this.handleMouseLeave} onMouseEnter={this.handleMouseEnter} onMouseMove={this.handleMouseMove}>
                <Table.Cell>{entry.Plot_ID}</Table.Cell>
                <Table.Cell>{entry.CID}</Table.Cell>
                <Table.Cell>{entry.SID}</Table.Cell>
                <Table.Cell>{entry.GID}</Table.Cell>
                <Table.Cell>{entry.Variety}</Table.Cell>
                <Table.Cell>{entry.Pedigree}</Table.Cell>
                <Table.Cell>{entry.Rust_Score_1}</Table.Cell>
                <Table.Cell>{entry.Susceptibility_Rating_1}</Table.Cell>
                <Table.Cell>{this._formatDate(entry.Date_1)}</Table.Cell>
                <Table.Cell>{entry.Rust_Score_2 ? entry.Rust_Score_2 : "n/a"}</Table.Cell>
                <Table.Cell>{entry.Susceptibility_Rating_2 ? entry.Susceptibility_Rating_2 : "n/a"}</Table.Cell>
                <Table.Cell>{entry.Date_2 ? this._formatDate(entry.Date_2) : "n/a"}</Table.Cell>
            </Table.Row>
        );
    }
}

DataTableRow.propTypes = {
    dataEntry: PropTypes.object.isRequired
}