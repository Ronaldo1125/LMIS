"use client";



import React, { useState, useEffect } from "react";

import Image from "next/image";

import { ChevronLeft, ChevronRight } from "lucide-react";





const BG_POOL = ["#dce8f5", "#e0ecf8", "#d6e5f5", "#e8f0fb", "#d0e4f7"];

const getBg = (i) => BG_POOL[i % BG_POOL.length];





const Placeholder = () => (

  <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="#0057b8" strokeWidth="1.2" opacity="0.35">

    <path d="M2 3h6a4 4 0 014 4v14a3 3 0 00-3-3H2z" />

    <path d="M22 3h-6a4 4 0 00-4 4v14a3 3 0 013-3h7z" />

  </svg>

);





const SkeletonCard = ({ large }) => (

  <div>

    <div style={{

      background: "#e8eef6",

      aspectRatio: "16/9",

      marginBottom: 18,

      animation: "pulse 1.5s ease-in-out infinite",

    }} />

    <div style={{ height: 12, width: "40%", background: "#e8eef6", borderRadius: 4, marginBottom: 10, animation: "pulse 1.5s ease-in-out infinite" }} />

    <div style={{ height: large ? 20 : 16, width: "90%", background: "#e8eef6", borderRadius: 4, marginBottom: 8, animation: "pulse 1.5s ease-in-out infinite" }} />

    <div style={{ height: large ? 20 : 16, width: "70%", background: "#e8eef6", borderRadius: 4, marginBottom: 12, animation: "pulse 1.5s ease-in-out infinite" }} />

    <div style={{ height: 12, width: "30%", background: "#e8eef6", borderRadius: 4, animation: "pulse 1.5s ease-in-out infinite" }} />

  </div>

);





