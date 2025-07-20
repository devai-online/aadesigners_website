import React from 'react';
import { Mail, Phone, MapPin, Send, Instagram, CheckCircle } from 'lucide-react';
import { useInView } from '../hooks/useInView';
import { useForm, ValidationError } from '@formspree/react';

const Contact = () => {
  const [ref, isInView] = useInView({ threshold: 0.1 });
  const [state, handleSubmit] = useForm("movljlql");

  return (
    <section id="contact" className="py-20 bg-black text-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div ref={ref} className={`transition-all duration-1000 ${isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          
          {/* Section Header */}
          <div className="mb-20">
            <h2 className="text-5xl md:text-6xl font-bold text-white mb-8 tracking-tight">
              LET'S CREATE
              <br />
              <span className="text-gray-400">TOGETHER</span>
            </h2>
            <div className="w-24 h-1 bg-white mb-8"></div>
            <p className="text-xl text-gray-300 max-w-3xl">
              Ready to transform your space? Get in touch with us today and let's bring your vision to life.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-16">
            {/* Contact Info */}
            <div className="space-y-12">
              <div className="space-y-8">
                <div className="flex items-start space-x-6">
                  <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center flex-shrink-0">
                    <Mail className="h-6 w-6 text-black" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-2">Email Us</h3>
                    <p className="text-gray-300 text-lg">reachus@aadesignerstudio.com</p>
                  </div>
                </div>

                <div className="flex items-start space-x-6">
                  <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center flex-shrink-0">
                    <Phone className="h-6 w-6 text-black" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-2">Call Us</h3>
                    <div className="space-y-1">
                      <p className="text-gray-300 text-lg">(+91) 79935 47958</p>
                      <p className="text-gray-300 text-lg">(+91) 80997 54478</p>
                    </div>
                  </div>
                </div>

                <div className="flex items-start space-x-6">
                  <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center flex-shrink-0">
                    <MapPin className="h-6 w-6 text-black" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-2">Visit Us</h3>
                    <div className="text-gray-300 text-lg">
                      <p>Kondapur, Hyderabad,</p>
                      <p>Telangana, 500084.</p>
                    </div>
                  </div>
                </div>

                <div className="flex items-start space-x-6">
                  <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center flex-shrink-0">
                    <Instagram className="h-6 w-6 text-black" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-2">Follow Us</h3>
                    <a 
                      href="https://www.instagram.com/aa_designer_studio" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-gray-300 text-lg hover:text-amber-400 transition-colors duration-300"
                    >
                      @aa_designer_studio
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="bg-gray-900 rounded-3xl p-8 lg:p-12">
              {state.succeeded ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-4">Thank You!</h3>
                  <p className="text-gray-300 text-lg">
                    Your message has been sent successfully. We'll get back to you soon!
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <input
                      type="text"
                      name="name"
                      placeholder="Your Name"
                      className="w-full px-6 py-4 bg-black border border-gray-700 rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:border-white transition-colors duration-300"
                      required
                    />
                  </div>
                  
                  <div>
                    <input
                      type="email"
                      name="email"
                      placeholder="Your Email"
                      className="w-full px-6 py-4 bg-black border border-gray-700 rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:border-white transition-colors duration-300"
                      required
                    />
                    <ValidationError 
                      prefix="Email" 
                      field="email"
                      errors={state.errors}
                      className="text-red-400 text-sm mt-1"
                    />
                  </div>
                  
                  <div>
                    <textarea
                      name="message"
                      placeholder="Tell us about your project..."
                      rows={5}
                      className="w-full px-6 py-4 bg-black border border-gray-700 rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:border-white transition-colors duration-300 resize-none"
                      required
                    />
                    <ValidationError 
                      prefix="Message" 
                      field="message"
                      errors={state.errors}
                      className="text-red-400 text-sm mt-1"
                    />
                  </div>
                  
                  <button
                    type="submit"
                    disabled={state.submitting}
                    className="w-full bg-white text-black px-8 py-4 rounded-2xl font-semibold text-lg transition-all duration-300 hover:bg-gray-100 disabled:bg-gray-600 disabled:cursor-not-allowed flex items-center justify-center"
                  >
                    <span className="flex items-center">
                      {state.submitting ? 'Sending...' : 'Send Message'}
                      {!state.submitting && <Send className="ml-2 h-5 w-5" />}
                    </span>
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;