import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'

export default function TermsOfServicePage() {
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
              Terms of <span className="text-red-500 italic">Service</span>
            </h1>
          </div>
        </section>

        {/* Content Section */}
        <section className="py-16 sm:py-20 lg:py-24 px-4 sm:px-6 lg:px-8 bg-background-light">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-3xl shadow-xl p-8 lg:p-12 border border-slate-100">
              <div className="prose prose-lg max-w-none text-slate-700">
                <p className="text-sm text-slate-500 mb-8">Last updated: {new Date().toLocaleDateString()}</p>

                <h2 className="text-2xl font-bold text-slate-800 mb-6">1. Acceptance of Terms</h2>
                <p className="mb-6">
                  By accessing and using DearHolly's website and services, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
                </p>

                <h2 className="text-2xl font-bold text-slate-800 mb-6">2. Use License</h2>
                <p className="mb-6">
                  Permission is granted to temporarily download one copy of the materials on DearHolly's website for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:
                </p>
                <ul className="list-disc pl-6 mb-6 space-y-2">
                  <li>modify or copy the materials</li>
                  <li>use the materials for any commercial purpose or for any public display</li>
                  <li>attempt to reverse engineer any software contained on DearHolly's website</li>
                  <li>remove any copyright or other proprietary notations from the materials</li>
                </ul>

                <h2 className="text-2xl font-bold text-slate-800 mb-6">3. Products and Services</h2>
                <p className="mb-6">
                  All products and services are subject to availability. We reserve the right to discontinue any product or service at any time. Prices for our products are subject to change without notice.
                </p>
                <p className="mb-6">
                  We have made every effort to display as accurately as possible the colors and images of our products. We cannot guarantee that your computer monitor's display of any color will be accurate.
                </p>

                <h2 className="text-2xl font-bold text-slate-800 mb-6">4. Billing and Account Information</h2>
                <p className="mb-6">
                  You agree to provide current, complete, and accurate purchase and account information for all purchases made at our store. You agree to promptly update your account and other information, including your email address and credit card numbers and expiration dates, so that we can complete your transactions and contact you as needed.
                </p>

                <h2 className="text-2xl font-bold text-slate-800 mb-6">5. Returns and Refunds</h2>
                <p className="mb-6">
                  We offer a 30-day return policy for unworn items in their original packaging. Custom orders and sale items are final sale. Return shipping costs are the responsibility of the customer unless the item was defective.
                </p>

                <h2 className="text-2xl font-bold text-slate-800 mb-6">6. Prohibited Uses</h2>
                <p className="mb-6">
                  You may not use our products or services:
                </p>
                <ul className="list-disc pl-6 mb-6 space-y-2">
                  <li>For any unlawful purpose or to solicit others to perform unlawful acts</li>
                  <li>To violate any international, federal, provincial, or state regulations, rules, laws, or local ordinances</li>
                  <li>To infringe upon or violate our intellectual property rights or the intellectual property rights of others</li>
                  <li>To harass, abuse, insult, harm, defame, slander, disparage, intimidate, or discriminate</li>
                  <li>To submit false or misleading information</li>
                </ul>

                <h2 className="text-2xl font-bold text-slate-800 mb-6">7. Intellectual Property Rights</h2>
                <p className="mb-6">
                  The DearHolly name, logo, and all related names, logos, product and service names, designs, and slogans are trademarks of DearHolly or its affiliates or licensors. You must not use such marks without our prior written permission.
                </p>

                <h2 className="text-2xl font-bold text-slate-800 mb-6">8. Disclaimer</h2>
                <p className="mb-6">
                  The information on this website is provided on an 'as is' basis. To the fullest extent permitted by law, DearHolly excludes all representations, warranties, conditions, and terms whether express or implied, statutory or otherwise.
                </p>

                <h2 className="text-2xl font-bold text-slate-800 mb-6">9. Limitations</h2>
                <p className="mb-6">
                  In no event shall DearHolly or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on DearHolly's website.
                </p>

                <h2 className="text-2xl font-bold text-slate-800 mb-6">10. Accuracy of Materials</h2>
                <p className="mb-6">
                  The materials appearing on DearHolly's website could include technical, typographical, or photographic errors. DearHolly does not warrant that any of the materials on its website are accurate, complete, or current.
                </p>

                <h2 className="text-2xl font-bold text-slate-800 mb-6">11. Modifications</h2>
                <p className="mb-6">
                  DearHolly may revise these terms of service at any time without notice. By using this website, you are agreeing to be bound by the then current version of these terms of service.
                </p>

                <h2 className="text-2xl font-bold text-slate-800 mb-6">12. Governing Law</h2>
                <p className="mb-6">
                  These terms and conditions are governed by and construed in accordance with the laws of France, and you irrevocably submit to the exclusive jurisdiction of the courts in that state or location.
                </p>

                <h2 className="text-2xl font-bold text-slate-800 mb-6">13. Contact Information</h2>
                <p className="mb-6">
                  If you have any questions about these Terms of Service, please contact us at:
                </p>
                <div className="bg-slate-50 p-6 rounded-lg">
                  <p className="font-medium">DearHolly</p>
                  <p>123 Fashion Street</p>
                  <p>Paris, France 75001</p>
                  <p>Email: legal@dearholly.com</p>
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