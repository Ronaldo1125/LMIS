import { useState } from 'react'
import {
  ArrowLeftIcon, BookOpenIcon, XMarkIcon,
  ArrowLeftCircleIcon, ArrowRightCircleIcon,
  WrenchScrewdriverIcon, Squares2X2Icon, ChevronRightIcon,
  MagnifyingGlassIcon, LightBulbIcon,
  ShieldCheckIcon, ClockIcon,
  CheckCircleIcon, InformationCircleIcon,
} from '@heroicons/react/24/outline'

/* ═══════════════════════════════════════════
   SVG ILLUSTRATIONS
═══════════════════════════════════════════ */

const IllDashStats = ({ d }) => (
  <svg viewBox="0 0 640 260" width="100%" height="100%">
    <rect width="640" height="260" fill={d ? '#060e20' : '#eef2f9'} />
    <rect width="128" height="260" fill={d ? '#0c1a30' : '#1e3a6e'} />
    {[0,1,2,3,4].map(i => (
      <g key={i}>
        <rect x="10" y={52+i*40} width="108" height="30" rx="6"
          fill={i===0 ? 'rgba(59,130,246,0.35)' : 'transparent'} />
        <rect x="14" y={62+i*40} width="10" height="10" rx="2"
          fill={i===0 ? '#60a5fa' : 'rgba(255,255,255,0.18)'} />
        <rect x="30" y={64+i*40} width="60" height="7" rx="3"
          fill={i===0 ? 'rgba(255,255,255,0.85)' : 'rgba(255,255,255,0.25)'} />
      </g>
    ))}
    <rect x="128" y="0" width="512" height="40" fill={d ? '#0c1a30' : '#fff'} />
    <rect x="144" y="14" width="100" height="10" rx="5" fill={d ? '#1a3356' : '#e2e8f0'} />
    {[
      { x:144, c:'#3b82f6', label:'Total Books',  val:'12,480' },
      { x:268, c:'#10b981', label:'Members',      val:'3,240'  },
      { x:392, c:'#f59e0b', label:'Borrowed',     val:'892'    },
      { x:516, c:'#ef4444', label:'Overdue',      val:'47'     },
    ].map(s => (
      <g key={s.x}>
        <rect x={s.x} y="48" width="108" height="66" rx="10"
          fill={d ? '#0c1a30' : '#fff'} stroke={d ? '#1a3356' : '#e2e8f0'} strokeWidth="1" />
        <rect x={s.x+10} y="58" width="26" height="26" rx="7" fill={s.c + '28'} />
        <rect x={s.x+17} y="65" width="12" height="12" rx="3" fill={s.c} />
        <rect x={s.x+10} y="92" width="52" height="8" rx="4" fill={d ? '#1a3356' : '#e2e8f0'} />
        <rect x={s.x+10} y="103" width="34" height="6" rx="3" fill={d ? '#0d1d35' : '#f1f5f9'} />
      </g>
    ))}
    <rect x="144" y="126" width="258" height="122" rx="10"
      fill={d ? '#0c1a30' : '#fff'} stroke={d ? '#1a3356' : '#e2e8f0'} strokeWidth="1" />
    <rect x="158" y="138" width="80" height="8" rx="4" fill={d ? '#1a3356' : '#e2e8f0'} />
    {[50,80,38,95,65,86].map((h, i) => (
      <rect key={i} x={162+i*34} y={234-h} width="20" height={h} rx="4"
        fill={`rgba(59,130,246,${0.35+i*0.1})`} />
    ))}
    <rect x="416" y="126" width="210" height="122" rx="10"
      fill={d ? '#0c1a30' : '#fff'} stroke={d ? '#1a3356' : '#e2e8f0'} strokeWidth="1" />
    <rect x="430" y="138" width="80" height="8" rx="4" fill={d ? '#1a3356' : '#e2e8f0'} />
    {[0,1,2,3].map(i => (
      <g key={i}>
        <circle cx="442" cy={160+i*24} r="7" fill={d ? '#1a3356' : '#dbeafe'} />
        <rect x="455" y={155+i*24} width="66" height="7" rx="3" fill={d ? '#1a3356' : '#e2e8f0'} />
        <rect x="455" y={165+i*24} width="42" height="5" rx="3" fill={d ? '#0d1d35' : '#f1f5f9'} />
      </g>
    ))}
    <path d="M516 48 L516 34 L468 34" stroke="#ef4444" strokeWidth="1.5" strokeDasharray="4 2" fill="none" />
    <rect x="298" y="24" width="170" height="18" rx="6" fill="#ef444414" stroke="#ef4444" strokeWidth="1" />
    <text x="308" y="37" fill="#ef4444" fontSize="9.5" fontFamily="sans-serif">Red number = needs attention</text>
  </svg>
)

const IllDashNav = ({ d }) => (
  <svg viewBox="0 0 640 260" width="100%" height="100%">
    <rect width="640" height="260" fill={d ? '#060e20' : '#eef2f9'} />
    <rect width="128" height="260" fill={d ? '#0c1a30' : '#1e3a6e'} />
    {['Dashboard','Cataloging','Accessions','Acquisitions','Users','Security'].map((m, i) => (
      <g key={m}>
        <rect x="10" y={44+i*36} width="108" height="28" rx="6"
          fill={i===1 ? 'rgba(59,130,246,0.35)' : 'transparent'} />
        <rect x="14" y={54+i*36} width="10" height="9" rx="2"
          fill={i===1 ? '#60a5fa' : 'rgba(255,255,255,0.2)'} />
        <rect x="30" y={55+i*36} width={i===1 ? 65 : 50} height="6" rx="3"
          fill={i===1 ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.28)'} />
        {i===5 && <rect x="10" y={44+i*36} width="108" height="28" rx="6" fill="rgba(220,38,38,0.2)" />}
      </g>
    ))}
    <path d="M120 58 L148 58" stroke="#60a5fa" strokeWidth="2" fill="none" />
    <path d="M145 54 L150 58 L145 62" stroke="#60a5fa" strokeWidth="1.5" fill="none" />
    <rect x="150" y="46" width="178" height="24" rx="7" fill="#3b82f614" stroke="#3b82f6" strokeWidth="1" />
    <text x="162" y="62" fill="#3b82f6" fontSize="9.5" fontFamily="sans-serif">Active module = blue highlight</text>
    <rect x="128" y="0" width="512" height="38" fill={d ? '#0c1a30' : '#fff'} />
    <rect x="144" y="46" width="480" height="202" rx="10"
      fill={d ? '#0c1a30' : '#fff'} stroke={d ? '#1a3356' : '#e2e8f0'} strokeWidth="1" />
    <rect x="160" y="62" width="200" height="10" rx="5" fill={d ? '#1a3356' : '#e2e8f0'} />
    {[0,1,2,3,4].map(i => (
      <rect key={i} x="160" y={88+i*30} width="400" height="22" rx="6"
        fill={i%2===0 ? (d ? '#060e20' : '#f8fafc') : 'transparent'} />
    ))}
    <rect x="8" y={44+5*36} width="112" height="28" rx="6"
      fill="none" stroke="rgba(220,38,38,0.7)" strokeWidth="1.5" strokeDasharray="3 2" />
    <rect x="148" y={220} width="180" height="20" rx="6" fill="#dc262614" stroke="#dc2626" strokeWidth="1" />
    <text x="158" y="233" fill="#dc2626" fontSize="9" fontFamily="sans-serif">Admin-only modules at the bottom</text>
  </svg>
)

const IllCatalogTable = ({ d }) => (
  <svg viewBox="0 0 640 260" width="100%" height="100%">
    <rect width="640" height="260" fill={d ? '#060e20' : '#eef2f9'} />
    <rect x="14" y="12" width="612" height="236" rx="12"
      fill={d ? '#0c1a30' : '#fff'} stroke={d ? '#1a3356' : '#e2e8f0'} strokeWidth="1" />
    <rect x="30" y="24" width="110" height="10" rx="5" fill={d ? '#1a3356' : '#e2e8f0'} />
    <rect x="470" y="18" width="140" height="32" rx="8" fill="#2563eb" />
    <rect x="484" y="30" width="108" height="8" rx="4" fill="rgba(255,255,255,0.9)" />
    <rect x="30" y="58" width="580" height="26" fill={d ? '#1a3356' : '#f1f5f9'} />
    {['Title','Author','ISBN','Category','Status'].map((h, i) => (
      <rect key={i} x={42+i*114} y="67" width="78" height="7" rx="3" fill={d ? '#2e4d70' : '#94a3b8'} />
    ))}
    {[0,1,2,3,4].map(i => (
      <g key={i}>
        <rect x="30" y={86+i*28} width="580" height="26"
          fill={i%2===0 ? (d ? '#060e20' : '#f8fafc') : 'transparent'} />
        {[0,1,2,3].map(j => (
          <rect key={j} x={42+j*114} y={95+i*28} width="78" height="7" rx="3" fill={d ? '#1a3356' : '#e2e8f0'} />
        ))}
        <rect x={42+4*114} y={93+i*28} width="54" height="14" rx="6"
          fill={['#10b98118','#f59e0b18','#10b98118','#ef444418','#10b98118'][i]} />
        <rect x={52+4*114} y={97+i*28} width="34" height="6" rx="3"
          fill={['#10b981','#f59e0b','#10b981','#ef4444','#10b981'][i]} />
      </g>
    ))}
    <path d="M470 18 L470 6 L398 6" stroke="#2563eb" strokeWidth="1.5" strokeDasharray="4 2" fill="none" />
    <rect x="222" y="0" width="178" height="14" rx="5" fill="#2563eb14" stroke="#2563eb" strokeWidth="1" />
    <text x="232" y="11" fill="#2563eb" fontSize="9" fontFamily="sans-serif">Click here to add a new book</text>
  </svg>
)

