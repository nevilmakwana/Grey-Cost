
import React from 'react';

const formatCurrency = (value: number) => {
  if (isNaN(value)) return '₹0.00';
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
  }).format(value);
};

const formatNumber = (value: number, decimals = 2) => {
    if (isNaN(value)) return '0.00';
    return value.toFixed(decimals);
};

export function ComboPdfDocument({ data }: { data: any }) {
    const {
        num90cm,
        num50cm,
        comboDiscount,
        totalScarves,
        totalIndividualPrice,
        finalComboPrice,
        customerSaving,
        profit,
        totalCost,
    } = data;

    return (
        <div style={{ fontFamily: 'Arial, sans-serif', color: '#333', padding: '40px', width: '210mm', height: '297mm', margin: 'auto', boxSizing: 'border-box' }}>
            <style>{`
                .header {
                    text-align: center;
                    margin-bottom: 40px;
                }
                .header h1 {
                    color: #1a73e8;
                    margin: 0;
                    font-size: 24px;
                }
                .header .company-name {
                    font-size: 28px;
                    font-weight: bold;
                    color: #333;
                    margin-bottom: 10px;
                }
                .header p {
                    color: #5f6368;
                    margin-top: 5px;
                    font-size: 16px;
                }
                .section {
                    margin-bottom: 30px;
                }
                .section-title {
                    font-size: 18px;
                    font-weight: bold;
                    color: #1a73e8;
                    border-bottom: 2px solid #1a73e8;
                    padding-bottom: 5px;
                    margin-bottom: 15px;
                }
                .item {
                    display: flex;
                    justify-content: space-between;
                    padding: 10px 0;
                    border-bottom: 1px solid #e0e0e0;
                    font-size: 16px;
                }
                .item-label {
                    color: #555;
                }
                .item-value {
                    font-weight: bold;
                }
                .total {
                    display: flex;
                    justify-content: space-between;
                    font-size: 24px;
                    font-weight: bold;
                    color: #1a73e8;
                    background-color: #e8f0fe;
                    padding: 20px;
                    border-radius: 8px;
                    margin-top: 30px;
                }
                .profit-item {
                    color: #1e8e3e; /* Green for profit */
                }
                 .saving-item {
                    color: #1e8e3e; /* Green for saving */
                }
            `}</style>
            <div className="header">
                <div className="company-name">Grey Exim</div>
                <h1>Combo Offer Analysis Report</h1>
            </div>

            <div className="section">
                <div className="section-title">Combo Configuration</div>
                <div className="item">
                    <span className="item-label">90x90cm Scarves</span>
                    <span className="item-value">{num90cm} pcs</span>
                </div>
                 <div className="item">
                    <span className="item-label">50x50cm Scarves</span>
                    <span className="item-value">{num50cm} pcs</span>
                </div>
                 <div className="item">
                    <span className="item-label">Total Scarves</span>
                    <span className="item-value">{totalScarves} pcs</span>
                </div>
                <div className="item">
                    <span className="item-label">Combo Discount</span>
                    <span className="item-value">{formatNumber(comboDiscount)}%</span>
                </div>
            </div>

            <div className="section">
                <div className="section-title">Pricing & Profitability</div>
                 <div className="item">
                    <span className="item-label">Total Price (Bought Individually)</span>
                    <span className="item-value">{formatCurrency(totalIndividualPrice)}</span>
                </div>
                 <div className="item">
                    <span className="item-label">Total Cost of Combo</span>
                    <span className="item-value">{formatCurrency(totalCost)}</span>
                </div>
                 <div className="item">
                    <span className="item-label">Customer's Saving</span>
                    <span className="item-value saving-item">{formatCurrency(customerSaving)}</span>
                </div>
                <div className="item">
                    <span className="item-label">Your Profit on this Combo</span>
                    <span className="item-value profit-item">{formatCurrency(profit)}</span>
                </div>
            </div>

            <div className="total">
                <span>Final Combo Price</span>
                <span>{formatCurrency(finalComboPrice)}</span>
            </div>
        </div>
    );
}
