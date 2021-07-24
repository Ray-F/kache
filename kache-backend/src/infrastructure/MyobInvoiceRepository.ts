import { MyobService } from '../service/MyobService';

/*
 * EXAMPLE INVOICE
 *
 {
   UID: '09ebf671-f4dc-447d-ae40-f4016eda351b',
   Number: '00000001',
   Date: '2021-07-23T00:00:00',
   CustomerPurchaseOrderNumber: '',
   Customer: {
     UID: 'e40fe2de-474c-44ac-b318-967a0a0b1c68',
     Name: 'Michael Howell',
     DisplayID: '*None',
     URI: 'https://ar2.api.myob.com/accountright/ec8619d9-bb20-4aae-9bbf-1e0e508bb58a/Contact/Customer/e40fe2de-474c-44ac-b318-967a0a0b1c68'
   },
   PromisedDate: null,
   BalanceDueAmount: 0,
   BalanceDueAmountForeign: null,
   Status: 'Closed',
   ShipToAddress: '',
   Terms: {
     PaymentIsDue: 'InAGivenNumberOfDays',
     DiscountDate: 0,
     BalanceDueDate: 10,
     DiscountForEarlyPayment: 0,
     MonthlyChargeForLatePayment: 0,
     DiscountExpiryDate: '2021-07-23T00:00:00',
     Discount: 0,
     DiscountForeign: null,
     DueDate: '2021-08-02T00:00:00',
     FinanceCharge: 0,
     FinanceChargeForeign: null
   },
   IsTaxInclusive: true,
   Subtotal: 100,
   SubtotalForeign: null,
   Freight: 0,
   FreightForeign: null,
   FreightTaxCode: {
     UID: 'bd3c220d-39b1-48a0-93fe-42ca88463e65',
     Code: 'S15',
     URI: 'https://ar2.api.myob.com/accountright/ec8619d9-bb20-4aae-9bbf-1e0e508bb58a/GeneralLedger/TaxCode/bd3c220d-39b1-48a0-93fe-42ca88463e65'
   },
   TotalTax: 0,
   TotalTaxForeign: null,
   TotalAmount: 100,
   TotalAmountForeign: null,
   Category: null,
   Salesperson: null,
   Comment: '',
   ShippingMethod: null,
   JournalMemo: 'Sale; Howell, Michael',
   ReferralSource: null,
   InvoiceDeliveryStatus: 'PrintAndEmail',
   LastPaymentDate: '2021-07-23T00:00:00',
   CanApplySurcharge: false,
   InvoiceType: 'Service',
   Order: null,
   OnlinePaymentMethod: 'All',
   ForeignCurrency: null,
   CurrencyExchangeRate: null,
   LastModified: '2021-07-23T04:51:15.497',
   URI: 'https://ar2.api.myob.com/accountright/ec8619d9-bb20-4aae-9bbf-1e0e508bb58a/Sale/Invoice/Service/09ebf671-f4dc-447d-ae40-f4016eda351b',
   RowVersion: '147774362773094400'
 }
 */

class MyobInvoiceRepository {

  private myobService: MyobService;
  private readonly cfId: string;

  private readonly INVOICE_URI = '/sale/invoice';

  constructor(myobService: MyobService, companyFileId: string) {
    this.myobService = myobService;
    this.cfId = companyFileId;
  }

  /**
   * Returns a list of invoices for the current company file.
   */
  async list(): Promise<object> {
    const cfUri = await this.myobService.getCFUriFromId(this.cfId);

    if (cfUri) {
      const resp = await this.myobService.makeCFApiCall(`${cfUri}${this.INVOICE_URI}`, 'GET', 'Administrator', '');

      return (await resp.json())["Items"];
    }

    return null;

  }

}

export {
  MyobInvoiceRepository,
};
