import { Link } from 'react-router-dom';
import { useThemeStore } from '../store/themeStore';
import { Shield, Eye, Lock, Database, Users, Bell, Download, Trash2 } from 'lucide-react';

export const PrivacyPolicy = () => {
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
          <h1 className="text-3xl font-bold mt-4">Privacy Policy</h1>
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
            <div className="flex items-start space-x-3 mb-4">
              <Shield className="w-8 h-8 text-blue-600 flex-shrink-0" />
              <div>
                <h2 className="text-2xl font-bold">Your Privacy Matters</h2>
                <p className={`${isDark ? 'text-gray-300' : 'text-gray-700'} mt-2 leading-relaxed`}>
                  ErrorWise ("we", "our", or "us") is committed to protecting your privacy. This Privacy Policy explains 
                  how we collect, use, disclose, and safeguard your information when you use our error analysis service.
                </p>
              </div>
            </div>
            <div className={`mt-4 p-4 ${isDark ? 'bg-blue-900/30 border-blue-700' : 'bg-blue-50 border-blue-200'} border rounded-lg`}>
              <p className={`${isDark ? 'text-blue-300' : 'text-blue-800'} text-sm`}>
                <strong>Quick Summary:</strong> We collect minimal data necessary to provide our service. We never sell 
                your data. Your error messages and code are processed securely and deleted after 30 days.
              </p>
            </div>
          </section>

          {/* Information We Collect */}
          <section>
            <div className="flex items-start space-x-3 mb-4">
              <Database className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
              <h2 className="text-2xl font-bold">1. Information We Collect</h2>
            </div>

            <div className="space-y-6 ml-9">
              <div>
                <h3 className="text-xl font-semibold mb-3">1.1 Information You Provide</h3>
                <ul className={`${isDark ? 'text-gray-300' : 'text-gray-700'} space-y-2`}>
                  <li className="flex items-start">
                    <span className="text-blue-600 mr-2">•</span>
                    <div>
                      <strong>Account Information:</strong> Email address, password (encrypted), name (optional)
                    </div>
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-600 mr-2">•</span>
                    <div>
                      <strong>Error Data:</strong> Error messages, stack traces, code snippets you submit for analysis
                    </div>
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-600 mr-2">•</span>
                    <div>
                      <strong>Payment Information:</strong> Billing details processed securely through our payment provider (we don't store full credit card numbers)
                    </div>
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-600 mr-2">•</span>
                    <div>
                      <strong>Communications:</strong> Support messages, feedback, and correspondence with us
                    </div>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-3">1.2 Automatically Collected Information</h3>
                <ul className={`${isDark ? 'text-gray-300' : 'text-gray-700'} space-y-2`}>
                  <li className="flex items-start">
                    <span className="text-blue-600 mr-2">•</span>
                    <div>
                      <strong>Usage Data:</strong> API calls, features used, error analysis history, timestamps
                    </div>
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-600 mr-2">•</span>
                    <div>
                      <strong>Device Information:</strong> IP address, browser type, operating system, device type
                    </div>
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-600 mr-2">•</span>
                    <div>
                      <strong>Cookies:</strong> Session tokens, authentication cookies, preference settings
                    </div>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-3">1.3 Information We DON'T Collect</h3>
                <div className={`p-4 ${isDark ? 'bg-green-900/30 border-green-700' : 'bg-green-50 border-green-200'} border rounded-lg`}>
                  <ul className={`${isDark ? 'text-green-300' : 'text-green-900'} space-y-2`}>
                    <li>✓ We don't track your browsing on other websites</li>
                    <li>✓ We don't sell or share your data with advertisers</li>
                    <li>✓ We don't use your code for training AI models without permission</li>
                    <li>✓ We don't access your private repositories or systems</li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          {/* How We Use Information */}
          <section>
            <div className="flex items-start space-x-3 mb-4">
              <Eye className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
              <h2 className="text-2xl font-bold">2. How We Use Your Information</h2>
            </div>

            <div className="ml-9 space-y-4">
              <p className={`${isDark ? 'text-gray-300' : 'text-gray-700'} leading-relaxed`}>
                We use the collected information for the following purposes:
              </p>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div className={`p-4 ${isDark ? 'bg-gray-700' : 'bg-gray-50'} rounded-lg`}>
                  <h4 className="font-semibold mb-2">Service Provision</h4>
                  <ul className={`${isDark ? 'text-gray-300' : 'text-gray-600'} text-sm space-y-1`}>
                    <li>• Process error analyses with AI</li>
                    <li>• Maintain your account</li>
                    <li>• Provide customer support</li>
                    <li>• Process payments</li>
                  </ul>
                </div>

                <div className={`p-4 ${isDark ? 'bg-gray-700' : 'bg-gray-50'} rounded-lg`}>
                  <h4 className="font-semibold mb-2">Service Improvement</h4>
                  <ul className={`${isDark ? 'text-gray-300' : 'text-gray-600'} text-sm space-y-1`}>
                    <li>• Analyze usage patterns</li>
                    <li>• Improve AI accuracy</li>
                    <li>• Fix bugs and issues</li>
                    <li>• Develop new features</li>
                  </ul>
                </div>

                <div className={`p-4 ${isDark ? 'bg-gray-700' : 'bg-gray-50'} rounded-lg`}>
                  <h4 className="font-semibold mb-2">Security & Compliance</h4>
                  <ul className={`${isDark ? 'text-gray-300' : 'text-gray-600'} text-sm space-y-1`}>
                    <li>• Prevent fraud and abuse</li>
                    <li>• Enforce terms of service</li>
                    <li>• Comply with legal obligations</li>
                    <li>• Protect user security</li>
                  </ul>
                </div>

                <div className={`p-4 ${isDark ? 'bg-gray-700' : 'bg-gray-50'} rounded-lg`}>
                  <h4 className="font-semibold mb-2">Communication</h4>
                  <ul className={`${isDark ? 'text-gray-300' : 'text-gray-600'} text-sm space-y-1`}>
                    <li>• Send service updates</li>
                    <li>• Respond to inquiries</li>
                    <li>• Send security alerts</li>
                    <li>• Marketing (opt-out available)</li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          {/* Data Security */}
          <section>
            <div className="flex items-start space-x-3 mb-4">
              <Lock className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
              <h2 className="text-2xl font-bold">3. How We Protect Your Data</h2>
            </div>

            <div className="ml-9 space-y-4">
              <p className={`${isDark ? 'text-gray-300' : 'text-gray-700'} leading-relaxed`}>
                We implement industry-standard security measures to protect your information:
              </p>

              <div className="grid gap-3">
                {[
                  { icon: '🔐', title: 'Encryption', desc: 'All data transmitted using SSL/TLS encryption (HTTPS)' },
                  { icon: '🔒', title: 'Password Security', desc: 'Passwords hashed using bcrypt with salt' },
                  { icon: '🛡️', title: 'Access Control', desc: 'Role-based access control and authentication' },
                  { icon: '🔍', title: 'Monitoring', desc: 'Continuous monitoring for suspicious activities' },
                  { icon: '💾', title: 'Backups', desc: 'Regular encrypted backups of user data' },
                  { icon: '🚨', title: 'Incident Response', desc: 'Security incident response procedures in place' },
                ].map((item, idx) => (
                  <div key={idx} className={`p-3 ${isDark ? 'bg-gray-700' : 'bg-gray-50'} rounded-lg flex items-start`}>
                    <span className="text-2xl mr-3">{item.icon}</span>
                    <div>
                      <strong className="block">{item.title}</strong>
                      <span className={`${isDark ? 'text-gray-400' : 'text-gray-600'} text-sm`}>{item.desc}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Data Sharing */}
          <section>
            <div className="flex items-start space-x-3 mb-4">
              <Users className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
              <h2 className="text-2xl font-bold">4. Data Sharing & Disclosure</h2>
            </div>

            <div className="ml-9 space-y-4">
              <p className={`${isDark ? 'text-gray-300' : 'text-gray-700'} leading-relaxed`}>
                We do not sell your personal information. We may share data only in these limited circumstances:
              </p>

              <div className="space-y-3">
                <div className={`p-4 ${isDark ? 'bg-gray-700' : 'bg-gray-50'} rounded-lg`}>
                  <h4 className="font-semibold mb-2">Service Providers</h4>
                  <p className={`${isDark ? 'text-gray-300' : 'text-gray-600'} text-sm`}>
                    We use third-party services for hosting (Railway, Vercel), AI processing (Anthropic, OpenAI), 
                    and payments (Dodo Payments). These providers have access only to data necessary for their services.
                  </p>
                </div>

                <div className={`p-4 ${isDark ? 'bg-gray-700' : 'bg-gray-50'} rounded-lg`}>
                  <h4 className="font-semibold mb-2">Legal Requirements</h4>
                  <p className={`${isDark ? 'text-gray-300' : 'text-gray-600'} text-sm`}>
                    We may disclose information if required by law, court order, or to protect our rights and safety.
                  </p>
                </div>

                <div className={`p-4 ${isDark ? 'bg-gray-700' : 'bg-gray-50'} rounded-lg`}>
                  <h4 className="font-semibold mb-2">Business Transfers</h4>
                  <p className={`${isDark ? 'text-gray-300' : 'text-gray-600'} text-sm`}>
                    In the event of a merger, acquisition, or sale, your information may be transferred. We'll notify you before this happens.
                  </p>
                </div>

                <div className={`p-4 ${isDark ? 'bg-gray-700' : 'bg-gray-50'} rounded-lg`}>
                  <h4 className="font-semibold mb-2">Team Members (Team Plan)</h4>
                  <p className={`${isDark ? 'text-gray-300' : 'text-gray-600'} text-sm`}>
                    If you're on a Team plan, shared errors and analyses are visible to your team members.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Data Retention */}
          <section>
            <div className="flex items-start space-x-3 mb-4">
              <Database className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
              <h2 className="text-2xl font-bold">5. Data Retention</h2>
            </div>

            <div className="ml-9 space-y-4">
              <ul className={`${isDark ? 'text-gray-300' : 'text-gray-700'} space-y-3`}>
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2 mt-1">•</span>
                  <div>
                    <strong>Error Analyses:</strong> Stored for 30 days, then automatically deleted (unless saved to favorites)
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2 mt-1">•</span>
                  <div>
                    <strong>Account Data:</strong> Retained while your account is active
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2 mt-1">•</span>
                  <div>
                    <strong>Billing Records:</strong> Kept for 7 years for tax and legal compliance
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2 mt-1">•</span>
                  <div>
                    <strong>Deleted Accounts:</strong> Personal data deleted within 30 days of account deletion
                  </div>
                </li>
              </ul>
            </div>
          </section>

          {/* Your Rights */}
          <section>
            <div className="flex items-start space-x-3 mb-4">
              <Shield className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
              <h2 className="text-2xl font-bold">6. Your Privacy Rights</h2>
            </div>

            <div className="ml-9 space-y-4">
              <p className={`${isDark ? 'text-gray-300' : 'text-gray-700'} leading-relaxed`}>
                You have the following rights regarding your personal data:
              </p>

              <div className="grid md:grid-cols-2 gap-3">
                <div className={`p-4 ${isDark ? 'bg-blue-900/30 border-blue-700' : 'bg-blue-50 border-blue-200'} border rounded-lg`}>
                  <Download className="w-5 h-5 text-blue-600 mb-2" />
                  <h4 className="font-semibold mb-1">Access & Export</h4>
                  <p className={`${isDark ? 'text-gray-300' : 'text-gray-600'} text-sm`}>
                    Request a copy of your data in machine-readable format
                  </p>
                </div>

                <div className={`p-4 ${isDark ? 'bg-blue-900/30 border-blue-700' : 'bg-blue-50 border-blue-200'} border rounded-lg`}>
                  <Trash2 className="w-5 h-5 text-blue-600 mb-2" />
                  <h4 className="font-semibold mb-1">Deletion</h4>
                  <p className={`${isDark ? 'text-gray-300' : 'text-gray-600'} text-sm`}>
                    Request deletion of your account and personal data
                  </p>
                </div>

                <div className={`p-4 ${isDark ? 'bg-blue-900/30 border-blue-700' : 'bg-blue-50 border-blue-200'} border rounded-lg`}>
                  <Lock className="w-5 h-5 text-blue-600 mb-2" />
                  <h4 className="font-semibold mb-1">Correction</h4>
                  <p className={`${isDark ? 'text-gray-300' : 'text-gray-600'} text-sm`}>
                    Update or correct inaccurate information
                  </p>
                </div>

                <div className={`p-4 ${isDark ? 'bg-blue-900/30 border-blue-700' : 'bg-blue-50 border-blue-200'} border rounded-lg`}>
                  <Bell className="w-5 h-5 text-blue-600 mb-2" />
                  <h4 className="font-semibold mb-1">Opt-Out</h4>
                  <p className={`${isDark ? 'text-gray-300' : 'text-gray-600'} text-sm`}>
                    Unsubscribe from marketing emails (service emails still sent)
                  </p>
                </div>
              </div>

              <div className={`p-4 ${isDark ? 'bg-gray-700' : 'bg-gray-100'} rounded-lg`}>
                <p className={`${isDark ? 'text-gray-300' : 'text-gray-700'} text-sm`}>
                  <strong>To exercise your rights:</strong> Email us at privacy@errorwise.tech or use the settings in your account dashboard.
                  We'll respond within 30 days.
                </p>
              </div>
            </div>
          </section>

          {/* Cookies */}
          <section>
            <h2 className="text-2xl font-bold mb-4">7. Cookies & Tracking</h2>
            <div className="space-y-4">
              <p className={`${isDark ? 'text-gray-300' : 'text-gray-700'} leading-relaxed`}>
                We use cookies and similar technologies for:
              </p>
              <ul className={`${isDark ? 'text-gray-300' : 'text-gray-700'} list-disc list-inside space-y-2`}>
                <li><strong>Essential Cookies:</strong> Required for authentication and security (cannot be disabled)</li>
                <li><strong>Functional Cookies:</strong> Remember your preferences and settings</li>
                <li><strong>Analytics Cookies:</strong> Understand how users interact with our service (anonymous)</li>
              </ul>
              <p className={`${isDark ? 'text-gray-300' : 'text-gray-700'} text-sm`}>
                You can control cookies through your browser settings, but disabling essential cookies may affect service functionality.
              </p>
            </div>
          </section>

          {/* Children's Privacy */}
          <section>
            <h2 className="text-2xl font-bold mb-4">8. Children's Privacy</h2>
            <div className={`p-4 ${isDark ? 'bg-red-900/30 border-red-700' : 'bg-red-50 border-red-200'} border rounded-lg`}>
              <p className={`${isDark ? 'text-red-300' : 'text-red-900'}`}>
                ErrorWise is not intended for users under 18 years of age. We do not knowingly collect personal information 
                from children. If you believe a child has provided us with data, please contact us immediately at 
                privacy@errorwise.tech, and we will delete it.
              </p>
            </div>
          </section>

          {/* International Users */}
          <section>
            <h2 className="text-2xl font-bold mb-4">9. International Data Transfers</h2>
            <p className={`${isDark ? 'text-gray-300' : 'text-gray-700'} leading-relaxed`}>
              Your data may be processed in the United States or other countries where our service providers operate. 
              By using ErrorWise, you consent to the transfer of your information to countries outside your residence, 
              which may have different data protection laws.
            </p>
          </section>

          {/* Changes to Policy */}
          <section>
            <h2 className="text-2xl font-bold mb-4">10. Changes to This Policy</h2>
            <p className={`${isDark ? 'text-gray-300' : 'text-gray-700'} leading-relaxed`}>
              We may update this Privacy Policy from time to time. We will notify you of material changes via email 
              or through a notice on our website. The "Last Updated" date at the top shows when this policy was last revised.
            </p>
          </section>

          {/* Contact */}
          <section>
            <h2 className="text-2xl font-bold mb-4">11. Contact Us</h2>
            <p className={`${isDark ? 'text-gray-300' : 'text-gray-700'} leading-relaxed mb-4`}>
              If you have questions about this Privacy Policy or our data practices:
            </p>
            <div className={`p-6 ${isDark ? 'bg-gray-700' : 'bg-gray-100'} rounded-lg`}>
              <div className="space-y-2">
                <p className={`${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  <strong>Privacy Officer:</strong> privacy@errorwise.tech
                </p>
                <p className={`${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  <strong>General Support:</strong> hi@getgingee.com
                </p>
                <p className={`${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  <strong>Website:</strong> https://www.errorwise.tech
                </p>
              </div>
            </div>
          </section>

        </div>
      </main>

      {/* Footer */}
      <footer className={`${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border-t mt-12`}>
        <div className="max-w-4xl mx-auto px-4 py-6 text-center">
          <div className="flex justify-center space-x-6">
            <Link to="/terms" className="text-blue-600 hover:text-blue-700">
              Terms of Service
            </Link>
            <Link to="/" className="text-blue-600 hover:text-blue-700">
              Home
            </Link>
            <a href="mailto:privacy@errorwise.tech" className="text-blue-600 hover:text-blue-700">
              Contact Privacy Team
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

export default PrivacyPolicy;