const IllCatalogForm = ({ d }) => (
  <svg viewBox="0 0 640 260" width="100%" height="100%">
    <rect width="640" height="260" fill={d ? '#060e20' : '#eef2f9'} />
    <rect width="640" height="260" fill="rgba(0,0,0,0.45)" />
    <rect x="88" y="10" width="464" height="240" rx="14"
      fill={d ? '#0c1a30' : '#fff'} stroke={d ? '#1a3356' : '#e2e8f0'} strokeWidth="1.5" />
    <rect x="88" y="10" width="464" height="44" rx="14" fill="#1a4f8a" />
    <rect x="88" y="34" width="464" height="20" fill="#1a4f8a" />
    <rect x="106" y="22" width="140" height="10" rx="5" fill="rgba(255,255,255,0.85)" />
    {[
      { label:'ISBN *',           y:68,  hi:true,  w:90  },
      { label:'Title *',          y:108, hi:true,  w:140 },
      { label:'Author *',         y:148, hi:false, w:110 },
      { label:'Classification *', y:188, hi:false, w:100 },
    ].map(f => (
      <g key={f.label}>
        <rect x="106" y={f.y} width="62" height="7" rx="3"
          fill={f.hi ? '#2563eb' : (d ? '#6b8cae' : '#64748b')} />
        <rect x="106" y={f.y+12} width="428" height="28" rx="8"
          fill={d ? '#060e20' : '#f8fafc'}
          stroke={f.hi ? '#2563eb' : (d ? '#1a3356' : '#e2e8f0')}
          strokeWidth={f.hi ? 2 : 1} />
        <rect x="118" y={f.y+22} width={f.w} height="7" rx="3" fill={d ? '#1a3356' : '#e2e8f0'} />
        {f.hi && <rect x="500" y={f.y+17} width="20" height="20" rx="5" fill="#2563eb18" />}
      </g>
    ))}
    <rect x="106" y="228" width="200" height="16" rx="7" fill="#2563eb" />
    <rect x="146" y="233" width="90" height="6" rx="3" fill="rgba(255,255,255,0.9)" />
    <text x="106" y="255" fill={d ? '#6b8cae' : '#64748b'} fontSize="9" fontFamily="sans-serif">
      Fields with blue border are required — fill all before saving
    </text>
  </svg>
)

const IllAccessionLog = ({ d }) => (
  <svg viewBox="0 0 640 260" width="100%" height="100%">
    <rect width="640" height="260" fill={d ? '#060e20' : '#eef2f9'} />
    <rect x="14" y="12" width="612" height="236" rx="12"
      fill={d ? '#0c1a30' : '#fff'} stroke={d ? '#1a3356' : '#e2e8f0'} strokeWidth="1" />
    <rect x="30" y="24" width="130" height="10" rx="5" fill={d ? '#1a3356' : '#e2e8f0'} />
    <rect x="462" y="18" width="148" height="32" rx="8" fill="#0891b2" />
    <rect x="476" y="30" width="116" height="8" rx="4" fill="rgba(255,255,255,0.9)" />
    <rect x="30" y="58" width="580" height="26" fill={d ? '#1a3356' : '#f1f5f9'} />
    {['Accession #','Title','Date Received','Supplier','Status'].map((h, i) => (
      <rect key={i} x={42+i*114} y="67" width="78" height="7" rx="3" fill={d ? '#2e4d70' : '#94a3b8'} />
    ))}
    {[0,1,2,3,4].map(i => (
      <g key={i}>
        <rect x="30" y={86+i*28} width="580" height="26"
          fill={i%2===0 ? (d ? '#060e20' : '#f8fafc') : 'transparent'} />
        {[0,1,2,3].map(j => (
          <rect key={j} x={42+j*114} y={95+i*28} width={j===0 ? 44 : 78} height="7" rx="3"
            fill={d ? '#1a3356' : '#e2e8f0'} />
        ))}
        <rect x={42+4*114} y={93+i*28} width="52" height="14" rx="6" fill="#10b98118" />
        <rect x={52+4*114} y={97+i*28} width="32" height="6" rx="3" fill="#10b981" />
      </g>
    ))}
    <path d="M462 18 L462 6 L390 6" stroke="#0891b2" strokeWidth="1.5" strokeDasharray="4 2" fill="none" />
    <rect x="198" y="0" width="194" height="14" rx="5" fill="#0891b214" stroke="#0891b2" strokeWidth="1" />
    <text x="208" y="11" fill="#0891b2" fontSize="9" fontFamily="sans-serif">Record each physical book arrival here</text>
  </svg>
)

const IllAccessionForm = ({ d }) => (
  <svg viewBox="0 0 640 260" width="100%" height="100%">
    <rect width="640" height="260" fill={d ? '#060e20' : '#eef2f9'} />
    <rect width="640" height="260" fill="rgba(0,0,0,0.45)" />
    <rect x="88" y="10" width="464" height="240" rx="14"
      fill={d ? '#0c1a30' : '#fff'} stroke={d ? '#1a3356' : '#e2e8f0'} strokeWidth="1.5" />
    <rect x="88" y="10" width="464" height="44" rx="14" fill="#0e7490" />
    <rect x="88" y="34" width="464" height="20" fill="#0e7490" />
    <rect x="106" y="22" width="160" height="10" rx="5" fill="rgba(255,255,255,0.85)" />
    {[
      { label:'Acquisition Date *', y:68,  req:true,  w:100, note:'Must match delivery receipt' },
      { label:'Supplier *',         y:114, req:true,  w:110, note:'Auto-complete from approved list' },
      { label:'Book Title',         y:160, req:false, w:140, note:'' },
      { label:'Quantity',           y:206, req:false, w:60,  note:'' },
    ].map(f => (
      <g key={f.label}>
        <rect x="106" y={f.y} width="80" height="7" rx="3"
          fill={f.req ? '#0891b2' : (d ? '#6b8cae' : '#64748b')} />
        <rect x="106" y={f.y+12} width="320" height="28" rx="8"
          fill={d ? '#060e20' : '#f8fafc'}
          stroke={f.req ? '#0891b2' : (d ? '#1a3356' : '#e2e8f0')}
          strokeWidth={f.req ? 2 : 1} />
        <rect x="118" y={f.y+22} width={f.w} height="7" rx="3" fill={d ? '#1a3356' : '#e2e8f0'} />
        {f.req && f.note !== '' && (
          <g>
            <rect x="440" y={f.y+16} width="106" height="16" rx="5"
              fill="#0891b218" stroke="#0891b2" strokeWidth="1" />
            <text x="448" y={f.y+27} fill="#0891b2" fontSize="8.5" fontFamily="sans-serif">{f.note}</text>
          </g>
        )}
      </g>
    ))}
    <text x="106" y="252" fill={d ? '#6b8cae' : '#64748b'} fontSize="9" fontFamily="sans-serif">
      Date &amp; Supplier are mandatory — they form the audit trail
    </text>
  </svg>
)

const IllAcqList = ({ d }) => (
  <svg viewBox="0 0 640 260" width="100%" height="100%">
    <rect width="640" height="260" fill={d ? '#060e20' : '#eef2f9'} />
    <rect x="14" y="12" width="612" height="236" rx="12"
      fill={d ? '#0c1a30' : '#fff'} stroke={d ? '#1a3356' : '#e2e8f0'} strokeWidth="1" />
    <rect x="30" y="22" width="580" height="32" rx="8" fill={d ? '#060e20' : '#f1f5f9'} />
    {['All Requests','Pending','Approved','Rejected'].map((t, i) => (
      <g key={t}>
        <rect x={38+i*124} y="26" width="112" height="24" rx="6"
          fill={i===0 ? (d ? 'rgba(37,99,235,0.22)' : '#dbeafe') : 'transparent'} />
        <rect x={54+i*124} y="34" width="72" height="7" rx="3"
          fill={i===0 ? '#2563eb' : (d ? '#2e4d70' : '#94a3b8')} />
      </g>
    ))}
    {[
      { label:'10 Science textbooks',  supplier:'Anvil Publishing', status:'Pending',  sc:'#f59e0b' },
      { label:'5 Reference books',     supplier:'National Books',   status:'Approved', sc:'#10b981' },
      { label:'8 Fiction novels',      supplier:'Rex Bookstore',    status:'Pending',  sc:'#f59e0b' },
      { label:'3 Encyclopedia sets',   supplier:'Anvil Publishing', status:'Rejected', sc:'#ef4444' },
    ].map((r, i) => (
      <g key={i}>
        <rect x="30" y={64+i*44} width="580" height="38" rx="8"
          fill={d ? '#060e20' : '#f8fafc'} stroke={d ? '#1a3356' : '#e2e8f0'} strokeWidth="1" />
        <rect x="46" y={74+i*44} width="170" height="8" rx="4" fill={d ? '#1a3356' : '#e2e8f0'} />
        <rect x="46" y={86+i*44} width="110" height="6" rx="3" fill={d ? '#0d1d35' : '#f1f5f9'} />
        <rect x="492" y={72+i*44} width="90" height="20" rx="7" fill={r.sc+'20'} />
        <rect x="504" y={79+i*44} width="66" height="6" rx="3" fill={r.sc} />
      </g>
    ))}
    <path d="M492 76 L570 50 L570 40" stroke="#f59e0b" strokeWidth="1.5" strokeDasharray="4 2" fill="none" />
    <rect x="488" y="28" width="106" height="14" rx="5" fill="#f59e0b14" stroke="#f59e0b" strokeWidth="1" />
    <text x="496" y="38" fill="#f59e0b" fontSize="9" fontFamily="sans-serif">Status badge per request</text>
  </svg>
)

