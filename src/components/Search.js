import React from 'react';
export default class Search extends React.Component {
    
    constructor(props) {
        super(props);

        this.state = {
            value: '',
        }
    }

    handleChange = (e) => {
        this.setState({ 
            value: e.target.value,
        });
    }


    render() {
        return(
            <input type="text" placeholder="Search" onChange={this.props.updateSearchTerm} value={this.props.searchTerm} className="group query_specificity"/>
        );
    }
}