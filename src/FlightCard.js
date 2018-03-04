import React from 'react';
import moment from 'moment';

export default function FlightCard({ cityFrom, cityTo, departureTime, arrivalTime, flyDuration, returnDuration, price, currency }) {
  return (
    <div className="card">
      <header className="card-header">
        <h3 className="card-header-title is-size-5">{cityFrom} -> {cityTo}</h3>
      </header>
      <div className="card-content">
        <div className="content is-size-7">
          <table>
            <tbody>
              <tr>
                <th>Departure</th>
                <td>
                  <time dateTime="2016-1-1">{moment(departureTime).format('ddd MMMM Do YYYY, h:mm A')}</time>
                </td>
              </tr>
              <tr>
                <th>Arrival</th>
                <td>
                  <time dateTime="2016-1-1">{moment(arrivalTime).format('ddd MMMM Do YYYY, h:mm A')}</time>
                </td>
              </tr>
              <tr>
                <th>Duration</th>
                <td>{flyDuration}</td>
              </tr>
              <tr>
                <th>Return duration</th>
                <td>{returnDuration}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <footer className="card-footer">
        <strong className="card-footer-item is-size-6">{price}&nbsp;{currency}</strong>
        <a href="#buy-a-ticket" className="card-footer-item flight-action">Buy a ticket</a>
        <a href="#details" className="card-footer-item flight-action">More details</a>
      </footer>
    </div>
  )
}