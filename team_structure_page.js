let teamData = {};

fetch("team.json")
  .then(response => response.json())
  .then(data => {
    teamData = data;
    initRender(); 
  })

deptColors={HR:"#f08c7e",PR:"#87baba",FR:"#ffa197","Content Writing":"#bbe8e8",Creative:"#9f7aea","Community Moderator":"#667eea",Marketing:"#f6ad55","Software Engineer":"#0d0a3b","Graphic Design":"#fc8181",Media:"#68d391",إدارة:"#2d2c2c"};function getInitials(e){return e&&"string"==typeof e?e.split(" ").filter(e=>e).map(e=>e[0]).join("").substring(0,2).toUpperCase():"?"}function renderSocialIcons(e,a="default"){if(!e||0===Object.keys(e).length)return"";let t="",i={facebook:"fab fa-facebook-f",twitter:"fab fa-twitter",instagram:"fab fa-instagram",linkedin:"fab fa-linkedin-in",youtube:"fab fa-youtube",github:"fab fa-github",behance:"fab fa-behance",whatsapp:"fab fa-whatsapp",telegram:"fab fa-telegram-plane"};for(let[r,n]of Object.entries(e))n&&i[r]&&(t+=`<a href="${n}" target="_blank" rel="noopener noreferrer" class="social-icon ${r}" aria-label="${r}"><i class="${i[r]}"></i></a>`);return t?`<div class="flex ${"founder"===a?"justify-center md:justify-start":"justify-center"} flex-wrap gap-3">${t}</div>`:""}
function renderFounder(e){let a=teamData.founder;if(!a||!e){e&&(e.innerHTML='<p class="text-center text-gray-600 p-6">لم يتم تحديد بيانات المؤسس.</p>');return}let t;if(a.image)t=`<img src="${a.image}" alt="${a.name}" class="profile-image-lg mx-auto md:mx-0">`;else{let i=getInitials(a.name);t=`<div class="profile-image-lg default-avatar mx-auto md:mx-0" style="background-color: var(--color-navy);"><span>${i}</span></div>`}
    let r=renderSocialIcons(a.social,"founder"),
    n=`<div class="flex flex-col md:flex-row items-center text-center md:text-right gap-6 md:gap-8 p-4 md:p-6">
            <div class="flex-shrink-0 order-1 md:order-1">${t}</div>
            <div class="flex-1 order-2 md:order-2 md:text-right">
                <h3 class="text-2xl lg:text-3xl font-bold text-gray-800 mb-2">${a.name||"اسم المؤسس"}</h3>
            <p class="text-gray-700 mb-5 leading-relaxed">${a.bio||"نبذة عن المؤسس..."}</p>
            ${r}
            </div>
        </div>`;
        e.innerHTML=n}function renderCouncil(e){if(!e)return;e.innerHTML="";let a=teamData.members.filter(e=>e&&"council"===e.role);if(0===a.length){e.innerHTML='<p class="text-center text-gray-600 md:col-span-full py-4">لا يوجد أعضاء في المجلس حالياً.</p>';return}a.forEach(a=>{let t,i=deptColors[a.department]||deptColors["إدارة"]||"#ccc";t=a.image?`<img src="${a.image}" alt="${a.name}" class="profile-image">`:`<div class="profile-image default-avatar" style="background-color: ${i};"><span>${getInitials(a.name)}</span></div>`;let r=document.createElement("div");r.className="council-card",r.innerHTML=`
            <div class="mb-4 flex-shrink-0">${t}</div>
            <div class="flex flex-col flex-grow justify-center">
                <h3 class="text-xl font-bold text-gray-800 mb-2">${a.name}</h3>
                <p class="text-gray-700 text-sm mb-3">${a.title}</p>
                ${a.bio?`<p class="text-sm text-gray-600 mb-4 px-2">${a.bio}</p>`:""}
            </div>
            ${renderSocialIcons(a.social)}`,e.appendChild(r)})}function renderLeaders(e){if(!e)return;e.innerHTML="";let a=teamData.members.filter(e=>e&&"leader"===e.role);if(0===a.length){e.innerHTML='<p class="text-center text-gray-600 md:col-span-full py-4">لا يوجد قادة حالياً.</p>';return}a.forEach(a=>{let t,i=deptColors[a.department]||"#87baba",r=a.department?a.department.toLowerCase().replace(/\s+/g,"-"):"unknown";t=a.image?`<img src="${a.image}" alt="${a.name}" class="profile-image-sm">`:`<div class="profile-image-sm default-avatar" style="background-color: ${i};"><span>${getInitials(a.name)}</span></div>`;let n=document.createElement("div");n.className="leaders-card",n.innerHTML=`
            <div class="flex items-center mb-4">
                <div class="ml-4 flex-shrink-0">${t}</div>
                <div class="flex-grow overflow-hidden">
                    <h3 class="text-lg font-bold text-gray-800 truncate">${a.name}</h3>
                    <p class="text-sm text-gray-600 truncate">${a.title}</p>
                    <span class="dept-${r}">${a.department||"غير محدد"}</span>
                </div>
            </div>
            ${a.bio?`<p class="text-sm text-gray-700 mb-4 flex-grow">${a.bio}</p>`:'<div class="flex-grow"></div>'}
            ${renderSocialIcons(a.social)}`,e.appendChild(n)})}function renderMembers(e,a="all",t=""){if(!e)return;e.innerHTML="";let i=teamData.members.filter(e=>e&&"member"===e.role);if("all"!==a&&(i=i.filter(e=>e.department===a)),t){let r=t.toLowerCase().trim();r&&(i=i.filter(e=>e.name&&e.name.toLowerCase().includes(r)||e.title&&e.title.toLowerCase().includes(r)||e.department&&e.department.toLowerCase().includes(r)))}if(0===i.length){e.innerHTML='<p class="text-center text-gray-600 sm:col-span-full py-4">جاري العمل علي إضافتهم</p>';return}i.forEach(a=>{let t,i=deptColors[a.department]||"#ccc",r=a.department?a.department.toLowerCase().replace(/\s+/g,"-"):"unknown";t=a.image?`<img src="${a.image}" alt="${a.name}" class="profile-image-sm">`:`<div class="profile-image-sm default-avatar" style="background-color: ${i};"><span>${getInitials(a.name)}</span></div>`;let n=document.createElement("div");n.className="member-card",n.innerHTML=`
            <div class="flex items-center">
                <div class="ml-3 flex-shrink-0">${t}</div>
                <div class="flex-grow overflow-hidden">
                    <h3 class="font-medium text-gray-800 truncate">${a.name||"اسم العضو"}</h3>
                    <p class="text-xs text-gray-500 truncate">${a.title||"المسمى الوظيفي"}</p>
                    <span class="dept-${r}">${a.department||"غير محدد"}</span>
                </div>
            </div>`,e.appendChild(n)})}
            
            function initRender() {
                const founderCard = document.getElementById("founderCard");
                const councilContainer = document.getElementById("councilContainer");
                const leadersContainer = document.getElementById("leadersContainer");
                const membersContainer = document.getElementById("membersContainer");
                const memberSearch = document.getElementById("memberSearch");
                const filterButtons = document.querySelectorAll(".tab-button[data-filter]");
                const yearSpan = document.getElementById("current-year");

                renderFounder(founderCard);
                renderCouncil(councilContainer);
                renderLeaders(leadersContainer);
                renderMembers(membersContainer);

                filterButtons.forEach((btn) => {
                  btn.addEventListener("click", function () {
                    filterButtons.forEach((b) => b.classList.remove("active"));
                    this.classList.add("active");
                    renderMembers(
                      membersContainer,
                      this.getAttribute("data-filter"),
                      memberSearch.value
                    );
                  });
                });

                memberSearch.addEventListener("input", function () {
                  const activeFilter =
                    document.querySelector(".tab-button.active")?.getAttribute("data-filter") ||
                    "all";
                  renderMembers(membersContainer, activeFilter, this.value);
                });

                if (yearSpan) yearSpan.textContent = new Date().getFullYear()
            };