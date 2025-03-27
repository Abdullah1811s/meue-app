
const FAQPage = () => {
    // Prevent copying
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
                <h1 className="text-2xl font-bold text-center mb-6">Frequently Asked Questions (FAQ)</h1>

                <p className="mb-4">Welcome to The Menu's FAQ section. Here, we answer common questions to enhance your experience with us. If you have a question that isn't covered here, please feel free to reach out to our support team.</p>

                <h2 className="text-xl font-bold mt-6">1. General Membership Questions</h2>

                <h3 className="text-lg font-bold mt-4">1.1. What is The Menu?</h3>
                <p className="ml-4">The Menu is a South African-based lifestyle rewards platform offering exclusive discounts, promotions, and competitions through tiered memberships and flexible one-time passes.</p>

                <h3 className="text-lg font-bold mt-4">1.2. How do I become a member?</h3>
                <p className="ml-4">Visit the <span className="font-bold">Membership Page</span>  on our website and select a membership tier or once-off pass that suits your needs. Complete the sign-up process and payment to activate your membership.</p>

                <h3 className="text-lg font-bold mt-4">1.3. What are the membership tiers and once-off pass options and their benefits?</h3>
                <p className="ml-4">We offer the following membership tiers and once-off pass options:</p>



                <div className="ml-4 mt-4 overflow-x-auto">
                    <div className="inline-block min-w-full align-middle">
                        <div className="overflow-hidden">
                            <table className="min-w-full border-collapse border border-gray-500 text-sm">
                                <thead>
                                    <tr className="bg-gray-100">
                                        <th className="border border-gray-500 p-1 text-left">Membership tiers</th>
                                        <th className="border border-gray-500 p-1 text-left">Cost (Rands)</th>
                                        <th className="border border-gray-500 p-1 text-left">Vendor database</th>
                                        <th className="border border-gray-500 p-1 text-left"># Bonus competition entries</th>
                                        <th className="border border-gray-500 p-1 text-left">Number of competition accessible</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr className="font-bold bg-gray-100">
                                        <td className="border border-gray-500 p-1" colSpan={5}>Subscription based (monthly, anytime cancellation)</td>
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
                                        <td className="border border-gray-500 p-1" colSpan={5}>Once off pass (non refundable)</td>
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
                    </div>
                </div>




                <div className="ml-8 mt-2">
                    <p className="font-bold">Springbok Membership (R150/month):</p>
                    <ul className="ml-8 list-disc">
                        <li>Access to 40% of the vendor database.</li>
                        <li>1 automatic entry per draw into monthly competitions.</li>
                    </ul>

                    <p className="font-bold mt-2">Leopard Membership (R300/month):</p>
                    <ul className="ml-8 list-disc">
                        <li>Access to 70% of the vendor database.</li>
                        <li>5 automatic entries per draw into monthly competitions.</li>
                        <li>Early access to new deals.</li>
                    </ul>

                    <p className="font-bold mt-2">Lion Membership (R500/month):</p>
                    <ul className="ml-8 list-disc">
                        <li>Access to 100% of the vendor database.</li>
                        <li>10 automatic entries per draw into monthly competitions.</li>
                        <li>Exclusive event invitations.</li>
                        <li>Exclusive/early access to bespoke products.</li>
                        <li>Premium customer support.</li>
                    </ul>

                    <p className="font-bold mt-2">Once-off Pass Options:</p>
                    <ul className="ml-8 list-disc">
                        <li>1 Hour Access (Monday to Thursday): 1 entry into competitions.</li>
                        <li>24 Hour Access (Weekday or Weekend): 5 entries into competitions.</li>
                        <li>3 Day Access (Weekday or Weekend): 10 entries into competitions.</li>
                        <li>Weekly (7 Days), Monthly (28-31 Days), 3 Months, 6 Months, and Yearly (365 Days) passes also available.</li>
                    </ul>
                </div>
                <h3 className="text-lg font-bold mt-4">1.4. Can I upgrade or downgrade my membership?</h3>
                <ul className="ml-8 list-disc">
                    <li>Yes, you can upgrade or downgrade your membership at any time from your <span className="font-bold">Member Dashboard</span> , which will take effect in the new calendar month.</li>
                    <li>Yes, you can cancel your membership at any time through the <span className="font-bold">Member Dashboard</span>. Your benefits will remain active until the end of your current billing cycle.</li>
                </ul>

                <h2 className="text-xl font-bold mt-6">2. Competitions and Rewards</h2>

                <h3 className="text-lg font-bold mt-4">2.1. How do I enter competitions?</h3>
                <p className="ml-4">Competition entries are automatic based on your membership tier or once-off pass:</p>
                <ul className="ml-8 list-disc">
                    <li>Springbok: 1 entry per draw/month.</li>
                    <li>Leopard: 5 entries per draw/month.</li>
                    <li>Lion: 10 entries per draw/month.</li>
                    <li>Once-off Passes: Entries depend on the pass type (e.g., 1-Hour Pass = 1 entry).</li>
                </ul>

                <h3 className="text-lg font-bold mt-4">2.2. How are winners selected?</h3>
                <p className="ml-4">Winners are selected via a random draw, supervised by an independent auditor to ensure fairness.</p>

                <h3 className="text-lg font-bold mt-4">2.3. How will I know if I've won a competition?</h3>
                <p className="ml-4">Winners are notified via email and announced on the Competitions Page and our social media channels.</p>
            </div>
            <h3 className="text-lg font-bold mt-4">2.4. Can I enter competitions without a membership?</h3>
            <p className="ml-4">No, competitions are accessible only as a benefit to monthly subscription members or those with valid once-off passes.</p>

            <h2 className="text-xl font-bold mt-6">3. Partner and Vendor Information</h2>

            <h3 className="text-lg font-bold mt-4">3.1. How can I register as a partner or vendor?</h3>
            <p className="ml-4">Visit the <span className="font-bold">Become a Partner</span> page, complete the registration form, and submit your business details. Our team will review your application and notify you upon approval.</p>

            <h3 className="text-lg font-bold mt-4">3.2. What are the benefits of partnering with The Menu?</h3>
            <ul className="ml-8 list-disc">
                <li>Access to a broad customer base.</li>
                <li>Increased visibility and promotional opportunities.</li>
                <li>Flexible advertising options and participation in competitions.</li>
            </ul>

            <h3 className="text-lg font-bold mt-4">3.3. How do I create and manage coupons?</h3>
            <ul className="ml-8 list-disc">
                <li>Vendors who can create their own coupons can upload them via the <span className="font-bold">Vendor Dashboard</span>.</li>
                <li>For vendors who need assistance, The Menu team can generate coupons on your behalf.</li>
                <li>Bulk coupon uploads are available via CSV format.</li>
            </ul>

            <h2 className="text-xl font-bold mt-6">4. Payment and Billing</h2>

            <h3 className="text-lg font-bold mt-4">4.1. What payment methods do you accept?</h3>
            <p className="ml-4">We accept payments through secure payment gateways.</p>

            <h3 className="text-lg font-bold mt-4">4.2. How does billing work?</h3>
            <ul className="ml-8 list-disc">
                <li>Billing is monthly for membership subscriptions or a one-time payment for one-time passes.</li>
                <li>Subscriptions automatically renew unless cancelled.</li>
            </ul>

            <h3 className="text-lg font-bold mt-4">4.3. What happens if my payment fails?</h3>
            <p className="ml-4">If a payment fails, you will be notified via email. Please ensure that your payment details are kept up to date in your <span className="font-bold">Member Dashboard</span>.</p>

            <h2 className="text-xl font-bold mt-6">5. Technical Support</h2>

            <h3 className="text-lg font-bold mt-4">5.1. What if I have trouble logging in?</h3>
            <p className="ml-4">Use the <span className="font-bold">Forgot Password</span> option on the login page to reset your password. If issues persist, contact us at <a href="mailto:support@themenuportal.co.za" className="text-blue-500">support@themenuportal.co.za</a>.</p>

            <h3 className="text-lg font-bold mt-4">5.2. How do I update my personal details?</h3>
            <p className="ml-4">Log in to your <span className="font-bold">Member Dashboard</span> and navigate to <span className="font-bold">Account Settings</span> to update your information.</p>

            <h3 className="text-lg font-bold mt-4">5.3. Who can I contact for assistance?</h3>
            <p className="ml-4">For any assistance, please contact:</p>
            <ul className="ml-8 list-disc">
                <li>Email: <a href="mailto:support@themenuportal.co.za" className="text-blue-500">support@themenuportal.co.za</a></li>
            </ul>
        </div>

    );
};

export default FAQPage;