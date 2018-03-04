import moment from 'moment';

const API_DATE_FORMAT = 'DD/MM/YYYY'

export async function searchFlights({ from, to, dateFrom, dateTo, offset, limit }) {
  const dateFromFormatted = (dateFrom ? moment(dateFrom).format(API_DATE_FORMAT) : undefined);
  const dateToFormatted = (dateTo ? moment(dateTo).format(API_DATE_FORMAT) : undefined);
  const baseUrl = 'https://api.skypicker.com/flights';
  const queryParams = {
    v: 3,
    flyFrom: from,
    to: to,
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
    const value = queryParams[key];

    if (value != null) {
      url.searchParams.append(key, value);
    }

    return url;
  }, new URL(baseUrl))

  const response = await fetch(apiUrl);
  const result = await response.json();

  return {
    total: result._results,
    flights: result.data.map((item) => {
      return {
        id: item.id,
        cityFrom: item.cityFrom,
        cityTo: item.cityTo,
        flyDuration: item.fly_duration,
        returnDuration: item.return_duration,
        price: item.price,
        currency: result.currency,
        // convert from seconds to miliseconds (and date instance)
        arrivalTime: new Date(item.aTime * 1000),
        departureTime: new Date(item.dTime * 1000),
      }
    })
  };
}