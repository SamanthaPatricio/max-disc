export const VERSION = 'max-disc-1.0';
export const LEGACY_PRIVACY_VERSION = 'max-disc-2026-10-06';
export const PRIVACY_VERSION = 'max-disc-2026-10-06-recrutamento';
export const RH_EMAIL = 'rhimoveis4@gmail.com';
export const DIMS = ['D', 'I', 'S', 'C'] as const;
export type Dimension = typeof DIMS[number];
export type Answer = Dimension | '';
export type Recruitment = { phone: string; birthDate: string; city: string; expectedSalary: string; salaryNegotiable: boolean };
export const EMPTY_RECRUITMENT: Recruitment = {phone:'',birthDate:'',city:'',expectedSalary:'',salaryNegotiable:false};
export const RECRUITMENT_GOAL = 'Processo seletivo';
export type Person = { recruitment?: Recruitment; name: string; email: string; unit: string; role: string; goal:string; consent: boolean };
export const UNITS = ['Itajaí', 'Navegantes', 'Balneário Camboriú', 'Não se aplica'];
export const GOALS = ['Desenvolvimento na Max', 'Processo seletivo', 'Autoconhecimento', 'Integração à equipe'];
export const PROFILES = {
 D: { name:'Dominância', alias:'Executor', short:'Direção e iniciativa', color:'#cc5846', summary:'Você tende a agir com objetividade, assumir desafios e direcionar a energia para resultados.', strength:'Tomar iniciativa, estabelecer prioridades e movimentar decisões.', growth:'Abrir espaço para diferentes ritmos e ouvir os impactos de uma decisão antes de agir.', communication:'Conversas diretas, objetivos claros e autonomia com limites combinados.', motivation:'Desafios claros, espaço para decidir e percepção de avanço.', action:'Na próxima decisão em equipe, peça duas perspectivas antes de definir o caminho.' },
 I: { name:'Influência', alias:'Comunicador', short:'Conexão e entusiasmo', color:'#b27b00', summary:'Você tende a se expressar com entusiasmo, construir conexões e mobilizar pessoas em torno de ideias.', strength:'Criar proximidade, compartilhar ideias e envolver a equipe.', growth:'Transformar o entusiasmo em combinados específicos e acompanhar a conclusão das tarefas.', communication:'Troca de ideias, reconhecimento e espaço para participar.', motivation:'Interação, oportunidades de expressão e reconhecimento das contribuições.', action:'Ao encerrar uma conversa, registre quem fará o quê e até quando.' },
 S: { name:'Estabilidade', alias:'Planejador', short:'Escuta e constância', color:'#268276', summary:'Você tende a valorizar a cooperação, a escuta e a continuidade, oferecendo apoio consistente às pessoas.', strength:'Acompanhar processos com constância, escutar e sustentar a colaboração.', growth:'Expressar necessidades e discordâncias, especialmente quando uma mudança for necessária.', communication:'Tempo para conversar, previsibilidade e explicações sobre as mudanças.', motivation:'Relações de confiança, colaboração e mudanças com uma transição compreensível.', action:'Escolha uma situação da semana para apresentar sua opinião com clareza, mesmo que ela seja diferente.' },
 C: { name:'Conformidade', alias:'Analista', short:'Análise e precisão', color:'#486cac', summary:'Você tende a buscar informações, critérios e organização para entregar um trabalho cuidadoso.', strength:'Analisar detalhes, organizar informações e observar a qualidade das entregas.', growth:'Ajustar a profundidade da análise ao prazo e diferenciar o essencial do aperfeiçoamento.', communication:'Informações consistentes, critérios definidos e tempo para analisar.', motivation:'Clareza sobre o que se espera, qualidade e oportunidades de aprofundamento.', action:'Antes da próxima entrega, combine os critérios de qualidade e um limite de tempo para a revisão.' }
} as const;
// Original item bank. One option per dimension, rotated to balance position.
// This descriptive instrument is not a licensed or validated DISC assessment.
const DATA: [string,string,string,string][] = [
 ['Tomo a iniciativa','Crio conexões','Ofereço apoio','Examino os detalhes'],
 ['Enfrento desafios','Compartilho entusiasmo','Escuto com calma','Busco evidências'],
 ['Decido com agilidade','Gosto de me expressar','Mantenho a constância','Sigo critérios claros'],
 ['Assumo a frente','Aproximo as pessoas','Cultivo a cooperação','Verifico as informações'],
 ['Foco na conquista','Envolvo a equipe','Dou continuidade','Organizo por etapas'],
 ['Sou determinado','Sou expansivo','Sou acolhedor','Sou criterioso'],
 ['Prefiro autonomia','Prefiro interação','Prefiro previsibilidade','Prefiro precisão'],
 ['Busco superar metas','Busco compartilhar ideias','Busco construir confiança','Busco compreender a fundo'],
 ['Direciono a ação','Animo o grupo','Acompanho com paciência','Reviso com atenção'],
 ['Avanço com firmeza','Converso com facilidade','Apoio com regularidade','Planejo com cuidado'],
 ['Gosto de liderar desafios','Gosto de apresentar ideias','Gosto de colaborar nos bastidores','Gosto de analisar alternativas'],
 ['Resolvo com objetividade','Engajo pela conversa','Contribuo com tranquilidade','Contribuo com organização'],
 ['Tenho iniciativa própria','Tenho facilidade para me aproximar','Tenho disposição para ouvir','Tenho atenção aos pormenores'],
 ['Quero ver progresso','Quero trocar experiências','Quero um ritmo sustentável','Quero critérios bem definidos'],
 ['Mobilizo para agir','Mobilizo pelo entusiasmo','Mobilizo pela parceria','Mobilizo pelo planejamento'],
 ['Encaro decisões difíceis','Crio um ambiente participativo','Dou suporte na adaptação','Identifico inconsistências'],
 ['Proponho uma direção','Proponho ideias em voz alta','Proponho acordos em conjunto','Proponho um método'],
 ['Aceito correr riscos calculados','Me sinto à vontade em grupos','Valorizo a estabilidade da rotina','Valorizo a clareza das regras'],
 ['Priorizo o resultado final','Priorizo o envolvimento das pessoas','Priorizo a continuidade do trabalho','Priorizo a qualidade dos detalhes'],
 ['Me posiciono prontamente','Me expresso de forma envolvente','Me dedico a compreender o outro','Me apoio em informações verificáveis'],
 ['Sou orientado à ação','Sou aberto a novas conversas','Sou constante no acompanhamento','Sou atento aos procedimentos'],
 ['Gosto de definir prioridades','Gosto de criar oportunidades de encontro','Gosto de fortalecer vínculos','Gosto de organizar informações'],
 ['Acelero decisões','Estimulo a participação','Sustento a colaboração','Aprofundo a análise'],
 ['Assumo responsabilidade pela direção','Aproximo perspectivas pela conversa','Ofereço presença e escuta','Estruturo argumentos com fatos'],
 ['Lido bem com competição','Lido bem com exposição de ideias','Lido bem com atividades contínuas','Lido bem com exigências de precisão'],
 ['Parto para a solução','Penso conversando','Penso com serenidade','Penso comparando evidências'],
 ['Prefiro desafios novos','Prefiro ambientes de troca','Prefiro relações duradouras','Prefiro expectativas detalhadas'],
 ['Tenho postura assertiva','Tenho postura entusiasmada','Tenho postura colaborativa','Tenho postura investigativa'],
 ['Questiono obstáculos para avançar','Busco adesão para uma ideia','Busco entendimento entre as pessoas','Questiono detalhes para compreender'],
 ['Me realizo ao superar dificuldades','Me realizo ao inspirar participação','Me realizo ao apoiar o grupo','Me realizo ao aperfeiçoar uma entrega'],
 ['Sou firme nos objetivos','Sou espontâneo nas conversas','Sou paciente no acompanhamento','Sou meticuloso nas verificações'],
 ['Transformo planos em movimento','Transformo contatos em conexões','Transformo escuta em apoio','Transformo dados em critérios'],
 ['Sigo com determinação','Sigo com energia social','Sigo com perseverança tranquila','Sigo com disciplina de método'],
 ['Me concentro no impacto','Me concentro na interação','Me concentro na harmonia do grupo','Me concentro na consistência'],
 ['Incentivo decisões práticas','Incentivo a expressão das ideias','Incentivo o apoio mútuo','Incentivo a checagem dos fatos'],
 ['Sou rápido para iniciar','Sou receptivo a novas pessoas','Sou cuidadoso com os vínculos','Sou cuidadoso com a exatidão'],
 ['Valorizo a liberdade de decidir','Valorizo a liberdade de comunicar','Valorizo a confiança construída','Valorizo o trabalho fundamentado'],
 ['Defino o próximo movimento','Celebro conquistas com os outros','Mantenho os combinados com constância','Registro os aprendizados com detalhe'],
 ['Me desafio a ir além','Me energizo com a troca','Me comprometo com o apoio','Me dedico ao aperfeiçoamento'],
 ['Contribuo trazendo direção','Contribuo trazendo conexão','Contribuo trazendo equilíbrio','Contribuo trazendo precisão']
];
export const QUESTIONS = DATA.map((r,i)=>({id:i+1,options:DIMS.map((_,j)=>{const d=DIMS[(j+i)%4];return {dimension:d,text:r[DIMS.indexOf(d)]};})}));
export function validateAnswers(value: unknown): value is Dimension[] {return Array.isArray(value)&&value.length===40&&value.every(a=>DIMS.includes(a));}
export function score(answers: Answer[]) {
 if(!validateAnswers(answers)) throw new Error('Responda às 40 perguntas antes de concluir.');
 const raw={D:0,I:0,S:0,C:0};for(const a of answers)raw[a]++;
 const sorted=[...DIMS].sort((a,b)=>raw[b]-raw[a]);
 const leaders=sorted.filter(d=>raw[d]===raw[sorted[0]]);
 const balanced=raw[sorted[0]]-raw[sorted[3]]<=2;
 const percentages=Object.fromEntries(DIMS.map(d=>[d,raw[d]*2.5])) as Record<Dimension,number>;
 const title=balanced?'Tendências próximas':leaders.map(d=>PROFILES[d].name).join(' + ');
 return {raw,percentages,leaders,sorted,balanced,title,version:VERSION};
}
export type Result=ReturnType<typeof score>;
export function parseSalary(value: string): number | null {
 const s=value.trim().replace(/^R\$\s*/, '');
 const valid=/^\d{1,6}(?:[.,]\d{1,2})?$/.test(s)||/^\d{1,3}(?:\.\d{3})+(?:,\d{1,2})?$/.test(s);
 if(!valid)return null;
 const normalized=s.includes(',')?s.replace(/\./g,'').replace(',','.'): /^\d{1,3}(?:\.\d{3})+$/.test(s)?s.replace(/\./g,''):s;
 const amount=Math.round(Number(normalized)*100);
 return Number.isSafeInteger(amount)&&amount>0&&amount<=100000000?amount:null;
}
export function salaryLabel(r: Recruitment): string {
 if(r.salaryNegotiable)return 'A combinar';
 const cents=parseSalary(r.expectedSalary);
 return cents===null?'Não informada':new Intl.NumberFormat('pt-BR',{style:'currency',currency:'BRL'}).format(cents/100)+' / mês';
}
export function recruitmentError(r: unknown): string | null {
 if(!r||typeof r!=='object')return 'Preencha os dados da candidatura antes do questionário.';
 const v=r as Recruitment;
 if(typeof v.phone!=='string'||v.phone.length>24||!/^[+()\d\s.-]+$/.test(v.phone)||!/^\d{10,15}$/.test(v.phone.replace(/\D/g,'')))return 'Informe um telefone válido com DDD.';
 if(typeof v.city!=='string'||v.city.trim().length<3||v.city.length>100)return 'Informe sua cidade e estado.';
 if(typeof v.birthDate!=='string')return 'Confira a data de nascimento.';
 if(v.birthDate){
  const d=new Date(v.birthDate+'T00:00:00Z');
  const today=new Intl.DateTimeFormat('en-CA',{timeZone:'America/Sao_Paulo',year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date());
  if(!/^\d{4}-\d{2}-\d{2}$/.test(v.birthDate)||Number.isNaN(d.getTime())||d.toISOString().slice(0,10)!==v.birthDate||v.birthDate<'1900-01-01'||v.birthDate>today)return 'Informe uma data de nascimento válida, sem data futura.';
 }
 if(typeof v.salaryNegotiable!=='boolean'||typeof v.expectedSalary!=='string'||v.expectedSalary.length>24||(!v.salaryNegotiable&&parseSalary(v.expectedSalary)===null))return 'Informe a pretensão salarial mensal ou marque “A combinar”.';
 return null;
}
export function normalizeRecruitment(r: Recruitment): Recruitment {
 return {phone:r.phone.trim(),birthDate:r.birthDate,city:r.city.trim(),expectedSalary:r.salaryNegotiable?'':(parseSalary(r.expectedSalary)!/100).toFixed(2).replace('.',','),salaryNegotiable:r.salaryNegotiable};
}
export function validatePerson(p:unknown, allowLegacyRecruitment=false): p is Person {
 if(!p||typeof p!=='object')return false;const v=p as Person;
 if(v.goal===RECRUITMENT_GOAL&&!(allowLegacyRecruitment&&v.recruitment===undefined)&&recruitmentError(v.recruitment))return false;
 return typeof v.name==='string'&&v.name.trim().length>=3&&v.name.length<=120&&typeof v.email==='string'&&v.email.length<=180&&/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.email)&&UNITS.includes(v.unit)&&GOALS.includes(v.goal)&&typeof v.role==='string'&&v.role.trim().length>=2&&v.role.length<=100&&v.consent===true;
}
