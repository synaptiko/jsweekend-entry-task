import React from 'react';
import Flatpickr from 'react-flatpickr';
import moment from 'moment';

const today = moment().startOf('day');

export default function SearchForm({ from, to, dateFrom, dateTo, isLoading, onFromChange, onToChange, onDatesChange, onSearch }) {
  return (<React.Fragment>
    <div className="field">
      <div className="control">
        <input className="input" type="text" placeholder="From" value={from} onChange={onFromChange}/>
      </div>
    </div>
    <div className="field">
      <div className="control">
        <input className="input" type="text" placeholder="To" value={to} onChange={onToChange}/>
      </div>
    </div>
    <div className="field">
      <div className="control">
        <Flatpickr onChange={onDatesChange} value={[dateFrom, dateTo]} options={{
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
        <a className={"button is-inverted is-medium " + (isLoading ? 'is-loading' : '')} onClick={onSearch}>
          Search
        </a>
      </div>
    </div>
  </React.Fragment>);
}