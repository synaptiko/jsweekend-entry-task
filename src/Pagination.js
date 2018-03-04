import React from 'react';
import Paginate from 'react-paginate';

export default function Pagination({ isLoading, offset, limit, total, onPageChange }) {
  return (
    <div className="box paginator-wrap">
      <Paginate
        containerClassName={'paginator ' + (isLoading ? 'is-loading' : '')}
        previousLabel="<"
        previousLinkClassName="button is-white has-text-weight-bold"
        nextLabel=">"
        nextLinkClassName="button is-white has-text-weight-bold"
        pageLinkClassName="button is-white"
        pageCount={Math.ceil(total / limit)}
        marginPagesDisplayed={2}
        pageRangeDisplayed={5}
        forcePage={offset / limit}
        activeClassName="has-text-weight-bold active-page"
        disableInitialCallback={true}
        onPageChange={onPageChange}
      />
    </div>
  );
}