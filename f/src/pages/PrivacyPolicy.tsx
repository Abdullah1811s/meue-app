const PrivacyPolicy = () => {
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
                <h1 className="text-2xl font-bold text-center mb-6">Privacy Policy</h1>

                <p className="ml-4">
                    At <b>The Menu</b>, your privacy is important to us. This Privacy Policy explains how we collect, use, store, and protect your personal information. By using The Menu’s services, you agree to the terms outlined in this policy.
                </p>

                <h2 className="text-xl font-bold mt-4">1. <b>Definitions</b></h2>
                <ul className="ml-12 list-disc">
                    <li><b>"We," "Us," "Our":</b> Refers to The Menu.</li>
                    <li><b>"You," "User":</b> Refers to members, vendors, or visitors of The Menu.</li>
                    <li><b>"Personal Information":</b> Information that identifies you personally, such as name, email, phone number, or payment details.</li>
                </ul>

                <h2 className="text-xl font-bold mt-4">2. <b>Information We Collect</b></h2>
                <h3 className="text-lg font-bold ml-4">2.1 Personal Information</h3>
                <p className="ml-4">We collect the following types of personal information:</p>
                <ul className="ml-12 list-disc">
                    <li><b>Members:</b>
                        <ul className="ml-8 list-disc">
                            <li>Name</li>
                            <li>Email Address</li>
                            <li>Phone Number</li>
                            <li>Payment Details</li>
                            <li>Delivery Address</li>
                        </ul>
                    </li>
                    <li><b>Vendors/Partners:</b>
                        <ul className="ml-8 list-disc">
                            <li>Business Name</li>
                            <li>Contact Person’s Name</li>
                            <li>Email Address</li>
                            <li>Phone Number</li>
                            <li>Business Category</li>
                        </ul>
                    </li>
                </ul>

                <h3 className="text-lg font-bold ml-4">2.2 Technical Information</h3>
                <ul className="ml-12 list-disc">
                    <li>IP Address</li>
                    <li>Browser Type and Version</li>
                    <li>Device Information</li>
                    <li>Cookies and Usage Data</li>
                </ul>

                <h3 className="text-lg font-bold ml-4">2.3 Usage Data</h3>
                <ul className="ml-12 list-disc">
                    <li>Pages visited</li>
                    <li>Actions performed (e.g., purchases, competition entries)</li>
                    <li>Referrals and links clicked</li>
                </ul>

                <h2 className="text-xl font-bold mt-4">3. <b>How We Use Your Information</b></h2>
                <p className="ml-6">We use your personal information for the following purposes:</p>
                <ul className="ml-12 list-disc">
                    <li><b>Membership Management:</b> Processing subscriptions and day pass purchases, managing competition entries and rewards.</li>
                    <li><b>Vendor Relations:</b> Partner onboarding, communication, and processing vendor offers and coupons.</li>
                    <li><b>Customer Support:</b> Assisting with inquiries, technical support, and resolving complaints.</li>
                    <li><b>Marketing and Promotions:</b> Sending newsletters, updates, and promotions (with your consent), managing referral and competition programs.</li>
                    <li><b>Website Improvement:</b> Enhancing user experience based on feedback and usage data, developing new features.</li>
                    <li><b>Legal Compliance:</b> Complying with laws, preventing fraud, ensuring security.</li>
                    <h2 className="text-lg font-bold mt-4">3.7 <b>Cookies and Tracking Technologies</b></h2>
                    <h3 className="text-base font-bold ml-4">3.7.1 What Are Cookies?</h3>
                    <p className="ml-4">Cookies are small data files stored on your device to enhance your browsing experience.</p>

                    <h3 className="text-base font-bold ml-4">3.7.2 Types of Cookies We Use</h3>
                    <ul className="ml-12 list-disc">
                        <li><b>Essential Cookies:</b> Necessary for website functionality.</li>
                        <li><b>Performance Cookies:</b> Track website usage to improve performance.</li>
                        <li><b>Functional Cookies:</b> Remember your preferences and settings.</li>
                        <li><b>Advertising Cookies:</b> Display relevant advertisements based on your interests.</li>
                    </ul>

                    <h3 className="text-base font-bold ml-4">Managing Cookies</h3>
                    <p className="ml-4">
                        You can adjust your browser settings to refuse cookies. However, some website features may not function properly without cookies.
                    </p>
                </ul>




                <h2 className="text-xl font-bold mt-4">4. <b>Data Storage and Security</b></h2>
                <ul className="ml-12 list-disc">
                    <li>Your personal data is stored on secure servers in South Africa.</li>
                    <li>We use SSL encryption and comply with PCI DSS standards for payment processing.</li>
                    <li>Encryption of sensitive data, regular security audits, and access control.</li>
                    <li>We retain your information for as long as necessary to fulfill the purposes outlined in this policy or to comply with legal obligations.</li>
                </ul>

                <h2 className="text-xl font-bold mt-4">5. <b>Sharing Your Information</b></h2>
                <ul className="ml-12 list-disc">
                    <li><b>Service Providers:</b> For payment processing, email services, and technical support.</li>
                    <li><b>Legal Authorities:</b> If required by law or to protect our rights.</li>
                    <li><b>Partners/Vendors:</b> Only with your consent for promotions or offers.</li>
                </ul>

                <h2 className="text-xl font-bold mt-4">6. <b>Your Rights</b></h2>
                <p className="ml-4">Under South African law (POPIA), you have the following rights:</p>
                <ul className="ml-12 list-disc">
                    <li><b>Right to Access:</b> Request a copy of your personal data.</li>
                    <li><b>Right to Correction:</b> Correct inaccurate or incomplete data.</li>
                    <li><b>Right to Deletion:</b> Request deletion of your data under certain conditions.</li>
                    <li><b>Right to Object:</b> Object to data processing for direct marketing.</li>
                    <li><b>Right to Withdraw Consent:</b> Withdraw consent for data processing at any time.</li>
                </ul>
                <p className="ml-4">To exercise your rights, contact us at <b className='text-blue-500 underline'>privacy@themenuportal.co.za</b>.</p>

                <h2 className="text-xl font-bold mt-4">7. <b>Third-Party Links</b></h2>
                <p className="ml-4">
                    Our website may contain links to third-party sites. We are not responsible for the privacy practices of these sites. We recommend reviewing their privacy policies before providing any personal information.
                </p>

                <h2 className="text-xl font-bold mt-4">8. <b>Children’s Privacy</b></h2>
                <p className="ml-4">
                    The Menu is not intended for individuals under the age of 18. We do not knowingly collect information from children. If we discover that a minor’s data has been collected, we will delete it promptly.
                </p>

                <h2 className="text-xl font-bold mt-4">9. <b>Changes to This Privacy Policy</b></h2>
                <p className="ml-4">
                    We may update this Privacy Policy from time to time. Changes will be posted on this page with the effective date. We encourage you to review this policy periodically.
                </p>

                <h2 className="text-xl font-bold mt-4">10. <b>Contact Information</b></h2>
                <p className="ml-4">For any questions or concerns regarding this Privacy Policy, please contact:</p>
                <ul className="ml-12 list-disc">
                    <li>Email: <b className='text-blue-500 underline'>privacy@themenuportal.co.za</b></li>
                </ul>
            </div>
        </div>
    );
};

export default PrivacyPolicy;