import React, { Component } from 'react';
import './App.css';
import Flatpickr from 'react-flatpickr';
import Paginate from 'react-paginate';
import moment from 'moment';

const API_DATE_FORMAT = 'DD/MM/YYYY'
const today = moment().startOf('day');

async function searchFlights({ from, to, dateFrom, dateTo, offset, limit }) {
  const dateFromFormatted = moment(dateFrom || today).format(API_DATE_FORMAT);
  const dateToFormatted = moment(dateTo || dateFrom || today).format(API_DATE_FORMAT);
  const baseUrl = 'https://api.skypicker.com/flights';
  const queryParams = {
    v: 3,
    flyFrom: from || '',
    to: to || '',
    dateFrom: dateFromFormatted,
    dateTo: dateFromFormatted,
    returnFrom: dateToFormatted,
    returnTo: dateToFormatted,
    locale: 'us',
    featureName: 'results',
    typeFlight: 'return',
    curr: 'EUR',
    partner: 'picky',
    partner_market: 'us',
    sort: 'price',
    asc: 1,
    limit,
    offset
  };
  const apiUrl = Object.keys(queryParams).reduce((url, key) => {
    url.searchParams.append(key, queryParams[key]);
    return url;
  }, new URL(baseUrl))

  const response = await fetch(apiUrl);
  const result = await response.json();

  return {
    total: result._results,
    currency: result.currency,
    flights: result.data.map((item) => {
      return {
        id: item.id,
        cityFrom: item.cityFrom,
        cityTo: item.cityTo,
        // convert from seconds to miliseconds (and date instance)
        arrivalTime: new Date(item.aTime * 1000),
        departureTime: new Date(item.dTime * 1000),
        flyDuration: item.fly_duration,
        returnDuration: item.return_duration,
        price: item.price
      }
    })
  };
}

function compareDatesSafe(date1, date2) {
  if (date1 == null && date2 == null) {
    return 0;
  }
  else if (date1 == null) {
    return -1;
  }
  else if (date2 == null) {
    return 1;
  }
  else {
    return (date1.getTime() - date2.getTime())
  }
}

class App extends Component {
  constructor() {
    super();

    this.state = {
      from: 'PRG',
      to: 'DXB',
      dateFrom: today.clone().add(7, 'days').toDate(),
      dateTo: today.clone().add(13, 'days').toDate(),
      limit: 5,
      offset: 0,
      total: 0
    };

    ['onFromChange', 'onToChange', 'onDatesChange', 'onSearch', 'onPageChange'].forEach((handlerName) => {
      this[handlerName] = this[handlerName].bind(this);
    })
  }

  onFromChange(event) {
    this.setState({ from: event.target.value });
  }

  onToChange(event) {
    this.setState({ to: event.target.value });
  }

  onDatesChange([dateFrom, dateTo]) {
    const {
      dateFrom: origDateFrom,
      dateTo: origDateTo
    } = this.state;

    if (compareDatesSafe(origDateFrom, dateFrom) !== 0) {
      this.setState({ dateFrom });
    }

    if (compareDatesSafe(origDateTo, dateTo) !== 0) {
      this.setState({ dateTo });
    }
  }

  async onPageChange({ selected }) {
    const offset = (selected * this.state.limit);

    this.setState({
      offset,
      isPageLoading: true
    });
    const result = await searchFlights(Object.assign({}, this.state, { offset }));
    this.setState({
      result,
      isPageLoading: false
    });
  }

  async onSearch() {
    this.setState({ isLoading: true });
    const result = await searchFlights(Object.assign({}, this.state));
    this.setState({
      result,
      isLoading: false
    });
  }

