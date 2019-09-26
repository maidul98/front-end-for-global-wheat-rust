import React, { Component } from 'react';


import Controls from './components/Controls';
import DataTable from './components/DataTable';
import './App.css';

// console.log(process.env)

export default class App extends Component {
  render() {
    return (
      <div className="App">
        <div id="page-header">
          <Controls />
        </div>
        <DataTable />
        <div id="page-footer">
          <p>© 2018 Delivering Genetic Gain in Wheat (DGGW) | Cornell CALS</p>
        </div>
      </div>
    );
  }
}