const IllAcqBudget = ({ d }) => (
  <svg viewBox="0 0 640 260" width="100%" height="100%">
    <rect width="640" height="260" fill={d ? '#060e20' : '#eef2f9'} />
    <rect x="14" y="12" width="288" height="236" rx="12"
      fill={d ? '#0c1a30' : '#fff'} stroke={d ? '#1a3356' : '#e2e8f0'} strokeWidth="1" />
    <rect x="30" y="26" width="120" height="9" rx="4" fill={d ? '#1a3356' : '#e2e8f0'} />
    <rect x="30" y="46" width="256" height="14" rx="7" fill={d ? '#060e20' : '#f1f5f9'} />
    <rect x="30" y="46" width="180" height="14" rx="7" fill="#05966980" />
    <rect x="30" y="66" width="80" height="7" rx="3" fill={d ? '#1a3356' : '#e2e8f0'} />
    <rect x="200" y="66" width="62" height="7" rx="3" fill={d ? '#2e4d70' : '#94a3b8'} />
    <rect x="30" y="86" width="70" height="7" rx="3" fill={d ? '#6b8cae' : '#64748b'} />
    {['Anvil Publishing','National Books','Rex Bookstore'].map((s, i) => (
      <g key={s}>
        <rect x="30" y={100+i*46} width="256" height="38" rx="8"
          fill={d ? '#060e20' : '#f8fafc'} stroke={d ? '#1a3356' : '#e2e8f0'} strokeWidth="1" />
        <rect x="44" y={110+i*46} width="100" height="7" rx="3" fill={d ? '#1a3356' : '#e2e8f0'} />
        <rect x="44" y={121+i*46} width="70" height="5" rx="3" fill={d ? '#0d1d35' : '#f1f5f9'} />
        <circle cx="260" cy={119+i*46} r="7" fill="#05966920" />
      </g>
    ))}
    <rect x="318" y="12" width="308" height="236" rx="12"
      fill={d ? '#0c1a30' : '#fff'} stroke={d ? '#1a3356' : '#e2e8f0'} strokeWidth="1" />
    <rect x="334" y="26" width="150" height="9" rx="4" fill={d ? '#1a3356' : '#e2e8f0'} />
    {['Item','Supplier','Quantity','Budget Code'].map((f, i) => (
      <g key={f}>
        <rect x="334" y={48+i*48} width="60" height="7" rx="3" fill={d ? '#6b8cae' : '#64748b'} />
        <rect x="334" y={60+i*48} width="276" height="28" rx="8"
          fill={d ? '#060e20' : '#f8fafc'} stroke={d ? '#1a3356' : '#e2e8f0'} strokeWidth="1" />
        <rect x="346" y={70+i*48} width="100" height="7" rx="3" fill={d ? '#1a3356' : '#e2e8f0'} />
      </g>
    ))}
    <rect x="334" y="234" width="276" height="0" />
    <rect x="334" y="228" width="276" height="14" rx="7" fill="#059669" />
    <rect x="394" y="232" width="100" height="6" rx="3" fill="rgba(255,255,255,0.85)" />
  </svg>
)

const IllUserList = ({ d }) => (
  <svg viewBox="0 0 640 260" width="100%" height="100%">
    <rect width="640" height="260" fill={d ? '#060e20' : '#eef2f9'} />
    <rect x="14" y="12" width="612" height="236" rx="12"
      fill={d ? '#0c1a30' : '#fff'} stroke={d ? '#1a3356' : '#e2e8f0'} strokeWidth="1" />
    <rect x="30" y="24" width="110" height="10" rx="5" fill={d ? '#1a3356' : '#e2e8f0'} />
    <rect x="468" y="18" width="142" height="32" rx="8" fill="#d97706" />
    <rect x="482" y="30" width="110" height="8" rx="4" fill="rgba(255,255,255,0.9)" />
    <rect x="30" y="58" width="580" height="26" fill={d ? '#1a3356' : '#f1f5f9'} />
    {['Name','Username','Role','Status','Action'].map((h, i) => (
      <rect key={i} x={42+i*114} y="67" width="78" height="7" rx="3" fill={d ? '#2e4d70' : '#94a3b8'} />
    ))}
    {[
      { rc:'#7c3aed', role:'Admin'    },
      { rc:'#2563eb', role:'Librarian' },
      { rc:'#059669', role:'Staff'    },
      { rc:'#64748b', role:'Patron'   },
      { rc:'#64748b', role:'Patron'   },
    ].map((u, i) => (
      <g key={i}>
        <rect x="30" y={86+i*28} width="580" height="26"
          fill={i%2===0 ? (d ? '#060e20' : '#f8fafc') : 'transparent'} />
        <circle cx="56" cy={99+i*28} r="8" fill={u.rc+'22'} />
        <rect x="70" y={95+i*28} width="58" height="7" rx="3" fill={d ? '#1a3356' : '#e2e8f0'} />
        <rect x="160" y={95+i*28} width="58" height="7" rx="3" fill={d ? '#1a3356' : '#e2e8f0'} />
        <rect x="270" y={93+i*28} width="56" height="14" rx="6" fill={u.rc+'20'} />
        <rect x="278" y={97+i*28} width="40" height="6" rx="3" fill={u.rc} />
        <rect x="384" y={93+i*28} width="46" height="14" rx="6" fill="#10b98118" />
        <rect x="392" y={97+i*28} width="30" height="6" rx="3" fill="#10b981" />
        <rect x="496" y={93+i*28} width="40" height="14" rx="6" fill={d ? '#1a3356' : '#e2e8f0'} />
        <rect x="504" y={97+i*28} width="24" height="6" rx="3" fill={d ? '#6b8cae' : '#94a3b8'} />
      </g>
    ))}
    <path d="M468 18 L468 6 L396 6" stroke="#d97706" strokeWidth="1.5" strokeDasharray="4 2" fill="none" />
    <rect x="220" y="0" width="178" height="14" rx="5" fill="#d9770614" stroke="#d97706" strokeWidth="1" />
    <text x="230" y="11" fill="#d97706" fontSize="9" fontFamily="sans-serif">Click to create a new user account</text>
  </svg>
)

const IllUserRoles = ({ d }) => (
  <svg viewBox="0 0 640 260" width="100%" height="100%">
    <rect width="640" height="260" fill={d ? '#060e20' : '#eef2f9'} />
    <rect width="640" height="260" fill="rgba(0,0,0,0.45)" />
    <rect x="68" y="10" width="504" height="240" rx="14"
      fill={d ? '#0c1a30' : '#fff'} stroke={d ? '#1a3356' : '#e2e8f0'} strokeWidth="1.5" />
    <rect x="68" y="10" width="504" height="44" rx="14" fill="#92400e" />
    <rect x="68" y="34" width="504" height="20" fill="#92400e" />
    <rect x="86" y="22" width="160" height="10" rx="5" fill="rgba(255,255,255,0.85)" />
    <rect x="86" y="66" width="68" height="7" rx="3" fill={d ? '#6b8cae' : '#64748b'} />
    <rect x="86" y="78" width="468" height="32" rx="8"
      fill={d ? '#060e20' : '#f8fafc'} stroke="#d97706" strokeWidth="2" />
    <rect x="98" y="90" width="80" height="7" rx="3" fill={d ? '#1a3356' : '#e2e8f0'} />
    <text x="526" y="99" fill="#d97706" fontSize="13" fontFamily="sans-serif">▾</text>
    <rect x="86" y="114" width="468" height="102" rx="8"
      fill={d ? '#060e20' : '#f8fafc'} stroke={d ? '#1a3356' : '#e2e8f0'} strokeWidth="1" />
    {['Admin','Librarian','Staff','Patron'].map((r, i) => (
      <g key={r}>
        <rect x="86" y={114+i*25} width="468" height="25"
          fill={i===1 ? (d ? 'rgba(37,99,235,0.14)' : '#dbeafe') : 'transparent'} />
        <rect x="102" y={124+i*25} width="70" height="7" rx="3"
          fill={i===1 ? '#2563eb' : (d ? '#1a3356' : '#e2e8f0')} />
        {i===1 && <circle cx="536" cy={128+i*25} r="5" fill="#2563eb" />}
      </g>
    ))}
    <rect x="86" y="226" width="468" height="0" />
    {['Read','Write','Delete'].map((p, i) => (
      <g key={p}>
        <rect x={86+i*160} y="226" width="144" height="20" rx="7"
          fill={i<2 ? '#2563eb14' : '#ef444414'} stroke={i<2 ? '#2563eb' : '#ef4444'} strokeWidth="1" />
        <rect x={106+i*160} y="233" width="70" height="6" rx="3"
          fill={i<2 ? '#2563eb' : '#ef4444'} />
      </g>
    ))}
  </svg>
)

const IllSecurityPolicy = ({ d }) => (
  <svg viewBox="0 0 640 260" width="100%" height="100%">
    <rect width="640" height="260" fill={d ? '#060e20' : '#eef2f9'} />
    <rect x="14" y="12" width="284" height="236" rx="12"
      fill={d ? '#0c1a30' : '#fff'} stroke={d ? '#1a3356' : '#e2e8f0'} strokeWidth="1" />
    <rect x="30" y="26" width="120" height="9" rx="4" fill={d ? '#1a3356' : '#e2e8f0'} />
    {[
      { v:80,  c:'#10b981', label:'Min Length: 8 chars'  },
      { v:100, c:'#10b981', label:'Uppercase letter'     },
      { v:100, c:'#10b981', label:'Number required'      },
      { v:55,  c:'#f59e0b', label:'Special character'    },
      { v:68,  c:'#f59e0b', label:'Expires: 90 days'     },
    ].map((p, i) => (
      <g key={i}>
        <rect x="30" y={46+i*36} width="252" height="26" rx="6"
          fill={d ? '#060e20' : '#f8fafc'} stroke={d ? '#1a3356' : '#e2e8f0'} strokeWidth="1" />
        <rect x="42" y={54+i*36} width="100" height="6" rx="3" fill={d ? '#1a3356' : '#e2e8f0'} />
        <rect x="42" y={63+i*36} width={Math.round(p.v*1.5)} height="4" rx="2" fill={p.c} />
        <rect x={42+Math.round(p.v*1.5)} y={63+i*36} width={Math.round((100-p.v)*1.5)} height="4" rx="2"
          fill={d ? '#1a3356' : '#e2e8f0'} />
      </g>
    ))}
    <rect x="314" y="12" width="312" height="236" rx="12"
      fill={d ? '#0c1a30' : '#fff'} stroke={d ? '#1a3356' : '#e2e8f0'} strokeWidth="1" />
    <rect x="330" y="26" width="130" height="9" rx="4" fill={d ? '#1a3356' : '#e2e8f0'} />
    {[true,true,false,true,false].map((ok, i) => (
      <g key={i}>
        <rect x="330" y={46+i*36} width="280" height="28" rx="6"
          fill={ok ? (d ? '#060e20' : '#f8fafc') : (d ? 'rgba(239,68,68,0.07)' : '#fef2f2')}
          stroke={ok ? (d ? '#1a3356' : '#e2e8f0') : '#ef444440'} strokeWidth="1" />
        <circle cx="346" cy={60+i*36} r="6" fill={ok ? '#10b98120' : '#ef444420'} />
        <rect x="358" y={56+i*36} width="56" height="6" rx="3" fill={d ? '#1a3356' : '#e2e8f0'} />
        <rect x="358" y={66+i*36} width="40" height="5" rx="3" fill={d ? '#0d1d35' : '#f1f5f9'} />
        {!ok && (
          <g>
            <rect x="548" y={54+i*36} width="48" height="14" rx="5" fill="#ef444420" />
            <rect x="556" y={59+i*36} width="32" height="5" rx="3" fill="#ef4444" />
          </g>
        )}
      </g>
    ))}
    <rect x="328" y={46+2*36} width="284" height="28" rx="6"
      fill="none" stroke="#ef4444" strokeWidth="2" strokeDasharray="4 2" />
    <text x="348" y="248" fill="#ef4444" fontSize="9" fontFamily="sans-serif">Red rows = suspicious / failed logins</text>
  </svg>
)

