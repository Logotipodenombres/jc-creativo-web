const quoteCourses = [{"id": "b0", "name": "Inteligencia Artificial Básica", "duration": "3 h", "base": 900, "category": "Básicos", "hours": 3}, {"id": "b1", "name": "IA aplicada a Ventas", "duration": "4 h", "base": 1100, "category": "Básicos", "hours": 4}, {"id": "b2", "name": "IA para Marketing y Redes", "duration": "4 h", "base": 1100, "category": "Básicos", "hours": 4}, {"id": "b3", "name": "IA para Administración", "duration": "4 h", "base": 1100, "category": "Básicos", "hours": 4}, {"id": "b4", "name": "ChatGPT para Negocios", "duration": "3 h", "base": 900, "category": "Básicos", "hours": 3}, {"id": "b5", "name": "Marketing para Emprendedores", "duration": "4 h", "base": 1100, "category": "Básicos", "hours": 4}, {"id": "b6", "name": "Facebook e Instagram", "duration": "4 h", "base": 1100, "category": "Básicos", "hours": 4}, {"id": "b7", "name": "Canva para Negocios", "duration": "4 h", "base": 1000, "category": "Básicos", "hours": 4}, {"id": "b8", "name": "CapCut y Edición", "duration": "4 h", "base": 1000, "category": "Básicos", "hours": 4}, {"id": "b9", "name": "Creación de Contenido con IA", "duration": "4 h", "base": 1100, "category": "Básicos", "hours": 4}, {"id": "excel", "name": "IA en Excel", "duration": "4 h", "base": 1200, "category": "Básicos", "hours": 4}, {"id": "c11", "name": "IA Aplicada a Ventas Avanzado", "duration": "4 h", "base": 1500, "category": "Avanzados", "hours": 4}, {"id": "c12", "name": "IA Avanzada Proyectos y Tarjetas Digitales", "duration": "6 h", "base": 2000, "category": "Avanzados", "hours": 6}, {"id": "c13", "name": "Marketing Digital Avanzado", "duration": "4 h", "base": 1500, "category": "Avanzados", "hours": 4}, {"id": "c14", "name": "Publicidad en Facebook e Instagram Avanzado", "duration": "4 h", "base": 1500, "category": "Avanzados", "hours": 4}, {"id": "c15", "name": "Canva Avanzado", "duration": "4 h", "base": 1400, "category": "Avanzados", "hours": 4}, {"id": "c16", "name": "Edición de Video Avanzado", "duration": "6 h", "base": 1800, "category": "Avanzados", "hours": 6}, {"id": "c17", "name": "IA para gerentes y toma de decisiones", "duration": "4 h", "base": 1500, "category": "Gerenciales y corporativos", "hours": 4}, {"id": "c18", "name": "Liderazgo y gestión de equipos", "duration": "4 h", "base": 1500, "category": "Gerenciales y corporativos", "hours": 4}, {"id": "c19", "name": "Indicadores y control de resultados", "duration": "6 h", "base": 2000, "category": "Gerenciales y corporativos", "hours": 6}, {"id": "c20", "name": "Gestión comercial y servicio al cliente", "duration": "4 h", "base": 1500, "category": "Gerenciales y corporativos", "hours": 4}, {"id": "c21", "name": "Productividad y procesos con IA", "duration": "6 h", "base": 1800, "category": "Gerenciales y corporativos", "hours": 6}, {"id": "c22", "name": "IA para transporte y logística", "duration": "6 h", "base": 1800, "category": "Gerenciales y corporativos", "hours": 6}];
function calculateCourseQuote(people, selected) {
  if (!Number.isInteger(people) || people < 1 || people > 500) return null;
  const priced = selected.filter(c => Number.isFinite(c.base));
  const pending = selected.filter(c => !Number.isFinite(c.base));
  const lines = priced.map(c => {
    const rate = people >= 16 ? .25 : people >= 11 ? .20 : people >= 6 ? .15 : people >= 2 ? .10 : 0;
    const before = c.base * people;
    const unitPrice = Math.round(c.base * (1-rate) * 100) / 100;
    const groupTotal = Math.round(unitPrice * people * 100) / 100;
    return {...c, unitPrice, rate, before, groupTotal, saving: before - groupTotal};
  });
  const original = lines.reduce((sum,c) => sum + c.before, 0);
  const subtotal = lines.reduce((sum,c) => sum + c.groupTotal, 0);
  const bundleRate = priced.length >= 3 ? .15 : priced.length === 2 ? .1 : 0;
  const bundleSaving = Math.round(subtotal * bundleRate * 100) / 100;
  const total = Math.round((subtotal - bundleSaving) * 100) / 100;
  return {hours: priced.reduce((sum,c)=>sum+c.hours,0), lines, pending, original, groupSaving: original-subtotal, subtotal, bundleRate, bundleSaving, total, perPerson: total/people};
}
const quoteForm = document.querySelector('#course-quote-form');
const quoteOptions = document.querySelector('#quote-options');
const quoteResult = document.querySelector('#quote-result');
const quoteContact = document.querySelector('#quote-whatsapp');
const quotePeople = document.querySelector('#quote-people');
const quoteMoney = value => new Intl.NumberFormat('es-MX',{style:'currency',currency:'MXN',minimumFractionDigits:2}).format(value);
const quoteEscape = value => String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
quoteOptions.innerHTML = [...new Set(quoteCourses.map(c=>c.category))].map(category => `<details class="quote-category"><summary>${category}<span>Ver cursos</span></summary><fieldset><legend class="quote-sr-only">${category}</legend><div class="quote-choices">${quoteCourses.filter(c=>c.category===category).map(c=>`<label><input type="checkbox" name="course" value="${c.id}"><span><strong>${quoteEscape(c.name)}</strong><small>${c.duration} · ${c.base ? quoteMoney(c.base)+' / persona · tarifa individual' : 'Cotización personalizada'}</small></span></label>`).join('')}</div></fieldset></details>`).join('');
function updateCourseQuote() {
  const people = quotePeople.valueAsNumber;
  const ids = [...quoteForm.querySelectorAll('input[name="course"]:checked')].map(c=>c.value);
  const selected = quoteCourses.filter(c=>ids.includes(c.id));
  const result = calculateCourseQuote(people, selected);
  quoteContact.hidden = true;
  quoteContact.removeAttribute('href');
  quotePeople.setAttribute('aria-invalid', String(!result));
  if (!result) {quoteResult.textContent='Escribe un número entero de participantes entre 1 y 500.';return;}
  if (!selected.length) {quoteResult.textContent='Selecciona al menos un curso para ver tu estimación.';return;}
  const pendingNote = result.pending.length ? `<div class="quote-pending"><strong>Pendientes de cotización personalizada</strong><ul>${result.pending.map(c=>`<li>${quoteEscape(c.name)}</li>`).join('')}</ul><p>No están incluidos en el importe calculado ni en el número de cursos usado para el descuento. Sus precios y posibles descuentos se confirman en la propuesta.</p></div>` : '';
  const partial = result.pending.length > 0;
  const heading = partial ? 'Importe parcial estimado' : 'Total estimado';
  quoteResult.innerHTML = `<h4>${selected.length} ${selected.length===1?'curso seleccionado':'cursos seleccionados'} · ${people} ${people===1?'persona':'personas'} · ${result.hours} horas de capacitación</h4>`+(result.lines.length ? `<ul class="quote-lines">${result.lines.map(c=>`<li><span>${quoteEscape(c.name)} · ${c.hours} h<small class="quote-unit">${quoteMoney(c.unitPrice)} por persona × ${people}</small></span><strong>${quoteMoney(c.groupTotal)}</strong></li>`).join('')}</ul><p class="fineprint">Importes por curso después del descuento por participantes y antes del descuento por varios cursos.</p><dl><div><dt>Precio sin descuentos</dt><dd>${quoteMoney(result.original)}</dd></div><div><dt>Descuento por tamaño de grupo</dt><dd>−${quoteMoney(result.groupSaving)}</dd></div><div><dt>Subtotal por tamaño de grupo</dt><dd>${quoteMoney(result.subtotal)}</dd></div><div><dt>Descuento por ${result.lines.length} ${result.lines.length===1?'curso':'cursos'} (${Math.round(result.bundleRate*100)}%)</dt><dd>−${quoteMoney(result.bundleSaving)}</dd></div><div class="quote-total"><dt>${heading}</dt><dd>${quoteMoney(result.total)} MXN</dd></div><div><dt>${partial?'Importe parcial':'Promedio'} por persona</dt><dd>${quoteMoney(result.perPerson)} MXN</dd></div></dl>` : '<p>Los cursos seleccionados requieren una propuesta personalizada. No hay un total calculado.</p>')+pendingNote;
  const message = ['Hola JC Creativo, me interesa esta capacitación privada.',`Participantes: ${people}.`,'Cursos:',...selected.map(c=>'- '+c.name+' ('+c.hours+' h)'),`Duración total: ${result.hours} horas.`,...result.lines.map(c=>c.name+': '+quoteMoney(c.unitPrice)+' por persona × '+people+' = '+quoteMoney(c.groupTotal)+' MXN antes del descuento por varios cursos.'),...(result.lines.length ? [`Precio sin descuentos: ${quoteMoney(result.original)} MXN.`,`Ahorro por tamaño de grupo: ${quoteMoney(result.groupSaving)} MXN.`,`Descuento por varios cursos (${Math.round(result.bundleRate*100)}%): ${quoteMoney(result.bundleSaving)} MXN.`,`${heading}: ${quoteMoney(result.total)} MXN.`] : []),...(partial ? ['Pendientes de cotizar (no incluidos en el importe): '+result.pending.map(c=>c.name).join(', ')+'.'] : []),'Quisiera confirmar fecha, modalidad, sede y precio final.'].join('\n');
  quoteContact.href='https://wa.me/527531597808?text='+encodeURIComponent(message);
  quoteContact.hidden=false;
}
quoteForm.addEventListener('input',updateCourseQuote);
quoteForm.addEventListener('change',updateCourseQuote);
quoteForm.addEventListener('submit',event=>event.preventDefault());
quoteForm.addEventListener('reset',()=>setTimeout(updateCourseQuote,0));
updateCourseQuote();

const quoteRules=document.querySelector('.quote-rules');
const ruleDetails=document.createElement('details');ruleDetails.className='quote-discounts';ruleDetails.innerHTML='<summary>Ver tarifas y descuentos</summary>';quoteRules.before(ruleDetails);ruleDetails.append(quoteRules);const ruleNote=ruleDetails.nextElementSibling;if(ruleNote?.classList.contains('fineprint'))ruleDetails.append(ruleNote);
quoteForm.addEventListener('change',()=>{quoteForm.querySelectorAll('.quote-category').forEach(group=>{const count=group.querySelectorAll('input:checked').length;group.querySelector('summary span').textContent=count?count+' seleccionados':'Ver cursos';});});
quoteForm.addEventListener('reset',()=>{quoteForm.querySelectorAll('.quote-category').forEach(group=>{group.open=false;group.querySelector('summary span').textContent='Ver cursos';});});
