import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'

export default function PrivacyPolicyPage() {
  return (
    <>
      <Navbar />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative h-[30vh] flex items-center justify-center overflow-hidden bg-linear-to-br from-slate-900 via-slate-800 to-slate-900">
          <div className="absolute inset-0 z-0">
            <div className="absolute inset-0 bg-linear-to-b from-transparent via-slate-900/60 to-slate-900/80 z-10"></div>
          </div>
          <div className="relative z-20 text-center px-4 max-w-4xl animate-fade-in">
            <h1 className="text-white text-4xl sm:text-5xl md:text-6xl font-black mb-4 leading-[0.9] tracking-tighter animate-slide-up">
              Privacy <span className="text-red-500 italic">Policy</span>
            </h1>
          </div>
        </section>

        {/* Content Section */}
        <section className="py-16 sm:py-20 lg:py-24 px-4 sm:px-6 lg:px-8 bg-background-light">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-3xl shadow-xl p-8 lg:p-12 border border-slate-100">
              <div className="prose prose-lg max-w-none text-slate-700">
                <p className="text-sm text-slate-500 mb-8">Last updated: {new Date().toLocaleDateString()}</p>

                <h2 className="text-2xl font-bold text-slate-800 mb-6">1. Information We Collect</h2>
                <p className="mb-6">
                  We collect information you provide directly to us, such as when you create an account, make a purchase, subscribe to our newsletter, or contact us for support.
                </p>
                <p className="mb-6">
                  This may include:
                </p>
                <ul className="list-disc pl-6 mb-6 space-y-2">
                  <li>Name, email address, and contact information</li>
                  <li>Billing and shipping addresses</li>
                  <li>Payment information (processed securely by third-party providers)</li>
                  <li>Order history and preferences</li>
                  <li>Communications with us</li>
                </ul>

                <h2 className="text-2xl font-bold text-slate-800 mb-6">2. How We Use Your Information</h2>
                <p className="mb-6">
                  We use the information we collect to:
                </p>
                <ul className="list-disc pl-6 mb-6 space-y-2">
                  <li>Process and fulfill your orders</li>
                  <li>Provide customer service and support</li>
                  <li>Send you important updates about your orders</li>
                  <li>Send marketing communications (with your consent)</li>
                  <li>Improve our products and services</li>
                  <li>Prevent fraud and maintain security</li>
                  <li>Comply with legal obligations</li>
                </ul>

                <h2 className="text-2xl font-bold text-slate-800 mb-6">3. Information Sharing</h2>
                <p className="mb-6">
                  We do not sell, trade, or otherwise transfer your personal information to third parties without your consent, except as described in this policy.
                </p>
                <p className="mb-6">
                  We may share your information with:
                </p>
                <ul className="list-disc pl-6 mb-6 space-y-2">
                  <li>Service providers who help us operate our business (payment processors, shipping companies, etc.)</li>
                  <li>Legal authorities when required by law</li>
                  <li>Business partners for joint marketing activities (with your consent)</li>
                </ul>

                <h2 className="text-2xl font-bold text-slate-800 mb-6">4. Cookies and Tracking</h2>
                <p className="mb-6">
                  We use cookies and similar technologies to enhance your browsing experience, analyze site traffic, and personalize content. You can control cookie settings through your browser preferences.
                </p>

                <h2 className="text-2xl font-bold text-slate-800 mb-6">5. Data Security</h2>
                <p className="mb-6">
                  We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the internet is 100% secure.
                </p>

                <h2 className="text-2xl font-bold text-slate-800 mb-6">6. Data Retention</h2>
                <p className="mb-6">
                  We retain your personal information for as long as necessary to provide our services, comply with legal obligations, resolve disputes, and enforce our agreements. Order information is typically retained for tax and accounting purposes.
                </p>

                <h2 className="text-2xl font-bold text-slate-800 mb-6">7. Your Rights</h2>
                <p className="mb-6">
                  Depending on your location, you may have the following rights regarding your personal information:
                </p>
                <ul className="list-disc pl-6 mb-6 space-y-2">
                  <li>Access: Request a copy of your personal information</li>
                  <li>Rectification: Correct inaccurate or incomplete information</li>
                  <li>Erasure: Request deletion of your personal information</li>
                  <li>Portability: Receive your data in a structured, machine-readable format</li>
                  <li>Objection: Object to processing based on legitimate interests</li>
                  <li>Restriction: Request limitation of processing</li>
                </ul>

                <h2 className="text-2xl font-bold text-slate-800 mb-6">8. International Data Transfers</h2>
                <p className="mb-6">
                  Your information may be transferred to and processed in countries other than your own. We ensure appropriate safeguards are in place to protect your information during such transfers.
                </p>

                <h2 className="text-2xl font-bold text-slate-800 mb-6">9. Children's Privacy</h2>
                <p className="mb-6">
                  Our services are not intended for children under 13. We do not knowingly collect personal information from children under 13. If we become aware that we have collected such information, we will take steps to delete it.
                </p>

                <h2 className="text-2xl font-bold text-slate-800 mb-6">10. Third-Party Links</h2>
                <p className="mb-6">
                  Our website may contain links to third-party websites. We are not responsible for the privacy practices or content of these external sites. We encourage you to review the privacy policies of any third-party sites you visit.
                </p>

                <h2 className="text-2xl font-bold text-slate-800 mb-6">11. Changes to This Policy</h2>
                <p className="mb-6">
                  We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new policy on this page and updating the "Last updated" date.
                </p>

                <h2 className="text-2xl font-bold text-slate-800 mb-6">12. Contact Us</h2>
                <p className="mb-6">
                  If you have any questions about this Privacy Policy or our data practices, please contact us:
                </p>
                <div className="bg-slate-50 p-6 rounded-lg">
                  <p className="font-medium">DearHolly Privacy Team</p>
                  <p>123 Fashion Street</p>
                  <p>Paris, France 75001</p>
                  <p>Email: privacy@dearholly.com</p>
                  <p>Phone: +33 1 23 45 67 89</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer variant="default" />
    </>
  )
}