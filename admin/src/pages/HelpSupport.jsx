import { useState } from 'react'
import {
  ArrowLeftIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  BookOpenIcon,
  XMarkIcon,
  ArrowLeftCircleIcon,
  ArrowRightCircleIcon
} from '@heroicons/react/24/outline'

/* FAQ */
const faqs = [
  { question: 'How do I search for a book?', answer: 'Use the search bar at the top of the page.' },
  { question: 'How do I reset my password?', answer: 'Go to My Profile and update your password.' }
]

/* ALL GUIDE CONTENT */
const guideContent = {
  dashboard: [
    { text: 'Dashboard overview and system statistics.' },
    { text: 'Navigate modules using the sidebar menu.' }
  ],
  cataloging: [
    { text: 'Click Add Book to catalog new materials.' },
    { text: 'Fill in ISBN, title, author and classification.' }
  ],
  accessions: [
    { text: 'Record newly arrived books in Accessions.' },
    { text: 'Ensure acquisition date and supplier are correct.' }
  ],
  acquisitions: [
    { text: 'Manage purchase requests and approvals.' },
    { text: 'Track acquisition budget and suppliers.' }
  ],
  usermanagement: [
    { text: 'Add new users and assign roles.' },
    { text: 'Modify permissions and deactivate accounts.' }
  ],
  security: [
    { text: 'Update password policies and access control.' },
    { text: 'Monitor login history and suspicious activity.' }
  ],
  loginproblem: [
    { text: 'Ensure your username and password are correct. Passwords are case-sensitive.' },
    { text: 'If you forgot your password, use the "Forgot Password" link on the login page.' }
  ],
  performanceslowdown: [
    { text: 'Check your internet connection speed. A slow connection can affect system performance.' },
    { text: 'Clear your browser cache and cookies, then reload the page.' }
  ],
  datasync: [
    { text: 'Data Synchronization Errors occur when local and server data conflict.' },
    { text: 'Try refreshing the page or logging out and back in to force a re-sync.' }
  ]
}

