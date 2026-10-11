import { Landmark, Globe } from "lucide-react";

const localTransfer = [
  { label: "Bank Name", value: "Bank of Kigali" },
  { label: "Account Number", value: "100070628052" },
  { label: "Account Name", value: "FAMILY SUCCESS RWANDA" },
  { label: "Bank Branch", value: "Bank of Kigali - Huye" },
  { label: "Currency", value: "FRW (Rwandan Franc)" },
];

const internationalTransfer = [
  { label: "Bank Name", value: "Bank of Kigali" },
  { label: "Bank Street Address", value: "Bank of Kigali - Huye" },
  { label: "Beneficiary Account Number", value: "100070628052" },
  { label: "Beneficiary Account Name", value: "FAMILY SUCCESS RWANDA" },
  { label: "Beneficiary Full Address", value: "Kibeho, Mata Sector, Nyaruguru District" },
  { label: "Contact", value: "+250788316227 | www.familysuccessrwanda.org | successrwanda@gmail.com" },
  { label: "SWIFT Code", value: "BKIGRWRWXXX" },
  { label: "Currency", value: "FRW (Rwandan Francs)" },
];

const transfers = [
  { title: "For Local Transfers (Rwanda)", icon: Landmark, rows: localTransfer },
  { title: "For International Transfers", icon: Globe, rows: internationalTransfer },
];

export default function BankDetails() {
  return (
    <section id="bank-details" className="section-padding bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <span className="text-orange-600 font-semibold text-sm uppercase tracking-wider">Make the Bank Transfer</span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mt-3 mb-4">
            Direct Deposit to <span className="text-emerald-700">Church and Community Missions</span>
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">(Family Success Rwanda)</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {transfers.map((transfer) => (
            <div key={transfer.title} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 bg-emerald-700 rounded-xl flex items-center justify-center flex-shrink-0">
                  <transfer.icon className="w-5 h-5 text-white" />
                </div>
                <h3 className="font-bold text-gray-900 text-lg">{transfer.title}</h3>
              </div>
              <dl className="divide-y divide-gray-100">
                {transfer.rows.map((row) => (
                  <div key={row.label} className="py-3 sm:grid sm:grid-cols-5 sm:gap-4">
                    <dt className="text-xs font-semibold text-gray-500 uppercase tracking-wide sm:col-span-2">{row.label}</dt>
                    <dd className="text-sm font-semibold text-gray-800 break-words sm:col-span-3">{row.value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
