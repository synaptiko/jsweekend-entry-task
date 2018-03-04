import React from 'react';
import Pagination from './Pagination';
import FlightCard from './FlightCard';

export default function Results({ pagination, flights, onPageChange }) {
  return (
    <div className="tile is-8 is-parent is-vertical results-wrap">
      <h2 className="title">Results</h2>
      <Pagination {...pagination} onPageChange={onPageChange}/>
      <div className="box">
        { flights.map(item => <FlightCard key={item.id} {...item}/>) }
      </div>
      <Pagination {...pagination} onPageChange={onPageChange}/>
    </div>
  );
}