import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { CSVLink } from 'react-csv';
import { useLocation } from 'react-router-dom';
import './Transactions.css'; // Import CSS file for styles

const Transactions = () => {
    const location = useLocation();
    const walletId = location.state.walletId;
    const [transactions, setTransactions] = useState([]);
    const [totalTransactions, setTotalTransactions] = useState(0);
    const [message, setMessage] = useState('');
    const [skip, setSkip] = useState(0);
    const [limit, setLimit] = useState(10);
    const [sortBy, setSortBy] = useState('createdAt'); // Default sort by createdAt
    const [sortOrder, setSortOrder] = useState('desc'); // Default sort order descending

    useEffect(() => {
        fetchTransactions();
    }, [skip, limit, sortBy, sortOrder]);

    const fetchTransactions = async () => {
        try {
            const response = await axios.get(`/transaction?walletId=${walletId}&skip=${skip}&limit=${limit}&sortBy=${sortBy}&sortOrder=${sortOrder}`);
            setTransactions(response.data.transactions);
            setTotalTransactions(response.data.total); // Assuming your API returns total count of transactions
            setMessage('Transactions fetched successfully');
        } catch (error) {
            setMessage('Error fetching transactions');
        }
    };

    const handleFetch = (e) => {
        e.preventDefault();
        fetchTransactions();
    };

    const formatDate = (string) => {
        var options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(string).toLocaleDateString([], options);
    };

    const headers = [
        { label: "Transaction ID", key: "transactionId" },
        { label: "Amount", key: "amount" },
        { label: "Description", key: "description" },
        { label: "Date", key: "createdAt" },
        { label: "Type", key: "type" },
    ];

    // Options for sorting criteria
    const sortByOptions = [
        { value: 'transactionId', label: 'Transaction ID' },
        { value: 'amount', label: 'Amount' },
        { value: 'createdAt', label: 'Date' },
        { value: 'type', label: 'Type' },
    ];

    const handleSortByChange = (e) => {
        setSortBy(e.target.value);
    };

    const toggleSortOrder = () => {
        setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    };

    return (
        <div className="transactions-container"> {/* Added container class for overall styling */}
            <h2>Transactions</h2>
            <form className="transaction-form" onSubmit={handleFetch}> {/* Added form class for styling */}
                <div className="form-group">
                    <label>Skip:</label>
                    <input className="form-control" type="number" value={skip} onChange={(e) => setSkip(e.target.value)} />
                </div>
                <div className="form-group">
                    <label>Limit:</label>
                    <input className="form-control" type="number" value={limit} onChange={(e) => setLimit(e.target.value)} />
                </div>
                <button className="btn" type="submit">Fetch Transactions</button>
            </form>
            {message && <p>{message}</p>}

            {/* Sorting UI */}
            <div className="sorting-section"> {/* Added class for styling */}
                <label className="sort-label">Sort By:</label>
                <select className="sort-select" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                    {sortByOptions.map(option => (
                        <option key={option.value} value={option.value}>{option.label}</option>
                    ))}
                </select>
                <button className="btn" onClick={toggleSortOrder}>
                    {sortOrder === 'asc' ? 'Ascending' : 'Descending'}
                </button>
            </div>

            <table className="transaction-table"> {/* Added class for table styling */}
                <thead>
                    <tr>
                        <th>Transaction ID</th>
                        <th>Amount</th>
                        <th>Description</th>
                        <th>Date</th>
                        <th>Type</th>
                    </tr>
                </thead>
                <tbody>
                    {transactions.map((transaction) => (
                        <tr key={transaction.transactionId}>
                            <td>{transaction.transactionId}</td>
                            <td>{transaction.amount}</td>
                            <td>{transaction.description}</td>
                            <td>{formatDate(transaction.createdAt)}</td>
                            <td>{transaction.type}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <br /><br />
            <CSVLink data={transactions} headers={headers} filename={`transactions_${walletId}.csv`}>
                Export to CSV
            </CSVLink>

            {/* Pagination */}
            <div className="pagination-section"> {/* Added class for styling */}
                <button className="btn" onClick={() => setSkip(skip - limit)} disabled={skip === 0}>Previous</button>
                <button className="btn" onClick={() => setSkip(skip + limit)} disabled={skip + limit >= totalTransactions}>Next</button>
            </div>
        </div>
    );
};

export default Transactions;
