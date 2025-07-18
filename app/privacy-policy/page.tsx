import { Vortex } from '@/components/ui/vortex';
import React from 'react';

const PrivacyPolicy = () => {
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
                  Privacy<br />
                  <span className="text-yellow-400">Policy</span>
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
              In using this website you are deemed to have read and agreed to the following privacy policy:
            </p>
            
            <div className="space-y-8 text-gray-600">
              <div>
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Privacy Policy</h2>
                <p className="leading-relaxed">
                  This Privacy Policy describes how Common Zen Media Inc., P3CO Game Studio, and Astrapuffs (collectively, &quot;we&quot;, &quot;us&ldquo;, or &quot;our&quot;) collect, use, and share information in connection with your use of our web and mobile game applications. By using our game applications, you agree to the collection, use, and disclosure of your information as outlined in this Privacy Policy.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-3">Information We Collect</h3>
                <p className="leading-relaxed mb-4">
                  We may collect the following types of information when you use our game applications:
                </p>
                <div className="bg-gray-50 p-6 rounded-lg space-y-4">
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-2">Personal Information:</h4>
                    <p className="text-sm leading-relaxed">This includes your email address, username, and any other information you provide during account registration or while using our game applications.</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-2">Usage Information:</h4>
                    <p className="text-sm leading-relaxed">This includes information about your use of our game applications, such as gameplay data, in-game purchases, and interactions with other users.</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-2">Device Information:</h4>
                    <p className="text-sm leading-relaxed">This includes information about the device you use to access our game applications, such as device model, operating system, browser type, and IP address.</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-2">Cookies and Similar Technologies:</h4>
                    <p className="text-sm leading-relaxed">We may use cookies, web beacons, and other similar technologies to collect information about your use of our game applications, for purposes such as analytics, personalization, and advertising.</p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-3">How We Use Your Information</h3>
                <p className="leading-relaxed mb-4">
                  We use the information we collect for the following purposes:
                </p>
                <div className="bg-blue-50 p-6 rounded-lg space-y-3">
                  <p className="text-sm leading-relaxed">• To provide, maintain, and improve our game applications, including processing transactions, providing customer support, and developing new features and functionalities.</p>
                  <p className="text-sm leading-relaxed">• To personalize your experience in our game applications, such as remembering your preferences, displaying targeted advertisements, and providing recommendations based on your interests.</p>
                  <p className="text-sm leading-relaxed">• To monitor and analyze usage and trends to improve our game applications and user experience.</p>
                  <p className="text-sm leading-relaxed">• To communicate with you about your account, including sending login magic links, password reset emails, and updates about our game applications.</p>
                  <p className="text-sm leading-relaxed">• To protect the security and integrity of our game applications and user accounts, including detecting, investigating, and preventing fraud or other illegal activities.</p>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-3">How We Share Your Information</h3>
                <p className="leading-relaxed mb-4">
                  We may share your information with third parties under the following circumstances:
                </p>
                <div className="bg-green-50 p-6 rounded-lg space-y-3">
                  <p className="text-sm leading-relaxed">• With service providers who perform functions on our behalf, such as hosting, analytics, and marketing services.</p>
                  <p className="text-sm leading-relaxed">• With other users of our game applications, when you choose to share information or participate in public activities like leaderboards or chat functions.</p>
                  <p className="text-sm leading-relaxed">• In response to legal requests, when required by law, or to comply with legal obligations.</p>
                  <p className="text-sm leading-relaxed">• In connection with a merger, acquisition, or sale of assets, in which case we will provide notice to you before your personal information is transferred and becomes subject to a different privacy policy.</p>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-3">Your Choices and Rights</h3>
                <p className="leading-relaxed mb-4">
                  You have the following choices and rights regarding your personal information:
                </p>
                <div className="bg-purple-50 p-6 rounded-lg space-y-3">
                  <p className="text-sm leading-relaxed">• You may request access to, correction of, or deletion of your personal information by contacting our support team at [support email address].</p>
                  <p className="text-sm leading-relaxed">• You may opt-out of receiving marketing communications from us by clicking the &quot;unsubscribe&ldquo; link in any marketing email.</p>
                  <p className="text-sm leading-relaxed">• You may set your browser to block or delete cookies, but this may affect the functionality of our game applications.</p>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-3">Data Security</h3>
                <p className="leading-relaxed">
                  We employ state-of-the-art security measures to protect your personal information from unauthorized access, use, or disclosure. These measures include encryption, secure servers, and regular monitoring to ensure that your data remains safe and secure at all times.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-3">Changes to This Privacy Policy</h3>
                <p className="leading-relaxed">
                  We reserve the right to update or modify this Privacy Policy at any time. Changes will be posted on our website, and we encourage you to review the policy periodically to stay informed about our practices regarding your personal information.
                </p>
              </div>

              <div className="bg-orange-50 border-l-4 border-orange-400 p-6">
                <h3 className="text-xl font-semibold text-orange-800 mb-3">Contact Us</h3>
                <p className="leading-relaxed text-orange-800">
                  If you have any questions or concerns about this Privacy Policy or how we handle your personal information, please feel free to contact our support team at [support email address].
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;