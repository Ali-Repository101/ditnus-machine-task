import React from 'react';

export default function RecursiveList({ data }) {
  if (!data || data.length === 0) return <p className="text-muted">No people added yet.</p>;

  const renderItems = (items) => {
    return items.map(item => (
      <li key={item._id}>
        <strong>- {item.name}</strong>
        {item.children && item.children.length > 0 && (
          <ul className="ms-4 mt-1 list-unstyled">
            {renderItems(item.children)}
          </ul>
        )}
      </li>
    ));
  };

  return <ul className="list-unstyled">{renderItems(data)}</ul>;
}
