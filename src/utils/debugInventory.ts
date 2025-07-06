import { getItems } from '../api/inventory.api';
import { getIssues } from '../api/export.api';
import { getReceipts } from '../api/receipt.api';

export const debugInventorySync = async () => {
  console.log('🔍 Starting inventory sync check...');
  
  try {
    const [items, issues, receipts] = await Promise.all([
      getItems(),
      getIssues({}),
      getReceipts({})
    ]);
    
    console.log('📊 Current inventory items:', items.length);
    console.log('📤 Total issues found:', issues.results.length);
    console.log('📥 Total receipts found:', receipts.results.length);
    
    // Check each item's stock vs calculated stock
    for (const item of items) {
      const itemIssues = issues.results.filter(issue => 
        issue.details?.some(detail => detail.item === item.item_id)
      );
      
      const itemReceipts = receipts.results.filter(receipt => 
        receipt.details?.some(detail => detail.item === item.item_id)
      );
      
      // Calculate expected stock
      const totalReceived = itemReceipts.reduce((sum, receipt) => {
        const details = receipt.details?.filter(detail => detail.item === item.item_id) || [];
        return sum + details.reduce((detailSum, detail) => detailSum + detail.quantity, 0);
      }, 0);
      
      const totalIssued = itemIssues.reduce((sum, issue) => {
        const details = issue.details?.filter(detail => detail.item === item.item_id) || [];
        return sum + details.reduce((detailSum, detail) => detailSum + detail.quantity, 0);
      }, 0);
      
      const expectedStock = totalReceived - totalIssued;
      
      if (Math.abs(item.stock_quantity - expectedStock) > 0.01) {
        console.warn(`⚠️  ${item.item_name}: 
          Current stock: ${item.stock_quantity}
          Expected stock: ${expectedStock}
          Difference: ${item.stock_quantity - expectedStock}
          Receipts: ${totalReceived}
          Issues: ${totalIssued}
        `);
      } else {
        console.log(`✅ ${item.item_name}: Stock is correct (${item.stock_quantity})`);
      }
    }
    
  } catch (error) {
    console.error('❌ Error during inventory sync check:', error);
  }
  
  console.log('🔍 Inventory sync check completed');
};

// Add to window object for easy access in dev console
if (typeof window !== 'undefined') {
  (window as any).debugInventorySync = debugInventorySync;
}
