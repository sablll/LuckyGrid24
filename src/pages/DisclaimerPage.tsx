import React from 'react';
import { SEOHead } from '../components/common/SEOHead';
import {
  AlertTriangle,
  Scale,
  ShieldAlert,
  Info,
  FileCheck2
} from 'lucide-react';

export const DisclaimerPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <SEOHead
        title="Disclaimer, Legal Terms & Statutory Compliance | My India Lottery"
        description="Statutory legal disclaimer under The Lotteries (Regulation) Act, 1998, 18+ policy, state legality notices, and prize claim procedures."
      />

      {/* Header */}
      <div className="pb-6 border-b-2 border-blue-600">
        <div className="flex items-center gap-2">
          <Scale className="w-6 h-6 text-blue-600" />
          <h1 className="text-2xl sm:text-4xl font-black text-blue-900 tracking-tight uppercase">
            Legal Disclaimer &amp; Statutory Compliance
          </h1>
        </div>
        <p className="text-xs sm:text-sm text-slate-600 font-semibold mt-1 max-w-2xl leading-relaxed">
          Important terms of use, statutory legal notices, and official gazette verification guidelines.
        </p>
      </div>

      {/* Mandatory Independent Disclaimer Card */}
      <div className="bg-white border-2 border-blue-600 rounded-lg p-6 space-y-4 shadow-sm">
        <div className="flex items-center gap-2 text-blue-900 font-black text-base uppercase">
          <Info className="w-5 h-5 text-blue-600" />
          Independent Information Portal Notice
        </div>
        <div className="text-xs sm:text-sm text-slate-700 leading-relaxed space-y-3 font-medium">
          <p className="font-bold text-slate-900">
            My India Lottery is an independent lottery results information website. We are not affiliated with, operated by, or endorsed by any Indian state government or lottery department.
          </p>
          <p>
            We provide lottery results, draw information, winning numbers, and historical archives for informational purposes. Results are collected and cross-checked against publicly available official government lottery sources.
          </p>
          <p>
            My India Lottery does not sell lottery tickets, process lottery payments, or operate any lottery scheme.
          </p>
          <p className="font-semibold text-blue-950">
            For official confirmation, users should always verify lottery results with the relevant state government's official lottery department or gazette.
          </p>
        </div>
      </div>

      {/* Alert Banner */}
      <div className="bg-blue-50 border-2 border-blue-600 rounded-lg p-6 space-y-3 shadow-xs">
        <div className="flex items-center gap-2 text-blue-900 font-black text-base uppercase">
          <AlertTriangle className="w-5 h-5 text-blue-600" />
          Mandatory Verification with Official Gazette
        </div>
        <p className="text-xs sm:text-sm text-slate-800 leading-relaxed font-medium">
          While utmost care is taken to ensure accuracy by parsing publicly available official records, <strong>My India Lottery is not responsible for any inadvertent error, typo, or omission</strong> that may have crept into the results published on this website. <strong>Winners are strongly advised to verify their numbers with the official State Government Gazette before surrendering tickets or making prize claims.</strong>
        </p>
      </div>

      {/* Structured Legal Sections */}
      <div className="space-y-6 text-xs sm:text-sm text-slate-700">
        {/* Section 1 */}
        <div className="bg-white border-2 border-slate-200 rounded-lg p-6 space-y-2 shadow-xs">
          <h2 className="text-base font-black text-blue-900 uppercase flex items-center gap-2">
            <Scale className="w-4 h-4 text-blue-600" />
            1. Regulatory Status under The Lotteries (Regulation) Act, 1998
          </h2>
          <p className="text-slate-600 leading-relaxed font-medium">
            Lotteries in India are governed by Central Act No. 39 of 1998 (The Lotteries (Regulation) Act, 1998) and respective State Lottery Rules. Lotteries are legally permitted only in the authorized states of Kerala, Nagaland, Sikkim, Punjab, Goa, Maharashtra, Mizoram, Arunachal Pradesh, Meghalaya, West Bengal, Bodoland, and Manipur.
          </p>
        </div>

        {/* Section 2 */}
        <div className="bg-white border-2 border-slate-200 rounded-lg p-6 space-y-2 shadow-xs">
          <h2 className="text-base font-black text-blue-900 uppercase flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-blue-600" />
            2. Age Restriction (Strictly 18+)
          </h2>
          <p className="text-slate-600 leading-relaxed font-medium">
            Participation in any lottery scheme in India is legally restricted to individuals aged 18 years and older. Minors are strictly prohibited by law from purchasing lottery tickets or claiming prizes.
          </p>
        </div>

        {/* Section 3 */}
        <div className="bg-white border-2 border-slate-200 rounded-lg p-6 space-y-2 shadow-xs">
          <h2 className="text-base font-black text-blue-900 uppercase flex items-center gap-2">
            <Info className="w-4 h-4 text-blue-600" />
            3. Non-Affiliation and Independent Operations
          </h2>
          <p className="text-slate-600 leading-relaxed font-medium">
            My India Lottery is an independent lottery results information website. We are not affiliated with, operated by, or endorsed by any Indian state government or lottery department. My India Lottery does not sell lottery tickets, process lottery payments, or operate any lottery scheme.
          </p>
        </div>

        {/* Section 4 */}
        <div className="bg-white border-2 border-slate-200 rounded-lg p-6 space-y-2 shadow-xs">
          <h2 className="text-base font-black text-blue-900 uppercase flex items-center gap-2">
            <FileCheck2 className="w-4 h-4 text-blue-600" />
            4. Prize Claim Procedure &amp; TDS Deduction Rules
          </h2>
          <div className="text-slate-600 leading-relaxed space-y-2 font-medium">
            <p>
              &bull; Prize claims must generally be lodged within <strong>30 to 60 days</strong> of the draw date, along with the intact original ticket, self-attested photos, and valid government ID proofs (PAN card, Aadhaar).
            </p>
            <p>
              &bull; As per Section 194B of the Indian Income Tax Act, any lottery prize exceeding ₹10,000 is subject to <strong>TDS (Tax Deducted at Source) at a flat rate of 30%</strong>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
