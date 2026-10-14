/* EventSync browser demo. All records are stored in this browser's localStorage. */
(() => {
  const KEY = 'eventsync-demo-v1';
  const today = new Date().toISOString().slice(0, 10);
  const plus = (n) => { const d = new Date(); d.setDate(d.getDate() + n); return d.toISOString().slice(0, 10); };
  const seed = {
    events: [
      { id: 1, name: 'AI Innovation Workshop', date: plus(8), venue: 'Innovation Lab', capacity: 60, fee: 250, status: 'Upcoming', description: 'A hands-on introduction to artificial intelligence.' },
      { id: 2, name: 'Future Tech Seminar', date: plus(18), venue: 'Main Auditorium', capacity: 120, fee: 0, status: 'Upcoming', description: 'Talks on emerging technology.' },
      { id: 3, name: 'Cultural Fest 2026', date: plus(30), venue: 'College Grounds', capacity: 300, fee: 150, status: 'Upcoming', description: 'Annual student cultural celebration.' }
    ],
    participants: [
      { id: 1, name: 'Aarav Sharma', email: 'aarav@example.com', phone: '9876543210', institution: 'WOU' },
      { id: 2, name: 'Mia Patel', email: 'mia@example.com', phone: '9876543211', institution: 'WOU' },
      { id: 3, name: 'Rohan Das', email: 'rohan@example.com', phone: '9876543212', institution: 'WOU' }
    ],
    sessions: [
      { id: 1, event_id: 1, name: 'Welcome & Opening', start_time: '10:00', end_time: '10:30', speaker: 'Dr. Meera Rao', room: 'Lab 1' },
      { id: 2, event_id: 1, name: 'Building with AI', start_time: '10:45', end_time: '12:00', speaker: 'Prof. Arjun Nair', room: 'Lab 1' },
      { id: 3, event_id: 2, name: 'Technology keynote', start_time: '11:00', end_time: '12:00', speaker: 'Dr. Sana Ali', room: 'Auditorium' }
    ],
    registrations: [
      { id: 1, participant_id: 1, event_id: 1, registration_date: today, status: 'Confirmed' },
      { id: 2, participant_id: 2, event_id: 1, registration_date: today, status: 'Confirmed' },
      { id: 3, participant_id: 3, event_id: 2, registration_date: today, status: 'Confirmed' }
    ],
    attendance: [
      { id: 1, registration_id: 1, session_id: 1, attendance_date: today, status: 'Present' }
    ],
    payments: [
      { id: 1, registration_id: 1, amount: 250, payment_date: today, method: 'UPI', status: 'Paid' },
      { id: 2, registration_id: 2, amount: 250, payment_date: today, method: 'UPI', status: 'Pending' }
    ],
    certificates: [
      { id: 1, registration_id: 1, issue_date: today, certificate_code: 'ES-2026-001', status: 'Issued' }
    ],
    waitlist: []
  };
  const config = {
    events: { title: 'Events', singular: 'Event', icon: '▣', fields: [['name','Event name','text'],['date','Date','date'],['venue','Venue','text'],['capacity','Capacity','number'],['fee','Fee (₹)','number'],['status','Status','select',['Upcoming','Ongoing','Completed','Cancelled']],['description','Description','textarea']] },
    sessions: { title: 'Sessions', singular: 'Session', icon: '◷', fields: [['event_id','Event','event'],['name','Session name','text'],['start_time','Start time','time'],['end_time','End time','time'],['speaker','Speaker','text'],['room','Room','text']] },
    participants: { title: 'Participants', singular: 'Participant', icon: '♙', fields: [['name','Full name','text'],['email','Email','email'],['phone','Phone','tel'],['institution','Institution','text']] },
    registrations: { title: 'Registration', singular: 'Registration', icon: '+', fields: [['participant_id','Participant','participant'],['event_id','Event','event'],['registration_date','Registration date','date'],['status','Status','select',['Confirmed','Pending','Cancelled']]] },
    attendance: { title: 'Attendance', singular: 'Attendance record', icon: '✓', fields: [['registration_id','Registration','registration'],['session_id','Session','session'],['attendance_date','Date','date'],['status','Status','select',['Present','Absent']]] },
    payments: { title: 'Payments', singular: 'Payment', icon: '$', fields: [['registration_id','Registration','registration'],['amount','Amount (₹)','number'],['payment_date','Payment date','date'],['method','Method','select',['UPI','Card','Cash','Bank transfer']],['status','Status','select',['Paid','Pending','Refunded']]] },
    certificates: { title: 'Certificates', singular: 'Certificate', icon: '▤', fields: [['registration_id','Registration','registration'],['issue_date','Issue date','date'],['certificate_code','Certificate code','text'],['status','Status','select',['Issued','Pending']]] }
  };
  const columns = {
    events: [['name','Event'],['date','Date'],['venue','Venue'],['capacity','Capacity'],['fee','Fee'],['status','Status']],
    sessions: [['name','Session'],['event_id','Event'],['start_time','Start'],['end_time','End'],['speaker','Speaker'],['room','Room']],
    participants: [['name','Name'],['email','Email'],['phone','Phone'],['institution','Institution']],
    registrations: [['participant_id','Participant'],['event_id','Event'],['registration_date','Date'],['status','Status']],
    attendance: [['registration_id','Registration'],['session_id','Session'],['attendance_date','Date'],['status','Status']],
    payments: [['registration_id','Registration'],['amount','Amount'],['payment_date','Date'],['method','Method'],['status','Status']],
    certificates: [['registration_id','Registration'],['issue_date','Issue date'],['certificate_code','Certificate code'],['status','Status']]
  };
  let data;
  try { data = JSON.parse(localStorage.getItem(KEY)) || seed; } catch { data = seed; }
  Object.keys(seed).forEach(k => { if (!Array.isArray(data[k])) data[k] = seed[k]; });
  let page = 'dashboard';
  const $ = (s, root=document) => root.querySelector(s);
  const esc = (v='') => String(v).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const save = () => localStorage.setItem(KEY, JSON.stringify(data));
  const titleCase = s => s[0].toUpperCase()+s.slice(1);
  const labelFor = (key, id) => {
    const map = {event_id:'events',participant_id:'participants',registration_id:'registrations',session_id:'sessions'};
    const obj = (data[map[key]] || []).find(x => String(x.id) === String(id));
    if (!obj) return '—';
    return obj.name || obj.certificate_code || `#${obj.id}`;
  };
  const display = (key, value) => key.endsWith('_id') ? labelFor(key,value) : (key === 'fee' || key === 'amount' ? `₹${Number(value||0).toLocaleString('en-IN')}` : (value || '—'));
  function renderNav(){
    const items=[['dashboard','⌂','Dashboard'],...Object.entries(config).map(([k,c])=>[k,c.icon,c.title])];
    $('#navigation').innerHTML=items.map(([k,i,t])=>`<button class="nav ${page===k?'active':''}" data-page="${k}"><span class="icon">${i}</span>${t}</button>`).join('');
    $('#navigation').onclick=e=>{const b=e.target.closest('[data-page]');if(b){page=b.dataset.page;render();}};
  }
  function renderDashboard(){
    const active=data.events.filter(e=>e.status!=='Cancelled'&&e.status!=='Completed').length;
    const registrations=data.registrations.filter(r=>r.status!=='Cancelled').length;
    const people=data.participants.length;
    const upcoming=[...data.events].filter(e=>e.status==='Upcoming'||e.status==='Ongoing').sort((a,b)=>a.date.localeCompare(b.date)).slice(0,5);
    return `<div class="alert success">Demo mode: your changes are saved in this browser only. This simple version does not use an online database.</div>
      <div class="stats"><article class="stat-card"><div class="stat-accent"></div><div class="stat-body"><label>Active events</label><div class="stat-value">${active}</div></div></article><article class="stat-card"><div class="stat-accent green"></div><div class="stat-body"><label>Registrations</label><div class="stat-value">${registrations}</div></div></article><article class="stat-card"><div class="stat-accent amber"></div><div class="stat-body"><label>Participants</label><div class="stat-value">${people}</div></div></article></div>
      <section class="lifecycle"><h2 class="section-title">Event management at a glance</h2><div class="stages"><article class="stage"><div class="stage-number">01</div><h3>Plan events</h3><p>Create events, set dates and venues, and add sessions to the schedule.</p></article><article class="stage"><div class="stage-number">02</div><h3>Manage participants</h3><p>Keep participant details together and record event registrations.</p></article><article class="stage"><div class="stage-number">03</div><h3>Track the day</h3><p>Record attendance, payments, and certificates from one workspace.</p></article></div></section>
      <section class="lifecycle"><div class="page-toolbar"><div><h2>Upcoming events</h2><p>Your next scheduled events</p></div><button class="button primary" data-goto="events">View events</button></div>${table('events',upcoming,false)}</section>
      <div class="page-toolbar" style="justify-content:flex-end;margin-top:18px"><button class="button light" data-reset>Reset sample data</button></div><div class="footer">EventSync — Event Management System <span>Browser demo</span></div>`;
  }
  function table(kind, rows, actions=true){
    const cols=columns[kind]||[];
    return `<div class="table-card"><div class="table-scroll"><table><thead><tr>${cols.map(c=>`<th>${c[1]}</th>`).join('')}${actions?'<th>Actions</th>':''}</tr></thead><tbody>${rows.length?rows.map(row=>`<tr>${cols.map(([k])=>`<td>${esc(display(k,row[k]))}</td>`).join('')}${actions?`<td><div class="row-actions"><button data-edit="${row.id}" title="Edit">Edit</button><button data-delete="${row.id}" title="Delete">Delete</button></div></td>`:''}</tr>`).join(''):`<tr><td class="empty" colspan="${cols.length+(actions?1:0)}">No records yet. Select “Add ${config[kind].singular}” to get started.</td></tr>`}</tbody></table></div></div>`;
  }
  function renderList(kind){
    const c=config[kind];
    return `<div class="page-toolbar"><div><h2>${c.title}</h2><p>View and manage your ${c.title.toLowerCase()}.</p></div><button class="button primary" id="add-record">+ Add ${c.singular}</button></div><div class="table-tools"><strong>${c.title} list <small>(${data[kind].length})</small></strong><input class="search" id="search" placeholder="Search ${c.title.toLowerCase()}…" aria-label="Search ${c.title}"></div><div id="list-table">${table(kind,data[kind])}</div>${kind==='registrations'?`<section class="lifecycle"><div class="page-toolbar"><div><h2>Waitlist</h2><p>Participants waiting for an event place.</p></div></div>${waitlistTable()}</section>`:''}<div class="footer">EventSync — Event Management System <span>Saved in this browser</span></div>`;
  }
  function waitlistTable(){
    const rows=data.waitlist;
    return `<div class="table-card"><div class="table-scroll"><table><thead><tr><th>Participant</th><th>Event</th><th>Position</th><th>Added</th><th>Actions</th></tr></thead><tbody>${rows.length?rows.map(r=>`<tr><td>${esc(labelFor('participant_id',r.participant_id))}</td><td>${esc(labelFor('event_id',r.event_id))}</td><td>${r.position}</td><td>${esc(r.added_date)}</td><td><button class="button light" data-wait-delete="${r.id}">Remove</button></td></tr>`).join(''):`<tr><td class="empty" colspan="5">The waitlist is empty.</td></tr>`}</tbody></table></div></div>`;
  }
  function render(){
    renderNav(); const name=page==='dashboard'?'Dashboard':config[page].title;
    $('#crumb').textContent=name.toUpperCase(); $('#page-title').textContent=name;
    $('#content').innerHTML=page==='dashboard'?renderDashboard():renderList(page);
    $('#content').onclick=e=>{
      if(e.target.closest('[data-goto]')){page=e.target.closest('[data-goto]').dataset.goto;render();return;}
      if(e.target.closest('[data-reset]')){if(confirm('Reset all browser demo records to the original examples?')){data=JSON.parse(JSON.stringify(seed));save();render();toast('Sample data restored');}return;}
      if(e.target.id==='add-record'){openForm(page);return;}
      const edit=e.target.closest('[data-edit]'); if(edit){openForm(page,data[page].find(x=>String(x.id)===edit.dataset.edit));return;}
      const del=e.target.closest('[data-delete]'); if(del){removeRecord(page,del.dataset.delete);return;}
      const wd=e.target.closest('[data-wait-delete]');if(wd){data.waitlist=data.waitlist.filter(x=>String(x.id)!==wd.dataset.waitDelete);save();render();toast('Removed from waitlist');}
    };
    const search=$('#search'); if(search) search.oninput=()=>{const q=search.value.toLowerCase();const filtered=data[page].filter(row=>Object.entries(row).some(([k,v])=>String(display(k,v)).toLowerCase().includes(q)));$('#list-table').innerHTML=table(page,filtered);};
  }
  function openForm(kind, row){
    const c=config[kind], isEdit=!!row;
    const fields=c.fields.map(([key,label,type,opts])=>{
      let value=row?.[key]??(type==='date'?today:''); let input;
      if(type==='select') input=`<select name="${key}" ${key==='status'?'':'required'}>${opts.map(o=>`<option ${String(value)===o?'selected':''}>${esc(o)}</option>`).join('')}</select>`;
      else if(type==='textarea')input=`<textarea name="${key}">${esc(value)}</textarea>`;
      else if(['event','participant','registration','session'].includes(type)){
        const source={event:'events',participant:'participants',registration:'registrations',session:'sessions'}[type];
        input=`<select name="${key}" required><option value="">Choose…</option>${data[source].map(x=>`<option value="${x.id}" ${String(value)===String(x.id)?'selected':''}>${esc(x.name||x.certificate_code||`#${x.id}`)}</option>`).join('')}</select>`;
      } else input=`<input name="${key}" type="${type}" value="${esc(value)}" ${type==='number'?'min="0"':''} ${['text','date','email','number'].includes(type)?'required':''}>`;
      return `<div class="field ${type==='textarea'?'full':''}"><label>${label}</label>${input}</div>`;
    }).join('');
    $('#modal-root').innerHTML=`<div class="modal-backdrop"><section class="modal" role="dialog" aria-modal="true"><div class="modal-header"><h2>${isEdit?'Edit':'Add'} ${c.singular}</h2><button type="button" id="close-modal" aria-label="Close">×</button></div><form id="record-form"><div class="form-grid">${fields}</div><p class="modal-note">Your changes are stored in this browser on this device.</p><div class="modal-actions"><button type="button" class="button light" id="cancel-modal">Cancel</button><button class="button primary">Save ${c.singular}</button></div></form></section></div>`;
    const close=()=>$('#modal-root').innerHTML=''; $('#close-modal').onclick=close; $('#cancel-modal').onclick=close;
    $('#modal-root').onclick=e=>{if(e.target.classList.contains('modal-backdrop'))close();};
    $('#record-form').onsubmit=e=>{e.preventDefault();const form=new FormData(e.currentTarget);const item=Object.fromEntries(form.entries());
      c.fields.forEach(([k,,t])=>{if(t==='number')item[k]=Number(item[k]||0);if(['event','participant','registration','session'].includes(t))item[k]=Number(item[k]);});
      if(kind==='registrations'&&!isEdit){
        const ev=data.events.find(x=>x.id===item.event_id); const confirmed=data.registrations.filter(x=>x.event_id===item.event_id&&x.status!=='Cancelled').length;
        if(ev&&confirmed>=Number(ev.capacity)){const same=data.waitlist.filter(x=>x.event_id===item.event_id);data.waitlist.push({id:nextId(data.waitlist),participant_id:item.participant_id,event_id:item.event_id,position:same.length+1,added_date:today});save();close();render();toast('Event is full — participant added to the waitlist.');return;}
      }
      if(isEdit){Object.assign(row,item);}else{item.id=nextId(data[kind]);data[kind].push(item);}
      save();close();render();toast(isEdit?'Changes saved':'Record added');
    };
  }
  function nextId(rows){return rows.reduce((m,x)=>Math.max(m,Number(x.id)||0),0)+1;}
  function removeRecord(kind,id){const row=data[kind].find(x=>String(x.id)===String(id));if(!row)return;if(!confirm(`Delete this ${config[kind].singular.toLowerCase()}?`))return;data[kind]=data[kind].filter(x=>String(x.id)!==String(id));save();render();toast('Record deleted');}
  function toast(message){const root=$('#toast-root');root.innerHTML=`<div class="toast">${esc(message)}</div>`;setTimeout(()=>root.innerHTML='',2600);}
  render();
})();
