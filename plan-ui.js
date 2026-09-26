'use strict';
const planStyles=document.createElement('link');planStyles.rel='stylesheet';planStyles.href='plan-ui.css?v=3';document.head.append(planStyles);
(()=>{
  const one=(selector,root=document)=>root.querySelector(selector);
  function setup(){
    const form=one('#planForm');
    if(!form||one('.plan-card'))return;
    const dates=one('.plan-dates',form),counter=one('.reading-counter',form),schedule=one('.schedule-mode',form),weekly=one('#weeklyFields',form),specific=one('#specificFields',form),goal=one('#targetBooks').closest('label'),errors=one('#planError',form),save=one('button[type="submit"]',form);
    const makeCard=title=>{const section=document.createElement('section');section.className='plan-card';section.innerHTML=`<div class="plan-card-heading"><h3>${title}</h3></div>`;return section};
    const duration=makeCard('مدة الدورة'),days=makeCard('أيام القراءة'),target=makeCard('هدف الدورة');
    form.insertBefore(duration,form.firstChild);duration.append(dates);
    form.insertBefore(days,errors);days.append(schedule,weekly,specific,counter);
    form.insertBefore(target,errors);target.append(goal);
    dates.querySelectorAll('.date-label').forEach((label,index)=>label.textContent=index?'نهاية الدورة:':'بداية الدورة:');
    weekly.querySelector('legend').textContent='اختر أيام الأسبوع';
    goal.childNodes[0].textContent='عدد الكتب';
    one('#specificPicker').hidden=true;
    one('#selectedDates').hidden=true;
    const inline=document.createElement('section');inline.id='inlineSpecificCalendar';inline.className='inline-specific-calendar';inline.hidden=true;inline.setAttribute('aria-label','تقويم أيام القراءة');
    specific.prepend(inline);
    save.classList.add('plan-save');
    const refresh=()=>{
      const start=one('#start').value,end=one('#end').value;
      const weeklyMode=one('#weeklyMode').getAttribute('aria-pressed')==='true';
      const selected=[...one('#weekdays').querySelectorAll('input:checked')].map(input=>Number(input.value));
      const selectedDates=[...one('#selectedDates').querySelectorAll('.date-chip')].length;
      const ready=!!start&&!!end&&start<=end&&(weeklyMode?selected.length>0:selectedDates>0);
      counter.hidden=!ready;
      inline.hidden=weeklyMode;
      if(!weeklyMode)window.renderInlineSpecificCalendar?.();
    };
    form.addEventListener('change',refresh);form.addEventListener('input',refresh);
    [one('#weeklyMode'),one('#specificMode')].forEach(button=>button.addEventListener('click',()=>setTimeout(refresh,0)));
    refresh();
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',setup);else setTimeout(setup,0);
})();
