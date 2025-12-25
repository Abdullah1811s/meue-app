const CampaignTermsOfService = () => {
  const preventCopy = (e: any) => {
    e.preventDefault();
    return false;
  };

  return (
    <div
      className="bg-white text-black p-8 max-w-4xl mx-auto"
      style={{ fontFamily: 'Times New Roman, serif' }}
      onCopy={preventCopy}
      onCut={preventCopy}
      onDrag={preventCopy}
      onDragStart={preventCopy}
      onContextMenu={(e) => e.preventDefault()}
    >
      <div style={{ userSelect: 'none' }}>
        <h1 className="text-2xl font-bold text-center mb-6">Campaign Terms & Conditions</h1>

        <h2 className="text-xl font-bold mt-4">1. <b>Promoter and Prize Partners</b></h2>
        <h3 className="text-lg font-bold ml-4">1.1 Promoter</h3>
        <p className="ml-8">
          This trade promotional campaign ("Campaign") is promoted by The Menu Portal (Pty) Ltd ("Promoter").
        </p>
        
        <h3 className="text-lg font-bold ml-4">1.2 Prize Partners/Sponsors</h3>
        <p className="ml-8">Prize partners/sponsors for this Campaign include:</p>
        <ul className="ml-12 list-disc">
          <li><b>Golf Boutique</b> – voucher plus Srixon full set (R100,000 value)</li>
          <li><b>Qaswarah</b> – Rolex voucher (R500,000 value)</li>
          <li><b>Aurinia Ford</b> – Ford Ranger Wildtrak (R1,000,000 value)</li>
        </ul>

        <h3 className="text-lg font-bold ml-4">1.3 SMME Upliftment Donation</h3>
        <p className="ml-8">
          The Menu will donate R1,000,000 to SMME upliftment if the relevant milestone is achieved (this is not a consumer prize).
        </p>

        <h3 className="text-lg font-bold ml-4">1.4 Administrators</h3>
        <p className="ml-8">
          The Promoter may appoint administrators and/or independent persons to oversee the draw process.
        </p>

        <h2 className="text-xl font-bold mt-4">2. <b>Important Notice</b></h2>
        <h3 className="text-lg font-bold ml-4">2.1 Legal Compliance</h3>
        <p className="ml-8">
          This Campaign is run as a trade promotional campaign in South Africa and is intended to comply with applicable South African consumer and promotional laws and regulations.
        </p>

        <h3 className="text-lg font-bold ml-4">2.2 No Additional Cost</h3>
        <p className="ml-8">
          Membership/access fees paid to THE MENU are paid for access to platform benefits (including exclusive deals, discounts, and services). The Campaign is an additional promotional benefit, and no separate or additional payment is required to participate beyond being an Active Member (defined below).
        </p>

        <h3 className="text-lg font-bold ml-4">2.3 Agreement to Terms</h3>
        <p className="ml-8">
          By participating, you agree to these Terms & Conditions and the Promoter's platform terms and policies available at <a href="https://www.themenuportal.co.za" className="text-blue-500">www.themenuportal.co.za</a> ("Platform Terms").
        </p>

        <h2 className="text-xl font-bold mt-4">3. <b>Campaign Period</b></h2>
        <h3 className="text-lg font-bold ml-4">3.1 Campaign Dates</h3>
        <p className="ml-8">
          The Campaign starts on <b>26 December 2025</b> and ends at <b>23:59 on 31 March 2026 (SAST)</b> ("Campaign Period").
        </p>

        <h3 className="text-lg font-bold ml-4">3.2 Amendments</h3>
        <p className="ml-8">
          The Promoter may amend, suspend, or terminate the Campaign if required by law or due to circumstances beyond its reasonable control, by publishing notice on <a href="https://www.themenuportal.co.za" className="text-blue-500">www.themenuportal.co.za</a>.
        </p>

        <h2 className="text-xl font-bold mt-4">4. <b>Eligibility</b></h2>
        <h3 className="text-lg font-bold ml-4">4.1 Eligible Participants</h3>
        <p className="ml-8">Participation is open to natural persons who:</p>
        <ul className="ml-12 list-disc">
          <li>are 18 years or older</li>
          <li>are resident in South Africa</li>
          <li>have a verified THE MENU account</li>
          <li>are an Active Member at the time of the draw and winner verification</li>
        </ul>

        <h3 className="text-lg font-bold ml-4">4.2 Excluded Persons</h3>
        <p className="ml-8">The following may not participate:</p>
        <ul className="ml-12 list-disc">
          <li>directors, members, employees, agents, contractors, or consultants of the Promoter and prize partners involved in the Campaign administration</li>
          <li>their immediate family members</li>
          <li>any person prohibited by law from participating</li>
        </ul>

        <h2 className="text-xl font-bold mt-4">5. <b>How Participation Works (No Additional Cost)</b></h2>
        <h3 className="text-lg font-bold ml-4">5.1 Active Member Definition</h3>
        <p className="ml-8">
          <b>Active Member</b> means a member whose THE MENU access/subscription is valid, successfully paid, and not cancelled, refunded, reversed, or in arrears at the time of the draw and winner verification.
        </p>

        <h3 className="text-lg font-bold ml-4">5.2 Automatic Inclusion</h3>
        <p className="ml-8">
          Eligible participants are automatically included in the Campaign participant pool while they remain Active Members during the Campaign Period.
        </p>

        <h3 className="text-lg font-bold ml-4">5.3 Verification</h3>
        <p className="ml-8">
          The Promoter may require reasonable verification information to prevent fraud and enable prize fulfilment (e.g., full name, SA ID/passport, contact details, and delivery/collection details).
        </p>

        <h2 className="text-xl font-bold mt-4">6. <b>Milestone Unlocks</b></h2>
        <h3 className="text-lg font-bold ml-4">6.1 Milestone Activation</h3>
        <p className="ml-8">
          Certain Campaign items activate ("Unlock") only once the Campaign reaches specified milestones based on Active Member counts.
        </p>

        <h3 className="text-lg font-bold ml-4">6.2 Milestone Thresholds</h3>
        <div className="ml-8 mt-4 overflow-x-auto">
          <table className="w-full border-collapse border border-gray-500 text-sm">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-500 p-1">Prize</th>
                <th className="border border-gray-500 p-1">Value</th>
                <th className="border border-gray-500 p-1">Milestone (Active Members)</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-gray-500 p-1">Qaswarah – Rolex voucher</td>
                <td className="border border-gray-500 p-1">R500,000</td>
                <td className="border border-gray-500 p-1">50,000</td>
              </tr>
              <tr>
                <td className="border border-gray-500 p-1">Aurinia Ford – Ford Ranger Wildtrak</td>
                <td className="border border-gray-500 p-1">R1,000,000</td>
                <td className="border border-gray-500 p-1">100,000</td>
              </tr>
              <tr>
                <td className="border border-gray-500 p-1">SMME upliftment donation (The Menu)</td>
                <td className="border border-gray-500 p-1">R1,000,000</td>
                <td className="border border-gray-500 p-1">200,000</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="ml-8 mt-2"><i>Note: The SMME upliftment donation is not a consumer prize.</i></p>

        <h3 className="text-lg font-bold ml-4">6.3 Golf Boutique Prize</h3>
        <p className="ml-8">
          The Golf Boutique prize (R100,000) forms part of the intended prize pool for the Campaign; the prize is live from launch or not subject to any milestone activation.
        </p>

        <h3 className="text-lg font-bold ml-4">6.4 Unreached Milestones</h3>
        <p className="ml-8">
          If a milestone is not reached by the end of the Campaign Period, the associated unlocked item:
        </p>
        <ul className="ml-12 list-disc">
          <li>will not be drawn in this Campaign</li>
          <li>may, at the Promoter's discretion, be rolled into a future campaign and/or substituted with an item of similar value, with notice published on the Campaign page</li>
        </ul>

        <h2 className="text-xl font-bold mt-4">7. <b>Prizes</b></h2>
        <h3 className="text-lg font-bold ml-4">7.1 Prize Pool</h3>
        <p className="ml-8">The intended prize pool (subject to milestones) is:</p>
        <ul className="ml-12 list-disc">
          <li><b>Golf Boutique</b> – Voucher plus Srixon full set: R100,000</li>
          <li><b>Qaswarah</b> – Rolex voucher: R500,000 (milestone-based)</li>
          <li><b>Aurinia Ford</b> – Ford Ranger Wildtrak: R1,000,000 (milestone-based)</li>
        </ul>

        <h3 className="text-lg font-bold ml-4">7.2 Cash Alternatives</h3>
        <p className="ml-8">
          No cash alternatives will be offered unless required by law or unless the Promoter elects to do so due to supply/logistics constraints.
        </p>

        <h3 className="text-lg font-bold ml-4">7.3 Transferability</h3>
        <p className="ml-8">
          Prizes are not transferable and may not be exchanged, except at the Promoter's discretion.
        </p>

        <h3 className="text-lg font-bold ml-4">7.4 Specifications</h3>
        <p className="ml-8">
          Images used in marketing are illustrative; final specifications may vary depending on availability.
        </p>

        <h2 className="text-xl font-bold mt-4">8. <b>Winner Selection and Live Draw</b></h2>
        <h3 className="text-lg font-bold ml-4">8.1 Selection Process</h3>
        <p className="ml-8">
          Winners will be selected by random draw from the eligible participant pool of Active Members at the time of the draw, for the prizes that are unlocked and active at that time.
        </p>

        <h3 className="text-lg font-bold ml-4">8.2 Draw Date</h3>
        <p className="ml-8">
          There will be one single live draw on <b>31 March 2026</b> ("Draw Date").
        </p>

        <h3 className="text-lg font-bold ml-4">8.3 Draw Method</h3>
        <p className="ml-8">
          The Promoter may use an electronic random-selection process and may appoint an independent person to oversee the draw.
        </p>

        <h3 className="text-lg font-bold ml-4">8.4 Final Decision</h3>
        <p className="ml-8">
          The Promoter's decision is final, subject to applicable law.
        </p>

        <h2 className="text-xl font-bold mt-4">9. <b>Winner Notification</b></h2>
        <h3 className="text-lg font-bold ml-4">9.1 Live Draw</h3>
        <p className="ml-8">
          The draw will be conducted as a Live Draw.
        </p>

        <h3 className="text-lg font-bold ml-4">9.2 Email Notification</h3>
        <p className="ml-8">
          In addition to the Live Draw, all members will receive an automatic email notification relating to the draw outcome/announcement, because all members are linked to draws.
        </p>

        <h3 className="text-lg font-bold ml-4">9.3 Direct Contact</h3>
        <p className="ml-8">
          Winners will also be contacted directly using the contact details linked to their THE MENU account within a reasonable time after the draw, for verification and fulfilment.
        </p>

        <h2 className="text-xl font-bold mt-4">10. <b>Winner Verification and Disqualification</b></h2>
        <h3 className="text-lg font-bold ml-4">10.1 Verification Requirements</h3>
        <p className="ml-8">
          Winners must complete verification, which may include: proof of identity (SA ID/passport), proof of residence, and confirmation of Active Member status.
        </p>

        <h3 className="text-lg font-bold ml-4">10.2 Disqualification</h3>
        <p className="ml-8">
          If a winner:
        </p>
        <ul className="ml-12 list-disc">
          <li>cannot be contacted; or</li>
          <li>fails verification; or</li>
          <li>is found to be ineligible; or</li>
          <li>breached these Terms or the Platform Terms;</li>
        </ul>
        <p className="ml-8">
          the Promoter may disqualify the winner and select an alternate winner via a further random draw (where appropriate).
        </p>

        <h2 className="text-xl font-bold mt-4">11. <b>Vehicle Prize Fulfilment (Ford Ranger Wildtrak)</b></h2>
        <h3 className="text-lg font-bold ml-4">11.1 Vehicle Specifications</h3>
        <p className="ml-8">
          Vehicle model/colour/specification is subject to supplier availability.
        </p>

        <h3 className="text-lg font-bold ml-4">11.2 Costs</h3>
        <p className="ml-8">
          Licensing and registration costs will be covered by the Promoter/prize partner as part of the vehicle prize fulfilment. Insurance is the winner's responsibility unless the Campaign page expressly states otherwise.
        </p>

        <h3 className="text-lg font-bold ml-4">11.3 Documentation</h3>
        <p className="ml-8">
          The winner may be required to comply with dealership/FICA requirements and sign reasonable documentation to take delivery of the vehicle.
        </p>

        <h3 className="text-lg font-bold ml-4">11.4 Additional Costs</h3>
        <p className="ml-8">
          Any optional extras, upgrades, accessories, fines, fuel, and ongoing running costs are the winner's responsibility.
        </p>

        <h2 className="text-xl font-bold mt-4">12. <b>Fraud, Abuse, and Platform Integrity</b></h2>
        <h3 className="text-lg font-bold ml-4">12.1 Disqualification</h3>
        <p className="ml-8">
          The Promoter may disqualify any participant where it reasonably believes there has been fraud, manipulation, fake accounts, bots, or abuse of the platform or Campaign.
        </p>

        <h3 className="text-lg font-bold ml-4">12.2 Forfeiture</h3>
        <p className="ml-8">
          Disqualified participants forfeit any right to a prize.
        </p>

        <h2 className="text-xl font-bold mt-4">13. <b>POPIA and Privacy</b></h2>
        <h3 className="text-lg font-bold ml-4">13.1 Data Processing</h3>
        <p className="ml-8">
          The Promoter will process personal information for Campaign administration, winner selection, verification, and prize fulfilment.
        </p>

        <h3 className="text-lg font-bold ml-4">13.2 Privacy Practices</h3>
        <p className="ml-8">
          Personal information will be processed in line with the Promoter's privacy and data practices as published on <a href="https://www.themenuportal.co.za" className="text-blue-500">www.themenuportal.co.za</a>.
        </p>

        <h2 className="text-xl font-bold mt-4">14. <b>Liability</b></h2>
        <h3 className="text-lg font-bold ml-4">14.1 Limited Liability</h3>
        <p className="ml-8">
          To the extent permitted by law, the Promoter and prize partners are not liable for any loss, damage, or injury arising from participation or from acceptance/use of a prize, except where liability cannot be excluded by law.
        </p>

        <h3 className="text-lg font-bold ml-4">14.2 Warranties</h3>
        <p className="ml-8">
          Prizes are provided subject to supplier/manufacturer warranties (if any).
        </p>

        <h2 className="text-xl font-bold mt-4">15. <b>General</b></h2>
        <h3 className="text-lg font-bold ml-4">15.1 Governing Law</h3>
        <p className="ml-8">
          These Terms are governed by the laws of the Republic of South Africa.
        </p>

        <h3 className="text-lg font-bold ml-4">15.2 Severability</h3>
        <p className="ml-8">
          If any clause is found unenforceable, the remaining clauses remain in force.
        </p>

        <h3 className="text-lg font-bold ml-4">15.3 Updates</h3>
        <p className="ml-8">
          Updates to these Terms will be published on the Campaign page at <a href="https://www.themenuportal.co.za" className="text-blue-500">www.themenuportal.co.za</a> with a revised effective date.
        </p>
      </div>
    </div>
  );
};

export default CampaignTermsOfService;