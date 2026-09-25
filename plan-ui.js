'use strict';
const planStyles=document.createElement('link');planStyles.rel='stylesheet';planStyles.href='plan-ui.css?v=2';document.head.append(planStyles);
(()=>{
  const one=(selector,root=document)=>root.querySelector(selector);
  const nf=new Intl.NumberFormat('ar-SA',{maximumFractionDigits:1});
  const dateValue=value=>new Date(`${value}T12:00:00`);
  const rangeDays=(start,end,selected)=>{
    if(!start||!end||start>end)return [];
    const result=[];
    for(let date=dateValue(start);date<=dateValue(end);date.setDate(date.getDate()+1))if(selected.includes(date.getDay()))result.push(date.toISOString().slice(0,10));
    return result;
  };
  function setup(){
    const form=one('#planForm');
    if(!form||one('.plan-card'))return;
    const dates=one('.plan-dates',form),counter=one('.reading-counter',form),schedule=one('.schedule-mode',form),weekly=one('#weeklyFields',form),specific=one('#specificFields',form),goal=one('#targetBooks').closest('label'),errors=one('#planError',form),save=one('button[type="submit"]',form);
    const makeCard=(title,description)=>{const section=document.createElement('section');section.className='plan-card';section.innerHTML=`<div class="plan-card-heading"><h3>${title}</h3><p>${description}</p></div>`;return section};
    const duration=makeCard('مدة الدورة','اختر بداية الدورة ونهايتها.'),days=makeCard('أيام القراءة','حدد الأيام التي ستخصصها للقراءة.'),target=makeCard('عدد الكتب المستهدفة','ضع الهدف الذي تريد إنجازه في هذه الدورة.');
    form.insertBefore(duration,form.firstChild);duration.append(dates,counter);
    form.insertBefore(days,errors);days.append(schedule,weekly,specific);
    form.insertBefore(target,errors);target.append(goal);
    weekly.querySelector('legend').textContent='اختر أيام الأسبوع';
    errors.insertAdjacentHTML('beforebegin','<section id="planCadence" class="plan-cadence" hidden aria-live="polite"></section>');
    save.classList.add('plan-save');
    const refresh=()=>{
      const start=one('#start').value,end=one('#end').value,targetBooks=Number(one('#targetBooks').value)||0;
      const selected=[...one('#weekdays').querySelectorAll('input:checked')].map(input=>Number(input.value));
      const weeklyMode=one('#weeklyMode').getAttribute('aria-pressed')==='true';
      const reading=weeklyMode?rangeDays(start,end,selected):[];
      const specificCount=one('#selectedDates').children.length;
      const readingDays=weeklyMode?reading.length:specificCount;
      const durationDays=start&&end&&start<=end?Math.round((dateValue(end)-dateValue(start))/86400000)+1:0;
      one('#readingCount').textContent=durationDays?nf.format(durationDays):'—';
      counter.querySelector('span').textContent='يومًا في الدورة';
      if(!start&&!end&&!targetBooks&&!selected.length&&!specificCount)errors.textContent='';
      const cadence=one('#planCadence');cadence.hidden=!(targetBooks&&readingDays);
      if(!cadence.hidden){const perDay=targetBooks/readingDays;const period=Math.max(1,durationDays);const perWeek=targetBooks*7/period;const daily=perDay<1?`كتاب واحد كل ${nf.format(Math.ceil(readingDays/targetBooks))} يوم قراءة`:`${nf.format(perDay)} كتاب لكل يوم قراءة`;cadence.innerHTML=`<span class="cadence-mark">⌁</span><div><strong>وتيرتك المقترحة</strong><p>${daily} · ${nf.format(perWeek)} كتاب أسبوعيًا</p></div>`}
    };
    form.addEventListener('change',refresh);form.addEventListener('input',refresh);[one('#weeklyMode'),one('#specificMode'),one('#specificPicker')].forEach(button=>button.addEventListener('click',()=>setTimeout(refresh,0)));refresh();
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',setup);else setTimeout(setup,0);
})();
