const toggle=document.querySelector(".menu-toggle"),nav=document.querySelector(".main-nav");
if(toggle){toggle.addEventListener("click",()=>{nav.classList.toggle("open");toggle.innerHTML=nav.classList.contains("open")?'<i class="fa-solid fa-xmark"></i>':'<i class="fa-solid fa-bars"></i>';});}
document.querySelectorAll(".main-nav a").forEach(a=>a.addEventListener("click",()=>nav?.classList.remove("open")));
const header=document.querySelector(".site-header");
window.addEventListener("scroll",()=>{if(header) header.classList.toggle("scrolled",scrollY>20);});
document.querySelectorAll(".faq button").forEach(btn=>btn.addEventListener("click",()=>{btn.classList.toggle("open");const panel=btn.nextElementSibling;panel.style.display=panel.style.display==="block"?"none":"block";}));
function formHandler(id){
 const form=document.getElementById(id); if(!form)return;
 form.addEventListener("submit",e=>{e.preventDefault();const msg=form.querySelector(".form-message");if(!form.checkValidity()){msg.textContent="Please complete the required fields.";msg.style.color="#9a3d32";form.reportValidity();return;}msg.textContent="Thank you. Your request has been captured on this demo site. Connect a real form/email service before publishing.";msg.style.color="#4b6b51";form.reset();});
}
formHandler("contactForm");formHandler("bookingForm");
const observer=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting)e.target.classList.add("visible")}),{threshold:.12});
document.querySelectorAll(".practice-card,.team-card,.service-detail,.three-values,.info-panel,.why-list>div").forEach(el=>{el.classList.add("reveal");observer.observe(el);});


/* ===== Lively Interactive Upgrade JS ===== */
document.addEventListener("DOMContentLoaded", () => {
  // Reveal-on-scroll animations
  const revealEls = document.querySelectorAll(".reveal,.reveal-left,.reveal-right");
  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if(entry.isIntersecting){
          entry.target.classList.add("show");
          obs.unobserve(entry.target);
        }
      });
    }, {threshold:.12});
    revealEls.forEach(el => observer.observe(el));
  } else {
    revealEls.forEach(el => el.classList.add("show"));
  }

  // Animated counters
  document.querySelectorAll(".stat-number[data-count]").forEach(el => {
    const target = Number(el.dataset.count || 0);
    let started = false;
    const run = () => {
      if(started) return;
      started = true;
      const duration = 1300, start = performance.now();
      const tick = now => {
        const p = Math.min((now-start)/duration,1);
        const eased = 1-Math.pow(1-p,3);
        el.textContent = Math.floor(target*eased).toLocaleString() + (el.dataset.suffix || "");
        if(p<1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    };
    const io = new IntersectionObserver(es => {
      if(es[0].isIntersecting){ run(); io.disconnect(); }
    }, {threshold:.5});
    io.observe(el);
  });

  // Practice-area filter
  const filterButtons = document.querySelectorAll(".filter-btn[data-filter]");
  const filterCards = document.querySelectorAll("[data-category]");
  filterButtons.forEach(btn => btn.addEventListener("click", () => {
    filterButtons.forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    const filter = btn.dataset.filter;
    filterCards.forEach(card => {
      const show = filter === "all" || (card.dataset.category || "").split(" ").includes(filter);
      card.classList.toggle("filter-hidden", !show);
    });
  }));

  // FAQ accordions (works for both old and new markup)
  document.querySelectorAll(".faq-question").forEach(q => {
    q.addEventListener("click", () => {
      const item = q.closest(".faq-item");
      if(!item) return;
      document.querySelectorAll(".faq-item.open").forEach(other => {
        if(other !== item) other.classList.remove("open");
      });
      item.classList.toggle("open");
    });
  });

  // Testimonial slider
  const slides = [...document.querySelectorAll(".testimonial-slide")];
  let slideIndex = 0;
  const showSlide = i => {
    slides.forEach((s,n)=>s.classList.toggle("active",n===i));
  };
  if(slides.length){
    showSlide(0);
    setInterval(()=>{ slideIndex=(slideIndex+1)%slides.length; showSlide(slideIndex); }, 5500);
    document.querySelector("[data-testimonial-next]")?.addEventListener("click",()=>{
      slideIndex=(slideIndex+1)%slides.length; showSlide(slideIndex);
    });
    document.querySelector("[data-testimonial-prev]")?.addEventListener("click",()=>{
      slideIndex=(slideIndex-1+slides.length)%slides.length; showSlide(slideIndex);
    });
  }

  // Toast helper
  window.showLegalToast = message => {
    let toast = document.querySelector(".toast");
    if(!toast){
      toast=document.createElement("div");
      toast.className="toast";
      document.body.appendChild(toast);
    }
    toast.textContent=message;
    toast.classList.add("show");
    setTimeout(()=>toast.classList.remove("show"),3000);
  };

  // Back to top
  const back = document.createElement("button");
  back.className="back-top";
  back.setAttribute("aria-label","Back to top");
  back.innerHTML="↑";
  document.body.appendChild(back);
  window.addEventListener("scroll",()=>back.classList.toggle("show",window.scrollY>600));
  back.addEventListener("click",()=>window.scrollTo({top:0,behavior:"smooth"}));

  // Add lively hover motion to cards/buttons
  document.querySelectorAll(".card,.service-card,.attorney-card,.practice-card,.case-card,.hover-lift").forEach(el=>{
    el.classList.add("hover-lift");
  });

  // Optional legal tip popup
  const tips = [
    "Legal tip: Keep important contracts and official documents in a secure place.",
    "Legal tip: Read important agreements carefully before signing them.",
    "Legal tip: When a dispute arises, keeping written records can help clarify events."
  ];
  if(!sessionStorage.getItem("oladimeji_tip_seen")){
    setTimeout(()=>{
      const tip=document.createElement("div");
      tip.className="legal-tip show";
      tip.innerHTML=`<button aria-label="Close">×</button><strong>Quick Legal Tip</strong><p>${tips[Math.floor(Math.random()*tips.length)]}</p>`;
      document.body.appendChild(tip);
      tip.querySelector("button").onclick=()=>{tip.remove();sessionStorage.setItem("oladimeji_tip_seen","1")};
    },7000);
  }

  // Contact/booking forms: keep static sites friendly without pretending to send data.
  document.querySelectorAll("form[data-demo-form]").forEach(form=>{
    form.addEventListener("submit",e=>{
      e.preventDefault();
      if(!form.checkValidity()){ form.reportValidity(); return; }
      showLegalToast("Thank you. Your details have been captured for this demo.");
      form.reset();
    });
  });
});

