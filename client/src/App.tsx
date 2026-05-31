import React, { useEffect, useState } from 'react';
import { OrdersList } from './OrdersList';

export type GarmentStatus = 'received' | 'in_cleaning' | 'ready' | 'delivered';
export type SelectedStatus = 'all' | GarmentStatus;

export interface Garment {
  id: string;
  description: string;
  status: GarmentStatus;
}

export interface Order {
  id: string;
  customerName: string;
  createdAt: string;
  garments: Garment[];
}

export const App: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<SelectedStatus>('all');

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch('http://localhost:3001/api/orders');
        if (!res.ok) {
          throw new Error(`HTTP ${res.status}`);
        }
        const data = (await res.json()) as Order[];
        setOrders(data);
      } catch (e: any) {
        setError(e.message || 'Failed to load orders');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  return (
    <div style={{ padding: '1rem', fontFamily: 'sans-serif' }}>
      <h1>QDC Mini Dashboard</h1>
      <p>Simple view of active orders and garments.</p>
      <label
        htmlFor="status-filter"
        style={{ display: 'block', marginBottom: '1rem' }}
      >
        Garment status:{' '}
        <select
          id="status-filter"
          value={selectedStatus}
          onChange={(event) =>
            setSelectedStatus(event.target.value as SelectedStatus)
          }
        >
          <option value="all">All</option>
          <option value="received">Received</option>
          <option value="in_cleaning">In Cleaning</option>
          <option value="ready">Ready</option>
          <option value="delivered">Delivered</option>
        </select>
      </label>
      {loading && <p>Loading orders...</p>}
      {error && <p style={{ color: 'red' }}>Error: {error}</p>}
      {!loading && !error && (
        <OrdersList orders={orders} selectedStatus={selectedStatus} />
      )}
    </div>
  );
};
