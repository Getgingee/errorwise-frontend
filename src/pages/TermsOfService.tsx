import { Link } from 'react-router-dom';
import { useThemeStore } from '../store/themeStore';

export const TermsOfService = () => {
  const { theme } = useThemeStore();
  const isDark = theme === 'dark';

  return (
    <div className={`min-h-screen ${isDark ? 'bg-gray-900 text-gray-100' : 'bg-gray-50 text-gray-900'}`}>
      {/* Header */}
      <header className={`${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border-b`}>
        <div className="max-w-4xl mx-auto px-4 py-6">
          <Link to="/" className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium">
            ← Back to Home
          </Link>
          <h1 className="text-3xl font-bold mt-4">Terms of Service</h1>
          <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'} mt-2`}>
            Last Updated: November 11, 2025
          </p>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-4xl mx-auto px-4 py-12">
        <div className={`${isDark ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-sm p-8 space-y-8`}>
          
          {/* Introduction */}
          <section>
            <h2 className="text-2xl font-bold mb-4">1. Agreement to Terms</h2>
            <p className={`${isDark ? 'text-gray-300' : 'text-gray-700'} leading-relaxed`}>
              By accessing or using ErrorWise ("Service"), you agree to be bound by these Terms of Service ("Terms"). 
              If you disagree with any part of these terms, you may not access the Service.
            </p>
            <div className={`mt-4 p-4 ${isDark ? 'bg-blue-900/30 border-blue-700' : 'bg-blue-50 border-blue-200'} border rounded-lg`}>
              <p className={`${isDark ? 'text-blue-300' : 'text-blue-800'} text-sm`}>
                <strong>Important:</strong> These terms constitute a legally binding agreement between you and ErrorWise.
                Please read them carefully before using our service.
              </p>
            </div>
          </section>

          {/* Account Terms */}
          <section>
            <h2 className="text-2xl font-bold mb-4">2. Account Terms</h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-xl font-semibold mb-2">2.1 Account Creation</h3>
                <ul className={`${isDark ? 'text-gray-300' : 'text-gray-700'} list-disc list-inside space-y-2`}>
                  <li>You must be at least 18 years old to create an account</li>
                  <li>You must provide accurate and complete information during registration</li>
                  <li>You are responsible for maintaining the security of your account and password</li>
                  <li>You must not share your account credentials with others</li>
                  <li>You are responsible for all activities under your account</li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-xl font-semibold mb-2">2.2 Account Responsibilities</h3>
                <ul className={`${isDark ? 'text-gray-300' : 'text-gray-700'} list-disc list-inside space-y-2`}>
                  <li>Notify us immediately of any unauthorized use of your account</li>
                  <li>Keep your email address current and verified</li>
                  <li>Do not create accounts using automated methods or false information</li>
                  <li>One person or legal entity may maintain only one free account</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Service Usage */}
          <section>
            <h2 className="text-2xl font-bold mb-4">3. Acceptable Use</h2>
            <div className="space-y-4">
              <p className={`${isDark ? 'text-gray-300' : 'text-gray-700'} leading-relaxed`}>
                You agree not to misuse the ErrorWise service. For example, you must not:
              </p>
              <ul className={`${isDark ? 'text-gray-300' : 'text-gray-700'} list-disc list-inside space-y-2`}>
                <li>Use the service for any illegal or unauthorized purpose</li>
                <li>Attempt to access, tamper with, or use non-public areas of the service</li>
                <li>Probe, scan, or test the vulnerability of any system or network</li>
                <li>Interfere with or disrupt the service or servers/networks connected to the service</li>
                <li>Use automated systems (bots, scrapers) without our express written consent</li>
                <li>Send spam, malware, or any malicious code through the service</li>
                <li>Reverse engineer or decompile any aspect of the service</li>
                <li>Share, resell, or redistribute the AI analysis results for commercial purposes</li>
              </ul>
            </div>
          </section>

          {/* Subscription Plans */}
          <section>
            <h2 className="text-2xl font-bold mb-4">4. Subscription Plans & Billing</h2>
            
            <div className="space-y-4">
              <div>
                <h3 className="text-xl font-semibold mb-2">4.1 Plan Tiers</h3>
                <ul className={`${isDark ? 'text-gray-300' : 'text-gray-700'} space-y-3`}>
                  <li>
                    <strong>Free Plan:</strong> Limited error analyses per month, basic AI model
                  </li>
                  <li>
                    <strong>Pro Plan ($3/month):</strong> Unlimited analyses, advanced AI models, priority support
                  </li>
                  <li>
                    <strong>Team Plan ($8/month):</strong> All Pro features plus team collaboration, video chat, premium AI models
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-2">4.2 Billing Terms</h3>
                <ul className={`${isDark ? 'text-gray-300' : 'text-gray-700'} list-disc list-inside space-y-2`}>
                  <li>Subscriptions are billed monthly in advance</li>
                  <li>All fees are in USD unless otherwise stated</li>
                  <li>Fees are non-refundable except as required by law</li>
                  <li>You authorize us to charge your payment method on a recurring basis</li>
                  <li>Price changes will be notified 30 days in advance</li>
                  <li>Failed payments may result in service suspension</li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-2">4.3 Cancellation</h3>
                <p className={`${isDark ? 'text-gray-300' : 'text-gray-700'} leading-relaxed`}>
                  You may cancel your subscription at any time from your account settings. Cancellation will take effect 
                  at the end of your current billing period. You will retain access to paid features until that time. 
                  No refunds will be provided for partial months.
                </p>
              </div>
            </div>
          </section>

          {/* Intellectual Property */}
          <section>
            <h2 className="text-2xl font-bold mb-4">5. Intellectual Property Rights</h2>
            
            <div className="space-y-4">
              <div>
                <h3 className="text-xl font-semibold mb-2">5.1 Your Content</h3>
                <p className={`${isDark ? 'text-gray-300' : 'text-gray-700'} leading-relaxed`}>
                  You retain all rights to the error messages, code snippets, and other content you submit to ErrorWise. 
                  By using our service, you grant us a limited license to process and analyze your content solely for 
                  the purpose of providing the service.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-2">5.2 Our Content</h3>
                <p className={`${isDark ? 'text-gray-300' : 'text-gray-700'} leading-relaxed`}>
                  ErrorWise and its original content (excluding user content), features, and functionality are owned by 
                  ErrorWise and are protected by international copyright, trademark, and other intellectual property laws.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-2">5.3 AI-Generated Content</h3>
                <p className={`${isDark ? 'text-gray-300' : 'text-gray-700'} leading-relaxed`}>
                  The AI-generated analyses, solutions, and recommendations are provided "as is" for your personal use. 
                  You may use this content in your development work, but you may not resell or redistribute the AI 
                  analyses as a standalone service.
                </p>
              </div>
            </div>
          </section>

          {/* Limitations of Liability */}
          <section>
            <h2 className="text-2xl font-bold mb-4">6. Limitation of Liability</h2>
            <div className={`p-4 ${isDark ? 'bg-yellow-900/30 border-yellow-700' : 'bg-yellow-50 border-yellow-200'} border rounded-lg`}>
              <p className={`${isDark ? 'text-yellow-300' : 'text-yellow-800'} font-semibold mb-2`}>
                IMPORTANT LEGAL NOTICE
              </p>
              <div className={`${isDark ? 'text-yellow-200' : 'text-yellow-900'} space-y-2 text-sm`}>
                <p>
                  TO THE MAXIMUM EXTENT PERMITTED BY LAW, ERRORWISE SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, 
                  SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, OR ANY LOSS OF PROFITS OR REVENUES, WHETHER INCURRED 
                  DIRECTLY OR INDIRECTLY, OR ANY LOSS OF DATA, USE, GOODWILL, OR OTHER INTANGIBLE LOSSES.
                </p>
                <p>
                  THE AI-GENERATED SOLUTIONS ARE PROVIDED AS SUGGESTIONS ONLY. YOU ARE RESPONSIBLE FOR TESTING AND 
                  VALIDATING ANY CODE OR SOLUTIONS BEFORE IMPLEMENTATION IN PRODUCTION ENVIRONMENTS.
                </p>
              </div>
            </div>
          </section>

          {/* Termination */}
          <section>
            <h2 className="text-2xl font-bold mb-4">7. Termination</h2>
            <div className="space-y-4">
              <p className={`${isDark ? 'text-gray-300' : 'text-gray-700'} leading-relaxed`}>
                We may terminate or suspend your account and access to the service immediately, without prior notice, 
                for conduct that we believe:
              </p>
              <ul className={`${isDark ? 'text-gray-300' : 'text-gray-700'} list-disc list-inside space-y-2`}>
                <li>Violates these Terms of Service</li>
                <li>Violates applicable laws or regulations</li>
                <li>Could harm our service, users, or third parties</li>
                <li>Involves fraudulent or illegal activities</li>
              </ul>
              <p className={`${isDark ? 'text-gray-300' : 'text-gray-700'} leading-relaxed mt-4`}>
                Upon termination, your right to use the service will cease immediately. We may delete your data 
                after 30 days of account termination.
              </p>
            </div>
          </section>

          {/* Changes to Terms */}
          <section>
            <h2 className="text-2xl font-bold mb-4">8. Changes to Terms</h2>
            <p className={`${isDark ? 'text-gray-300' : 'text-gray-700'} leading-relaxed`}>
              We reserve the right to modify these terms at any time. We will notify you of material changes via 
              email or through the service. Your continued use of the service after such changes constitutes your 
              acceptance of the new terms.
            </p>
          </section>

          {/* Governing Law */}
          <section>
            <h2 className="text-2xl font-bold mb-4">9. Governing Law</h2>
            <p className={`${isDark ? 'text-gray-300' : 'text-gray-700'} leading-relaxed`}>
              These Terms shall be governed by and construed in accordance with the laws of the United States, 
              without regard to its conflict of law provisions. Any disputes arising from these terms or the service 
              shall be resolved through binding arbitration.
            </p>
          </section>

          {/* Contact */}
          <section>
            <h2 className="text-2xl font-bold mb-4">10. Contact Information</h2>
            <p className={`${isDark ? 'text-gray-300' : 'text-gray-700'} leading-relaxed`}>
              If you have any questions about these Terms, please contact us at:
            </p>
            <div className={`mt-4 p-4 ${isDark ? 'bg-gray-700' : 'bg-gray-100'} rounded-lg`}>
              <p className={`${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                <strong>Email:</strong> legal@errorwise.tech<br />
                <strong>Website:</strong> https://www.errorwise.tech<br />
                <strong>Support:</strong> support@errorwise.tech
              </p>
            </div>
          </section>

          {/* Acceptance */}
          <section className={`mt-8 p-6 ${isDark ? 'bg-blue-900/30 border-blue-700' : 'bg-blue-50 border-blue-200'} border rounded-lg`}>
            <h3 className="text-xl font-bold mb-3">Acceptance of Terms</h3>
            <p className={`${isDark ? 'text-blue-300' : 'text-blue-900'}`}>
              By clicking "I Agree" during registration or by using ErrorWise, you acknowledge that you have read, 
              understood, and agree to be bound by these Terms of Service.
            </p>
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className={`${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border-t mt-12`}>
        <div className="max-w-4xl mx-auto px-4 py-6 text-center">
          <div className="flex justify-center space-x-6">
            <Link to="/privacy" className="text-blue-600 hover:text-blue-700">
              Privacy Policy
            </Link>
            <Link to="/" className="text-blue-600 hover:text-blue-700">
              Home
            </Link>
            <a href="mailto:legal@errorwise.tech" className="text-blue-600 hover:text-blue-700">
              Contact Legal
            </a>
          </div>
          <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'} text-sm mt-4`}>
            © 2025 ErrorWise. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default TermsOfService;
