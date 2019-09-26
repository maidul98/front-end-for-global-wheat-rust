import React from 'react';
import { Form, Input } from 'semantic-ui-react';

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

    handleSubmit = (e) => {
        const { storeData } = this.props;
        this.props.searchAction(this.state.value);
        this.props.updateAction(storeData.start, storeData.count, storeData.query, storeData.order);
        this.setState({
            value: '',
        });
    }

    removeFromSearch = (e) => {
        const text = e.currentTarget.parentNode.innerHTML;
        this.props.removeFromSearchAction(text.slice(0, -46)); // inner html includes <i></i> tags. Log tect var to see.
        const { storeData } = this.props;
        this.props.updateAction(storeData.start, storeData.count, storeData.query, storeData.order);
    }

    render() {
        const value = this.state.value;
        return(
            <div id="search" className="group">
                {   
                    this.props.storeData.query.search &&
                    Object.keys(this.props.storeData.query.search).map((term) => 
                        <p key={term}>{term}
                            <i 
                                aria-hidden="true" 
                                class="delete icon"
                                onClick={this.removeFromSearch}
                            ></i>
                        </p>
                    )
                }
                <Form
                    onSubmit={this.handleSubmit}
                >
                    <Input
                        onChange={this.handleChange} 
                        type="text" 
                        placeholder="Search"
                        fluid
                        value={value}
                    />
                </Form>
            </div>
        );
    }
}