const News = () => {

  const [newsItems, setNewsItems] = useState([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState(null);

  const [currentSlide, setCurrentSlide] = useState(0);

  const [windowWidth, setWindowWidth] = useState(0);



 

  const getResponsiveConfig = () => {

    if (windowWidth < 640) { // Mobile

      return {

        headerPadding: "20px 16px 16px",

        contentPadding: "0 16px",

        gridColumns: "1fr",

        gap: 16,

        titleSize: 20,

        itemsPerSlide: 1,

        cardTitleSize: 14,

        minCardHeight: 280

      };

    } else if (windowWidth < 768) { // Tablet

      return {

        headerPadding: "32px 24px 16px",

        contentPadding: "0 24px",

        gridColumns: "1fr 1fr",

        gap: 24,

        titleSize: 22,

        itemsPerSlide: 2,

        cardTitleSize: 16,

        minCardHeight: 300

      };

    } else if (windowWidth < 1024) { 

      return {

        headerPadding: "40px 32px 18px",

        contentPadding: "0 32px",

        gridColumns: "2fr 1fr 1fr",

        gap: 28,

        titleSize: 24,

        itemsPerSlide: 3,

        cardTitleSize: 18,

        minCardHeight: 320

      };

    } else { 

      return {

        headerPadding: "48px 48px 24px",

        contentPadding: "0 48px",

        gridColumns: "2fr 1fr 1fr",

        gap: 32,

        titleSize: 25,

        itemsPerSlide: 3,

        cardTitleSize: 18,

        minCardHeight: 320

      };

    }

  };



  const config = getResponsiveConfig();



  

  useEffect(() => {

    const handleResize = () => setWindowWidth(window.innerWidth);

    handleResize();

    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);

  }, []);



  

  useEffect(() => {

    const load = async () => {

      setLoading(true);

      setError(null);

      try {

        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/news`);

        if (!res.ok) throw new Error(`HTTP ${res.status}`);

        const raw = await res.json();



        const hydrated = raw.map((item, idx) => ({

          ...item,

     

          ogImage: item.thumbnail || null,

          bg: getBg(idx),

          category: item.category || "News",

          formattedDate: item.created_at

            ? new Date(item.created_at).toLocaleDateString("en-US", {

                year: "numeric", month: "long", day: "numeric",

              })

            : "",

        }));



        setNewsItems(hydrated);

      } catch (err) {

        setError(err.message);

      } finally {

        setLoading(false);

      }

    };



    load();

  }, []);



  

  const slides = [];

  for (let i = 0; i < newsItems.length; i += config.itemsPerSlide) {

    slides.push(newsItems.slice(i, i + config.itemsPerSlide));

  }



  const prev = () => setCurrentSlide((s) => Math.max(s - 1, 0));

  const next = () => setCurrentSlide((s) => Math.min(s + 1, slides.length - 1));

  const current = slides[currentSlide] || [];



  return (

    <>

      <style>{`

        @keyframes pulse {

          0%, 100% { opacity: 1; }

          50% { opacity: 0.5; }

        }

        .news-card-link:hover h3 { color: #0057b8 !important; }

        .news-card-link:hover { text-decoration: none; }

      `}</style>



      <div style={{ background: "#fff" }}>

      

        <div style={{

          display: "flex",

          alignItems: windowWidth < 640 ? "flex-start" : "center",

          justifyContent: "space-between",

          padding: config.headerPadding,

          maxWidth: 1700,

          marginLeft: "auto",

          marginRight: "auto",

          gap: 16,

          flexDirection: windowWidth < 640 ? "column" : "row",

        }}>

          <div style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between" }}>

            <h2 style={{ fontSize: config.titleSize, fontWeight: 600, color: "#000000ff", margin: 0 }}>

              {windowWidth < 640 ? "News" : "DEPDev 5 News"}

            </h2>

            

          

            {windowWidth < 640 && (

              <div style={{ display: "flex", gap: 8 }}>

                {[

                  { fn: prev, disabled: currentSlide === 0, Icon: ChevronLeft },

                  { fn: next, disabled: currentSlide === slides.length - 1 || slides.length === 0, Icon: ChevronRight },

                ].map(({ fn, disabled, Icon }, idx) => (

                  <button

                    key={idx}

                    onClick={fn}

                    disabled={disabled}

                    style={{

                      width: 36, height: 32, borderRadius: 8,

                      border: "1px solid #d1d8e8",

                      background: disabled ? "#f5f7fa" : "#fff",

                      color: disabled ? "#c0c8d8" : "#003087",

                      display: "flex", alignItems: "center", justifyContent: "center",

                      cursor: disabled ? "not-allowed" : "pointer",

                      transition: "background 0.15s",

                    }}

                  >

                    <Icon size={16} />

                  </button>

                ))}

              </div>

            )}

          </div>



         

          {windowWidth >= 640 && (

            <div style={{ display: "flex", alignItems: "center", gap: 16 }}>

              <div style={{ display: "flex", gap: 8 }}>

                {[

                  { fn: prev, disabled: currentSlide === 0, Icon: ChevronLeft },

                  { fn: next, disabled: currentSlide === slides.length - 1 || slides.length === 0, Icon: ChevronRight },

                ].map(({ fn, disabled, Icon }, idx) => (

                  <button

                    key={idx}

                    onClick={fn}

                    disabled={disabled}

                    style={{

                      width: 40, height: 40, borderRadius: 8,

                      border: "1px solid #d1d8e8",

                      background: disabled ? "#f5f7fa" : "#fff",

                      color: disabled ? "#c0c8d8" : "#003087",

                      display: "flex", alignItems: "center", justifyContent: "center",

                      cursor: disabled ? "not-allowed" : "pointer",

                      transition: "background 0.15s",

                    }}

                  >

                    <Icon size={18} />

                  </button>

                ))}

              </div>

            </div>

          )}

        </div>



       

        {error && (

          <div style={{ maxWidth: 1700, margin: "0 auto", padding: `0 ${config.contentPadding} 40px`, color: "#dc2626", fontSize: 12 }}>

            Failed to load news: {error}

          </div>

        )}



       

        <div style={{

          maxWidth: 1700,

          margin: "0 auto",

          padding: config.contentPadding,

          display: "grid",

          gridTemplateColumns: config.gridColumns,

          gap: config.gap,

          marginBottom: 40,

          minHeight: config.minCardHeight,

        }}>

          {loading

            ? [0, 1, 2].map((i) => <SkeletonCard key={i} large={i === 0} />)

            : current.length === 0

            ? (

              <div style={{ gridColumn: "1/-1", textAlign: "center", color: "#9ca3af", padding: "60px 0", fontSize: 13 }}>

                No news available at the moment.

              </div>

            )

            : current.map((item) => (

              <a

                key={item.id}

                href={item.url || "#"}

                target={item.url ? "_blank" : "_self"}

                rel="noopener noreferrer"

                className="news-card-link"

                style={{ cursor: "pointer", textDecoration: "none", color: "inherit" }}

              >

            

                <div style={{

                  background: item.bg,

                  marginBottom: 18,

                  aspectRatio: "16/9",

                  display: "flex",

                  alignItems: "center",

                  justifyContent: "center",

                  overflow: "hidden",

                  position: "relative",

                }}>

                  {item.ogImage ? (

                    <Image

                      src={item.ogImage}

                      alt={item.title}

                      fill

                      style={{ objectFit: "cover" }}

                      onError={(e) => {

                        e.target.style.display = "none";

                      }}

                    />

                  ) : (

                    <Placeholder />

                  )}

                </div>



              

                <div style={{

                  fontSize: 11, fontWeight: 700, color: "#0057b8",

                  textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 8,

                }}>

                  {item.category}

                </div>



               

                <h3 style={{

                  fontSize: config.cardTitleSize,

                  fontWeight: 600, lineHeight: 1.4,

                  margin: "0 0 10px 0", color: "#111827",

                  transition: "color 0.15s",

                  ...(windowWidth < 640 && { lineHeight: 1.3 } ),

                }}>

                  {item.title}

                </h3>



              

                <div style={{ fontSize: 11, color: "#9ca3af" }}>{item.formattedDate}</div>

              </a>

            ))

          }

        </div>

      </div>

    </>

  );

};



export default News;