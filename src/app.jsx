import React, { useState, useRef } from 'react';
import './App.css';

function App() {
  const [file, setFile] = useState(null);
  const [originalImage, setOriginalImage] = useState(null);
  const [processedImage, setProcessedImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileUpload = (e) => {
    const uploadedFile = e.target.files[0];
    if (uploadedFile) {
      setFile(uploadedFile);
      const reader = new FileReader();
      reader.onload = (event) => {
        setOriginalImage(event.target.result);
      };
      reader.readAsDataURL(uploadedFile);
      processImage(uploadedFile);
    }
  };

  const processImage = async (imageFile) => {
    setLoading(true);
    const formData = new FormData();
    formData.append('image', imageFile);

    try {
      const response = await fetch('/api/remove-background.php', {
        method: 'POST',
        body: formData
      });
      
      if (response.ok) {
        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        setProcessedImage(url);
      } else {
        console.error('Processing failed');
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    if (processedImage) {
      const link = document.createElement('a');
      link.href = processedImage;
      link.download = 'magicbg-result.png';
      link.click();
    }
  };

  const handleTryAnother = () => {
    setFile(null);
    setOriginalImage(null);
    setProcessedImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleContactSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    
    try {
      const response = await fetch('/api/contact.php', {
        method: 'POST',
        body: formData
      });
      
      if (response.ok) {
        alert('Message sent successfully!');
        e.target.reset();
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div className="App">
      {/* Navbar */}
      <nav className="bg-black text-white shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex-shrink-0 flex items-center">
              <i className="bi bi-magic text-2xl text-purple-500 mr-2"></i>
              <span className="text-xl font-bold text-cyan-400">MagicBG</span>
            </div>

            <div className="hidden md:flex space-x-6">
              {['Home', 'Features', 'How It Works', 'Pricing', 'Gallery', 'FAQ', 'Contact'].map((item) => (
                <a
                  key={item}
                  href={`#${item.toLowerCase().replace(/\s+/g, '-')}`}
                  className={`nav-link ${activeSection === item.toLowerCase() ? 'active' : ''}`}
                  onClick={() => setActiveSection(item.toLowerCase())}
                >
                  {item}
                </a>
              ))}
            </div>

            <div className="hidden md:flex items-center space-x-5">
              <a href="#" className="text-gray-400 hover:text-purple-400 transition">
                <i className="bi bi-person-circle text-xl"></i>
              </a>
              <a href="#" className="text-gray-400 hover:text-purple-400 transition">
                <i className="bi bi-heart text-xl"></i>
              </a>
              <a href="#" className="text-gray-400 hover:text-purple-400 transition">
                <i className="bi bi-cart3 text-xl"></i>
              </a>
            </div>

            <div className="md:hidden flex items-center">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="text-gray-300 hover:text-cyan-400 focus:outline-none"
              >
                <i className="bi bi-list text-2xl"></i>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-black border-t border-gray-700">
            <div className="px-4 pt-4 pb-3 space-y-2">
              {['Home', 'Features', 'How It Works', 'Pricing', 'Gallery', 'FAQ', 'Contact'].map((item) => (
                <a
                  key={item}
                  href={`#${item.toLowerCase().replace(/\s+/g, '-')}`}
                  className="mobile-nav-link block"
                  onClick={() => {
                    setActiveSection(item.toLowerCase());
                    setMobileMenuOpen(false);
                  }}
                >
                  {item}
                </a>
              ))}
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section id="home" className="py-16 md:py-24 bg-gradient-to-r from-blue-100 to-purple-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="md:flex items-center">
            <div className="md:w-1/2 animate__animated animate__fadeInLeft">
              <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
                Remove Backgrounds <span className="text-purple-600">Like Magic</span>
              </h1>
              <p className="text-lg text-gray-600 mb-8">
                Upload your image and get a transparent background in seconds. No credit card required.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={() => document.getElementById('upload-container')?.scrollIntoView({ behavior: 'smooth' })}
                  className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-6 rounded-lg shadow-lg transition duration-300 transform hover:scale-105"
                >
                  <i className="bi bi-upload mr-2"></i> Upload Image
                </button>
                <button className="bg-white hover:bg-gray-100 text-gray-800 font-semibold py-3 px-6 rounded-lg border border-gray-300 shadow transition duration-300">
                  <i className="bi bi-play-circle mr-2"></i> Watch Demo
                </button>
              </div>
            </div>
            <div className="md:w-1/2 mt-10 md:mt-0 animate__animated animate__fadeInRight">
              <div className="relative bg-white p-4 rounded-xl shadow-xl">
                <div className="bg-gray-200 rounded-lg overflow-hidden">
                  <video
                    preload="auto"
                    className="w-full h-auto rounded-4xl max-w-[320px] lg:max-w-[420px]"
                    poster="https://sb.kaleidousercontent.com/67418/840x560/686381d375/emilia-poster.jpg"
                    autoPlay
                    muted
                    playsInline
                    src="https://sb.kaleidousercontent.com/67418/x/681f13b37d/emilia_compressed.mp4"
                  ></video>
                </div>
                <div className="absolute -bottom-4 -right-4 bg-purple-600 text-white px-4 py-2 rounded-lg shadow-lg">
                  <i className="bi bi-lightning-fill mr-2"></i> AI Powered
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Upload Area */}
      <section id="how-it-works" className="py-20 bg-gradient-to-br from-white via-purple-50 to-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-extrabold text-gray-800 mb-4 tracking-tight">
              How It Works
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Remove backgrounds in just three simple steps.
            </p>
          </div>

          <div
            id="upload-container"
            onClick={() => fileInputRef.current?.click()}
            className="mt-16 border-4 border-dashed border-gray-300 rounded-xl p-10 text-center cursor-pointer transition duration-300 hover:border-purple-500 hover:shadow-xl hover:bg-purple-50"
          >
            <i className="bi bi-cloud-arrow-up text-5xl text-purple-400 mb-3 animate-bounce"></i>
            <p className="text-gray-700 font-medium text-lg">Drag & drop your image here</p>
            <p className="text-sm text-gray-500 mt-2">or click to browse files (JPG, PNG up to 5MB)</p>
            <input
              ref={fileInputRef}
              type="file"
              id="file-input"
              accept="image/*"
              onChange={handleFileUpload}
              className="hidden"
            />
          </div>

          {/* Processing Area */}
          {originalImage && (
            <div className="mt-16">
              <div className="flex flex-col md:flex-row gap-6">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">Original Image</h3>
                  <div className="border rounded-xl overflow-hidden shadow-md">
                    <img src={originalImage} alt="Original" className="w-full h-auto" />
                  </div>
                </div>

                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">Result</h3>
                  <div className="border rounded-xl overflow-hidden shadow-md relative min-h-[200px]">
                    {processedImage ? (
                      <img src={processedImage} alt="Result" className="w-full h-auto" />
                    ) : (
                      <div className="w-full h-full min-h-[200px] flex items-center justify-center bg-gray-100">
                        {loading ? (
                          <div className="text-center">
                            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500 mx-auto"></div>
                            <span className="mt-2 text-gray-600">Removing background...</span>
                          </div>
                        ) : (
                          <p className="text-gray-400">Processing preview</p>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              {processedImage && (
                <div className="mt-8 flex flex-wrap gap-4">
                  <button
                    onClick={handleDownload}
                    className="bg-purple-600 hover:bg-purple-700 text-white font-medium py-2.5 px-5 rounded-xl flex items-center shadow transition duration-300"
                  >
                    <i className="bi bi-download mr-2"></i> Download PNG
                  </button>
                  <button
                    onClick={handleTryAnother}
                    className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2.5 px-5 rounded-xl flex items-center shadow transition duration-300"
                  >
                    <i className="bi bi-arrow-repeat mr-2"></i> Try Another
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Contact Form */}
      <section id="contact" className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">Contact Us</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Have questions or feedback? We'd love to hear from you!
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Send us a message</h3>
              <form onSubmit={handleContactSubmit} className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  />
                </div>
                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
                    Subject
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  />
                </div>
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows="4"
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  ></textarea>
                </div>
                <button
                  type="submit"
                  className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-6 rounded-lg shadow transition duration-300"
                >
                  Send Message
                </button>
              </form>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Contact Information</h3>
              <div className="space-y-6">
                <div className="flex items-start">
                  <div className="flex-shrink-0 bg-purple-100 rounded-lg p-3">
                    <i className="bi bi-envelope text-purple-600 text-xl"></i>
                  </div>
                  <div className="ml-4">
                    <h4 className="text-lg font-medium text-gray-800">Email</h4>
                    <p className="text-gray-600">codeoxideofficial@gmail.com</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="flex-shrink-0 bg-blue-100 rounded-lg p-3">
                    <i className="bi bi-telephone text-blue-600 text-xl"></i>
                  </div>
                  <div className="ml-4">
                    <h4 className="text-lg font-medium text-gray-800">Phone</h4>
                    <p className="text-gray-600">+92 3429624031 (Sales)</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="flex-shrink-0 bg-green-100 rounded-lg p-3">
                    <i className="bi bi-geo-alt text-green-600 text-xl"></i>
                  </div>
                  <div className="ml-4">
                    <h4 className="text-lg font-medium text-gray-800">Address</h4>
                    <p className="text-gray-600">Attock, Punjab, Kamra</p>
                  </div>
                </div>
              </div>

              <div className="mt-8">
                <h4 className="text-lg font-medium text-gray-800 mb-4">Follow Us</h4>
                <div className="flex space-x-4">
                  {[
                    { icon: 'facebook', bg: 'bg-blue-600' },
                    { icon: 'twitter', bg: 'bg-blue-400' },
                    { icon: 'instagram', bg: 'bg-pink-600' },
                    { icon: 'youtube', bg: 'bg-red-600' },
                    { icon: 'github', bg: 'bg-gray-800' }
                  ].map((social) => (
                    <a
                      key={social.icon}
                      href="#"
                      className={`${social.bg} hover:opacity-80 text-white w-10 h-10 rounded-full flex items-center justify-center transition`}
                    >
                      <i className={`bi bi-${social.icon}`}></i>
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white pt-16 pb-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-5 gap-8 mb-12">
            <div className="md:col-span-2">
              <div className="flex items-center mb-4">
                <i className="bi bi-magic text-2xl text-purple-400 mr-2"></i>
                <span className="text-xl font-bold">MagicBG</span>
              </div>
              <p className="text-gray-400 mb-4">
                The fastest, most accurate background remover powered by AI.
              </p>
            </div>

            {[
              { title: 'Product', links: ['Features', 'Pricing', 'API', 'Integrations'] },
              { title: 'Company', links: ['About Us', 'Careers', 'Blog', 'Press'] },
              { title: 'Resources', links: ['Documentation', 'Help Center', 'Tutorials', 'Webinars'] },
              { title: 'Legal', links: ['Privacy Policy', 'Terms of Service', 'Cookie Policy', 'GDPR'] }
            ].map((column) => (
              <div key={column.title}>
                <h4 className="text-lg font-semibold mb-4">{column.title}</h4>
                <ul className="space-y-2">
                  {column.links.map((link) => (
                    <li key={link}>
                      <a href="#" className="text-gray-400 hover:text-white">
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="border-t border-gray-800 pt-8 text-center text-gray-400 text-sm">
            © 2024 MagicBG. All rights reserved.
          </div>
        </div>
      </footer>

      {/* Back to Top Button */}
      <button
        id="back-to-top"
        className="fixed bottom-8 right-8 bg-purple-600 text-white w-12 h-12 rounded-full shadow-lg flex items-center justify-center transition duration-300 hover:bg-purple-700"
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      >
        <i className="bi bi-arrow-up"></i>
      </button>
    </div>
  );
}

export default App;