const IllSecurityMatrix = ({ d }) => (
  <svg viewBox="0 0 640 260" width="100%" height="100%">
    <rect width="640" height="260" fill={d ? '#060e20' : '#eef2f9'} />
    <rect x="14" y="12" width="612" height="236" rx="12"
      fill={d ? '#0c1a30' : '#fff'} stroke={d ? '#1a3356' : '#e2e8f0'} strokeWidth="1" />
    <rect x="30" y="24" width="150" height="10" rx="5" fill={d ? '#1a3356' : '#e2e8f0'} />
    <rect x="30" y="44" width="580" height="26" rx="6" fill={d ? '#060e20' : '#f1f5f9'} />
    <rect x="42" y="53" width="70" height="7" rx="3" fill={d ? '#2e4d70' : '#94a3b8'} />
    {['Catalog','Accessions','Users','Reports','Settings'].map((h, i) => (
      <rect key={i} x={136+i*94} y="53" width="68" height="7" rx="3" fill={d ? '#2e4d70' : '#94a3b8'} />
    ))}
    {[
      { role:'Admin',     perms:[1,1,1,1,1], c:'#7c3aed' },
      { role:'Librarian', perms:[1,1,0,1,0], c:'#2563eb' },
      { role:'Staff',     perms:[1,0,0,0,0], c:'#059669' },
      { role:'Patron',    perms:[0,0,0,0,0], c:'#64748b' },
    ].map((r, i) => (
      <g key={r.role}>
        <rect x="30" y={72+i*42} width="580" height="34"
          fill={i%2===0 ? (d ? '#060e20' : '#f8fafc') : 'transparent'} />
        <rect x="42" y={82+i*42} width="70" height="8" rx="4" fill={r.c} />
        {r.perms.map((p, j) => (
          <g key={j}>
            <rect x={132+j*94} y={80+i*42} width="38" height="20" rx="6"
              fill={p ? '#10b98120' : '#ef444420'} />
            <rect x={140+j*94} y={87+i*42} width="22" height="6" rx="3"
              fill={p ? '#10b981' : '#ef4444'} />
          </g>
        ))}
      </g>
    ))}
    <rect x="30" y="248" width="100" height="8" rx="3" fill="#10b98118" />
    <rect x="38" y="251" width="54" height="4" rx="2" fill="#10b981" />
    <rect x="140" y="248" width="100" height="8" rx="3" fill="#ef444418" />
    <rect x="148" y="251" width="54" height="4" rx="2" fill="#ef4444" />
    <text x="248" y="255" fill={d ? '#6b8cae' : '#64748b'} fontSize="9" fontFamily="sans-serif">
      Green = allowed | Red = denied
    </text>
  </svg>
)

const IllLoginError = ({ d }) => (
  <svg viewBox="0 0 640 260" width="100%" height="100%">
    <rect width="640" height="260" fill={d ? '#060e20' : '#eef2f9'} />
    <rect x="170" y="8" width="300" height="244" rx="18"
      fill={d ? '#0c1a30' : '#fff'} stroke={d ? '#1a3356' : '#e2e8f0'} strokeWidth="1.5" />
    <rect x="290" y="22" width="60" height="14" rx="7" fill={d ? '#1a3356' : '#dbeafe'} />
    <rect x="188" y="50" width="58" height="7" rx="3" fill={d ? '#6b8cae' : '#64748b'} />
    <rect x="188" y="62" width="264" height="30" rx="8"
      fill={d ? '#060e20' : '#fef2f2'} stroke="#ef4444" strokeWidth="2" />
    <rect x="200" y="73" width="80" height="7" rx="3" fill="#ef444455" />
    <rect x="188" y="96" width="264" height="22" rx="6" fill="#ef444412" />
    <rect x="200" y="105" width="180" height="5" rx="3" fill="#ef4444" />
    <rect x="188" y="130" width="58" height="7" rx="3" fill={d ? '#6b8cae' : '#64748b'} />
    <rect x="188" y="142" width="264" height="30" rx="8"
      fill={d ? '#060e20' : '#f8fafc'} stroke={d ? '#1a3356' : '#e2e8f0'} strokeWidth="1" />
    <rect x="188" y="184" width="264" height="30" rx="8" fill="#2563eb" />
    <rect x="240" y="195" width="100" height="8" rx="4" fill="rgba(255,255,255,0.9)" />
    <rect x="228" y="226" width="114" height="7" rx="3" fill="#3b82f6" />
    <path d="M452 77 L532 50" stroke="#ef4444" strokeWidth="1.5" strokeDasharray="4 2" fill="none" />
    <rect x="534" y="34" width="98" height="32" rx="7" fill="#ef444414" stroke="#ef4444" strokeWidth="1" />
    <text x="542" y="48" fill="#ef4444" fontSize="9" fontFamily="sans-serif">Check Caps Lock</text>
    <text x="542" y="60" fill="#ef4444" fontSize="9" fontFamily="sans-serif">Use username</text>
    <text x="188" y="252" fill={d ? '#6b8cae' : '#64748b'} fontSize="9" fontFamily="sans-serif">3 failed attempts = locked 15 min</text>
  </svg>
)

const IllLoginReset = ({ d }) => (
  <svg viewBox="0 0 640 260" width="100%" height="100%">
    <rect width="640" height="260" fill={d ? '#060e20' : '#eef2f9'} />
    {[
      { x:10,  n:'1', c:'#3b82f6', t:'Click Forgot\nPassword link', sub:'On the login page' },
      { x:222, n:'2', c:'#8b5cf6', t:'Check your email\nfor reset link',    sub:'Valid for 30 minutes' },
      { x:434, n:'3', c:'#10b981', t:'Enter new password\nand sign in',      sub:'Min 8 chars + 1 number' },
    ].map(s => (
      <g key={s.n}>
        <rect x={s.x} y="14" width="196" height="232" rx="14"
          fill={d ? '#0c1a30' : '#fff'} stroke={d ? '#1a3356' : '#e2e8f0'} strokeWidth="1" />
        <circle cx={s.x+98} cy="66" r="28" fill={s.c+'18'} stroke={s.c} strokeWidth="2" />
        <text x={s.x+90} y="73" fill={s.c} fontSize="20" fontFamily="sans-serif" fontWeight="bold">{s.n}</text>
        {s.t.split('\n').map((line, li) => (
          <rect key={li} x={s.x+18} y={108+li*16} width={line.length*6.5} height="9" rx="4"
            fill={d ? '#1a3356' : '#e2e8f0'} />
        ))}
        <rect x={s.x+18} y="148" width="140" height="7" rx="3" fill={d ? '#0d1d35' : '#f1f5f9'} />
        <rect x={s.x+18} y="168" width="160" height="46" rx="8"
          fill={d ? '#060e20' : '#f8fafc'} stroke={d ? '#1a3356' : '#e2e8f0'} strokeWidth="1" />
        <rect x={s.x+30} y="180" width="100" height="6" rx="3" fill={d ? '#1a3356' : '#e2e8f0'} />
        <rect x={s.x+30} y="192" width={s.n==='2' ? 90 : 70} height="6" rx="3"
          fill={s.n==='2' ? '#10b98160' : s.c+'50'} />
        <rect x={s.x+18} y="228" width="160" height="12" rx="6"
          fill={s.c+'20'} stroke={s.c} strokeWidth="1" />
        <rect x={s.x+48} y="232" width="80" height="4" rx="2" fill={s.c+'80'} />
        {s.n !== '3' && (
          <g>
            <path d={`M${s.x+196} 130 L${s.x+212} 130`} stroke={d ? '#2e4d70' : '#cbd5e1'} strokeWidth="2" fill="none" />
            <path d={`M${s.x+208} 126 L${s.x+214} 130 L${s.x+208} 134`} stroke={d ? '#2e4d70' : '#cbd5e1'} strokeWidth="1.5" fill="none" />
          </g>
        )}
      </g>
    ))}
  </svg>
)

const IllPerfBefore = ({ d }) => (
  <svg viewBox="0 0 640 260" width="100%" height="100%">
    <rect width="640" height="260" fill={d ? '#060e20' : '#eef2f9'} />
    <rect x="14" y="14" width="292" height="232" rx="12"
      fill={d ? '#0c1a30' : '#fff'} stroke="#ef4444" strokeWidth="1.5" />
    <rect x="14" y="14" width="292" height="36" rx="12" fill="#ef444420" />
    <rect x="14" y="36" width="292" height="14" fill="#ef444420" />
    <rect x="28" y="24" width="60" height="8" rx="4" fill="#ef4444" />
    <text x="28" y="58" fill={d ? '#6b8cae' : '#64748b'} fontSize="9" fontFamily="sans-serif">Slow — cache overloaded</text>
    {['Page Load','API Call','Render','Database'].map((l, i) => (
      <g key={l}>
        <rect x="28" y={68+i*42} width="68" height="6" rx="3" fill={d ? '#6b8cae' : '#64748b'} />
        <rect x="28" y={78+i*42} width="262" height="14" rx="4" fill={d ? '#060e20' : '#f1f5f9'} />
        <rect x="28" y={78+i*42} width={[224,192,212,238][i]} height="14" rx="4" fill="#ef444455" />
        <rect x={32+[224,192,212,238][i]} y={81+i*42} width="28" height="8" rx="3" fill="#ef4444" />
      </g>
    ))}
    <text x="314" y="136" fill={d ? '#2e4d70' : '#94a3b8'} fontSize="22" fontFamily="sans-serif" textAnchor="middle">→</text>
    <rect x="322" y="14" width="304" height="232" rx="12"
      fill={d ? '#0c1a30' : '#fff'} stroke="#10b981" strokeWidth="1.5" />
    <rect x="322" y="14" width="304" height="36" rx="12" fill="#10b98120" />
    <rect x="322" y="36" width="304" height="14" fill="#10b98120" />
    <rect x="336" y="24" width="80" height="8" rx="4" fill="#10b981" />
    <text x="336" y="58" fill={d ? '#6b8cae' : '#64748b'} fontSize="9" fontFamily="sans-serif">After clearing cache</text>
    {['Page Load','API Call','Render','Database'].map((l, i) => (
      <g key={l}>
        <rect x="336" y={68+i*42} width="68" height="6" rx="3" fill={d ? '#6b8cae' : '#64748b'} />
        <rect x="336" y={78+i*42} width="274" height="14" rx="4" fill={d ? '#060e20' : '#f1f5f9'} />
        <rect x="336" y={78+i*42} width={[72,56,64,80][i]} height="14" rx="4" fill="#10b98155" />
        <rect x={340+[72,56,64,80][i]} y={81+i*42} width="28" height="8" rx="3" fill="#10b981" />
      </g>
    ))}
  </svg>
)

