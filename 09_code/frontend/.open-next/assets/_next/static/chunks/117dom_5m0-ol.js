(globalThis.TURBOPACK||(globalThis.TURBOPACK=[])).push(["object"==typeof document?document.currentScript:void 0,48161,e=>{"use strict";let t=(0,e.i(56420).default)("circle-check-big",[["path",{d:"M21.801 10A10 10 0 1 1 17 3.335",key:"yps3ct"}],["path",{d:"m9 11 3 3L22 4",key:"1pflzl"}]]);e.s(["CheckCircle",0,t],48161)},36791,e=>{"use strict";var t=e.i(43476),s=e.i(46932),a=e.i(56420);let i=(0,a.default)("code",[["path",{d:"m16 18 6-6-6-6",key:"eg8j8"}],["path",{d:"m8 6-6 6 6 6",key:"ppft3o"}]]),o=(0,a.default)("chevron-right",[["path",{d:"m9 18 6-6-6-6",key:"mthhwq"}]]),r=(0,a.default)("copy",[["rect",{width:"14",height:"14",x:"8",y:"8",rx:"2",ry:"2",key:"17jyea"}],["path",{d:"M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2",key:"zix9uf"}]]);var c=e.i(48161),n=e.i(71645);let l=[{method:"POST",path:"/api/v1/predict",description:"Analyze article text or URL for fake news detection.",body:`{
  "text": "The earth is definitely flat and governments are hiding it.",
  "source_url": "https://example-news.com/article"
}`,response:`{
  "prediction": "FAKE",
  "confidence": 94.2,
  "risk_level": "HIGH",
  "suspicious_sentences": [
    "The earth is definitely flat and governments are hiding it."
  ]
}`,color:"green"},{method:"POST",path:"/api/v1/analyze-url",description:"Scrape and analyze the content of a public article URL.",body:`{
  "url": "https://some-news-site.com/controversial-article"
}`,response:`{
  "prediction": "FAKE",
  "confidence": 88.7,
  "risk_level": "HIGH",
  "source_trust_score": 22
}`,color:"green"},{method:"POST",path:"/api/v1/verify",description:"Verify a factual claim against trusted external sources.",body:`{
  "claim": "Vaccines contain microchips that track individuals"
}`,response:`{
  "claim": "Vaccines contain microchips that track individuals",
  "verification": "FALSE",
  "confidence": 97,
  "evidence": [...]
}`,color:"green"},{method:"GET",path:"/api/v1/source-score/{domain}",description:"Get the credibility and trust score for a specific news domain.",body:null,response:`{
  "source": "example-news.com",
  "trust_score": 72,
  "bias": "Moderate",
  "risk": "Medium"
}`,color:"blue"},{method:"GET",path:"/api/v1/analytics",description:"Retrieve platform analytics and detection statistics.",body:null,response:`{
  "total_analyzed": 1245,
  "fake_detected": 342,
  "real_confirmed": 903,
  "avg_confidence": 94.2
}`,color:"blue"},{method:"POST",path:"/api/v1/auth/register",description:"Create a new user account and receive a JWT token.",body:`{
  "email": "user@example.com",
  "password": "securePassword123",
  "full_name": "Jane Doe"
}`,response:`{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "bearer"
}`,color:"green"},{method:"POST",path:"/api/v1/auth/login",description:"Authenticate with email and password to receive a JWT token.",body:`{
  "email": "user@example.com",
  "password": "securePassword123"
}`,response:`{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "bearer"
}`,color:"green"}],d={GET:"bg-blue-500/15 text-blue-400 border border-blue-500/30",POST:"bg-green-500/15 text-green-400 border border-green-500/30",DELETE:"bg-red-500/15 text-red-400 border border-red-500/30"};function p({code:e,label:s}){let[a,i]=(0,n.useState)(!1);return(0,t.jsxs)("div",{children:[(0,t.jsxs)("div",{className:"flex items-center justify-between mb-1.5",children:[(0,t.jsx)("span",{className:"text-xs text-slate-600 uppercase tracking-widest",children:s}),(0,t.jsx)("button",{onClick:()=>{navigator.clipboard.writeText(e),i(!0),setTimeout(()=>i(!1),2e3)},className:"flex items-center gap-1 text-xs text-slate-500 hover:text-cyan-400 transition-colors",children:a?(0,t.jsxs)(t.Fragment,{children:[(0,t.jsx)(c.CheckCircle,{className:"w-3 h-3"}),"Copied"]}):(0,t.jsxs)(t.Fragment,{children:[(0,t.jsx)(r,{className:"w-3 h-3"}),"Copy"]})})]}),(0,t.jsx)("pre",{className:"bg-black/40 rounded-lg p-3 text-xs font-mono text-slate-300 overflow-x-auto border border-white/5",children:e})]})}e.s(["default",0,function(){let[e,a]=(0,n.useState)(0);return(0,t.jsx)("div",{className:"min-h-screen pt-24 pb-16 px-4",children:(0,t.jsxs)("div",{className:"max-w-4xl mx-auto",children:[(0,t.jsxs)(s.motion.div,{initial:{opacity:0,y:20},animate:{opacity:1,y:0},className:"text-center mb-10",children:[(0,t.jsx)("h1",{className:"text-4xl font-black mb-3",children:(0,t.jsx)("span",{className:"gradient-text",children:"API Documentation"})}),(0,t.jsxs)("p",{className:"text-slate-400",children:["Production-ready REST API. Base URL: ",(0,t.jsx)("code",{className:"font-mono text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded",children:"http://localhost:8000"})]})]}),(0,t.jsx)(s.motion.div,{initial:{opacity:0},animate:{opacity:1},transition:{delay:.1},className:"glass-card p-4 mb-6 border border-yellow-500/20 bg-yellow-500/5",children:(0,t.jsxs)("p",{className:"text-sm text-yellow-400 flex items-center gap-2",children:[(0,t.jsx)(i,{className:"w-4 h-4"}),"Protected endpoints require a JWT Bearer token in the Authorization header: ",(0,t.jsx)("code",{className:"font-mono ml-1",children:"Bearer <your_token>"})]})}),(0,t.jsx)("div",{className:"space-y-3",children:l.map((i,r)=>(0,t.jsxs)(s.motion.div,{initial:{opacity:0,y:10},animate:{opacity:1,y:0},transition:{delay:.06*r},className:"glass-card overflow-hidden",children:[(0,t.jsxs)("button",{onClick:()=>a(e===r?null:r),className:"w-full flex items-center gap-3 p-4 hover:bg-white/2 transition-colors text-left",children:[(0,t.jsx)("span",{className:`text-xs font-bold px-2.5 py-1 rounded flex-shrink-0 ${d[i.method]}`,children:i.method}),(0,t.jsx)("code",{className:"font-mono text-sm text-slate-200 flex-1",children:i.path}),(0,t.jsx)("p",{className:"text-slate-500 text-xs hidden md:block flex-1",children:i.description}),(0,t.jsx)(o,{className:`w-4 h-4 text-slate-600 transition-transform flex-shrink-0 ${e===r?"rotate-90":""}`})]}),e===r&&(0,t.jsx)(s.motion.div,{initial:{height:0},animate:{height:"auto"},className:"overflow-hidden",children:(0,t.jsxs)("div",{className:"px-4 pb-4 border-t border-white/5 pt-4 space-y-4",children:[(0,t.jsx)("p",{className:"text-slate-400 text-sm",children:i.description}),i.body&&(0,t.jsx)(p,{code:i.body,label:"Request Body"}),(0,t.jsx)(p,{code:i.response,label:"Response"})]})})]},r))}),(0,t.jsxs)(s.motion.div,{initial:{opacity:0},whileInView:{opacity:1},viewport:{once:!0},className:"mt-8 text-center",children:[(0,t.jsx)("p",{className:"text-slate-500 text-sm mb-4",children:"The FastAPI backend also provides an interactive Swagger UI at:"}),(0,t.jsx)("code",{className:"font-mono text-cyan-400 bg-cyan-500/10 px-4 py-2 rounded-lg text-sm",children:"http://localhost:8000/docs"})]})]})})}],36791)}]);