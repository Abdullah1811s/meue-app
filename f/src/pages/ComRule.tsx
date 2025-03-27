const CompetitionRules = () => {
  // Prevent copying and right-click
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
      onContextMenu={(e: any) => e.preventDefault()}
    >
      <div style={{ userSelect: 'none' }}>
        <h1 className="text-2xl font-bold text-center mb-6">Competition Rules for The Menu</h1>

        <h2 className="text-xl font-bold mt-4">1. <b>Eligibility</b></h2>
        <p className="ml-4"><b>1.1. Competitions are open to:</b></p>
        <ul className="ml-12 list-disc">
          <li><b>Users with an active subscription or a valid day pass.</b></li>
          <li><b>Individuals aged 18 years or older.</b></li>
        </ul>
        <p className="ml-4"><b>1.2. Employees, vendors, affiliates, and their immediate family members are not eligible to participate unless otherwise specified.</b></p>

        <h2 className="text-xl font-bold mt-4">2. <b>Entries</b></h2>
        <p className="ml-4"><b>2.1. Automatic Entries:</b></p>
        <ul className="ml-12 list-disc">
          <li><b>Springbok Plan:</b> 1 entry per month.</li>
          <li><b>Leopard Plan:</b> 5 entries per month.</li>
          <li><b>Lion Plan:</b> 10 entries per month.</li>
        </ul>
        <p className="ml-4"><b>2.2. Day Passes Offer Automatic Entries:</b></p>
        <ul className="ml-12 list-disc">
          <li><b>1-Hour Pass:</b> 1 entry.</li>
          <li><b>24-Hour Pass:</b> 5 entries.</li>
          <li>Refer to <b>Terms of Service</b> for the full breakdown of access points and competition entries associated.</li>
        </ul>
        <p className="ml-4"><b>2.3. Manual Entries:</b></p>
        <ul className="ml-12 list-disc">
          <li>Users may enter competitions manually where applicable, such as completing forms or tasks specified in competition details.</li>
        </ul>
        <p className="ml-4"><b>2.4. No Purchase Necessary:</b></p>
        <ul className="ml-12 list-disc">
          <li>Where required by law, alternative methods of entry will be provided (e.g., free online form submission).</li>
        </ul>

        <h2 className="text-xl font-bold mt-4">3. <b>Winner Selection</b></h2>
        <p className="ml-4"><b>3.1. Winners are selected through:</b></p>
        <ul className="ml-12 list-disc">
          <li>Random automated draws for most competitions.</li>
          <li>Merit-based selection for specific competitions, as described in the event details.</li>
        </ul>
        <p className="ml-4"><b>3.2. Draws are conducted transparently, and all results are final.</b></p>

        <h2 className="text-xl font-bold mt-4">4. <b>Notification of Winners</b></h2>
        <p className="ml-4"><b>4.1. Winners will be notified via:</b></p>
        <ul className="ml-12 list-disc">
          <li><b>Live Feed:</b> If implemented, winners may be announced during a live broadcast on the platform.</li>
          <li><b>Direct Notification:</b> Winners will be contacted via their registered email or phone number within 48 hours of the draw.</li>
        </ul>
        <p className="ml-4"><b>4.2. If a winner cannot be reached or fails to claim their prize within 14 days, The Menu reserves the right to select an alternate winner.</b></p>

        <h2 className="text-xl font-bold mt-4">5. <b>Prizes</b></h2>
        <p className="ml-4"><b>Prizes are described in the competition details and may include:</b></p>
        <ul className="ml-12 list-disc">
          <li>Cash rewards.</li>
          <li>Products or services from vendors.</li>
          <li>Vouchers or credits redeemable on the platform.</li>
        </ul>
        <p className="ml-4"><b>Terms:</b></p>
        <ul className="ml-12 list-disc">
          <li>Prizes are non-transferable and cannot be exchanged for cash unless explicitly stated.</li>
          <li>The Menu reserves the right to substitute prizes of equal or greater value if the advertised prize becomes unavailable.</li>
        </ul>

        <h2 className="text-xl font-bold mt-4">6. <b>Taxes and Fees</b></h2>
        <ul className="ml-12 list-disc">
          <li>Winners are responsible for any applicable taxes, duties, or fees associated with claiming their prizes.</li>
          <li>The Menu is not liable for additional costs incurred by winners when claiming or using their prizes.</li>
        </ul>

        <h2 className="text-xl font-bold mt-4">7. <b>Disqualification</b></h2>
        <ul className="ml-12 list-disc">
          <li>Providing false or misleading information during entry.</li>
          <li>Violating these rules or The Menu’s Terms of Service.</li>
          <li>Using fraudulent methods to obtain entries.</li>
        </ul>

        <h2 className="text-xl font-bold mt-4">8. <b>Privacy</b></h2>
        <ul className="ml-12 list-disc">
          <li>By entering a competition, participants consent to the use of their name, likeness, and entry details for promotional purposes without additional compensation, unless prohibited by law.</li>
          <li>The storage and processing of personal information in accordance with our Privacy Policy.</li>
        </ul>

        <h2 className="text-xl font-bold mt-4">9. <b>Limitation of Liability</b></h2>
        <ul className="ml-12 list-disc">
          <li>The Menu is not responsible for lost, late, or misdirected entries due to technical issues.</li>
          <li>Issues related to prize delivery or use once awarded.</li>
          <li>Any disputes arising from third-party vendor involvement in prizes.</li>
        </ul>

        <h2 className="text-xl font-bold mt-4">10. <b>Modifications and Cancellation</b></h2>
        <ul className="ml-12 list-disc">
          <li>The Menu reserves the right to modify, suspend, or cancel any competition at its sole discretion in the event of unforeseen circumstances, fraud, or technical failures without any liability.</li>
          <li>Any changes will be communicated to participants in a timely manner.</li>
        </ul>

        <h2 className="text-xl font-bold mt-4">11. <b>Governing Law</b></h2>
        <p className="ml-4">Competitions are subject to all applicable laws and regulations.</p>

        <h2 className="text-xl font-bold mt-4">12. <b>Contact Information</b></h2>
        <p className="ml-4">For questions about these Terms, contact us at:</p>
        <ul className="ml-12 list-disc">
          <li >Email: <a href="mailto:competitions@themenuportal.co.za" className="text-blue-500 underline">
            competitions@themenuportal.co.za</a> </li>
        </ul>
      </div>
    </div>
  );
};

export default CompetitionRules;