const IllPerfSteps = ({ d }) => (
  <svg viewBox="0 0 640 260" width="100%" height="100%">
    <rect width="640" height="260" fill={d ? '#060e20' : '#eef2f9'} />
    {[
      { n:'1', c:'#3b82f6', title:'Open Settings', desc:'Browser menu (3 dots) → Settings' },
      { n:'2', c:'#8b5cf6', title:'Privacy section', desc:'Privacy & Security → Clear Data' },
      { n:'3', c:'#f59e0b', title:'Check both boxes', desc:'Cached images + Cookies' },
      { n:'4', c:'#10b981', title:'Clear & reload', desc:'Click Clear, then log back in' },
    ].map((s, i) => (
      <g key={i}>
        <rect x={10+i*158} y="14" width="144" height="232" rx="12"
          fill={d ? '#0c1a30' : '#fff'} stroke={d ? '#1a3356' : '#e2e8f0'} strokeWidth="1" />
        <circle cx={10+i*158+72} cy="62" r="26" fill={s.c+'18'} stroke={s.c} strokeWidth="2" />
        <text x={10+i*158+64} y="69" fill={s.c} fontSize="18" fontFamily="sans-serif" fontWeight="bold">{s.n}</text>
        <rect x={22+i*158} y="100" width="120" height="9" rx="4" fill={d ? '#1a3356' : '#e2e8f0'} />
        <rect x={22+i*158} y="115" width="110" height="6" rx="3" fill={d ? '#0d1d35' : '#f1f5f9'} />
        <rect x={22+i*158} y="125" width="96" height="6" rx="3" fill={d ? '#0d1d35' : '#f1f5f9'} />
        <rect x={22+i*158} y="148" width="120" height="60" rx="8"
          fill={d ? '#060e20' : '#f8fafc'} stroke={d ? '#1a3356' : '#e2e8f0'} strokeWidth="1" />
        <rect x={32+i*158} y="158" width="100" height="6" rx="3" fill={d ? '#1a3356' : '#e2e8f0'} />
        <rect x={32+i*158} y="168" width={s.n==='3' ? 100 : 70} height="6" rx="3"
          fill={s.n==='3' ? s.c+'60' : (d ? '#1a3356' : '#e2e8f0')} />
        {s.n==='3' && (
          <g>
            <rect x={32+i*158} y="178" width="14" height="14" rx="3"
              fill={s.c+'30'} stroke={s.c} strokeWidth="1.5" />
            <path d={`M${34+i*158} 185 L${38+i*158} 189 L${46+i*158} 181`}
              stroke={s.c} strokeWidth="1.5" fill="none" />
            <rect x={50+i*158} y="183" width="60" height="5" rx="2" fill={d ? '#1a3356' : '#e2e8f0'} />
          </g>
        )}
        <rect x={22+i*158} y="226" width="120" height="12" rx="6"
          fill={s.c+'22'} stroke={s.c} strokeWidth="1" />
        <rect x={42+i*158} y="230" width="60" height="4" rx="2" fill={s.c+'80'} />
      </g>
    ))}
  </svg>
)

const IllSyncConflict = ({ d }) => (
  <svg viewBox="0 0 640 260" width="100%" height="100%">
    <rect width="640" height="260" fill={d ? '#060e20' : '#eef2f9'} />
    <rect x="14" y="16" width="222" height="228" rx="12"
      fill={d ? '#0c1a30' : '#fff'} stroke={d ? '#1a3356' : '#e2e8f0'} strokeWidth="1" />
    <rect x="30" y="28" width="80" height="8" rx="4" fill={d ? '#6b8cae' : '#64748b'} />
    <rect x="30" y="42" width="110" height="8" rx="4" fill={d ? '#1a3356' : '#e2e8f0'} />
    {[0,1,2,3].map(i => (
      <g key={i}>
        <rect x="30" y={62+i*42} width="190" height="32" rx="7"
          fill={i===2 ? (d ? 'rgba(239,68,68,0.08)' : '#fef2f2') : (d ? '#060e20' : '#f8fafc')}
          stroke={i===2 ? '#ef4444' : (d ? '#1a3356' : '#e2e8f0')}
          strokeWidth={i===2 ? 2 : 1} />
        <rect x="44" y={73+i*42} width="80" height="7" rx="3"
          fill={i===2 ? '#ef444488' : (d ? '#1a3356' : '#e2e8f0')} />
        <rect x="44" y={84+i*42} width="60" height="5" rx="3" fill={d ? '#0d1d35' : '#f1f5f9'} />
      </g>
    ))}
    <rect x="238" y="104" width="164" height="52" rx="12"
      fill="#ef444414" stroke="#ef4444" strokeWidth="1.5" />
    <text x="260" y="126" fill="#ef4444" fontSize="11" fontFamily="sans-serif" fontWeight="bold">CONFLICT</text>
    <text x="252" y="142" fill="#ef4444" fontSize="9" fontFamily="sans-serif">Data mismatch!</text>
    <path d="M236 128 L238 128" stroke="#ef4444" strokeWidth="2" strokeDasharray="4 2" fill="none" />
    <path d="M402 128 L404 128" stroke="#ef4444" strokeWidth="2" strokeDasharray="4 2" fill="none" />
    <rect x="404" y="16" width="222" height="228" rx="12"
      fill={d ? '#0c1a30' : '#fff'} stroke={d ? '#1a3356' : '#e2e8f0'} strokeWidth="1" />
    <rect x="420" y="28" width="80" height="8" rx="4" fill={d ? '#6b8cae' : '#64748b'} />
    <rect x="420" y="42" width="110" height="8" rx="4" fill={d ? '#1a3356' : '#e2e8f0'} />
    {[0,1,2,3].map(i => (
      <g key={i}>
        <rect x="420" y={62+i*42} width="190" height="32" rx="7"
          fill={i===2 ? (d ? 'rgba(245,158,11,0.08)' : '#fffbeb') : (d ? '#060e20' : '#f8fafc')}
          stroke={i===2 ? '#f59e0b' : (d ? '#1a3356' : '#e2e8f0')}
          strokeWidth={i===2 ? 2 : 1} />
        <rect x="434" y={73+i*42} width="80" height="7" rx="3"
          fill={i===2 ? '#f59e0b88' : (d ? '#1a3356' : '#e2e8f0')} />
        <rect x="434" y={84+i*42} width="60" height="5" rx="3" fill={d ? '#0d1d35' : '#f1f5f9'} />
      </g>
    ))}
    <text x="180" y="252" fill={d ? '#6b8cae' : '#64748b'} fontSize="9" fontFamily="sans-serif">
      Same record edited by two users at the same time
    </text>
  </svg>
)

const IllSyncFix = ({ d }) => (
  <svg viewBox="0 0 640 260" width="100%" height="100%">
    <rect width="640" height="260" fill={d ? '#060e20' : '#eef2f9'} />
    {[
      { n:'1', c:'#3b82f6', title:'Refresh Page',    note:'Press F5 or\nCtrl+R',        result:'Fixes most cases' },
      { n:'2', c:'#8b5cf6', title:'Log Out & Back',  note:'Sign out, then\nsign back in', result:'Forces full re-sync' },
      { n:'3', c:'#10b981', title:'Verify Record',   note:'Open the record,\ncheck data',  result:'Confirm it is correct' },
    ].map((s, i) => (
      <g key={i}>
        <rect x={10+i*212} y="14" width="196" height="232" rx="14"
          fill={d ? '#0c1a30' : '#fff'} stroke={d ? '#1a3356' : '#e2e8f0'} strokeWidth="1" />
        <circle cx={10+i*212+98} cy="66" r="28" fill={s.c+'18'} stroke={s.c} strokeWidth="2" />
        <text x={10+i*212+90} y="73" fill={s.c} fontSize="20" fontFamily="sans-serif" fontWeight="bold">{s.n}</text>
        <rect x={24+i*212} y="108" width="160" height="10" rx="5" fill={d ? '#1a3356' : '#e2e8f0'} />
        {s.note.split('\n').map((line, li) => (
          <rect key={li} x={24+i*212} y={126+li*16} width={line.length*6} height="7" rx="3"
            fill={d ? '#0d1d35' : '#f1f5f9'} />
        ))}
        <rect x={24+i*212} y="170" width="164" height="44" rx="8"
          fill={d ? '#060e20' : '#f8fafc'} stroke={d ? '#1a3356' : '#e2e8f0'} strokeWidth="1" />
        <rect x={36+i*212} y="182" width="100" height="7" rx="3" fill={d ? '#1a3356' : '#e2e8f0'} />
        <rect x={36+i*212} y="196" width={s.n==='3' ? 80 : 60} height="7" rx="3"
          fill={s.c+'60'} />
        <rect x={24+i*212} y="224" width="164" height="14" rx="6"
          fill={s.c+'18'} stroke={s.c} strokeWidth="1" />
        <rect x={44+i*212} y="228" width="100" height="5" rx="2" fill={s.c+'80'} />
      </g>
    ))}
  </svg>
)