/* ===== Next-Level Polish JS ===== */
document.addEventListener("DOMContentLoaded",()=>{
  const bar=document.createElement("div");
  bar.className="scroll-progress";
  bar.setAttribute("aria-hidden","true");
  document.body.appendChild(bar);
  const updateProgress=()=>{
    const max=document.documentElement.scrollHeight-window.innerHeight;
    bar.style.width=(max>0 ? (window.scrollY/max)*100 : 0)+"%";
  };
  window.addEventListener("scroll",updateProgress,{passive:true});
  window.addEventListener("resize",updateProgress);
  updateProgress();
});

/* ===== Real enquiry handoff ===== */
function sendToWhatsApp(form, title){
  const data=new FormData(form);
  const get=k=>(data.get(k)||"").toString().trim();
  const lines=[title];
  [["Name","name"],["Email","email"],["Phone","phone"],["Subject","subject"],["Preferred date","date"],["Practice area","area"],["Message","message"]]
    .forEach(([label,key])=>{const value=get(key);if(value) lines.push(label+": "+value);});
  const url="https://wa.me/2348024273323?text="+encodeURIComponent(lines.join("\n"));
  window.open(url,"_blank","noopener,noreferrer");
}
document.addEventListener("DOMContentLoaded",()=>{
  document.querySelectorAll("#contactForm,#bookingForm").forEach(form=>{
    form.addEventListener("submit",e=>{
      e.preventDefault();
      if(!form.checkValidity()){form.reportValidity();return;}
      sendToWhatsApp(form,form.id==="bookingForm"?"New consultation request":"New legal enquiry");
      const msg=form.querySelector(".form-message");
      if(msg) msg.textContent="WhatsApp opened with your enquiry details. Please review and send the message.";
    });
  });
});
