const TermsOfService = () => {
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
        <h1 className="text-2xl font-bold text-center mb-6">Terms of Service (TOS) for The Menu</h1>

        <h2 className="text-xl font-bold mt-4">1. <b>Introduction</b></h2>
        <p className="ml-4">
          Welcome to <b>The Menu</b> ("we," "us," or "our"). These Terms of Service ("Terms") govern your access to and use of our software, platform, including the website, mobile app, vendor dashboard, and all related services. By accessing or using our platform, and by joining the Partner Program, and using the site and/or the services, you signify your acceptance of and agreement to these terms and conditions, including any amendments that we make from time to time. If you do not agree, please discontinue use immediately.
        </p>

        <h2 className="text-xl font-bold mt-4">2. <b>Definitions</b></h2>
        <ul className="ml-12 list-disc">
          <li><b>"Platform":</b> The software, website, mobile app, and associated services provided by The Menu.</li>
          <li><b>"User":</b> Any individual accessing the platform, including subscribers, once-off pass users, and affiliates.</li>
          <li><b>"Vendor":</b> Businesses or individuals offering products/services on the platform.</li>
          <li><b>"Subscriber":</b> A user enrolled in a recurring membership plan.</li>
          <li><b>"Once-off Pass User":</b> A user purchasing limited-time access to platform features.</li>
          <li><b>"Competition":</b> A trade promotion, giveaway, or other gamified event hosted on the platform.</li>
        </ul>

        <h2 className="text-xl font-bold mt-4">3. <b>Eligibility</b></h2>
        <ul className="ml-12 list-disc">
          <li>You must be at least 18 years old or the age of majority in your jurisdiction to use the platform.</li>
          <li>By creating an account, you represent that all information provided is accurate and that you have the legal capacity to agree to these Terms.</li>
        </ul>

        <h2 className="text-xl font-bold mt-4">4. <b>Account Registration and Responsibilities</b></h2>
        <h3 className="text-lg font-bold ml-4">4.1 Registration</h3>
        <ul className="ml-12 list-disc">
          <li>Users must create an account to access platform features.</li>
          <li>Vendors must complete a detailed onboarding process.</li>
        </ul>

        <h3 className="text-lg font-bold ml-4">4.2 Account Security</h3>
        <ul className="ml-12 list-disc">
          <li>You are responsible for maintaining the confidentiality of your account credentials.</li>
          <li>Notify us immediately of any unauthorized use of your account.</li>
        </ul>

        <h3 className="text-lg font-bold ml-4">4.3 Termination</h3>
        <ul className="ml-12 list-disc">
          <li>We reserve the right to suspend or terminate accounts for violations of these Terms.</li>
        </ul>

        <h2 className="text-xl font-bold mt-4">5. <b>Subscription and Once-off Passes</b></h2>
        <p className="ml-4">
          The platform offers the following membership plans and once-off passes:
        </p>

        <div className="ml-4 mt-4 overflow-x-auto">
          <table className="w-full border-collapse border border-gray-500 text-sm">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-500 p-1">Membership tiers</th>
                <th className="border border-gray-500 p-1">Cost (Rands)</th>
                <th className="border border-gray-500 p-1">Vendor database</th>
                <th className="border border-gray-500 p-1"># Bonus competition entries</th>
                <th className="border border-gray-500 p-1">Number of competition accessible</th>
              </tr>
            </thead>
            <tbody>
              <tr className="font-bold bg-gray-100">
                <td colSpan={5} className="border border-gray-500 p-1">Subscription based (monthly, anytime cancellation)</td>
              </tr>
              <tr>
                <td className="border border-gray-500 p-1">Springbok</td>
                <td className="border border-gray-500 p-1">R150.00</td>
                <td className="border border-gray-500 p-1">40%</td>
                <td className="border border-gray-500 p-1">1</td>
                <td className="border border-gray-500 p-1">All (subject to maintaining monthly membership)</td>
              </tr>
              <tr>
                <td className="border border-gray-500 p-1">Leopard</td>
                <td className="border border-gray-500 p-1">R300.00</td>
                <td className="border border-gray-500 p-1">70%</td>
                <td className="border border-gray-500 p-1">5</td>
                <td className="border border-gray-500 p-1">All (subject to maintaining monthly membership)</td>
              </tr>
              <tr>
                <td className="border border-gray-500 p-1">Lion</td>
                <td className="border border-gray-500 p-1">R500.00</td>
                <td className="border border-gray-500 p-1">100%</td>
                <td className="border border-gray-500 p-1">10</td>
                <td className="border border-gray-500 p-1">All (subject to maintaining monthly membership)</td>
              </tr>
              <tr className="font-bold bg-gray-100">
                <td colSpan={5} className="border border-gray-500 p-1">Once off pass (non refundable)</td>
              </tr>
              <tr>
                <td className="border border-gray-500 p-1">1 Hour pass (Monday to Thursday)</td>
                <td className="border border-gray-500 p-1">R10.00</td>
                <td className="border border-gray-500 p-1">100%</td>
                <td className="border border-gray-500 p-1">1</td>
                <td className="border border-gray-500 p-1">Specific to the competition on the day of access</td>
              </tr>
              <tr>
                <td className="border border-gray-500 p-1">2 Hour pass (Monday to Thursday)</td>
                <td className="border border-gray-500 p-1">R15.00</td>
                <td className="border border-gray-500 p-1">100%</td>
                <td className="border border-gray-500 p-1">2</td>
                <td className="border border-gray-500 p-1">Specific to the competition on the day of access</td>
              </tr>
              <tr>
                <td className="border border-gray-500 p-1">3 Hour pass (Monday to Thursday)</td>
                <td className="border border-gray-500 p-1">R20.00</td>
                <td className="border border-gray-500 p-1">100%</td>
                <td className="border border-gray-500 p-1">3</td>
                <td className="border border-gray-500 p-1">Specific to the competition on the day of access</td>
              </tr>
              <tr>
                <td className="border border-gray-500 p-1">1 Hour pass (Friday to Sunday)</td>
                <td className="border border-gray-500 p-1">R20.00</td>
                <td className="border border-gray-500 p-1">100%</td>
                <td className="border border-gray-500 p-1">1</td>
                <td className="border border-gray-500 p-1">Specific to the competition on the day of access</td>
              </tr>
              <tr>
                <td className="border border-gray-500 p-1">2 Hour pass (Friday to Sunday)</td>
                <td className="border border-gray-500 p-1">R30.00</td>
                <td className="border border-gray-500 p-1">100%</td>
                <td className="border border-gray-500 p-1">2</td>
                <td className="border border-gray-500 p-1">Specific to the competition on the day of access</td>
              </tr>
              <tr>
                <td className="border border-gray-500 p-1">3 Hour pass (Monday to Thursday)</td>
                <td className="border border-gray-500 p-1">R40.00</td>
                <td className="border border-gray-500 p-1">100%</td>
                <td className="border border-gray-500 p-1">3</td>
                <td className="border border-gray-500 p-1">Specific to the competition on the day of access</td>
              </tr>
              <tr>
                <td className="border border-gray-500 p-1">24-hour pass (Monday to Thursday)</td>
                <td className="border border-gray-500 p-1">R50.00</td>
                <td className="border border-gray-500 p-1">100%</td>
                <td className="border border-gray-500 p-1">5</td>
                <td className="border border-gray-500 p-1">Specific to the competition on the day of access</td>
              </tr>
              <tr>
                <td className="border border-gray-500 p-1">24-hour pass (Friday to Sunday)</td>
                <td className="border border-gray-500 p-1">R75.00</td>
                <td className="border border-gray-500 p-1">100%</td>
                <td className="border border-gray-500 p-1">5</td>
                <td className="border border-gray-500 p-1">Specific to the competition on the day of access</td>
              </tr>
              <tr>
                <td className="border border-gray-500 p-1">Three day pass (Monday to Thursday)</td>
                <td className="border border-gray-500 p-1">R150.00</td>
                <td className="border border-gray-500 p-1">100%</td>
                <td className="border border-gray-500 p-1">10</td>
                <td className="border border-gray-500 p-1">Specific to the competition on the days of access</td>
              </tr>
              <tr>
                <td className="border border-gray-500 p-1">Three day pass (Friday to Sunday)</td>
                <td className="border border-gray-500 p-1">R225.00</td>
                <td className="border border-gray-500 p-1">100%</td>
                <td className="border border-gray-500 p-1">10</td>
                <td className="border border-gray-500 p-1">Specific to the competition on the days of access</td>
              </tr>
              <tr>
                <td className="border border-gray-500 p-1">Weekly: 7 day pass</td>
                <td className="border border-gray-500 p-1">R500.00</td>
                <td className="border border-gray-500 p-1">100%</td>
                <td className="border border-gray-500 p-1">15</td>
                <td className="border border-gray-500 p-1">Specific to the competition on the days of access</td>
              </tr>
              <tr>
                <td className="border border-gray-500 p-1">Monthly: 28 to 31 day pass</td>
                <td className="border border-gray-500 p-1">R750.00</td>
                <td className="border border-gray-500 p-1">100%</td>
                <td className="border border-gray-500 p-1">20</td>
                <td className="border border-gray-500 p-1">Specific to the competition on the days of access (benefits across 28-31 day period, benefits begin from initiation date)</td>
              </tr>
              <tr>
                <td className="border border-gray-500 p-1">3 month pass</td>
                <td className="border border-gray-500 p-1">R2,250.00</td>
                <td className="border border-gray-500 p-1">100%</td>
                <td className="border border-gray-500 p-1">30</td>
                <td className="border border-gray-500 p-1">Specific to the competition on the days of access (benefits across 90 day period, benefits begin from initiation date)</td>
              </tr>
              <tr>
                <td className="border border-gray-500 p-1">6 month pass</td>
                <td className="border border-gray-500 p-1">R4,500.00</td>
                <td className="border border-gray-500 p-1">100%</td>
                <td className="border border-gray-500 p-1">50</td>
                <td className="border border-gray-500 p-1">Specific to the competition on the days of access (benefits across 180 day period, benefits begin from initiation date)</td>
              </tr>
              <tr>
                <td className="border border-gray-500 p-1">Annual</td>
                <td className="border border-gray-500 p-1">R9,000.00</td>
                <td className="border border-gray-500 p-1">100%</td>
                <td className="border border-gray-500 p-1">100</td>
                <td className="border border-gray-500 p-1">All (benefits across 365 day period, benefits begin from initiation date)</td>
              </tr>
            </tbody>
          </table>
        </div>
        <ul className="ml-12 list-disc">
          <li><b>Subscriptions:</b> Renew automatically unless cancelled through account settings before the renewal date.</li>
          <li><b>Once-off Passes:</b> Offer limited-time access. Once-off passes are non-refundable and valid only for the specified time period.</li>
        </ul>

        <h2 className="text-xl font-bold mt-4">6. <b>Vendor Participation</b></h2>
        <h3 className="text-lg font-bold ml-4">6.1 Compliance with Policies</h3>
        <ul className="ml-12 list-disc">
          <li>Vendors must comply with platform policies, including quality standards and legal obligations.</li>
        </ul>

        <h3 className="text-lg font-bold ml-4">6.2 Fulfilment Responsibility</h3>
        <ul className="ml-12 list-disc">
          <li>Vendors are solely responsible for fulfilling their listed services/products.</li>
        </ul>

        <h3 className="text-lg font-bold ml-4">6.3 Contract Management</h3>
        <ul className="ml-12 list-disc">
          <li>Vendor contracts are managed through automated templates with e-signature functionality.</li>
        </ul>

        <h2 className="text-xl font-bold mt-4">7. <b>Referral and Affiliate Programs</b></h2>
        <h3 className="text-lg font-bold ml-4">7.1 Referrals</h3>
        <ul className="ml-12 list-disc">
          <li>Users can share referral links to earn rewards.</li>
          <li>Milestones and leaderboard features track referral achievements.</li>
        </ul>

        <h3 className="text-lg font-bold ml-4">7.2 Affiliate Marketing</h3>
        <ul className="ml-12 list-disc">
          <li>Affiliates receive unique referral codes and access to a dashboard for tracking conversions and commissions.</li>
        </ul>

        <h2 className="text-xl font-bold mt-4">8. <b>Competitions and Raffles</b></h2>
        <h3 className="text-lg font-bold ml-4">8.1 Eligibility</h3>
        <ul className="ml-12 list-disc">
          <li>Competitions are open to users with valid subscriptions or once-off passes.</li>
        </ul>

        <h3 className="text-lg font-bold ml-4">8.2 Entries</h3>
        <ul className="ml-12 list-disc">
          <li>Subscriptions provide automatic entries based on tier.</li>
          <li>Once-off passes provide automatic entries based on the access chosen.</li>
        </ul>

        <h3 className="text-lg font-bold ml-4">8.3 Winner Selection</h3>
        <ul className="ml-12 list-disc">
          <li>Winners are selected via automated random draws, and results are final.</li>
        </ul>

        <h3 className="text-lg font-bold ml-4">8.4 Prizes</h3>
        <ul className="ml-12 list-disc">
          <li>Prizes are non-transferable and cannot be exchanged for cash unless otherwise stated.</li>
        </ul>

        <h2 className="text-xl font-bold mt-4">9. <b>Payments and Refunds</b></h2>
        <ul className="ml-12 list-disc">
          <li>Payments are processed through secure payment gateways.</li>
          <li>Refunds are issued only in exceptional circumstances as outlined in our Refund Policy.</li>
        </ul>

        <h2 className="text-xl font-bold mt-4">10. <b>Privacy and Data Protection</b></h2>
        <p className="ml-4">
          Your use of the platform is subject to our Privacy Policy, which explains how we collect, use, and protect your personal information.
        </p>

        <h2 className="text-xl font-bold mt-4">11. <b>Advertising and Promotions</b></h2>
        <ul className="ml-12 list-disc">
          <li>Vendors can purchase advertising space on the platform.</li>
          <li>All advertisements must comply with platform guidelines and local laws.</li>
        </ul>

        <h2 className="text-xl font-bold mt-4">12. <b>User Conduct</b></h2>
        <p className="ml-4">
          By accessing the platform, you agree to:
        </p>
        <ul className="ml-12 list-disc">
          <li>Use the services only for lawful purposes.</li>
          <li>Refrain from uploading harmful, illegal, or fraudulent content.</li>
          <li>Respect the rights and privacy of other users and vendors.</li>
        </ul>

        <h2 className="text-xl font-bold mt-4">13. <b>Intellectual Property</b></h2>
        <ul className="ml-12 list-disc">
          <li>All platform content, trademarks, and logos are owned by The Menu.</li>
          <li>Users and vendors may not reproduce or distribute platform content without permission.</li>
        </ul>

        <h2 className="text-xl font-bold mt-4">14. <b>Services Model and Liability Exclusions</b></h2>
        <h3 className="text-lg font-bold ml-4">14.1 Services Model</h3>
        <p className="ml-4">
          The Menu acts as an intermediary platform connecting users with vendors offering various products and services. Our role is to facilitate access to vendor listings, promotions, and competitions while providing tools for managing accounts and transactions.
        </p>
        <p className="ml-4"><b>Key Points:</b></p>
        <ul className="ml-12 list-disc">
          <li>The Menu does not act as a party to any transaction between users and vendors.</li>
          <li>All transactions, including payments, delivery, and fulfilment, are conducted directly between the user and the vendor.</li>
        </ul>

        <h3 className="text-lg font-bold ml-4">14.2 Liability Exclusions</h3>
        <p className="ml-4">
          To the fullest extent permitted by law, The Menu disclaims liability for:
        </p>
        <ul className="ml-12 list-disc">
          <li>The quality, legality, or availability of vendor products/services.</li>
          <li>Any disputes arising between users and vendors.</li>
          <li>Indirect, incidental, or consequential damages resulting from platform use.</li>
        </ul>

        <h2 className="text-xl font-bold mt-4">15. <b>Disclaimers</b></h2>
        <ul className="ml-12 list-disc">
          <li>Access to the platform is provided "as is," without warranties of any kind.</li>
          <li>The Menu makes no guarantees regarding uptime, performance, or uninterrupted service.</li>
        </ul>

        <h2 className="text-xl font-bold mt-4">16. <b>Limitation of Liability</b></h2>
        <p className="ml-4">
          To the fullest extent permitted by law, The Menu disclaims liability for:
        </p>
        <ul className="ml-12 list-disc">
          <li>Indirect or consequential damages.</li>
          <li>Loss of data or revenue arising from platform use.</li>
        </ul>

        <h2 className="text-xl font-bold mt-4">17. <b>Modifications to Terms</b></h2>
        <p className="ml-4">
          We may modify these Terms at any time. Material changes will be communicated via email or platform notifications. Continued use of the platform constitutes acceptance of the updated Terms.
        </p>

        <h2 className="text-xl font-bold mt-4">18. <b>Governing Law</b></h2>
        <p className="ml-4">
          These Terms are governed by the laws of South Africa. Disputes will be resolved in the courts of South Africa.
        </p>

        <h2 className="text-xl font-bold mt-4">19. <b>Contact Information</b></h2>
        <p className="ml-4">
          For questions about these Terms, contact us at:
        </p>
        <ul className="ml-12 list-disc">
          <li><b>Email:</b> <a href="mailto:support@themenuportal.co.za" className="text-blue-500">support@themenuportal.co.za</a> </li>
          <li><b>Address:</b> 17 Dely Rd, Hazelwood, Pretoria, 0081</li>
        </ul>
      </div>
    </div>
  );
};

export default TermsOfService;