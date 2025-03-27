import React from 'react';

// Reusable Section Component
const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <div className="mb-6">
        <h2 className="text-2xl font-semibold mb-4">{title}</h2>
        <p className="mb-4">{children}</p>
    </div>
);

// Reusable SubSection Component
const SubSection = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <div className="mb-4">
        <h3 className="text-xl font-semibold mb-2">{title}</h3>
        <p className="mb-4">{children}</p>
    </div>
);

// Partner Program Terms and Conditions Component
const PartnerProgramTerms = () => {
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
                <h1 className="text-3xl font-bold mb-6 text-center">Partner Program Terms and Conditions</h1>

                {/* Section 1: Introduction */}
                <Section title="1. Introduction">
                    Welcome to The Menu Partner Program ("we," "us," or "our"). These Partner Program Terms and Conditions ("Terms") govern the relationship between The Menu and any business or individual ("Partner") who registers to list products, services, discounts, and promotions on our Platform. By joining the Partner Program, and using the site and/or the services, you signify your acceptance of and agreement to these terms and conditions, including any amendments that we make from time to time. If you do not agree, you may not participate in the Partner Program.
                </Section>

                {/* Section 2: Definitions */}
                <Section title="2. Definitions">
                    • <strong>Partner</strong>: A business or individual registered with The Menu to offer products, services, or discounts. <br />
                    • <strong>Supplier</strong>: The Menu, operated by The Menuportal (Pty) Ltd. <br />
                    • <strong>User/Member</strong>: Individuals accessing the Platform, including those with memberships or Day Passes. <br />
                    • <strong>Platform</strong>: The Menu software, website, and associated services. <br />
                    • <strong>Offers/Discounts</strong>: Promotions, vouchers, or deals listed by Partners. <br />
                    • <strong>Vendor Dashboard</strong>: The portal used by Partners to manage their listings and coupons.
                </Section>

                {/* Section 3: Registration and Approval */}
                <Section title="3. Registration and Approval">
                    <SubSection title="3.1 Registration Requirements">
                        To join the Partner Program, you must: <br />
                        1. Complete the Partner Registration Form on <a  href='https://themenuportal.co.za/'  target='_blank' className='text-blue-500 underline'>www.themenuportal.co.za</a>. <br />
                        2. Provide accurate business information, including: <br />
                        &nbsp;&nbsp;&nbsp;&nbsp;• Business name <br />
                        &nbsp;&nbsp;&nbsp;&nbsp;• Contact person <br />
                        &nbsp;&nbsp;&nbsp;&nbsp;• Email and phone number <br />
                        &nbsp;&nbsp;&nbsp;&nbsp;• Business address <br />
                        &nbsp;&nbsp;&nbsp;&nbsp;• Type of products/services offered <br />
                        &nbsp;&nbsp;&nbsp;&nbsp;• Business registration documentation/CIPC Documents <br />
                        &nbsp;&nbsp;&nbsp;&nbsp;• VAT Vendor Certificate <br />
                        &nbsp;&nbsp;&nbsp;&nbsp;• FICA Documents (e.g., proof of identity, proof of address, and other required identification documents). <br />
                        3. Submit any required documentation for verification.
                    </SubSection>

                    <SubSection title="3.2 Approval Process">
                        • All registrations are subject to approval by The Menu. <br />
                        • We reserve the right to approve, deny, or revoke Partner status at our discretion. <br />
                        • Partners will be notified via email once their application is approved.
                    </SubSection>
                </Section>

                {/* Section 4: Partner Obligations */}
                <Section title="4. Partner Obligations">
                    By participating in the Partner Program, you agree to: <br />
                    • <strong>Compliance</strong>: Ensure all offers and activities comply with South African laws, including the Consumer Protection Act (CPA), the Electronic Communications and Transactions Act (ECTA), and the Protection of Personal Information Act (POPI). <br />
                    • <strong>Accuracy</strong>: Provide accurate and up-to-date descriptions of products, services, and offers. <br />
                    • <strong>Exclusivity</strong>: Offer exclusive discounts or promotions not available on other platforms. <br />
                    • <strong>Professionalism</strong>: Maintain high standards of customer service and quality. <br />
                    • <strong>Updates</strong>: Inform The Menu of any changes to your business information or offers.
                </Section>

                {/* Section 5: Offers and Discounts */}
                <Section title="5. Offers and Discounts">
                    <SubSection title="5.1 Types of Offers">
                        Partners can provide: <br />
                        • Percentage Discounts (e.g., 10% off) <br />
                        • Fixed-Amount Discounts (e.g., R100 off) <br />
                        • Buy-One-Get-One (BOGO) Offers <br />
                        • Exclusive Promotions for Members and Day Pass holders
                    </SubSection>

                    <SubSection title="5.2 Coupon Management">
                        • Partners can create and manage coupons via the Vendor Dashboard. <br />
                        • <strong>CSV Bulk Upload</strong>: For mass uploads, Partners can use a CSV file template provided by The Menu. <br />
                        • Partners who cannot generate coupons can request assistance from The Menu.
                    </SubSection>

                    <SubSection title="5.3 Restrictions on Offers">
                        • Offers must be genuine and not misleading. <br />
                        • No false advertising or bait-and-switch practices. <br />
                        • Offers must not violate any laws or third-party rights.
                    </SubSection>
                </Section>

                {/* Section 6: Advertising and Promotions */}
                <Section title="6. Advertising and Promotions">
                    <SubSection title="6.1 Advertising Banners">
                        • Partners can purchase advertising space on The Menu. <br />
                        • Advertisements must comply with our content guidelines and South African advertising standards.
                    </SubSection>

                    <SubSection title="6.2 Promotional Campaigns">
                        • The Menu may feature selected Partners in promotional campaigns. <br />
                        • Participation is subject to mutual agreement and terms.
                    </SubSection>
                </Section>

                {/* Section 7: Payments and Fees */}
                <Section title="7. Payments and Fees">
                    <SubSection title="7.1 Payment Terms">
                        • Partners agree to pay any applicable fees for advertising or premium listings. <br />
                        • Payments are processed via secure payment gateways.
                    </SubSection>
                </Section>

                {/* Section 8: Intellectual Property */}
                <Section title="8. Intellectual Property">
                    • Partners grant The Menu a non-exclusive, royalty-free license to use their logos, images, and content for promotional purposes. <br />
                    • Partners must ensure they have the right to use and share all content provided.
                </Section>

                {/* Section 9: Confidentiality */}
                <Section title="9. Confidentiality">
                    • Both parties agree to keep confidential any proprietary information exchanged during the partnership. <br />
                    • Confidentiality obligations survive termination of the partnership.
                </Section>

                {/* Section 10: Termination */}
                <Section title="10. Termination">
                    <SubSection title="10.1 Termination by The Menu">
                        We may terminate a Partner’s participation if: <br />
                        • The Partner breaches these Terms. <br />
                        • The Partner engages in fraudulent or unethical practices. <br />
                        • The Partner fails to comply with legal obligations.
                    </SubSection>

                    <SubSection title="10.2 Termination by Partner">
                        • Partners may terminate their participation by providing 30 days’ written notice.
                    </SubSection>
                </Section>

                {/* Section 11: Limitation of Liability */}
                <Section title="11. Limitation of Liability">
                    • The Menu is not liable for indirect, incidental, or consequential damages arising from the Partner Program. <br />
                    • The Partner absolves and holds The Menu harmless against any user, customer, and/or third-party claim arising from any cause whatsoever.
                </Section>

                {/* Section 12: Governing Law */}
                <Section title="12. Governing Law">
                    These Terms are governed by the laws of South Africa. Disputes shall be resolved in South African courts.
                </Section>

                {/* Section 13: Contact Information */}
                <Section title="13. Contact Information">
                    For questions about these Terms, contact us at: <br />
                    • <strong>Email</strong>: <a href='mailto:partners@themenuportal.co.za' target='_blank'  className='text-blue-500 underline'>partners@themenuportal.co.za</a>
                </Section>
            </div>
        </div>
    );
};

export default PartnerProgramTerms;