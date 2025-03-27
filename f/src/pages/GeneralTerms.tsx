const GeneralTermPdf = () => {
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
      <div className="bg-white p-8 max-w-4xl w-full select-none">
        <h1 className="text-3xl font-bold mb-6 text-center">General Terms and Conditions</h1>

        {/* Section 1: Introduction */}
        <Section title="1. Introduction">
          Welcome to The Menu ("we," "us," or "our"). These General Terms and Conditions ("Terms") govern your access to and use of The Menu software, website, services, memberships, competitions, and vendor offerings (collectively referred to as the "Platform"). By accessing or using The Menu, you agree to comply with these Terms. If you do not agree to these Terms, you must refrain from accessing or using the Platform.
        </Section>

        {/* Section 2: Definitions */}
        <Section title="2. Definitions">
          • <strong>The Menu</strong>: Refers to the software and services offered at www.themenuportal.co.za. <br />
          • <strong>Member</strong>: Any individual who subscribes to a membership tier or purchases a Day Pass on The Menu. <br />
          • <strong>Vendor/Partner</strong>: Any business or individual listing products, services, offers, or promotions on The Menu. <br />
          • <strong>User</strong>: Any person accessing or using The Menu, including Members, Vendors, and visitors. <br />
          • <strong>Content</strong>: All text, images, videos, offers, coupons, and other materials available on the Platform. <br />
          • <strong>Membership Tiers</strong>: Subscription levels that provide different levels of access and benefits (Entry-Level: Springbok Pass, Mid-Level: Leopard Pass, and Premium-Level: Lion Pass). <br />
          • <strong>Once-off Pass</strong>: One-time access passes for specified durations (e.g., 1 hour, 2 hours, 3 hours, 1 day, 3 days, 7 days, 1 month, 3 months, 6 months, 12 months). <br />
          • <strong>Competitions</strong>: Promotions and giveaways available to eligible Members and Users.
        </Section>

        {/* Section 3: Service Model */}
        <Section title="3. Service Model">
          The Menu provides an online platform and software that connects Members and Users with Vendors/Partners offering products, services, and promotions. Our core services include: <br />
          • Facilitating access to a curated database of Vendor listings. <br />
          • Hosting competitions and giveaways for eligible Members and Users. <br />
          • Providing tools for Vendors to manage their offers, coupons, and promotions. <br />
          • Offering subscription-based Membership Tiers and Once-off Passes for varying levels of access to the Platform. <br />
          <br />
          <strong>Key Points:</strong> <br />
          • The Menu acts solely as an intermediary or facilitator between Members/Users and Vendors/Partners. <br />
          • All transactions (e.g., purchases, bookings, deliveries) are conducted directly between the Member/User and the respective Vendor/Partner. <br />
          • The Menu does not assume responsibility for the quality, availability, or delivery of any product or service listed on the Platform.
        </Section>

        {/* Section 4: Membership Terms */}
        <Section title="4. Membership Terms">
          <SubSection title="4.1. Membership Options">
            The Menu offers the following Membership Tiers: <br />
            <strong>1. Springbok Membership (R150/month):</strong> <br />
            • Access to 40% of the vendor database. <br />
            • 1 automatic entry per draw into monthly competitions. <br />
            <strong>2. Leopard Membership (R300/month):</strong> <br />
            • Access to 70% of the vendor database. <br />
            • 5 automatic entries per draw into monthly competitions. <br />
            • Early access to new deals. <br />
            <strong>3. Lion Membership (R500/month):</strong> <br />
            • Access to 100% of the vendor database. <br />
            • 10 automatic entries per draw into monthly competitions. <br />
            • Exclusive event invitations. <br />
            • Exclusive/early access to bespoke products. <br />
            • Premium customer support.
          </SubSection>

          <SubSection title="4.2. Once-off Pass Options">
            The Menu also offers the following Once-off Passes: <br />
            • 1 Hour Access (Monday to Thursday) <br />
            • 2 Hour Access (Monday to Thursday) <br />
            • 3 Hour Access (Monday to Thursday) <br />
            • 1 Hour Weekend Access (Friday to Sunday) <br />
            • 2 Hour Weekend Access (Friday to Sunday) <br />
            • 3 Hour Weekend Access (Friday to Sunday) <br />
            • 24 Hour Weekday Access (Monday to Thursday) <br />
            • 24 Hour Weekend Access (Friday to Sunday) <br />
            • 3 Day Access (Monday to Thursday) <br />
            • 3 Day Weekend Access (Friday to Sunday) <br />
            • Weekly: 7 Days Access <br />
            • Monthly: 28 to 31 Days Access (Dependent on Full Calendar Month Accessed) <br />
            • 3 Months Access: 84 to 93 Days Access (Dependent on Full Calendar Months Accessed) <br />
            • 6 Months Access: 168 to 186 Days Access (Dependent on Full Calendar Months Accessed) <br />
            • Yearly: 365 Days Access
          </SubSection>

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


          <SubSection title="4.3. Subscription Billing">
            • <strong>Billing Cycle</strong>: Memberships renew automatically on a monthly basis unless cancelled. <br />
            • <strong>Payment Methods</strong>: Payments are processed securely via payment options aligned to the South African FSP regulations. <br />
            • <strong>Cancellation</strong>: Members may cancel their subscription at any time through their dashboard. Benefits remain active until the end of the respective billing cycle. <br />
            • <strong>Refunds</strong>: Membership fees are non-refundable except in cases of billing errors or as required by law.
          </SubSection>
        </Section>

        {/* Section 5: User Conduct */}
        <Section title="5. User Conduct">
          Users of The Menu agree to: <br />
          • Use the Platform lawfully and responsibly. <br />
          • Provide accurate and complete registration information. <br />
          • Not engage in fraudulent, misleading, or harmful activities. <br />
          • Refrain from uploading offensive, defamatory, or copyrighted content without permission. <br />
          • Comply with all applicable national laws and regulations.
        </Section>

        {/* Section 6: Competitions and Giveaways */}
        <Section title="6. Competitions and Giveaways">
          <SubSection title="6.1. Eligibility">
            • Open to South African residents aged 18 years or older unless otherwise stated. <br />
            • Employees of The Menu, its affiliates, and their immediate families are ineligible to participate.
          </SubSection>

          <SubSection title="6.2. Entry Rules">
            • Members receive automatic entries into competitions based on their Membership Tier or Day Pass level. <br />
            • Additional entries may be earned by completing specific actions, such as referring friends, sharing content, or engaging with promotional materials.
          </SubSection>

          <SubSection title="6.3. Winner Selection">
            • Winners are selected randomly by an independent auditor to ensure fairness and transparency. <br />
            • Notifications will be sent via email, and winners will also be announced on the Competitions Page and social media channels.
          </SubSection>

          <SubSection title="6.4. Prizes">
            • Prizes are non-transferable and cannot be exchanged for cash. <br />
            • The Menu reserves the right to substitute prizes of equal or greater value if necessary. <br />
            • Claims for prizes must be made within 7 days of announcement; unclaimed prizes will be forfeited.
          </SubSection>
        </Section>

        {/* Section 7: Vendor Listings and Offers */}
        <Section title="7. Vendor Listings and Offers">
          <SubSection title="7.1. Vendor Obligations">
            • Vendors/Partners must ensure that all product descriptions, pricing, and promotional materials comply with South African laws, including the Consumer Protection Act (CPA). <br />
            • Vendors/Partners are responsible for resolving disputes, handling returns, and addressing customer inquiries related to their offerings.
          </SubSection>

          <SubSection title="7.2. Coupon Management">
            • Vendors/Partners can create and manage coupons independently through the Vendor Portal or request assistance from their assigned account manager. <br />
            • Bulk uploads via CSV files are supported for efficient coupon management.
          </SubSection>
        </Section>

        {/* Section 8: Payment and Billing */}
        <Section title="8. Payment and Billing">
          • <strong>Payment Methods</strong>: We accept payments via payment options aligned to the South African FSP regulations. <br />
          • <strong>Security</strong>: All transactions are encrypted and PCI DSS compliant.
        </Section>

        {/* Section 9: Privacy Policy */}
        <Section title="9. Privacy Policy">
          Refer to our <a href="/doc/Privacy" target="_blank" className="text-blue-500">Privacy Policy</a> for details on data collection, use, and protection.
        </Section>

        {/* Section 10: Limitation of Liability */}
        <Section title="10. Limitation of Liability">
          • The Menu is not liable for any claims, damages, losses, or expenses arising out of or in connection with: <br />
          &nbsp;&nbsp;&nbsp;&nbsp;• Transactions conducted between Members/Users and Vendors/Partners. <br />
          &nbsp;&nbsp;&nbsp;&nbsp;• The quality, availability, or delivery of products or services provided by Vendors/Partners. <br />
          &nbsp;&nbsp;&nbsp;&nbsp;• Payment terms, refunds, or other financial arrangements between Members/Users and Vendors/Partners. <br />
          &nbsp;&nbsp;&nbsp;&nbsp;• Any act or omission of Vendors/Partners, including but not limited to public liability, negligence, or breach of contract. <br />
          • Our total liability is limited to the amount paid by the User to access the platform in the preceding three months.
        </Section>

        {/* Section 11: Governing Law */}
        <Section title="11. Governing Law">
          These Terms are governed by the laws of South Africa. Any disputes arising from or in connection with these Terms shall be resolved exclusively in the courts of South Africa.
        </Section>

        {/* Section 12: Dispute Resolution */}
        <Section title="12. Dispute Resolution">
          • In the event of a dispute, parties agree to first attempt resolution through good-faith negotiations. <br />
          • If negotiations fail, the matter may proceed to litigation in accordance with South African law.
        </Section>

        {/* Section 13: Amendments */}
        <Section title="13. Amendments">
          We reserve the right to update these Terms at any time. Changes will take effect immediately upon posting on the Platform. Continued use of the Platform after such changes constitutes acceptance of the revised Terms. It is the User's responsibility to regularly review these Terms for updates.
        </Section>

        {/* Section 14: Contact Information */}
        <Section title="14. Contact Information">
          For inquiries or support, please contact us via: <br />
          • <strong>Email</strong>: <a href="mailto:support@themenuportal.co.za" className="text-blue-500 underline">
            support@themenuportal.co.za
          </a>
          <br />
          • <strong>Address</strong>: 17 Dely Rd, Hazelwood, Pretoria, 0081 <br />
          <br />
          By agreeing to these Terms, you acknowledge that you have read, understood, and accepted them in full. Thank you for choosing The Menu!
        </Section>
      </div>
    </div>
  );
};

// Reusable Section Component
const Section = ({ title, children }: { title: any; children: any }) => (
  <div className="mb-6">
    <h2 className="text-2xl font-semibold mb-4">{title}</h2>
    <p className="mb-4">{children}</p>
  </div>
);

// Reusable SubSection Component with TypeScript
const SubSection = ({ title, children }: { title: any; children: any }) => (
  <div className="mb-4">
    <h3 className="text-xl font-semibold mb-2">{title}</h3>
    <p className="mb-4">{children}</p>
  </div>
);

export default GeneralTermPdf;