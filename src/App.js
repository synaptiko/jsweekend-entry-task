import React, { Component } from 'react';
import './App.css';
import moment from 'moment';
import { searchFlights } from './api';
import { compareDatesSafe } from './utils';
import SearchForm from './SearchForm';
import Results from './Results';

const today = moment().startOf('day');

class App extends Component {
  constructor() {
    super();

    this.state = {
      searchForm: {
        from: 'PRG',
        to: 'DXB',
        dateFrom: today.clone().add(7, 'days').toDate(),
        dateTo: today.clone().add(13, 'days').toDate(),
        isLoading: false
      },
      pagination: {
        limit: 5,
        offset: 0,
        total: 0,
        isLoading: false
      },
      flights: []
    };

    ['onFromChange', 'onToChange', 'onDatesChange', 'onSearch', 'onPageChange'].forEach((handlerName) => {
      this[handlerName] = this[handlerName].bind(this);
    })
  }

  applyStateChanges(changes) {
    const newState = {...this.state};

    Object.keys(changes).forEach((key) => {
      if (Array.isArray(changes[key])) { // assign new array
        newState[key] = changes[key];
      }
      else { // merge changes with the previous state if an object
        newState[key] = {
          ...newState[key],
          ...changes[key],
        };
      }
    });

    this.setState(newState);
  }

  onFromChange(event) {
    this.applyStateChanges({
      searchForm: {
        from: event.target.value
      }
    });
  }

  onToChange(event) {
    this.applyStateChanges({
      searchForm: {
        to: event.target.value
      }
    });
  }

  onDatesChange([dateFrom, dateTo]) {
    const {
      dateFrom: origDateFrom,
      dateTo: origDateTo
    } = this.state.searchForm;

    if (compareDatesSafe(origDateFrom, dateFrom) !== 0) {
      this.applyStateChanges({
        searchForm: {
          dateFrom
        }
      });
    }

    if (compareDatesSafe(origDateTo, dateTo) !== 0) {
      this.applyStateChanges({
        searchForm: {
          dateTo
        }
      });
    }
  }

  async onPageChange({ selected }) {
    const { from, to, dateFrom, dateTo } = this.state.searchForm;
    const { limit } = this.state.pagination;
    const offset = (selected * limit);

    this.applyStateChanges({
      pagination: {
        offset,
        isLoading: true      
      }
    })
    const result = await searchFlights({ from, to, dateFrom, dateTo, offset, limit });
    this.applyStateChanges({
      pagination: {
        total: result.total,
        isLoading: false
      },
      flights: result.flights
    })
  }

  async onSearch() {
    const { from, to, dateFrom, dateTo } = this.state.searchForm;
    const { offset, limit } = this.state.pagination;

    this.applyStateChanges({
      searchForm: {
        isLoading: true
      },
      flights: []
    });
    const result = await searchFlights({ from, to, dateFrom, dateTo, offset, limit });
    this.applyStateChanges({
      searchForm: {
        isLoading: false
      },
      pagination: {
        total: result.total
      },
      flights: result.flights
    });
  }

  render() {
    return (
      <div className="container">
        <div className="tile is-ancestor">
          <div className="tile is-4 is-parent">
            <div className="tile is-child search-form-wrap">
              <h1 className="title">Search for a flight!</h1>
              <SearchForm
                {...this.state.searchForm}
                onFromChange={this.onFromChange}
                onToChange={this.onToChange}
                onDatesChange={this.onDatesChange}
                onSearch={this.onSearch}
              />
            </div>
          </div>
          { this.state.flights.length > 0 && <Results
            pagination={this.state.pagination}
            flights={this.state.flights}
            onPageChange={this.onPageChange}
          />}
        </div>
      </div>
    );
  }
}

export default App;