'use client';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { EMPTY_RECRUITMENT, UNITS, RH_EMAIL, salaryLabel, parseSalary, type Person, type Recruitment } from '@/lib/disc';

export function RecruitmentFields({person,onChange}:{person:Person;onChange:(person:Person)=>void}){
 const r=person.recruitment||EMPTY_RECRUITMENT;
 const update=(key:keyof Recruitment,value:string|boolean)=>onChange({...person,recruitment:{...r,[key]:value}});
 return <div className="recruitment-fields">
  <fieldset><legend>Sobre você</legend>
   <div className="field"><label htmlFor="candidate-name">Nome completo *</label><input id="candidate-name" autoComplete="name" required minLength={3} maxLength={120} value={person.name} onChange={e=>onChange({...person,name:e.target.value})} placeholder="Seu nome completo"/></div>
   <div className="field"><label htmlFor="candidate-email">E-mail *</label><input id="candidate-email" type="email" autoComplete="email" required maxLength={180} value={person.email} onChange={e=>onChange({...person,email:e.target.value})} placeholder="seuemail@exemplo.com"/></div>
   <div className="form-two"><div className="field"><label htmlFor="candidate-phone">Telefone / WhatsApp *</label><input id="candidate-phone" type="tel" autoComplete="tel" required maxLength={24} value={r.phone} onChange={e=>update('phone',e.target.value)} placeholder="(47) 99999-9999"/></div><div className="field"><label htmlFor="candidate-birth">Data de nascimento <span>(opcional)</span></label><input id="candidate-birth" type="date" autoComplete="bday" min="1900-01-01" value={r.birthDate} onChange={e=>update('birthDate',e.target.value)}/></div></div>
   <div className="field"><label htmlFor="candidate-city">Cidade e estado *</label><input id="candidate-city" autoComplete="address-level2" required minLength={3} maxLength={100} value={r.city} onChange={e=>update('city',e.target.value)} placeholder="Ex.: Navegantes / SC"/></div>
  </fieldset>
  <fieldset><legend>Sua candidatura</legend>
   <div className="field"><label htmlFor="candidate-role">Vaga ou área de interesse *</label><input id="candidate-role" required minLength={2} maxLength={100} value={person.role} onChange={e=>onChange({...person,role:e.target.value})} placeholder="Ex.: Assistente administrativo"/></div>
   <div className="field"><label htmlFor="candidate-unit">Unidade de interesse *</label><Select value={person.unit} onValueChange={unit=>onChange({...person,unit})}><SelectTrigger id="candidate-unit" className="max-select" aria-required="true"><SelectValue placeholder="Selecione a unidade"/></SelectTrigger><SelectContent>{UNITS.map(u=><SelectItem key={u} value={u}>{u==='Não se aplica'?'Sem preferência':u}</SelectItem>)}</SelectContent></Select></div>
   <div className="field"><label htmlFor="candidate-salary">Pretensão salarial mensal (R$) *</label><input id="candidate-salary" type="text" inputMode="decimal" required={!r.salaryNegotiable} disabled={r.salaryNegotiable} maxLength={24} value={r.expectedSalary} onChange={e=>update('expectedSalary',e.target.value)} onBlur={()=>{const cents=parseSalary(r.expectedSalary);if(cents!==null)update('expectedSalary',(cents/100).toLocaleString('pt-BR',{minimumFractionDigits:2,maximumFractionDigits:2}));}} placeholder="Ex.: 3.500,00" aria-describedby="salary-help"/><p id="salary-help" className="field-help">Informe o valor mensal desejado ou selecione abaixo.</p></div>
   <div className="consent salary-choice"><Checkbox id="salary-negotiable" checked={r.salaryNegotiable} onCheckedChange={v=>onChange({...person,recruitment:{...r,salaryNegotiable:v===true,expectedSalary:v===true?'':r.expectedSalary}})}/><label htmlFor="salary-negotiable">A combinar</label></div>
  </fieldset>
 </div>;
}

export function RecruitmentSummary({person}:{person:Person}){
 const r=person.recruitment;
 if(!r)return null;
 const fields=[['Nome',person.name],['E-mail',person.email],['Telefone / WhatsApp',r.phone],['Cidade / estado',r.city],['Data de nascimento',r.birthDate?r.birthDate.split('-').reverse().join('/'):'Não informada'],['Vaga / área',person.role],['Unidade de interesse',person.unit==='Não se aplica'?'Sem preferência':person.unit],['Pretensão salarial',salaryLabel(r)]];
 return <dl className="candidate-summary">{fields.map(([label,value])=><div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}</dl>;
}

export function RecruitmentPrivacy(){return <details className="fine-details"><summary>Aviso de privacidade da candidatura</summary><p>Ao concluir o formulário e o DISC, a Max Imóveis recebe seu nome, e-mail, telefone, cidade e estado, vaga e unidade de interesse, pretensão salarial, data de nascimento (se informada), respostas e resultado. Esses dados apoiam o contato e as conversas do processo seletivo e são enviados ao RH em <a href={'mailto:'+RH_EMAIL}>{RH_EMAIL}</a>, com a data da sua ciência.</p><p>Os dados ficam armazenados com acesso restrito. O preenchimento é voluntário. Para solicitar acesso, correção ou exclusão, contate o RH nesse endereço. Durante o preenchimento, um rascunho permanece nesta aba; ele é removido ao concluir ou fechar a aba.</p><p>O DISC é um questionário descritivo, sem validação psicométrica. Não é avaliação psicológica ou diagnóstico e não define aprovação, classificação ou adequação à vaga.</p></details>;}
