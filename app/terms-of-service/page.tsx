import { Vortex } from '@/components/ui/vortex';
import React from 'react';

const TermsOfService = () => {
  return (
    <div className="min-h-screen bg-gray-100">

          {/* Hero Section */}
          <div className="vortex-hero h-[30vh] sm:h-[80vh] relative overflow-hidden">
                        <Vortex
        backgroundColor="black"
        rangeY={800}
        particleCount={500}
        baseHue={120}
        className="flex items-center flex-col justify-center px-2 md:px-10  py-4 w-full h-full"
      >
            <div className="relative text-white py-24 px-4">
        <div className="relative max-w-4xl mx-auto text-center">
          <p className="text-sm uppercase tracking-widest mb-4 opacity-80">UNDERSTANDING OUR</p>
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-8 leading-tight">
            Terms of<br />
            <span className="text-yellow-400">Service</span>
          </h1>
        </div>
      </div>
      </Vortex>
          </div>



      {/* Content Section */}
      <div className="max-w-4xl mx-auto px-4 py-16">
        <div className="bg-white rounded-lg shadow-lg p-8 md:p-12">
          <div className="prose prose-lg max-w-none">
            <p className="text-xl text-gray-700 mb-8 leading-relaxed">
              In using this website you are deemed to have read and agreed to the following terms and conditions:
            </p>
            
            <div className="space-y-8 text-gray-600">
              <div>
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Terms of Service</h2>
                <p className="leading-relaxed">
                  This document outlines the email and privacy policy for Common Zen Media Inc., P3CO Game Studio, and Astrapuffs, a web and mobile game application. By using our game applications, you agree to the following terms of service.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-3">Consent to Communication</h3>
                <p className="leading-relaxed">
                  By providing your email address, you consent to receive electronic communications from Common Zen Media Inc., P3CO Game Studio, and Astrapuffs for purposes such as account-related issues, login magic links, or marketing, if you choose to opt-in. You may unsubscribe from marketing emails at any time by clicking on the &quot;unsubscribe&quot; link provided at the bottom of each email.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-3">No Selling of Email Information</h3>
                <p className="leading-relaxed">
                  Common Zen Media Inc., P3CO Game Studio, and Astrapuffs will never sell your email information to any third parties. Your email address and personal data will be used solely for the purpose of providing you with the services you requested and maintaining the security of your account.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-3">No Sharing of Email with Anyone</h3>
                <p className="leading-relaxed">
                  Common Zen Media Inc., P3CO Game Studio, and Astrapuffs will not share your email address with any third parties or affiliates without your prior consent. Your email information will remain confidential within our companies and will not be disclosed to external parties unless required by law or to comply with legal obligations.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-3">Data Security Measures</h3>
                <p className="leading-relaxed">
                  We employ state-of-the-art security measures to protect your personal information from unauthorized access, use, or disclosure. These measures include encryption, secure servers, and regular monitoring to ensure that your data remains safe and secure at all times.
                </p>
              </div>

              <div className="bg-gray-50 p-6 rounded-lg">
                <p className="leading-relaxed">
                  By agreeing to these terms of service, you acknowledge that you understand and accept the email and privacy policy set forth by Common Zen Media Inc., P3CO Game Studio, and Astrapuffs. If you have any questions or concerns regarding this policy or how we handle your personal information, please feel free to contact our support team at [support email address].
                </p>
              </div>

              <div className="bg-yellow-50 border-l-4 border-yellow-400 p-6">
                <p className="leading-relaxed text-yellow-800">
                  We reserve the right to update or modify this policy at any time. Changes will be posted on our website, and we encourage you to review the policy periodically to stay informed about our practices regarding your personal information.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsOfService;