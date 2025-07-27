import React from 'react';

interface PartCardProps {
  id: string;
  partNumber: string;
  name: string;
  description?: string;
  price: number;
  quantity: number;
  status: string;
  category: string;
  onSelect?: () => void;
}

export const PartCard: React.FC<PartCardProps> = ({
  partNumber,
  name,
  description,
  price,
  quantity,
  status,
  category,
  onSelect
}) => {
  return (
    <div className="part-card" onClick={onSelect}>
      <div className="part-header">
        <h4>{name}</h4>
        <span className="part-number">{partNumber}</span>
      </div>
      <div className="part-details">
        {description && <p className="description">{description}</p>}
        <div className="part-meta">
          <span className="price">${price.toFixed(2)}</span>
          <span className="quantity">Qty: {quantity}</span>
          <span className="category">{category}</span>
          <span className={`status ${status.toLowerCase()}`}>
            {status}
          </span>
        </div>
      </div>
    </div>
  );
};
