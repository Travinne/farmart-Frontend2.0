import React from "react";

function OrderCard({ order, onView, onCancel, onTrack }) {
  return (
    <div className="card">
      <div className="card-header">
        <h3>Order #{order.id}</h3>
        <span>{new Date(order.date).toLocaleDateString()}</span>
      </div>

      <p>
        Status:{" "}
        <span className={`status-${order.status.toLowerCase()}`}>
          {order.status}
        </span>
      </p>
      <p>Total: ${order.total.toFixed(2)}</p>

      <div className="card-buttons">
        <button className="btn" onClick={() => onView(order.id)}>
          View
        </button>
        {order.status === "Pending" && (
          <button className="btn btn-danger" onClick={() => onCancel(order.id)}>
            Cancel
          </button>
        )}
        <button className="btn btn-secondary" onClick={() => onTrack(order.id)}>
          Track
        </button>
      </div>
    </div>
  );
}

export default OrderCard;