const HelpSupport = ({ setCurrentView }) => {
  const [openFaq, setOpenFaq] = useState(null)
  const [showManual, setShowManual] = useState(false)
  const [openSystemGuide, setOpenSystemGuide] = useState(false)
  const [openTroubleshooting, setOpenTroubleshooting] = useState(false)
  const [activeGuide, setActiveGuide] = useState(null)
  const [pageIndex, setPageIndex] = useState(0)

  const openGuideModal = (guideKey) => {
    setActiveGuide(guideKey)
    setPageIndex(0)
  }

  const closeModal = () => {
    setActiveGuide(null)
    setPageIndex(0)
  }

  const nextPage = () => {
    if (pageIndex < guideContent[activeGuide].length - 1) setPageIndex(pageIndex + 1)
  }

  const prevPage = () => {
    if (pageIndex > 0) setPageIndex(pageIndex - 1)
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Back */}
      <button
        onClick={() => setCurrentView('dashboard')}
        className="flex items-center gap-2 text-sm text-gray-600 mb-6"
      >
        <ArrowLeftIcon className="w-4 h-4" />
        Back to Dashboard
      </button>

      {/* Hero */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Help & Support</h1>
      </div>

      {/* FAQ */}
      <div className="bg-white rounded-xl shadow-sm mb-4 overflow-hidden">
        <div className="px-6 py-4 font-semibold text-gray-700 border-b">FAQ</div>
        {faqs.map((faq, i) => (
          <div key={i} className="border-b last:border-b-0">
            <button
              onClick={() => setOpenFaq(openFaq === i ? null : i)}
              className="w-full flex justify-between px-6 py-4 text-left"
            >
              <span className="text-sm text-gray-700">{faq.question}</span>
              {openFaq === i ? (
                <ChevronUpIcon className="w-4 h-4 text-gray-500" />
              ) : (
                <ChevronDownIcon className="w-4 h-4 text-gray-500" />
              )}
            </button>
            {openFaq === i && (
              <div className="px-6 pb-4 text-sm text-gray-600">{faq.answer}</div>
            )}
          </div>
        ))}
      </div>

      {/* USER MANUAL */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <button
          onClick={() => setShowManual(!showManual)}
          className="w-full flex justify-between items-center px-6 py-5"
        >
          <div className="flex items-center gap-2 font-semibold text-gray-700">
            <BookOpenIcon className="w-5 h-5" />
            User Manual
          </div>
          {showManual ? (
            <ChevronUpIcon className="w-4 h-4 text-gray-500" />
          ) : (
            <ChevronDownIcon className="w-4 h-4 text-gray-500" />
          )}
        </button>

        {showManual && (
          <div className="border-t">
            {/* System Guide */}
            <button
              onClick={() => setOpenSystemGuide(!openSystemGuide)}
              className="w-full flex justify-between items-center px-8 py-4 text-left hover:bg-gray-50 font-medium text-sm text-gray-700"
            >
              <span>System Guide</span>
              {openSystemGuide ? (
                <ChevronUpIcon className="w-4 h-4 text-gray-500" />
              ) : (
                <ChevronDownIcon className="w-4 h-4 text-gray-500" />
              )}
            </button>
            {openSystemGuide && (
              <div className="bg-gray-50 border-t border-b">
                {[
                  { key: 'dashboard', label: 'Dashboard Guide' },
                  { key: 'cataloging', label: 'Cataloging Guide' },
                  { key: 'accessions', label: 'Accessions Guide' },
                  { key: 'acquisitions', label: 'Acquisitions Guide' },
                  { key: 'usermanagement', label: 'User Management Guide' },
                  { key: 'security', label: 'Security Guide' }
                ].map(({ key, label }) => (
                  <button
                    key={key}
                    onClick={() => openGuideModal(key)}
                    className="block w-full px-12 py-3 text-left text-sm text-gray-600 hover:bg-gray-100"
                  >
                    {label}
                  </button>
                ))}
              </div>
            )}

            {/* Troubleshooting */}
            <button
              onClick={() => setOpenTroubleshooting(!openTroubleshooting)}
              className="w-full flex justify-between items-center px-8 py-4 text-left hover:bg-gray-50 font-medium text-sm text-gray-700"
            >
              <span>Troubleshooting Guide</span>
              {openTroubleshooting ? (
                <ChevronUpIcon className="w-4 h-4 text-gray-500" />
              ) : (
                <ChevronDownIcon className="w-4 h-4 text-gray-500" />
              )}
            </button>
            {openTroubleshooting && (
              <div className="bg-gray-50 border-t">
                {[
                  { key: 'loginproblem', label: 'Login Problem' },
                  { key: 'performanceslowdown', label: 'Performance Slowdown' },
                  { key: 'datasync', label: 'Data Synchronization Errors' }
                ].map(({ key, label }) => (
                  <button
                    key={key}
                    onClick={() => openGuideModal(key)}
                    className="block w-full px-12 py-3 text-left text-sm text-gray-600 hover:bg-gray-100"
                  >
                    {label}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* MODAL — smaller, centered */}
      {activeGuide && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-4xl flex flex-col" style={{ height: '85vh' }}>
            {/* Header */}
            <div className="flex justify-between items-center px-6 py-5 flex-shrink-0" style={{ backgroundColor: '#1a4f8a' }}>
              <h2 className="font-semibold text-white text-base">
                {{
                  dashboard: 'Dashboard',
                  cataloging: 'Cataloging',
                  accessions: 'Accessions',
                  acquisitions: 'Acquisitions',
                  usermanagement: 'User Management',
                  security: 'Security',
                  loginproblem: 'Login Problem',
                  performanceslowdown: 'Performance Slowdown',
                  datasync: 'Data Synchronization Errors'
                }[activeGuide]} Guide
              </h2>
              <button onClick={closeModal} className="text-white/70 hover:text-white">
                <XMarkIcon className="w-5 h-5" />
              </button>
            </div>

            {/* Image placeholder */}
            <div className="mx-6 mt-5 flex-shrink-0 h-96 bg-gray-100 rounded-lg flex items-center justify-center text-sm text-gray-400">
              Image Placeholder (Page {pageIndex + 1})
            </div>

            {/* Instruction — scrollable */}
            <div className="px-6 py-5 flex-1 overflow-y-auto text-base text-gray-700 leading-relaxed">
              {guideContent[activeGuide][pageIndex].text}
            </div>

            {/* Navigation */}
            <div className="flex items-center justify-between px-6 py-4 border-t flex-shrink-0">
              <button
                onClick={prevPage}
                disabled={pageIndex === 0}
                className="disabled:opacity-30 text-gray-500 hover:text-gray-700"
              >
                <ArrowLeftCircleIcon className="w-9 h-9" />
              </button>
              <span className="text-sm text-gray-500">
                {pageIndex + 1} / {guideContent[activeGuide].length}
              </span>
              <button
                onClick={nextPage}
                disabled={pageIndex === guideContent[activeGuide].length - 1}
                className="disabled:opacity-30 text-gray-500 hover:text-gray-700"
              >
                <ArrowRightCircleIcon className="w-9 h-9" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default HelpSupport