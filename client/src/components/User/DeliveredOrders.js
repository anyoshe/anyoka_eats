import React, { useEffect, useState } from 'react';
import axios from 'axios';
import config from '../../config';
import "./UserPage.css";

const DeliveredOrders = ({ partner }) => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [totalSales, setTotalSales] = useState(0);
  const [commissionDue, setCommissionDue] = useState(0);
  const [totalDeliveries, setTotalDeliveries] = useState(0);
  const [filterDate, setFilterDate] = useState('');
  const [filterRestaurant, setFilterRestaurant] = useState('');
  const [partnerRestaurants, setPartnerRestaurants] = useState([]);

  useEffect(() => {
    const fetchPartnerRestaurants = async () => {
      try {
        const response = await axios.get(`${config.backendUrl}/api/partners/${partner._id}/restaurants`);
        setPartnerRestaurants(response.data);
      } catch (error) {
        console.error('Error fetching partner restaurants:', error);
      }
    };
  
    fetchPartnerRestaurants();
  }, [partner]);

  useEffect(() => {
    if (partnerRestaurants.length > 0) {
      fetchDeliveredOrders();
    }
  }, [partnerRestaurants]);

  useEffect(() => {
    filterAndDisplayOrders();
  }, [filterDate, filterRestaurant, orders]);
  
  const fetchDeliveredOrders = async () => {
    try {
      const response = await axios.get(`${config.backendUrl}/api/orders`);
      const deliveredOrders = response.data.filter(order => order.status === 'Delivered');
      
      const partnerOrders = deliveredOrders.filter(order => 
        partnerRestaurants.some(restaurant => restaurant.restaurant === order.selectedRestaurant)
      );
  
      setOrders(partnerOrders);
      setFilteredOrders(partnerOrders); // Set filtered orders initially
      calculateTotals(partnerOrders);
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  };

  const calculateTotals = (orders) => {
    const totalSales = orders.reduce((acc, order) => acc + order.totalPrice, 0);
    const commissionDue = totalSales * 0.1;
    const totalDeliveries = orders.length;

    setTotalSales(totalSales);
    setCommissionDue(commissionDue);
    setTotalDeliveries(totalDeliveries);
  };

  const filterAndDisplayOrders = () => {
    const filteredOrders = orders.filter(order => {
      const orderDate = order.createdAt.split('T')[0];
      return (!filterDate || orderDate === filterDate) &&
            (!filterRestaurant || order.selectedRestaurant === filterRestaurant);
    });
    setFilteredOrders(filteredOrders);
    calculateTotals(filteredOrders);
  };

  const handleDateFilterChange = (event) => {
    setFilterDate(event.target.value);
  };

  const handleRestaurantFilterChange = (event) => {
    setFilterRestaurant(event.target.value);
  };

  const createSalesElement = (order) => (
    <tr key={order.orderId} id={`sale-${order.orderId}`} className="salesDetails">
      <td>{order.orderId}</td>
      <td>{order.dishCode}</td>
      <td>{order.createdAt.split('T')[0]}</td>
      <td>{order.selectedRestaurant}</td>
      {/* <td>{order.customerName}</td>
      <td>{order.phoneNumber}</td> */}
      <td>Kes.{order.totalPrice}.00</td>
    </tr>
  );

  const uniqueDates = [...new Set(orders.map(order => order.createdAt.split('T')[0]))];
  const uniqueRestaurants = [...new Set(orders.map(order => order.selectedRestaurant))];

  return (
    <div className="salesOrders">

      <button id="fetchSalesButton" onClick={fetchDeliveredOrders}>Hotel Sales</button>

      <div id="salesList">

        <table>

          <thead>

            <tr>
              <th>Sales Number</th>
              <th>Dish Code</th>
              <th>
                Date
                <select id="dateFilter" value={filterDate} onChange={handleDateFilterChange}>
                  <option value="">All Dates</option>
                  {uniqueDates.map(date => <option key={date} value={date}>{date}</option>)}
                </select>
              </th>

              <th>
                Restaurant
                <select id="restaurantFilter" value={filterRestaurant} onChange={handleRestaurantFilterChange}>
                  <option value="">All Restaurants</option>
                  {uniqueRestaurants.map(restaurant => <option key={restaurant} value={restaurant}>{restaurant}</option>)}
                </select>
              </th>

              {/* <th>Customer Name</th>
              <th>Phone Number</th> */}
              <th>Sales Amount</th>

            </tr>
          </thead>

          <tbody id="salesBody">
            {filteredOrders.map(order => createSalesElement(order))}
          </tbody>

        </table>
      </div>

      <div id="salesTotals">
        <div id="salesTotal">

          <p>Total Sales: Kes. <span id="totalSales" className="sameTotal">{totalSales.toFixed(2)}</span></p>

          <p>Commission: Kes. <span id="commissionDue sameTotal" className="sameTotal">{commissionDue.toFixed(2)}</span></p>
          
          <p>Total Deliveries: <span id="totalDeliveries sameTotal" className="sameTotal">{totalDeliveries}</span></p>
        </div>
      </div>

    </div>
  );
};

export default DeliveredOrders;