/* ═══════════════════════════════════════════
   GUIDE CONTENT
═══════════════════════════════════════════ */
const guideContent = {
  dashboard: [
    {
      title: 'Reading the Dashboard Stats',
      text: 'The four cards at the top show Total Books, Active Members, Currently Borrowed, and Overdue items — all in real time. A red number means something needs your attention right away. Click any card to open a detailed report for that category.',
      tips: ['Click any stat card to drill into its full report', 'Red numbers indicate records that need immediate action', 'The bar chart below shows monthly borrowing trends'],
      Image: IllDashStats,
    },
    {
      title: 'Navigating Between Modules',
      text: 'The sidebar on the left is how you switch between all system areas. The active module is highlighted in blue. Admin accounts see extra modules at the bottom — Security and User Management — that are hidden for Staff and Patron roles.',
      tips: ['Admin-only modules appear at the bottom of the sidebar', 'Hover over a sidebar icon to see its label if the panel is collapsed'],
      Image: IllDashNav,
    },
  ],
  cataloging: [
    {
      title: 'Finding Books & Adding a New One',
      text: 'The Cataloging page lists every book in the system with a status badge (Available, Borrowed, or Overdue). To add a new book, click the blue "Add Book" button in the top-right corner. The system will automatically flag any duplicate ISBNs so you do not create duplicate records.',
      tips: ['Search for a book before adding to avoid duplicates', 'Click any row to view the full record and borrowing history', 'Status badges are color-coded: green = available, yellow = borrowed, red = overdue'],
      Image: IllCatalogTable,
    },
    {
      title: 'Filling the Add Book Form',
      text: 'Fields with a blue border are required: ISBN, Title, Author, and Classification. The ISBN is the most critical — if the book exists in the global database, the other fields will auto-fill. After filling all required fields, click Save to add the book.',
      tips: ['Find the ISBN on the barcode printed on the back cover', 'Classification follows the Dewey Decimal System by default', 'Use the Category field to group books for easier searching later'],
      Image: IllCatalogForm,
    },
  ],
  accessions: [
    {
      title: 'Recording a Physical Book Arrival',
      text: 'Every physical book that enters the library must be logged in Accessions. Click "New Accession" to start an entry. Each record is automatically given a unique, permanent accession number. You can log an entire delivery batch in one session by adding multiple rows before saving.',
      tips: ['Accession numbers are permanent — they cannot be changed after saving', 'Each physical copy of the same title gets its own unique accession number', 'Filter the log by date range to find records from a specific delivery'],
      Image: IllAccessionLog,
    },
    {
      title: 'Mandatory Fields Explained',
      text: 'Acquisition Date and Supplier are highlighted in blue because they are mandatory. These two fields form the official audit trail and feed directly into budget reports. Supplier names auto-complete from the approved vendor list. Attach the delivery receipt using the paperclip icon.',
      tips: ['The Acquisition Date must match the physical delivery receipt', 'Attaching delivery receipts is required for compliance audits', 'If a supplier is missing from the list, ask your Admin to add it'],
      Image: IllAccessionForm,
    },
  ],
  acquisitions: [
    {
      title: 'Tracking Purchase Requests',
      text: 'The Acquisitions page shows all purchase requests with a colored status badge: Pending (yellow), Approved (green), or Rejected (red). Use the tabs at the top to filter by status. When a new request is submitted, approvers receive an automatic email notification.',
      tips: ['Only Librarian and Admin roles can approve or reject requests', 'Rejected requests can be edited and resubmitted', 'Filter by supplier or date using the search bar at the top'],
      Image: IllAcqList,
    },
    {
      title: 'Budget Panel & Submitting Requests',
      text: 'The left panel shows your department budget bar — it turns amber at 70% and red at 90%. Your approved supplier list is also here. Use the form on the right to submit a new purchase request by selecting an item, supplier, quantity, and budget code.',
      tips: ['Contact Admin if the budget bar shows an incorrect amount', 'You can attach supplier quotes or PDF files to any request', 'Budget codes are set up in Settings → Finance'],
      Image: IllAcqBudget,
    },
  ],
  usermanagement: [
    {
      title: 'Viewing Users & Creating New Accounts',
      text: 'The User Management table shows every account with its role badge (Admin, Librarian, Staff, or Patron). Click "Add User" to create a new account and assign it a role. Deactivated accounts remain visible with all their history intact, but they cannot log in.',
      tips: ['A user\'s role controls which sidebar modules they can see and use', 'You can filter the list by role, status, or date created', 'Bulk-import users via CSV under the Actions menu'],
      Image: IllUserList,
    },
    {
      title: 'Changing Roles & Fine-Tuning Permissions',
      text: 'Click any user\'s name and then "Edit" to open the editor. The role dropdown lists all available options. Selecting a new role instantly updates their access on next login. The Permissions grid at the bottom lets you fine-tune individual actions — Read, Write, and Delete — per module.',
      tips: ['Admins cannot remove their own Admin role', 'All permission changes are logged in the Security audit trail', 'Role changes take effect the next time the user logs in'],
      Image: IllUserRoles,
    },
  ],
  security: [
    {
      title: 'Password Rules & Login Activity',
      text: 'The left panel shows your active password requirements with progress bars — green means the rule is met, amber means partially met. The right panel is a live log of all login attempts. Rows highlighted in red are suspicious or failed logins. Click any row to see the full IP address, timestamp, and device info.',
      tips: ['Enable email alerts for failed logins under the Notifications settings', 'Three consecutive failed attempts lock the account for 15 minutes', 'Hover a flagged row to see the full browser and device details'],
      Image: IllSecurityPolicy,
    },
    {
      title: 'Access Control Matrix',
      text: 'The Access Control Matrix shows exactly what each role can do in every module. Green means that action is permitted; red means it is denied. Only Admin users can edit this matrix. Use the Export button in the top-right corner to download it as a PDF for compliance records.',
      tips: ['Changes take effect immediately for all users system-wide', 'Review the matrix every quarter as a security best practice', 'Admins cannot accidentally remove their own access to the matrix'],
      Image: IllSecurityMatrix,
    },
  ],
  loginproblem: [
    {
      title: 'Why Your Login is Failing',
      text: 'When a login attempt fails, the username field turns red with an error message. The most common causes are: Caps Lock is on (passwords are case-sensitive), you are using your email address instead of your assigned username, or your account is locked after 3 failed attempts. Locked accounts unlock automatically after 15 minutes.',
      tips: ['Use your assigned username — not your email address', 'Contact your Admin to unlock an account before the 15 minutes', 'A specific "Account Locked" message appears if the account is locked'],
      Image: IllLoginError,
    },
    {
      title: 'How to Reset Your Password',
      text: 'Step 1 — Click "Forgot Password" on the login page; a reset link is emailed to your registered address. Step 2 — Check your inbox (and Spam folder); the link is valid for 30 minutes. Step 3 — Enter your new password twice on the reset page and sign in.',
      tips: ['Reset links expire after 30 minutes — request a new one if needed', 'New passwords must be at least 8 characters with at least 1 number', 'If no email arrives, ask your Admin to confirm your registered email address'],
      Image: IllLoginReset,
    },
  ],
  performanceslowdown: [
    {
      title: 'Why the System Feels Slow',
      text: 'Slow page loads are almost always caused by either a weak internet connection or a browser overloaded with stale cached data. Run a speed test to confirm you have at least 5 Mbps download. If your speed is fine, the issue is your browser cache — clearing it usually resolves the problem immediately.',
      tips: ['Wired connections are always faster and more stable than Wi-Fi', 'If other websites are also slow, the issue is your network — not LMIS', 'Avoid using the system during peak hours (10am–12pm) if possible'],
      Image: IllPerfBefore,
    },
    {
      title: 'How to Clear Your Browser Cache',
      text: 'Follow these 4 steps: (1) Open browser Settings. (2) Go to Privacy & Security. (3) Click "Clear Browsing Data" — check both Cached images and Cookies. (4) Click Clear Data, then reload the page and log back in. This resolves most slowdowns immediately.',
      tips: ['Clearing cache will log you out — have your password ready', 'Do this monthly as regular maintenance to keep the system fast', 'On most browsers you can jump straight to the clear dialog with Ctrl+Shift+Delete'],
      Image: IllPerfSteps,
    },
  ],
  datasync: [
    {
      title: 'What is a Sync Conflict?',
      text: 'A sync conflict happens when your browser\'s local copy of a record disagrees with the version on the server. This usually occurs after a network interruption mid-save, or when two users edit the same record at the same time. You will see a yellow warning icon in the top bar of the page.',
      tips: ['Do not close the tab during a sync warning — wait up to 30 seconds for auto-retry', 'Avoid editing the same record as another user simultaneously', 'Hover the warning icon to see which specific record caused the conflict'],
      Image: IllSyncConflict,
    },
    {
      title: 'Three Steps to Fix a Sync Error',
      text: 'Step 1 — Refresh the page with F5; this fixes most cases. Step 2 — If the error persists, log out completely and log back in to force a full re-sync with the server. Step 3 — Open the affected record and verify that the data looks correct before continuing.',
      tips: ['Never force-close the browser while a save spinner is active', 'If data looks wrong after re-sync, contact your Admin immediately', 'All sync events are logged with timestamps under Security → System Log'],
      Image: IllSyncFix,
    },
  ],
}

const guideLabels = {
  dashboard:'Dashboard', cataloging:'Cataloging', accessions:'Accessions',
  acquisitions:'Acquisitions', usermanagement:'User Management', security:'Security',
  loginproblem:'Login Problem', performanceslowdown:'Performance Slowdown',
  datasync:'Data Synchronization Errors',
}

const systemGuides = [
  { key:'dashboard',      label:'Dashboard Guide',       accent:'#0F61F7' },
  { key:'cataloging',     label:'Cataloging Guide',      accent:'#3F1BD2' },
  { key:'accessions',     label:'Accessions Guide',      accent:'#0891b2' },
  { key:'acquisitions',   label:'Acquisitions Guide',    accent:'#059669' },
  { key:'usermanagement', label:'User Management Guide', accent:'#d97706' },
  { key:'security',       label:'Security Guide',        accent:'#dc2626' },
]

const troubleshootingGuides = [
  { key:'loginproblem',        label:'Login Problem',               accent:'#dc2626' },
  { key:'performanceslowdown', label:'Performance Slowdown',        accent:'#d97706' },
  { key:'datasync',            label:'Data Synchronization Errors', accent:'#7c3aed' },
]

const searchIndex = [
  ...systemGuides.map(g => ({ type:'guide', key:g.key, label:g.label })),
  ...troubleshootingGuides.map(g => ({ type:'guide', key:g.key, label:g.label })),
]

