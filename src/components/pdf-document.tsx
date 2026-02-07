
import React from 'react';

const formatCurrency = (value: number) => {
  if (isNaN(value)) return '₹0.00';
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
  }).format(value);
};

export function PdfDocument({ data }: { data: any }) {
    const {
        scarfSize,
        costOfFabric,
        totalPrintingCost,
        costOfProduction,
        packagingCost,
        deliveryCost,
        totalCostOfProduct,
        percentageOverheadsValue,
        advertisement,
        totalOverheadsValue,
        totalCostWithOverheads,
        profitMargin,
        profitValue,
        sellingPrice,
        defective,
        returns,
        deadStock,
        officeMaintenance,
        agentCommission,
        salesOffer,
        cuttingCost,
        stitchingCost,
        ironingCost,
    } = data;

    const percentageOverheads = defective + returns + officeMaintenance + agentCommission + salesOffer + deadStock;

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
                 .sub-item {
                    display: flex;
                    justify-content: space-between;
                    padding: 6px 0 6px 20px;
                    font-size: 14px;
                }
                .sub-item-label {
                    color: #777;
                }
                .sub-item-value {
                    color: #333;
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
                .grand-total {
                    font-weight: bold;
                    color: #1a73e8;
                }
            `}</style>
            <div className="header">
                <div className="company-name">Grey Exim</div>
                <h1>Cost Calculation Report</h1>
                <p>Scarf Size: {scarfSize}</p>
            </div>

            <div className="section">
                <div className="section-title">Cost Breakdown</div>
                
                <div className="item">
                    <span className="item-label">Raw Material & Production</span>
                    <span className="item-value">{formatCurrency(costOfProduction)}</span>
                </div>
                <div className="sub-item">
                    <span className="sub-item-label">Cost of Fabric</span>
                    <span className="sub-item-value">{formatCurrency(costOfFabric)}</span>
                </div>
                <div className="sub-item">
                    <span className="sub-item-label">Printing Cost</span>
                    <span className="sub-item-value">{formatCurrency(totalPrintingCost)}</span>
                </div>
                 <div className="sub-item">
                    <span className="sub-item-label">Cutting Cost</span>
                    <span className="sub-item-value">{formatCurrency(cuttingCost)}</span>
                </div>
                 <div className="sub-item">
                    <span className="sub-item-label">Stitching Cost</span>
                    <span className="sub-item-value">{formatCurrency(stitchingCost)}</span>
                </div>
                 <div className="sub-item">
                    <span className="sub-item-label">Ironing Cost</span>
                    <span className="sub-item-value">{formatCurrency(ironingCost)}</span>
                </div>

                <div className="item">
                    <span className="item-label">Packaging & Delivery</span>
                    <span className="item-value">{formatCurrency(packagingCost + deliveryCost)}</span>
                </div>
                 <div className="sub-item">
                    <span className="sub-item-label">Packaging Cost</span>
                    <span className="sub-item-value">{formatCurrency(packagingCost)}</span>
                </div>
                <div className="sub-item">
                    <span className="sub-item-label">Delivery Cost</span>
                    <span className="sub-item-value">{formatCurrency(deliveryCost)}</span>
                </div>

                 <div className="item">
                    <span className="item-label grand-total">Finished Product Cost</span>
                    <span className="item-value grand-total">{formatCurrency(totalCostOfProduct)}</span>
                </div>
            </div>

             <div className="section">
                <div className="section-title">Overheads & Margins</div>
                <div className="item">
                    <span className="item-label">Overhead Costs ({percentageOverheads}% + Advertisement)</span>
                    <span className="item-value">{formatCurrency(totalOverheadsValue)}</span>
                </div>
                 <div className="sub-item">
                    <span className="sub-item-label">Percentage Overheads ({percentageOverheads}%)</span>
                    <span className="sub-item-value">{formatCurrency(percentageOverheadsValue)}</span>
                </div>
                 <div className="sub-item">
                    <span className="sub-item-label">Advertisement</span>
                    <span className="sub-item-value">{formatCurrency(advertisement)}</span>
                </div>

                 <div className="item">
                    <span className="item-label grand-total">Grand Total Cost</span>
                    <span className="item-value grand-total">{formatCurrency(totalCostWithOverheads)}</span>
                </div>
            </div>

            <div className="section">
                <div className="section-title">Pricing</div>
                 <div className="item">
                    <span className="item-label">Target Profit ({profitMargin}%)</span>
                    <span className="item-value">{formatCurrency(profitValue)}</span>
                </div>
            </div>

            <div className="total">
                <span>Final Selling Price</span>
                <span>{formatCurrency(sellingPrice)}</span>
            </div>
        </div>
    );
}
