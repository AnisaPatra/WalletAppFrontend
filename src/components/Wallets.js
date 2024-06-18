import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './Wallets.css'; // Import CSS file for styles

const Wallet = () => {
    const BACKEND_URL = "https://walletservicebackend-production.up.railway.app";
    const [wallet, setWallet] = useState([]);
    const [name, setName] = useState('');
    const [balance, setBalance] = useState('');
    const [message, setMessage] = useState('');
    const [transactionAmount, setTransactionAmount] = useState('');
    const [transactionDescription, setTransactionDescription] = useState('');
    const [transactionType, setTransactionType] = useState('Credit');
    const [transactionMessage, setTransactionMessage] = useState('');

    const getWallet = async () => {
        try {
            const response = await axios.get(BACKEND_URL + "/wallet");
            setWallet(response.data.wallets);
        } catch (error) {
            setMessage('Error fetching wallet');
        }
    };

    const formatDate = (string) => {
        var options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(string).toLocaleDateString([], options);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(BACKEND_URL + '/wallet/setup', { name, balance });
            setMessage(`Wallet created with ID: ${response.data.walletId}`);
            getWallet(); // Fetch the wallet again to reflect the new wallet
        } catch (error) {
            setMessage('Error creating wallet');
        }
    };

    const handleTransaction = async (e) => {
        e.preventDefault();
        try {
            await axios.post(`${BACKEND_URL}/transaction/${wallet[0].walletId}`, {
                amount: transactionAmount,
                description: transactionDescription,
                type: transactionType
            });
            setTransactionMessage(`Transaction ${transactionType} of ${transactionAmount} successful`);
            getWallet(); // Fetch the wallet again to reflect the updated balance
        } catch (error) {
            setTransactionMessage('Error processing transaction');
        }
    };

    useEffect(() => {
        getWallet();
    }, []);

    return (
        <div className="wallet-container-details">
            {wallet.length > 0 ? (
                <div>
                    <h3>Wallet Details</h3>
                    <p>Wallet Name : {wallet[0].name}</p>
                    <p>Wallet Balance : {wallet[0].balance}</p>
                    <p>Last Modified Date: {formatDate(wallet[0].updatedAt)}</p>

                    <h3>Perform Transaction</h3>
                    <form className="transaction-form" onSubmit={handleTransaction}> 
                        <div className="form-group">
                            <label>Amount:</label>
                            <input className="form-control" type="number" value={transactionAmount} onChange={(e) => setTransactionAmount(e.target.value)} />
                        </div>
                        <div className="form-group">
                            <label>Description:</label>
                            <input className="form-control" type="text" value={transactionDescription} onChange={(e) => setTransactionDescription(e.target.value)} />
                        </div>
                        <div className="form-group">
                            <label>Transaction Type:</label>
                            <select className="form-control" value={transactionType} onChange={(e) => setTransactionType(e.target.value)}>
                                <option value="Credit">Credit</option>
                                <option value="Debit">Debit</option>
                            </select>
                        </div>
                        <button className="btn" type="submit">Submit Transaction</button>
                    </form>
                    {transactionMessage && <p>{transactionMessage}</p>}
                    <Link className="view-transactions-link" to={{ pathname: "/transactions", state: { walletId: wallet[0].walletId } }}>View Transactions</Link>
                </div>
            ) : (
                <div>
                    <h3>Setup Wallet</h3>
                    <form className="setup-form" onSubmit={handleSubmit}> 
                        <div className="form-group">
                            <label>Name:</label>
                            <input className="form-control" type="text" value={name} onChange={(e) => setName(e.target.value)} />
                        </div>
                        <div className="form-group">
                            <label>Balance:</label>
                            <input className="form-control" type="number" value={balance} onChange={(e) => setBalance(e.target.value)} />
                        </div>
                        <button className="btn" type="submit">Create Wallet</button>
                    </form>
                    {message && <p>{message}</p>}
                </div>
            )}
        </div>
    );
};

export default Wallet;
