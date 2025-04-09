
import React from 'react';
import { motion } from 'framer-motion';

const PrivacyPolicyPage: React.FC = () => {
  return (
    <div className="bg-gray-100 py-12 min-h-screen">
      <div className="container mx-auto px-4 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl md:text-4xl font-bold mb-8 text-center">Privacy Policy</h1>
          
          <div className="bg-white p-6 md:p-8 rounded-lg shadow-md space-y-6">
            <section>
              <h2 className="text-xl font-semibold mb-3 text-primary">Introduction</h2>
              <p className="text-gray-700">
                Final Thread ("we", "our", or "us") is committed to protecting your privacy. This Privacy Policy explains how your personal information is collected, used, and disclosed by Final Thread. This Privacy Policy applies to our website, finalthread.com, and its associated subdomains (collectively, our "Service").
              </p>
              <p className="text-gray-700 mt-3">
                By accessing or using our Service, you signify that you have read, understood, and agree to our collection, storage, use, and disclosure of your personal information as described in this Privacy Policy.
              </p>
            </section>
            
            <section>
              <h2 className="text-xl font-semibold mb-3 text-primary">Information We Collect</h2>
              <p className="text-gray-700">
                We collect several different types of information for various purposes to provide and improve our Service to you:
              </p>
              <ul className="list-disc pl-6 mt-3 space-y-2 text-gray-700">
                <li>
                  <strong>Personal Data</strong>: While using our Service, we may ask you to provide us with certain personally identifiable information that can be used to contact or identify you ("Personal Data"). This may include, but is not limited to:
                  <ul className="list-circle pl-6 mt-1 space-y-1">
                    <li>Email address</li>
                    <li>First name and last name</li>
                    <li>Phone number</li>
                    <li>Address, State, Province, ZIP/Postal code, City</li>
                  </ul>
                </li>
                <li>
                  <strong>Usage Data</strong>: We may also collect information that your browser sends whenever you visit our Service or when you access the Service by or through a mobile device ("Usage Data").
                </li>
                <li>
                  <strong>Digital Legacy Content</strong>: We store the content you create for your digital legacy, including messages, files, and instructions.
                </li>
              </ul>
            </section>
            
            <section>
              <h2 className="text-xl font-semibold mb-3 text-primary">How We Use Your Information</h2>
              <p className="text-gray-700">
                We use the collected data for various purposes:
              </p>
              <ul className="list-disc pl-6 mt-3 space-y-2 text-gray-700">
                <li>To provide and maintain our Service</li>
                <li>To notify you about changes to our Service</li>
                <li>To allow you to participate in interactive features of our Service when you choose to do so</li>
                <li>To provide customer support</li>
                <li>To gather analysis or valuable information so that we can improve our Service</li>
                <li>To monitor the usage of our Service</li>
                <li>To detect, prevent and address technical issues</li>
                <li>To fulfill the purpose of your digital legacy planning, including the delivery of messages and files according to your instructions</li>
              </ul>
            </section>
            
            <section>
              <h2 className="text-xl font-semibold mb-3 text-primary">Security</h2>
              <p className="text-gray-700">
                The security of your data is important to us but remember that no method of transmission over the Internet or method of electronic storage is 100% secure. While we strive to use commercially acceptable means to protect your Personal Data, we cannot guarantee its absolute security.
              </p>
            </section>
            
            <section>
              <h2 className="text-xl font-semibold mb-3 text-primary">Your Rights</h2>
              <p className="text-gray-700">
                You have the following data protection rights:
              </p>
              <ul className="list-disc pl-6 mt-3 space-y-2 text-gray-700">
                <li>The right to access, update or delete the information we have on you.</li>
                <li>The right of rectification - You have the right to have your information rectified if that information is inaccurate or incomplete.</li>
                <li>The right to object - You have the right to object to our processing of your Personal Data.</li>
                <li>The right of restriction - You have the right to request that we restrict the processing of your personal information.</li>
                <li>The right to data portability - You have the right to be provided with a copy of the information we have on you in a structured, machine-readable and commonly used format.</li>
                <li>The right to withdraw consent - You also have the right to withdraw your consent at any time where Final Thread relied on your consent to process your personal information.</li>
              </ul>
            </section>
            
            <section>
              <h2 className="text-xl font-semibold mb-3 text-primary">Changes to This Privacy Policy</h2>
              <p className="text-gray-700">
                We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last Updated" date at the top of this Privacy Policy.
              </p>
              <p className="text-gray-700 mt-3">
                You are advised to review this Privacy Policy periodically for any changes. Changes to this Privacy Policy are effective when they are posted on this page.
              </p>
            </section>
            
            <section>
              <h2 className="text-xl font-semibold mb-3 text-primary">Contact Us</h2>
              <p className="text-gray-700">
                If you have any questions about this Privacy Policy, please contact us:
              </p>
              <ul className="list-disc pl-6 mt-3 text-gray-700">
                <li>By email: privacy@finalthread.com</li>
                <li>By visiting the contact page on our website</li>
              </ul>
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

export default PrivacyPolicyPage;
