import { useState } from 'react'
import { ArrowLeftIcon, ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/outline'

const faqs = [
  {
    question: 'How do I search for a book or resource?',
    answer: 'Use the search bar at the top of any page. You can search by title, author, ISBN, or subject. Use filters to narrow results by category, availability, or year.'
  },
  {
    question: 'How do I borrow or request a physical item?',
    answer: "Find the item you want and click \"Request Borrow\". Staff will be notified and the item will be reserved under your name. You will receive a notification when it's ready for pickup."
  },
  {
    question: 'How do I download a digital resource?',
    answer: 'Navigate to the digital collection, find your resource, and click "Download". Downloads are tracked in your account under My Downloads.'
  },
  {
    question: 'Who do I contact if I find a missing or damaged item?',
    answer: 'Report it to the active librarian or any staff member. You can also use the form below to send a message directly.'
  },
  {
    question: 'How do I reset my password?',
    answer: 'Go to My Profile from the top-right account menu. You can set a new password there. If you are locked out, contact your administrator.'
  },
  {
    question: 'I encountered an error or bug — what should I do?',
    answer: 'Please describe the issue in the contact form below or report it directly to your system administrator. Include what page you were on and what you were trying to do.'
  }
]

const HelpSupport = ({ setCurrentView }) => {
  const [openFaq, setOpenFaq] = useState(null)
  const [form, setForm] = useState({ subject: '', message: '' })
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    // Wire up to your backend or email service as needed
    setSubmitted(true)
    setForm({ subject: '', message: '' })
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-2xl mx-auto">
        {/* Back */}
        <button
          onClick={() => setCurrentView('dashboard')}
          className="flex items-center gap-2 text-sm text-gray-600 hover:text-[var(--dark-blue-1)] mb-6 transition-colors"
        >
          <ArrowLeftIcon className="w-4 h-4" />
          Back to Dashboard
        </button>

        {/* Hero */}
        <div className="bg-gradient-to-r from-[var(--dark-blue-1)] to-[var(--dark-blue-2)] rounded-2xl p-6 mb-6 text-white">
          <h1 className="text-2xl font-bold mb-1">Help & Support</h1>
          <p className="text-white/75 text-sm">
            Find answers to common questions or reach out to your administrator.
          </p>
        </div>

        {/* FAQ */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-6">
          <div className="px-6 py-4 border-b border-gray-100">
            <h2 className="font-semibold text-gray-900">Frequently Asked Questions</h2>
          </div>
          <div className="divide-y divide-gray-100">
            {faqs.map((faq, i) => (
              <div key={i}>
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between px-6 py-4 text-left hover:bg-gray-50 transition-colors"
                >
                  <span className="text-sm font-medium text-gray-800 pr-4">{faq.question}</span>
                  {openFaq === i
                    ? <ChevronUpIcon className="w-4 h-4 text-gray-400 flex-shrink-0" />
                    : <ChevronDownIcon className="w-4 h-4 text-gray-400 flex-shrink-0" />
                  }
                </button>
                {openFaq === i && (
                  <div className="px-6 pb-4 text-sm text-gray-600 leading-relaxed">
                    {faq.answer}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Contact form */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h2 className="font-semibold text-gray-900 mb-1">Contact Administrator</h2>
          <p className="text-sm text-gray-500 mb-5">Can't find what you need? Send a message.</p>

          {submitted ? (
            <div className="text-center py-8">
              <div className="w-14 h-14 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-3">
                <svg className="w-7 h-7 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-900 mb-1">Message Sent</h3>
              <p className="text-sm text-gray-500">Your administrator will get back to you shortly.</p>
              <button
                onClick={() => setSubmitted(false)}
                className="mt-4 text-sm text-[var(--dark-blue-2)] hover:underline"
              >
                Send another message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                <input
                  type="text"
                  value={form.subject}
                  onChange={(e) => setForm(f => ({ ...f, subject: e.target.value }))}
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-300 text-sm focus:outline-none focus:border-[var(--dark-blue-2)] focus:ring-2 focus:ring-[var(--dark-blue-2)] focus:ring-opacity-30"
                  placeholder="Briefly describe your issue"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                <textarea
                  rows={5}
                  value={form.message}
                  onChange={(e) => setForm(f => ({ ...f, message: e.target.value }))}
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-300 text-sm focus:outline-none focus:border-[var(--dark-blue-2)] focus:ring-2 focus:ring-[var(--dark-blue-2)] focus:ring-opacity-30 resize-none"
                  placeholder="Describe your question or issue in detail..."
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full py-2.5 rounded-lg bg-[var(--dark-blue-1)] text-white font-medium text-sm hover:bg-[var(--dark-blue-2)] transition-colors"
              >
                Send Message
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}

export default HelpSupport