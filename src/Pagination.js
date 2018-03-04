import React, { Component } from 'react';
import createFragment from 'react-addons-create-fragment';

// inspired by https://github.com/AdeleD/react-paginate
export default class Pagination extends Component {

  constructor() {
    super();

    this.onClick = this.onClick.bind(this);
  }

  onClick(event) {
    const { offset, limit, onPageChange } = this.props;
    const currentPageIndex = Math.floor(offset / limit);
    const action = event.currentTarget.dataset.action;
    let pageIndex = 0;

    if (action === 'next' || action === 'previous') {
      const { total } = this.props;
      const pageCount = Math.ceil(total / limit);

      pageIndex = (action === 'next'
        ? Math.min(pageCount - 1, currentPageIndex + 1)
        : Math.max(0, currentPageIndex - 1)
      );
    }
    else {
      pageIndex = parseInt(action.split('-')[1], 10);
    }

    if (pageIndex !== currentPageIndex) {
      onPageChange({ selected: pageIndex });
    }
  }

  getItems() {
    const items = {};
    const { offset, limit, total } = this.props;
    const currentPageIndex = Math.floor(offset / limit);
    const pageRangeDisplayed = 5;
    const pageCount = Math.ceil(total / limit);
    const marginPagesDisplayed = 2;

    const createPageItem = (i) => {
      const page = i + 1;
      const action = `goto-${i}`;

      return (
        <li><a className={"pagination-link " + (i === currentPageIndex ? 'is-current' : '')} data-action={action} onClick={this.onClick}>{page}</a></li>
      );
    };

    if (pageCount <= pageRangeDisplayed) {
      for (let i = 0; i < pageCount; i++) {
        items[`key${i}`] = createPageItem(i);
      }
    } else {
      let leftSide  = (pageRangeDisplayed / 2);
      let rightSide = (pageRangeDisplayed - leftSide);

      if (currentPageIndex > pageCount - pageRangeDisplayed / 2) {
        rightSide = pageCount - currentPageIndex;
        leftSide  = pageRangeDisplayed - rightSide;
      }
      else if (currentPageIndex < pageRangeDisplayed / 2) {
        leftSide  = currentPageIndex;
        rightSide = pageRangeDisplayed - leftSide;
      }

      let skipEllipsis = false;

      for (let i = 0; i < pageCount; i++) {
        const page = i + 1;

        if (page <= marginPagesDisplayed) {
          items[`key${i}`] = createPageItem(i);
          skipEllipsis = false;
          continue;
        }

        if (page > pageCount - marginPagesDisplayed) {
          items[`key${i}`] = createPageItem(i);
          skipEllipsis = false;
          continue;
        }

        if ((i >= currentPageIndex - leftSide) && (i <= currentPageIndex + rightSide)) {
          items[`key${i}`] = createPageItem(i);
          skipEllipsis = false;
          continue;
        }

        if (!skipEllipsis) {
          items[`key${i}`] = (<li><span className="pagination-ellipsis">&hellip;</span></li>);
          skipEllipsis = true;
        }
      }
    }

    return items;
  }

  render() {
    const { isLoading, offset, limit, total, onPageChange } = this.props;
    const items = this.getItems();

    return (
      <div className="box pagination-wrap">
        <nav className={"pagination is-centered " + (isLoading ? 'is-loading' : '')}>
        <a className="pagination-previous" data-action="previous" onClick={this.onClick}>&lt;</a>
        <a className="pagination-next" data-action="next" onClick={this.onClick}>&gt;</a>
        <ul className="pagination-list">
          {createFragment(items)}
        </ul>
        </nav>
      </div>
    );
  }
}