  render() {
    const {
      from,
      to,
      dateFrom,
      dateTo,
      isLoading,
      isPageLoading,
      result,
      limit,
      offset
    } = this.state;
    const flights = (result ? result.flights.map((item) => {
      return (
        <div key={item.id} className="card">
          <header className="card-header">
            <h3 className="card-header-title is-size-5">{item.cityFrom} -> {item.cityTo}</h3>
          </header>
          <div className="card-content">
            <div className="content is-size-7">
              <table>
                <tbody>
                  <tr>
                    <th>Departure</th>
                    <td>
                      <time dateTime="2016-1-1">{moment(item.departureTime).format('ddd MMMM Do YYYY, h:mm A')}</time>
                    </td>
                  </tr>
                  <tr>
                    <th>Arrival</th>
                    <td>
                      <time dateTime="2016-1-1">{moment(item.arrivalTime).format('ddd MMMM Do YYYY, h:mm A')}</time>
                    </td>
                  </tr>
                  <tr>
                    <th>Duration</th>
                    <td>{item.flyDuration}</td>
                  </tr>
                  <tr>
                    <th>Return duration</th>
                    <td>{item.returnDuration}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          <footer className="card-footer">
            <strong className="card-footer-item is-size-6">{item.price}&nbsp;{result.currency}</strong>
            <a href="#" className="card-footer-item flight-action">Buy a ticket</a>
            <a href="#" className="card-footer-item flight-action">More details</a>
          </footer>
        </div>)
    }) : [])

    return (
      <section className="hero is-primary is-bold">
        <div className="hero-body">
        <div className="container">
          <div className="tile is-ancestor">
            <div className="tile is-4 is-parent">
              <div className="tile is-child">
                <h1 className="title">Search for a flight!</h1>
                <div className="field">
                  <div className="control">
                    <input className="input" type="text" placeholder="From" value={from} onChange={this.onFromChange}/>
                  </div>
                </div>
                <div className="field">
                  <div className="control">
                    <input className="input" type="text" placeholder="To" value={to} onChange={this.onToChange}/>
                  </div>
                </div>
                <div className="field">
                  <div className="control">
                    <Flatpickr onChange={this.onDatesChange} value={[dateFrom, dateTo]} options={{
                      minDate: today.clone().toDate(),
                      wrap: true,
                      mode: 'range',
                      static: true,
                      inline: true
                    }}>
                      <input className="hidden-input" data-input />
                    </Flatpickr>
                  </div>
                </div>
                <br/>
                <div className="field">
                  <div className="control has-text-centered">
                    <a className={"button is-inverted is-medium " + (isLoading ? 'is-loading' : '')} onClick={this.onSearch}>
                      Search
                    </a>
                  </div>
                </div>
              </div>
            </div>
            { result &&
              <div className="tile is-8 is-parent is-vertical">
                <h2 className="title">Results</h2>
                <div className="box paginator-wrap">
                  <Paginate
                    containerClassName={'paginator ' + (isPageLoading ? 'is-loading' : '')}
                    previousLabel="<"
                    previousLinkClassName="button is-white has-text-weight-bold"
                    nextLabel=">"
                    nextLinkClassName="button is-white has-text-weight-bold"
                    pageLinkClassName="button is-white"
                    pageCount={Math.ceil(result.total / limit)}
                    marginPagesDisplayed={2}
                    pageRangeDisplayed={5}
                    forcePage={offset / limit}
                    activeClassName="has-text-weight-bold active-page"
                    disableInitialCallback={true}
                    onPageChange={this.onPageChange}
                  />
                </div>
                <div className="box">
                  {flights}
                </div>
                <div className="box paginator-wrap">
                  <Paginate
                    containerClassName={'paginator ' + (isPageLoading ? 'is-loading' : '')}
                    previousLabel="<"
                    previousLinkClassName="button is-white has-text-weight-bold"
                    nextLabel=">"
                    nextLinkClassName="button is-white has-text-weight-bold"
                    pageLinkClassName="button is-white"
                    pageCount={Math.ceil(result.total / limit)}
                    marginPagesDisplayed={2}
                    pageRangeDisplayed={5}
                    forcePage={offset / limit}
                    activeClassName="has-text-weight-bold active-page"
                    disableInitialCallback={true}
                    onPageChange={this.onPageChange}
                  />
                </div>
              </div>
            }
          </div>
        </div>
        </div>
      </section>
    );
  }
}

export default App;