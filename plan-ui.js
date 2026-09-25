'use strict';
const planStyles=document.createElement('link');planStyles.rel='stylesheet';planStyles.href='plan-ui.css?v=1';document.head.append(planStyles);
(()=>{
  const one=(selector,root=document)=>root.querySelector(selector);
  const nf=new Intl.NumberFormat('ar-SA',{maximumFractionDigits:1});
  const dateValue=value=>new Date(`${value}T12:00:00`);
  const dayLabel=value=>dateValue(value).toLocaleDateString('ar-SA',{weekday:'short',day:'numeric',month:'short',calendar:'gregory'});
  const rangeDays=(start,end,selected)=>{
    if(!start||!end||start>end)return [];
    const result=[];
    for(let date=dateValue(start);date<=dateValue(end);date.setDate(date.getDate()+1))if(selected.includes(date.getDay()))result.push(date.toISOString().slice(0,10));
    return result;
  };
  function setup(){
    const form=one('#planForm');
    if(!form||one('#planOverview'))return;
    const card=one('#view-plan .panel');
    const dates=one('.plan-dates',form),counter=one('.reading-counter',form),schedule=one('.schedule-mode',form),errors=one('#planError',form);
    card.querySelector('h2').insertAdjacentHTML('afterend','<p class="plan-intro">خطّة واضحة، ووتيرة مناسبة، وأيام قراءة محددة.</p><section id="planOverview" class="plan-overview" aria-live="polite"></section>');
    dates.insertAdjacentHTML('beforebegin','<h3 class="plan-section-title">مدة الدورة</h3>');
    one('#targetBooks').classList.add('plan-goal');
    counter.insertAdjacentHTML('beforebegin','<h3 class="plan-section-title">هدف القراءة</h3>');
    schedule.insertAdjacentHTML('beforebegin','<h3 class="plan-section-title">جدول القراءة</h3>');
    errors.insertAdjacentHTML('beforebegin','<section id="planCadence" class="plan-cadence" aria-live="polite"></section><section id="planPreview" class="plan-preview" aria-live="polite"></section>');
    const save=one('button[type="submit"]',form);save.classList.add('plan-save');
    const refresh=()=>{
      const start=one('#start').value,end=one('#end').value,target=Number(one('#targetBooks').value)||0;
      const selected=[...one('#weekdays').querySelectorAll('input:checked')].map(input=>Number(input.value));
      const weekly=one('#weeklyMode').getAttribute('aria-pressed')==='true';
      const reading=weekly?rangeDays(start,end,selected):[];
      const specificCount=one('#selectedDates').children.length;
      const totalDays=weekly?reading.length:specificCount;
      const overview=one('#planOverview');overview.replaceChildren();
      [['بداية الدورة',one('#startDisplay').textContent],['نهاية الدورة',one('#endDisplay').textContent],['أيام القراءة',totalDays?`${nf.format(totalDays)} يومًا`:'—']].forEach(([label,value])=>{const item=document.createElement('div');item.innerHTML=`<span>${label}</span><strong>${value}</strong>`;overview.append(item)});
      const cadence=one('#planCadence');cadence.replaceChildren();
      if(target&&totalDays){const perDay=target/totalDays;const period=Math.max(1,Math.ceil((dateValue(end)-dateValue(start))/86400000)+1);const perWeek=target*7/period;cadence.innerHTML=`<span class="cadence-mark">⌁</span><div><strong>وتيرتك المقترحة</strong><p>${nf.format(perDay)} كتاب لكل يوم قراءة · ${nf.format(perWeek)} كتاب أسبوعيًا</p></div>`}else cadence.innerHTML='<span class="cadence-mark">⌁</span><div><strong>وتيرتك المقترحة</strong><p>حدد الهدف وأيام القراءة لتظهر وتيرة خطتك.</p></div>';
      const preview=one('#planPreview');preview.replaceChildren();
      const heading=document.createElement('div');heading.className='preview-heading';heading.innerHTML=`<strong>${weekly?'أيام القراءة القادمة':'أيام القراءة المختارة'}</strong><span>${totalDays?`${nf.format(totalDays)} يومًا في الخطة`:'لم تحدد أيامًا بعد'}</span>`;preview.append(heading);
      const days=document.createElement('div');days.className='preview-days';
      if(weekly){reading.slice(0,12).forEach(value=>{const chip=document.createElement('span');chip.textContent=dayLabel(value);days.append(chip)});if(reading.length>12){const more=document.createElement('span');more.className='more-days';more.textContent=`+${nf.format(reading.length-12)}`;days.append(more)}}else if(specificCount){[...one('#selectedDates').children].forEach(chip=>{const copy=document.createElement('span');copy.textContent=chip.textContent.replace(' ×','');days.append(copy)})}preview.append(days);
    };
    form.addEventListener('change',refresh);form.addEventListener('input',refresh);[one('#weeklyMode'),one('#specificMode'),one('#specificPicker')].forEach(button=>button.addEventListener('click',()=>setTimeout(refresh,0)));refresh();
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',setup);else setTimeout(setup,0);
})();