function doSearch(q) {
  if (!q.trim()) return []
  const t = q.toLowerCase()
  return searchIndex.filter(item =>
    item.label.toLowerCase().includes(t) || (item.key && item.key.includes(t.replace(/\s/g, '')))
  ).slice(0, 7)
}

/* ═══════════════════════════════════════════
   MAIN COMPONENT
═══════════════════════════════════════════ */
export default function HelpSupport({ setCurrentView, dark }) {
  const [activeGuide, setActiveGuide] = useState(null)
  const [pageIndex,   setPageIndex]   = useState(0)
  const [searchQ,     setSearchQ]     = useState('')
  const [searchRes,   setSearchRes]   = useState([])

  const openGuide  = key => { setActiveGuide(key); setPageIndex(0); setSearchQ(''); setSearchRes([]) }
  const closeModal = ()  => { setActiveGuide(null); setPageIndex(0) }
  const nextPage   = ()  => { if (pageIndex < guideContent[activeGuide].length - 1) setPageIndex(p => p + 1) }
  const prevPage   = ()  => { if (pageIndex > 0) setPageIndex(p => p - 1) }
  const handleSearch = v => { setSearchQ(v); setSearchRes(doSearch(v)) }

  const d    = dark
  const bg   = d ? '#0a1628' : '#f1f5f9'
  const card = d ? '#0f1f38' : '#ffffff'
  const bdr  = d ? '#1a3356' : '#e2e8f0'
  const tp   = d ? '#dde8f5' : '#1e293b'
  const ts   = d ? '#6b8cae' : '#64748b'
  const tm   = d ? '#2e4d70' : '#94a3b8'
  const hov  = d ? '#0d1d35' : '#f8fafc'
  const div  = d ? '#1a3356' : '#e2e8f0'
  const ibox = d ? 'rgba(30,64,175,0.15)' : '#dbeafe'
  const ic   = d ? '#93c5fd' : '#2563eb'
  const mBg  = d ? '#0f1f38' : '#ffffff'
  const mFt  = d ? '#0d1d35' : '#f8fafc'
  const navC = d ? '#6b8cae' : '#9ca3af'
  const navH = d ? '#dde8f5' : '#374151'
  const tipB = d ? 'rgba(37,99,235,0.08)' : '#f0f6ff'
  const tipR = d ? 'rgba(37,99,235,0.2)'  : '#dbeafe'

  const step    = activeGuide ? guideContent[activeGuide][pageIndex] : null
  const StepImg = step?.Image

  return (
    <div style={{ minHeight:'100vh', background:bg, padding:'1.5rem', transition:'background 0.4s' }}>
      <div style={{ maxWidth:'72rem', margin:'0 auto' }}>

        {/* back */}
        <button onClick={() => setCurrentView?.('dashboard')}
          style={{ display:'flex', alignItems:'center', gap:'0.5rem', fontSize:'0.875rem', color:ts, background:'none', border:'none', cursor:'pointer', marginBottom:'1.5rem', padding:0 }}
          onMouseEnter={e => e.currentTarget.style.color = ic}
          onMouseLeave={e => e.currentTarget.style.color = ts}>
          <ArrowLeftIcon style={{ width:'1rem', height:'1rem' }} /> Back to Dashboard
        </button>

        {/* hero */}
        <div style={{
          background: d ? 'linear-gradient(135deg,#0d1d35,#0f1f38 60%,#1a3356)' : 'linear-gradient(135deg,#1e40af,#1d4ed8 60%,#2563eb)',
          borderRadius:'1.25rem', padding:'2rem 2.25rem 1.75rem',
          marginBottom:'1.25rem', position:'relative', overflow:'visible',
          border: d ? '1px solid #1a3356' : 'none',
        }}>
          <div style={{ position:'absolute', top:'-2rem', right:'-2rem', width:'9rem', height:'9rem', borderRadius:'50%', background:'rgba(255,255,255,0.04)', pointerEvents:'none' }} />
          <div style={{ position:'relative', display:'flex', alignItems:'center', justifyContent:'space-between', gap:'1rem', flexWrap:'wrap', marginBottom:'1.375rem' }}>
            <div style={{ display:'flex', alignItems:'center', gap:'1rem' }}>
              <div style={{ width:'3.25rem', height:'3.25rem', borderRadius:'0.875rem', background:'rgba(255,255,255,0.15)', display:'flex', alignItems:'center', justifyContent:'center' }}>
                <BookOpenIcon style={{ width:'1.625rem', height:'1.625rem', color:'#fff' }} />
              </div>
              <div>
                <h1 style={{ fontSize:'1.5rem', fontWeight:800, color:'#fff', margin:0, letterSpacing:'-0.02em' }}>Help & Support</h1>
                <p style={{ fontSize:'0.8125rem', color:'rgba(255,255,255,0.55)', margin:'0.2rem 0 0' }}>Illustrated step-by-step guides for LMIS</p>
              </div>
            </div>
            <div style={{ display:'flex', gap:'0.5rem' }}>
              <span style={{ background:'rgba(255,255,255,0.12)', borderRadius:'999px', padding:'0.275rem 0.75rem', fontSize:'0.72rem', color:'rgba(255,255,255,0.8)', fontWeight:600 }}>9 Guides</span>
            </div>
          </div>

          {/* search */}
          <div style={{ position:'relative' }}>
            <MagnifyingGlassIcon style={{ position:'absolute', left:'1rem', top:'50%', transform:'translateY(-50%)', width:'1rem', height:'1rem', color:'rgba(255,255,255,0.45)', pointerEvents:'none' }} />
            <input value={searchQ} onChange={e => handleSearch(e.target.value)}
              placeholder="Search guides or describe your problem..."
              style={{ width:'100%', boxSizing:'border-box', padding:'0.8rem 2.75rem', borderRadius:'0.875rem', border:'1px solid rgba(255,255,255,0.18)', background:'rgba(255,255,255,0.1)', color:'#fff', fontSize:'0.9rem', outline:'none', backdropFilter:'blur(8px)', transition:'border-color 0.2s' }}
              onFocus={e => e.target.style.borderColor = 'rgba(255,255,255,0.48)'}
              onBlur={e  => e.target.style.borderColor = 'rgba(255,255,255,0.18)'} />
            {searchQ && (
              <button onClick={() => handleSearch('')}
                style={{ position:'absolute', right:'1rem', top:'50%', transform:'translateY(-50%)', background:'transparent', border:'none', cursor:'pointer', color:'rgba(255,255,255,0.5)', padding:0 }}>
                <XMarkIcon style={{ width:'1rem', height:'1rem' }} />
              </button>
            )}
            {searchQ && (
              <div style={{ position:'absolute', left:0, right:0, top:'calc(100% + 0.5rem)', background:card, border:`1px solid ${bdr}`, borderRadius:'0.875rem', zIndex:40, boxShadow:'0 16px 48px rgba(0,0,0,0.35)', overflow:'hidden' }}>
                {searchRes.length > 0 ? searchRes.map((r, i) => (
                  <button key={i}
                    onClick={() => openGuide(r.key)}
                    style={{ display:'flex', alignItems:'center', gap:'0.75rem', width:'100%', textAlign:'left', padding:'0.75rem 1rem', background:'transparent', border:'none', borderBottom:i<searchRes.length-1?`1px solid ${div}`:'none', cursor:'pointer' }}
                    onMouseEnter={e => e.currentTarget.style.background = hov}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                    <span style={{ fontSize:'0.7rem', padding:'0.2rem 0.5rem', borderRadius:'4px', background:ic+'20', color:ic, fontWeight:700 }}>Guide</span>
                    <span style={{ fontSize:'0.875rem', color:tp, fontWeight:500 }}>{r.label}</span>
                    <ChevronRightIcon style={{ width:'0.875rem', height:'0.875rem', color:tm, marginLeft:'auto' }} />
                  </button>
                )) : (
                  <div style={{ padding:'1rem', textAlign:'center', color:ts, fontSize:'0.875rem' }}>No results found for "{searchQ}"</div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* quick access */}
        <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:'0.875rem', marginBottom:'1.25rem' }}>
          {[
            { Ic:LightBulbIcon,         label:'Getting Started',  desc:'New to LMIS? Start here.',       color:'#3b82f6', action:()=>openGuide('dashboard')     },
            { Ic:WrenchScrewdriverIcon, label:'Fix an Issue',      desc:'Common problems & solutions',    color:'#ef4444', action:()=>openGuide('loginproblem')  },
            { Ic:ShieldCheckIcon,       label:'Security & Access', desc:'Passwords, roles, permissions',  color:'#8b5cf6', action:()=>openGuide('security')      },
          ].map(({ Ic, label:ql, desc:qd, color:qc, action:qa }) => (
            <button key={ql} onClick={qa}
              style={{ display:'flex', alignItems:'center', gap:'0.875rem', padding:'0.875rem 1rem', background:card, border:`1px solid ${bdr}`, borderRadius:'0.875rem', cursor:'pointer', textAlign:'left', transition:'all 0.18s' }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = qc+'55'; e.currentTarget.style.background = hov }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = bdr;     e.currentTarget.style.background = card }}>
              <div style={{ width:'2.25rem', height:'2.25rem', borderRadius:'0.625rem', background:qc+'18', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                <Ic style={{ width:'1.125rem', height:'1.125rem', color:qc }} />
              </div>
              <div style={{ minWidth:0 }}>
                <p style={{ fontSize:'0.8125rem', fontWeight:600, color:tp, margin:0 }}>{ql}</p>
                <p style={{ fontSize:'0.72rem', color:ts, margin:'0.1rem 0 0', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{qd}</p>
              </div>
              <ChevronRightIcon style={{ width:'0.875rem', height:'0.875rem', color:tm, marginLeft:'auto', flexShrink:0 }} />
            </button>
          ))}
        </div>

        {/* guides grid */}
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'1.125rem' }}>
          <GuideCard icon={<Squares2X2Icon style={{ width:'1.125rem', height:'1.125rem', color:ic }} />}
            title="System Guides" subtitle="Illustrated walkthroughs for every module"
            guides={systemGuides} onOpen={openGuide} dark={d}
            cardBg={card} cardBorder={bdr} textPrimary={tp} textSecondary={ts}
            textMuted={tm} hoverBg={hov} divider={div} iconBoxBg={ibox} />
          <GuideCard icon={<WrenchScrewdriverIcon style={{ width:'1.125rem', height:'1.125rem', color:ic }} />}
            title="Troubleshooting" subtitle="Solutions to common issues and errors"
            guides={troubleshootingGuides} onOpen={openGuide} dark={d}
            cardBg={card} cardBorder={bdr} textPrimary={tp} textSecondary={ts}
            textMuted={tm} hoverBg={hov} divider={div} iconBoxBg={ibox} />
        </div>

        {/* contact banner */}
        <div style={{ marginTop:'1.25rem', background:d?'rgba(37,99,235,0.07)':'#eff6ff', border:`1px solid ${d?'rgba(37,99,235,0.18)':'#bfdbfe'}`, borderRadius:'0.875rem', padding:'1rem 1.375rem', display:'flex', alignItems:'center', gap:'1rem', flexWrap:'wrap' }}>
          <ClockIcon style={{ width:'1.125rem', height:'1.125rem', color:ic, flexShrink:0 }} />
          <div style={{ flex:1, minWidth:0 }}>
            <p style={{ fontSize:'0.875rem', fontWeight:600, color:tp, margin:0 }}>Still need help?</p>
            <p style={{ fontSize:'0.8rem', color:ts, margin:'0.125rem 0 0' }}>Contact your system administrator if the guides above do not resolve your issue.</p>
          </div>
        </div>

      </div>

      {/* ── GUIDE MODAL ── */}
      {activeGuide && (
        <div onClick={closeModal}
          style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.68)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:50, padding:'1rem' }}>
          <div onClick={e => e.stopPropagation()} style={{
            background:mBg, border:d?`1px solid ${div}`:'none',
            borderRadius:'1.125rem',
            boxShadow:d?'0 24px 64px rgba(0,0,0,0.8)':'0 24px 64px rgba(0,0,0,0.2)',
            width:'100%', maxWidth:'54rem', maxHeight:'92vh',
            display:'flex', flexDirection:'column', overflow:'hidden',
          }}>
            {/* header */}
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'1rem 1.5rem', background:d?'#0d1d35':'#1a4f8a', flexShrink:0 }}>
              <div style={{ display:'flex', alignItems:'center', gap:'0.75rem' }}>
                <div style={{ width:'2rem', height:'2rem', borderRadius:'0.5rem', background:'rgba(255,255,255,0.15)', display:'flex', alignItems:'center', justifyContent:'center' }}>
                  <BookOpenIcon style={{ width:'1rem', height:'1rem', color:'#fff' }} />
                </div>
                <div>
                  <h2 style={{ fontWeight:700, color:'#fff', fontSize:'0.9375rem', margin:0 }}>{guideLabels[activeGuide]}</h2>
                  <p style={{ fontSize:'0.68rem', color:'rgba(255,255,255,0.5)', margin:0 }}>Step {pageIndex+1} of {guideContent[activeGuide].length}</p>
                </div>
              </div>
              <button onClick={closeModal}
                style={{ background:'transparent', border:'none', cursor:'pointer', color:'rgba(255,255,255,0.65)', padding:'0.25rem' }}
                onMouseEnter={e => e.currentTarget.style.color = '#fff'}
                onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.65)'}>
                <XMarkIcon style={{ width:'1.25rem', height:'1.25rem' }} />
              </button>
            </div>

            {/* dots */}
            <div style={{ display:'flex', justifyContent:'center', gap:'0.5rem', padding:'0.75rem 0 0', flexShrink:0 }}>
              {guideContent[activeGuide].map((_, i) => (
                <button key={i} onClick={() => setPageIndex(i)}
                  style={{ width:i===pageIndex?'1.75rem':'0.5rem', height:'0.5rem', borderRadius:'999px', border:'none', cursor:'pointer', padding:0, background:i===pageIndex?'#2563eb':(d?'#1a3356':'#e2e8f0'), transition:'all 0.3s cubic-bezier(0.34,1.5,0.64,1)' }} />
              ))}
            </div>

            {/* step title */}
            {step?.title && (
              <div style={{ padding:'0.75rem 1.5rem 0', flexShrink:0 }}>
                <p style={{ fontSize:'0.68rem', fontWeight:700, color:ic, textTransform:'uppercase', letterSpacing:'0.08em', margin:0 }}>Step {pageIndex+1}</p>
                <h3 style={{ fontSize:'1.0625rem', fontWeight:700, color:tp, margin:'0.2rem 0 0' }}>{step.title}</h3>
              </div>
            )}

            {/* illustration */}
            <div style={{ margin:'0.75rem 1.5rem 0', flexShrink:0, height:'12.5rem', background:d?'#081422':'#f1f5f9', borderRadius:'0.875rem', border:`1px solid ${div}`, overflow:'hidden' }}>
              {StepImg && <StepImg dark={d} />}
            </div>

            {/* text + tips */}
            <div style={{ padding:'0.875rem 1.5rem 0.5rem', overflowY:'auto', flex:1 }}>
              <p style={{ fontSize:'0.9375rem', color:tp, lineHeight:1.75, margin:0 }}>{step?.text}</p>
              {step?.tips?.length > 0 && (
                <div style={{ marginTop:'0.875rem', padding:'0.75rem 1rem', background:tipB, border:`1px solid ${tipR}`, borderRadius:'0.75rem' }}>
                  <div style={{ display:'flex', alignItems:'center', gap:'0.375rem', marginBottom:'0.5rem' }}>
                    <InformationCircleIcon style={{ width:'0.875rem', height:'0.875rem', color:d?'#93c5fd':'#2563eb', flexShrink:0 }} />
                    <p style={{ fontSize:'0.68rem', fontWeight:700, color:d?'#93c5fd':'#2563eb', textTransform:'uppercase', letterSpacing:'0.08em', margin:0 }}>Tips</p>
                  </div>
                  {step.tips.map((tip, i) => (
                    <div key={i} style={{ display:'flex', gap:'0.5rem', marginBottom:i<step.tips.length-1?'0.35rem':0 }}>
                      <span style={{ color:d?'#93c5fd':'#2563eb', fontWeight:700, fontSize:'0.8rem', flexShrink:0 }}>•</span>
                      <p style={{ fontSize:'0.8125rem', color:ts, margin:0, lineHeight:1.6 }}>{tip}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* footer */}
            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'0.875rem 1.5rem', borderTop:`1px solid ${div}`, flexShrink:0, background:mFt }}>
              <NavArrow onClick={prevPage} disabled={pageIndex===0} color={navC} hoverColor={navH}>
                <ArrowLeftCircleIcon style={{ width:'2.25rem', height:'2.25rem' }} />
              </NavArrow>
              <div style={{ display:'flex', alignItems:'center', gap:'0.75rem' }}>
                <span style={{ fontSize:'0.8125rem', color:tm, fontWeight:500 }}>{pageIndex+1} / {guideContent[activeGuide].length}</span>
                {pageIndex === guideContent[activeGuide].length - 1 && (
                  <div style={{ display:'flex', alignItems:'center', gap:'0.375rem', fontSize:'0.75rem', color:'#10b981', fontWeight:600 }}>
                    <CheckCircleIcon style={{ width:'1rem', height:'1rem' }} /> Complete
                  </div>
                )}
              </div>
              <NavArrow onClick={nextPage} disabled={pageIndex===guideContent[activeGuide].length-1} color={navC} hoverColor={navH}>
                <ArrowRightCircleIcon style={{ width:'2.25rem', height:'2.25rem' }} />
              </NavArrow>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

const GuideCard = ({ icon, title, subtitle, guides, onOpen, dark, cardBg, cardBorder, textPrimary, textSecondary, textMuted, hoverBg, divider, iconBoxBg }) => (
  <div style={{ background:cardBg, border:`1px solid ${cardBorder}`, borderRadius:'0.875rem', overflow:'hidden', boxShadow:dark?'0 2px 12px rgba(0,0,0,0.3)':'0 1px 4px rgba(0,0,0,0.06)' }}>
    <div style={{ padding:'1.125rem 1.5rem', borderBottom:`1px solid ${divider}`, display:'flex', alignItems:'center', gap:'0.75rem' }}>
      <div style={{ width:'2.25rem', height:'2.25rem', borderRadius:'0.625rem', background:iconBoxBg, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>{icon}</div>
      <div>
        <h2 style={{ fontSize:'0.9375rem', fontWeight:700, color:textPrimary, margin:0 }}>{title}</h2>
        <p style={{ fontSize:'0.75rem', color:textMuted, margin:'0.1rem 0 0' }}>{subtitle}</p>
      </div>
    </div>
    <div>
      {guides.map(({ key, label, accent }, i) => (
        <GuideRow key={key} label={label} accent={accent} onClick={() => onOpen(key)}
          isLast={i===guides.length-1} textPrimary={textPrimary} textSecondary={textSecondary}
          hoverBg={hoverBg} divider={divider} dark={dark} />
      ))}
    </div>
  </div>
)

const GuideRow = ({ label, accent, onClick, isLast, textPrimary, textSecondary, hoverBg, divider, dark }) => {
  const [h, setH] = useState(false)
  return (
    <button onClick={onClick} onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)}
      style={{ display:'flex', alignItems:'center', gap:'0.75rem', width:'100%', textAlign:'left', padding:'0.875rem 1.5rem', background:h?hoverBg:'transparent', border:'none', borderBottom:isLast?'none':`1px solid ${divider}`, cursor:'pointer', transition:'background 0.15s' }}>
      <div style={{ width:'0.25rem', height:'1.5rem', borderRadius:'999px', background:accent, flexShrink:0, opacity:h?1:0.38, transition:'opacity 0.2s' }} />
      <span style={{ flex:1, fontSize:'0.875rem', fontWeight:500, color:h?textPrimary:textSecondary, transition:'color 0.15s' }}>{label}</span>
      <ChevronRightIcon style={{ width:'1rem', height:'1rem', color:h?accent:(dark?'#2e4d70':'#d1d5db'), flexShrink:0, transition:'color 0.15s' }} />
    </button>
  )
}

const NavArrow = ({ onClick, disabled, color, hoverColor, children }) => (
  <button onClick={onClick} disabled={disabled}
    style={{ background:'transparent', border:'none', cursor:disabled?'default':'pointer', color, opacity:disabled?0.3:1, padding:0, transition:'color 0.2s' }}
    onMouseEnter={e => { if (!disabled) e.currentTarget.style.color = hoverColor }}
    onMouseLeave={e => { e.currentTarget.style.color = color }}>
    {children}
  </button>
)