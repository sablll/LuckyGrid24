import React from 'react';
import { SEOHead } from '../components/common/SEOHead';
import {
  AlertTriangle,
  Scale,
  ShieldAlert,
  FileText,
  Info,
  CheckCircle2,
  FileCheck2
} from 'lucide-react';

export const DisclaimerPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <SEOHead
        title="Disclaimer, Legal Terms & Statutory Compliance | India Lottery Results"
        description="Statutory legal disclaimer under The Lotteries (Regulation) Act, 1998, 18+ policy, state legality notices, and prize claim procedures."
      />

      {/* Header */}
      <div className="pb-6 border-b border-stone-200">
        <div className="flex items-center gap-2">
          <Scale className="w-6 h-6 text-stone-700" />
          <h1 className="text-2xl sm:text-4xl font-bold text-stone-950 font-editorial-serif tracking-tight">
            Legal Disclaimer &amp; Statutory Compliance
          </h1>
        </div>
        <p className="text-xs sm:text-sm text-stone-500 mt-1 max-w-2xl leading-relaxed">
          Important terms of use, statutory legal notices, and official gazette verification guidelines.
        </p>
      </div>

      {/* Alert Banner */}
      <div className="bg-white border border-stone-300 rounded-2xl p-6 space-y-3 shadow-xs">
        <div className="flex items-center gap-2 text-stone-950 font-bold text-sm uppercase tracking-wider font-mono-code">
          <AlertTriangle className="w-5 h-5 text-stone-700" />
          Mandatory Verification with Official Gazette
        </div>
        <p className="text-xs sm:text-sm text-stone-700 leading-relaxed">
          While utmost care is taken to ensure accuracy by parsing authorized state directorate records, <strong>India Lottery Results is not responsible for any inadvertent error, typo, or omission</strong> that may have crept into the results published on this website. <strong>Winners are strongly advised to verify their numbers with the official State Government Gazette before surrendering tickets or making prize claims.</strong>
        </p>
      </div>

      {/* Structured Legal Sections */}
      <div className="space-y-6 text-xs sm:text-sm text-stone-700">
        {/* Section 1 */}
        <div className="bg-white border border-stone-200 rounded-xl p-6 space-y-2 shadow-xs">
          <h2 className="text-base font-bold text-stone-950 font-editorial-serif flex items-center gap-2">
            <Scale className="w-4 h-4 text-stone-700" />
            1. Regulatory Status under The Lotteries (Regulation) Act, 1998
          </h2>
          <p className="text-stone-600 leading-relaxed">
            Lotteries in India are governed by Central Act No. 39 of 1998 (The Lotteries (Regulation) Act, 1998) and respective State Lottery Rules. Lotteries are legally permitted only in the states of Kerala, Nagaland, Sikkim, Punjab, Goa, Maharashtra, Mizoram, Arunachal Pradesh, Meghalaya, West Bengal, Bodoland, and Manipur. Participating in or purchasing tickets from non-authorized lotteries is unlawful.
          </p>
        </div>

        {/* Section 2 */}
        <div className="bg-white border border-stone-200 rounded-xl p-6 space-y-2 shadow-xs">
          <h2 className="text-base font-bold text-stone-950 font-editorial-serif flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-stone-700" />
            2. Age Restriction (Strictly 18+)
          </h2>
          <p className="text-stone-600 leading-relaxed">
            Participation in any lottery scheme in India is legally restricted to individuals aged 18 years and older. Minors are strictly prohibited by law from purchasing lottery tickets or claiming prizes.
          </p>
        </div>

        {/* Section 3 */}
        <div className="bg-white border border-stone-200 rounded-xl p-6 space-y-2 shadow-xs">
          <h2 className="text-base font-bold text-stone-950 font-editorial-serif flex items-center gap-2">
            <Info className="w-4 h-4 text-stone-700" />
            3. Non-Affiliation and No Commercial Activity
          </h2>
          <p className="text-stone-600 leading-relaxed">
            India Lottery Results is an independent archival and news portal. We are NOT affiliated with, authorized by, or an agent of any State Lottery Department. We DO NOT sell tickets, accept money, process wagers, or run syndicates.
          </p>
        </div>

        {/* Section 4 */}
        <div className="bg-white border border-stone-200 rounded-xl p-6 space-y-2 shadow-xs">
          <h2 className="text-base font-bold text-stone-950 font-editorial-serif flex items-center gap-2">
            <FileCheck2 className="w-4 h-4 text-stone-700" />
            4. Prize Claim Procedure &amp; TDS Deduction Rules
          </h2>
          <div className="text-stone-600 leading-relaxed space-y-2">
            <p>
              &bull; Prize claims must generally be lodged within <strong>30 to 60 days</strong> of the draw date, along with the intact original ticket, self-attested photos, and valid government ID proofs (PAN card, Aadhaar).
            </p>
            <p>
              &bull; As per Section 194B of the Indian Income Tax Act, any lottery prize exceeding ₹10,000 is subject to <strong>TDS (Tax Deducted at Source) at a flat rate of 30%</strong> (plus applicable surcharge & cess).
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
