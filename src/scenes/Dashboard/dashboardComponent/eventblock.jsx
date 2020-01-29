import React from 'react';

function EventBlock(props) {
  const { title, locations, eventTime } = props;
  return (
    <div className="event-block">
      <div className="details">
        <h2 className="title">{title}</h2>
        {
          locations.map(val => <h3 key={val} className="location">{val}</h3>)
        }
      </div>
      <div className="time">
        <h2>{eventTime}</h2>
      </div>
    </div>
  );
}

export default EventBlock;
