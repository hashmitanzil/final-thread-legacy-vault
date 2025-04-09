
import React from 'react';
import { motion } from 'framer-motion';

const TermsPage: React.FC = () => {
  return (
    <div className="bg-gray-100 py-12 min-h-screen">
      <div className="container mx-auto px-4 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl md:text-4xl font-bold mb-8 text-center">Terms of Service</h1>
          
          <div className="bg-white p-6 md:p-8 rounded-lg shadow-md space-y-6">
            <section>
              <h2 className="text-xl font-semibold mb-3 text-primary">1. Introduction</h2>
              <p className="text-gray-700">
                Welcome to Final Thread ("Company", "we", "our", "us")! These Terms of Service ("Terms", "Terms of Service") govern your use of our website located at finalthread.com (together or individually "Service") operated by Final Thread.
              </p>
              <p className="text-gray-700 mt-3">
                Our Privacy Policy also governs your use of our Service and explains how we collect, safeguard and disclose information that results from your use of our web pages.
              </p>
              <p className="text-gray-700 mt-3">
                Your agreement with us includes these Terms and our Privacy Policy ("Agreements"). You acknowledge that you have read and understood Agreements, and agree to be bound by them.
              </p>
              <p className="text-gray-700 mt-3">
                If you do not agree with (or cannot comply with) Agreements, then you may not use the Service, but please let us know by emailing at support@finalthread.com so we can try to find a solution. These Terms apply to all visitors, users and others who wish to access or use Service.
              </p>
            </section>
            
            <section>
              <h2 className="text-xl font-semibold mb-3 text-primary">2. Communications</h2>
              <p className="text-gray-700">
                By using our Service, you agree to subscribe to newsletters, marketing or promotional materials and other information we may send. However, you may opt out of receiving any, or all, of these communications from us by following the unsubscribe link or by emailing at support@finalthread.com.
              </p>
            </section>
            
            <section>
              <h2 className="text-xl font-semibold mb-3 text-primary">3. Purchases</h2>
              <p className="text-gray-700">
                If you wish to purchase any product or service made available through Service ("Purchase"), you may be asked to supply certain information relevant to your Purchase including but not limited to, your credit or debit card number, the expiration date of your card, your billing address, and your shipping information.
              </p>
              <p className="text-gray-700 mt-3">
                You represent and warrant that: (i) you have the legal right to use any card(s) or other payment method(s) in connection with any Purchase; and that (ii) the information you supply to us is true, correct and complete.
              </p>
              <p className="text-gray-700 mt-3">
                We reserve the right to refuse or cancel your order at any time for reasons including but not limited to: product or service availability, errors in the description or price of the product or service, error in your order or other reasons.
              </p>
            </section>
            
            <section>
              <h2 className="text-xl font-semibold mb-3 text-primary">4. Digital Legacy Content</h2>
              <p className="text-gray-700">
                You understand that by using our Service, you are creating content that may be delivered to your designated recipients according to your instructions. You are responsible for:
              </p>
              <ul className="list-disc pl-6 mt-3 space-y-2 text-gray-700">
                <li>Ensuring all content you upload or create is legal and does not violate any third party rights</li>
                <li>Accurately designating your trusted contacts and recipients</li>
                <li>Maintaining current contact information for yourself and your designated contacts</li>
                <li>Complying with all confirmation requests to verify your status</li>
              </ul>
              <p className="text-gray-700 mt-3">
                We reserve the right to refuse to deliver content that violates our content policies, including but not limited to content that is illegal, harmful, threatening, abusive, harassing, tortious, defamatory, or invasive of another's privacy.
              </p>
            </section>
            
            <section>
              <h2 className="text-xl font-semibold mb-3 text-primary">5. Intellectual Property</h2>
              <p className="text-gray-700">
                Service and its original content (excluding content provided by users), features and functionality are and will remain the exclusive property of Final Thread and its licensors. Service is protected by copyright, trademark, and other laws of both the United States and foreign countries. Our trademarks and trade dress may not be used in connection with any product or service without the prior written consent of Final Thread.
              </p>
            </section>
            
            <section>
              <h2 className="text-xl font-semibold mb-3 text-primary">6. Termination</h2>
              <p className="text-gray-700">
                We may terminate or suspend your account and bar access to Service immediately, without prior notice or liability, under our sole discretion, for any reason whatsoever and without limitation, including but not limited to a breach of Terms.
              </p>
              <p className="text-gray-700 mt-3">
                If you wish to terminate your account, you may simply discontinue using Service, or contact us to request account deletion. Note that certain information may still be stored in our backup systems even after deletion.
              </p>
            </section>
            
            <section>
              <h2 className="text-xl font-semibold mb-3 text-primary">7. Limitation of Liability</h2>
              <p className="text-gray-700">
                In no event shall Final Thread, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from (i) your access to or use of or inability to access or use the Service; (ii) any conduct or content of any third party on the Service; (iii) any content obtained from the Service; and (iv) unauthorized access, use or alteration of your transmissions or content, whether based on warranty, contract, tort (including negligence) or any other legal theory, whether or not we have been informed of the possibility of such damage.
              </p>
            </section>
            
            <section>
              <h2 className="text-xl font-semibold mb-3 text-primary">8. Disclaimer</h2>
              <p className="text-gray-700">
                Your use of the Service is at your sole risk. The Service is provided on an "AS IS" and "AS AVAILABLE" basis. The Service is provided without warranties of any kind, whether express or implied, including, but not limited to, implied warranties of merchantability, fitness for a particular purpose, non-infringement or course of performance.
              </p>
            </section>
            
            <section>
              <h2 className="text-xl font-semibold mb-3 text-primary">9. Governing Law</h2>
              <p className="text-gray-700">
                These Terms shall be governed and construed in accordance with the laws of the United States without regard to its conflict of law provisions.
              </p>
              <p className="text-gray-700 mt-3">
                Our failure to enforce any right or provision of these Terms will not be considered a waiver of those rights. If any provision of these Terms is held to be invalid or unenforceable by a court, the remaining provisions of these Terms will remain in effect.
              </p>
            </section>
            
            <section>
              <h2 className="text-xl font-semibold mb-3 text-primary">10. Changes to Terms</h2>
              <p className="text-gray-700">
                We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a revision is material we will provide at least 30 days notice prior to any new terms taking effect. What constitutes a material change will be determined at our sole discretion.
              </p>
              <p className="text-gray-700 mt-3">
                By continuing to access or use our Service after any revisions become effective, you agree to be bound by the revised terms. If you do not agree to the new terms, you are no longer authorized to use the Service.
              </p>
            </section>
            
            <section>
              <h2 className="text-xl font-semibold mb-3 text-primary">11. Contact Us</h2>
              <p className="text-gray-700">
                If you have any questions about these Terms, please contact us at terms@finalthread.com.
              </p>
            </section>
            
            <p className="text-sm text-gray-500 mt-8 pt-4 border-t border-gray-200">
              Last updated: April 9, 2025
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default TermsPage;
