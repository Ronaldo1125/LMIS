"use client";

import React from 'react';
import { useRouter } from 'next/navigation';

const Footer = () => {
  const router = useRouter();

  const handleHome = () => router.push("/");
  const handleBrowse = () => router.push("/search");

  const handleNewRelease = (section = "recent") => {
    if (section === "recent") {
      if (window.location.pathname !== "/") {
        router.push("/#recent-additions");
      } else {
        const element = document.getElementById("recent-additions");
        if (element) {
          const offsetPosition = element.getBoundingClientRect().top + window.pageYOffset - 80;
          window.scrollTo({ top: offsetPosition, behavior: "smooth" });
        }
      }
    } else if (section === "news") {
      if (window.location.pathname !== "/") {
        router.push("/#news");
      } else {
        const element = document.getElementById("news");
        if (element) {
          const offsetPosition = element.getBoundingClientRect().top + window.pageYOffset - 80;
          window.scrollTo({ top: offsetPosition, behavior: "smooth" });
        }
      }
    }
  };

  const getQuickLinkAction = (link) => {
    switch (link) {
      case "Home": return handleHome;
      case "Browse": return handleBrowse;
      case "Recent Additions": return () => handleNewRelease("recent");
      case "News": return () => handleNewRelease("news");
      default: return () => {};
    }
  };

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: `
        .lmis-footer {
          background-color: #172554;
          padding: 4rem 3rem 2.5rem;
          color: #ffffff;
          font-family: inherit;
          display: flex;
          flex-direction: column;
        }

        .lmis-footer-inner {
          max-width: 1900px;
          margin: 0 auto;
          display: flex;
          flex-direction: column;
          flex: 1;
          width: 100%;
        }

        .lmis-footer-grid {
          display: grid;
          grid-template-columns: 1.2fr 1fr 1.4fr 0.9fr 0.9fr;
          gap: 3rem;
          margin-bottom: 5rem;
        }

        .lmis-footer-col-title {
          font-size: 0.85rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin-bottom: 1.5rem;
          color: #ffffff;
        }

        .lmis-footer-links {
          list-style: none;
          padding: 0;
          margin: 0;
          display: flex;
          flex-direction: column;
          gap: 0.7rem;
        }

        .lmis-footer-link {
          color: rgba(255,255,255,0.7);
          text-decoration: none;
          font-size: 1rem;
          font-weight: 400;
          transition: color 0.2s;
          background: none;
          border: none;
          padding: 0;
          cursor: pointer;
          text-align: left;
        }

        .lmis-footer-link:hover {
          color: #ffffff;
        }

        .lmis-footer-text {
          color: rgba(255,255,255,0.7);
          font-size: 1rem;
          font-weight: 400;
          margin: 0;
          line-height: 1.7;
        }

        .lmis-footer-bottom {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding-top: 1.5rem;
          border-top: 1px solid rgba(255,255,255,0.15);
        }

        .lmis-footer-bottom-mobile {
          display: none;
          flex-direction: column;
          align-items: center;
          padding-top: 1.5rem;
          border-top: 1px solid rgba(255,255,255,0.15);
          gap: 0.3rem;
        }

        .lmis-footer-copyright {
          font-size: 0.85rem;
          color: rgba(255,255,255,0.5);
          font-weight: 400;
          margin: 0;
        }

        .lmis-footer-dev {
          font-size: 0.85rem;
          color: rgba(255,255,255,0.5);
          font-weight: 400;
          margin: 0;
        }

        .lmis-footer-dev a {
          color: #ffffff;
          text-decoration: none;
          font-weight: 500;
        }

        .lmis-footer-dev a:hover {
          text-decoration: underline;
        }

        .lmis-footer-mobile-only {
          display: none;
        }

        @media (max-width: 1024px) {
          .lmis-footer-grid {
            grid-template-columns: 1fr 1fr 1fr;
            gap: 2.5rem;
          }
          .lmis-footer-brand {
            grid-column: span 3;
          }
        }

        @media (max-width: 768px) {
          .lmis-footer {
            padding: 3rem 1.5rem 2rem;
          }
          .lmis-footer-grid {
            grid-template-columns: 1fr 1fr;
            gap: 2rem;
            margin-bottom: 3rem;
          }
          .lmis-footer-brand {
            grid-column: span 2;
          }
        }

        @media (max-width: 640px) {
          .lmis-footer {
            padding: 2.5rem 1.5rem 1.5rem;
          }
          .lmis-footer-grid {
            grid-template-columns: 1fr 1fr;
            gap: 2.5rem 2rem;
            margin-bottom: 0;
          }
          .lmis-footer-brand {
            grid-column: span 2;
          }
          .lmis-footer-col-contact {
            order: 2;
          }
          .lmis-footer-col-quicklinks {
            order: 1;
          }
          .lmis-footer-col-resources {
            order: 3;
          }
          .lmis-footer-col-support {
            order: 4;
          }
          .lmis-footer-bottom {
            display: none;
          }
          .lmis-footer-bottom-mobile {
            display: flex;
            flex-direction: row;
            justify-content: space-between;
            align-items: center;
          }
          .lmis-footer-mobile-only {
            display: block;
          }
          .lmis-footer-links {
            gap: 0.4rem;
          }
          .lmis-footer-copyright {
            color: #ffffff;
          }
        }
      `}} />

      <footer className="lmis-footer">
        <div className="lmis-footer-inner">
          <div className="lmis-footer-grid">
            {/* Logo */}
            <div className="lmis-footer-brand">
              <img
                src="/assets/other/depdevlogo.png"
                alt="Depdev Logo"
                style={{ width: 160, height: 'auto', objectFit: 'contain', filter: 'brightness(0) invert(1)', opacity: 0.9 }}
              />
            </div>

            {/* Quick Links */}
            <div className="lmis-footer-col-quicklinks">
              <h4 className="lmis-footer-col-title">Quick Links</h4>
              <ul className="lmis-footer-links">
                {["Home", "Browse", "Recent Additions", "News"].map((link) => (
                  <li key={link}>
                    <button className="lmis-footer-link" onClick={getQuickLinkAction(link)}>
                      {link}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Resources */}
            <div className="lmis-footer-col-resources">
              <h4 className="lmis-footer-col-title">Resources</h4>
              <ul className="lmis-footer-links">
                {[
                  { label: "Books", category: "books" },
                  { label: "Sourcebooks", category: "sourcebooks" },
                  { label: "Periodicals", category: "periodicals" },
                  { label: "Thesis / Research papers", category: "thesis" },
                  { label: "Statute / Law / Legal documents", category: "statute" },
                  { label: "Guide / Manuals", category: "guides" },
                  { label: "Report", category: "reports" },
                  { label: "Reference Materials", category: "reference" },
                ].map((resource) => (
                  <li key={resource.category}>
                    <a href={`/search?category=${resource.category}`} className="lmis-footer-link">
                      {resource.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact */}
            <div className="lmis-footer-col-contact">
              <h4 className="lmis-footer-col-title">Contact</h4>
              <ul className="lmis-footer-links">
                <li><span className="lmis-footer-text">Email: info@lmis.edu</span></li>
                <li><span className="lmis-footer-text">Phone: +1 (555) 123-4567</span></li>
              </ul>
            </div>

            {/* Support */}
            <div className="lmis-footer-col-support">
              <h4 className="lmis-footer-col-title">Support</h4>
              <ul className="lmis-footer-links">
                <li><a href="/privacy-terms" className="lmis-footer-link">Privacy Policy</a></li>
                <li><a href="/privacy-terms" className="lmis-footer-link">Terms of Service</a></li>
              </ul>
            </div>
          </div>

          <div className="lmis-footer-mobile-only" style={{ marginTop: '2.5rem', marginBottom: '4rem' }}>
            <h4 className="lmis-footer-col-title">Developed by</h4>
            <ul className="lmis-footer-links">
              <li><a href="https://www.linkedin.com/in/jake-macua/" target="_blank" rel="noopener noreferrer" className="lmis-footer-link">Jake Macua</a></li>
              <li><a href="https://www.linkedin.com/in/anzelbotin/" target="_blank" rel="noopener noreferrer" className="lmis-footer-link">Anzel Botin</a></li>
              <li><a href="https://www.linkedin.com/in/michaelalatraca/" target="_blank" rel="noopener noreferrer" className="lmis-footer-link">Mich Alatraca</a></li>
              <li><a href="https://www.linkedin.com/in/charles-loneza-282b15387/" target="_blank" rel="noopener noreferrer" className="lmis-footer-link">Charles Ethan Loneza</a></li>
            </ul>
          </div>

          <div className="lmis-footer-bottom">
            <p className="lmis-footer-copyright">
              © {new Date().getFullYear()} All rights reserved.
            </p>
            <p className="lmis-footer-dev">
              Developed by: <a href="https://www.linkedin.com/in/jake-macua/" target="_blank" rel="noopener noreferrer">Jake M.</a>, <a href="https://www.linkedin.com/in/michaelalatraca/" target="_blank" rel="noopener noreferrer">Michael A.</a>, <a href="https://www.linkedin.com/in/charles-loneza-282b15387/" target="_blank" rel="noopener noreferrer">Charles L.</a>, <a href="https://www.linkedin.com/in/anzelbotin/" target="_blank" rel="noopener noreferrer">Anzel Victor B.</a>
            </p>
          </div>

          <div className="lmis-footer-bottom-mobile">
            <p className="lmis-footer-copyright">
              DEPDEV LMIS
            </p>
            <p className="lmis-footer-copyright">
              © {new Date().getFullYear()} All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer;
