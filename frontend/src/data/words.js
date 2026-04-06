/**
 * words.js — IELTS vocabulary database
 *
 * Each word object:
 *   word      — the English word
 *   phonetic  — IPA pronunciation
 *   meaning   — Chinese meaning
 *   freq      — 'high' | 'medium' (IELTS exam frequency)
 *   band      — IELTS band range this word targets
 *   synonyms  — array of near-synonyms (for paraphrase training)
 *   example   — one IELTS-style example sentence
 *
 * Structure follows the data design in the project spec.
 */

export const BOOKS = [
  {
    id:        'core',
    name:      'IELTS Core 500',
    desc:      '雅思最高频词汇，覆盖写作 Task 1 & 2 核心表达',
    badge:     'CORE',
    level:     'Band 6–8',
  },
  {
    id:        'academic',
    name:      'Academic Plus',
    desc:      '学术写作高分词，提升 Lexical Resource 得分',
    badge:     'PRO',
    level:     'Band 7–9',
  },
]

export const WORDS = {
  core: [
    { word:'increase',      phonetic:'/ɪnˈkriːs/',         meaning:'增加；上升',       freq:'high',   band:'6-7', synonyms:['rise','surge','climb','escalate'],              example:'CO₂ emissions have increased dramatically over the past decade.' },
    { word:'significant',   phonetic:'/sɪɡˈnɪfɪkənt/',    meaning:'重大的；显著的',    freq:'high',   band:'6-7', synonyms:['substantial','considerable','notable','marked'],   example:'There has been a significant improvement in air quality since the new policy.' },
    { word:'decline',       phonetic:'/dɪˈklaɪn/',         meaning:'下降；减少',        freq:'high',   band:'6-7', synonyms:['decrease','drop','fall','diminish'],               example:'The birth rate has been in steady decline for the past two decades.' },
    { word:'diverse',       phonetic:'/daɪˈvɜːs/',         meaning:'多样的；各异的',    freq:'high',   band:'6-7', synonyms:['varied','assorted','multifaceted','heterogeneous'],example:'The workforce needs to become more diverse to reflect modern society.' },
    { word:'implement',     phonetic:'/ˈɪmplɪment/',       meaning:'实施；执行',        freq:'high',   band:'6-8', synonyms:['carry out','execute','apply','enforce'],           example:'The government plans to implement new environmental policies next year.' },
    { word:'sustain',       phonetic:'/səˈsteɪn/',         meaning:'维持；支撑',        freq:'high',   band:'6-8', synonyms:['maintain','preserve','uphold','support'],          example:'It is crucial to sustain economic growth while protecting natural resources.' },
    { word:'contribute',    phonetic:'/kənˈtrɪbjuːt/',    meaning:'贡献；促成',        freq:'high',   band:'6-7', synonyms:['add to','input','donate','play a part'],           example:'Education contributes significantly to social mobility and economic growth.' },
    { word:'achieve',       phonetic:'/əˈtʃiːv/',          meaning:'实现；达到',        freq:'high',   band:'5-7', synonyms:['attain','accomplish','reach','fulfil'],            example:'Many students struggle to achieve the required band score on their first attempt.' },
    { word:'challenge',     phonetic:'/ˈtʃælɪndʒ/',       meaning:'挑战；难题',        freq:'high',   band:'5-7', synonyms:['difficulty','obstacle','hurdle','test'],           example:'Climate change poses one of the greatest challenges facing modern societies.' },
    { word:'impact',        phonetic:'/ˈɪmpækt/',          meaning:'影响；冲击',        freq:'high',   band:'6-7', synonyms:['effect','influence','consequence','bearing'],      example:'Urbanisation has had a profound impact on biodiversity worldwide.' },
    { word:'emerge',        phonetic:'/ɪˈmɜːdʒ/',          meaning:'出现；显现',        freq:'high',   band:'6-8', synonyms:['arise','appear','surface','develop'],             example:'New technologies emerge at an increasingly rapid pace.' },
    { word:'policy',        phonetic:'/ˈpɒlɪsi/',          meaning:'政策；方针',        freq:'high',   band:'5-7', synonyms:['regulation','guideline','measure','legislation'], example:'Government policy on immigration has become a contentious political issue.' },
    { word:'adopt',         phonetic:'/əˈdɒpt/',           meaning:'采纳；采用',        freq:'high',   band:'6-7', synonyms:['embrace','take up','utilise','incorporate'],      example:'Many countries have adopted renewable energy targets to combat climate change.' },
    { word:'fundamental',   phonetic:'/ˌfʌndəˈmentl/',    meaning:'基本的；根本的',    freq:'high',   band:'6-8', synonyms:['essential','core','basic','primary'],             example:'Access to clean water is a fundamental human right.' },
    { word:'global',        phonetic:'/ˈɡləʊbl/',          meaning:'全球的',            freq:'high',   band:'5-6', synonyms:['worldwide','international','universal','planetary'],example:'Global cooperation is needed to address the climate crisis effectively.' },
    { word:'assess',        phonetic:'/əˈses/',             meaning:'评估；评价',        freq:'high',   band:'6-7', synonyms:['evaluate','measure','gauge','appraise'],          example:'It is difficult to assess the long-term effects of social media on mental health.' },
    { word:'consequence',   phonetic:'/ˈkɒnsɪkwəns/',     meaning:'后果；结果',        freq:'high',   band:'6-7', synonyms:['outcome','result','implication','effect'],        example:'The consequences of deforestation extend far beyond local ecosystems.' },
    { word:'generate',      phonetic:'/ˈdʒenəreɪt/',      meaning:'产生；引发',        freq:'high',   band:'6-7', synonyms:['produce','create','yield','give rise to'],        example:'Solar panels generate electricity without producing harmful emissions.' },
    { word:'benefit',       phonetic:'/ˈbenɪfɪt/',         meaning:'好处；受益',        freq:'high',   band:'5-6', synonyms:['advantage','gain','merit','value'],               example:'Regular exercise provides both physical and mental health benefits.' },
    { word:'trend',         phonetic:'/trend/',             meaning:'趋势；走向',        freq:'high',   band:'5-7', synonyms:['pattern','tendency','shift','direction'],         example:'There is a growing trend towards remote working in developed economies.' },
    { word:'evolve',        phonetic:'/ɪˈvɒlv/',           meaning:'演变；进化',        freq:'high',   band:'6-8', synonyms:['develop','transform','progress','adapt'],         example:'Language continually evolves to reflect changes in society and culture.' },
    { word:'advocate',      phonetic:'/ˈædvəkeɪt/',       meaning:'倡导；支持者',      freq:'high',   band:'6-8', synonyms:['promote','champion','support','endorse'],         example:'Many experts advocate for stricter regulations on fast food advertising.' },
    { word:'indicate',      phonetic:'/ˈɪndɪkeɪt/',       meaning:'表明；显示',        freq:'high',   band:'6-7', synonyms:['suggest','show','demonstrate','reveal'],          example:'Research indicates that sleep deprivation significantly affects cognitive performance.' },
    { word:'establish',     phonetic:'/ɪˈstæblɪʃ/',       meaning:'建立；确立',        freq:'high',   band:'6-7', synonyms:['create','found','set up','institute'],            example:'The report aims to establish a clear link between diet and chronic disease.' },
    { word:'enhance',       phonetic:'/ɪnˈhɑːns/',         meaning:'提升；增强',        freq:'high',   band:'6-8', synonyms:['improve','boost','elevate','strengthen'],         example:'Technology can enhance the learning experience if used appropriately.' },
    { word:'sector',        phonetic:'/ˈsektə/',            meaning:'行业；领域',        freq:'high',   band:'6-7', synonyms:['industry','field','area','domain'],               example:'The public sector needs greater investment to meet growing demand.' },
    { word:'restrict',      phonetic:'/rɪˈstrɪkt/',        meaning:'限制；约束',        freq:'high',   band:'6-7', synonyms:['limit','constrain','curb','regulate'],            example:'Some argue that governments should restrict access to harmful online content.' },
    { word:'propose',       phonetic:'/prəˈpəʊz/',         meaning:'提议；建议',        freq:'high',   band:'6-7', synonyms:['suggest','recommend','put forward','advocate'],   example:'Several economists have proposed a universal basic income as a solution.' },
    { word:'resource',      phonetic:'/rɪˈzɔːs/',          meaning:'资源',              freq:'high',   band:'5-7', synonyms:['asset','supply','reserve','capacity'],            example:'Managing finite natural resources is one of the defining challenges of our era.' },
    { word:'infrastructure',phonetic:'/ˈɪnfrəˌstrʌktʃə/',meaning:'基础设施',          freq:'high',   band:'6-8', synonyms:['framework','network','facilities','systems'],      example:'Poor infrastructure remains a major barrier to economic development in some regions.' },
    { word:'phenomenon',    phonetic:'/fɪˈnɒmɪnən/',      meaning:'现象',              freq:'high',   band:'6-8', synonyms:['occurrence','event','development','trend'],       example:'Social media addiction has become a widespread phenomenon among young people.' },
    { word:'integrate',     phonetic:'/ˈɪntɪɡreɪt/',      meaning:'整合；融合',        freq:'high',   band:'6-8', synonyms:['incorporate','combine','merge','unify'],          example:'Schools are encouraged to integrate digital literacy into the curriculum.' },
    { word:'initiative',    phonetic:'/ɪˈnɪʃətɪv/',       meaning:'主动性；倡议',      freq:'high',   band:'6-8', synonyms:['scheme','programme','drive','effort'],            example:'The government launched a new initiative to tackle youth unemployment.' },
    { word:'attribute',     phonetic:'/əˈtrɪbjuːt/',      meaning:'归因于；特征',      freq:'high',   band:'6-8', synonyms:['ascribe','assign','credit','associate'],          example:'Rising obesity can be attributed to poor dietary habits and sedentary lifestyles.' },
    { word:'regulate',      phonetic:'/ˈreɡjʊleɪt/',      meaning:'监管；调节',        freq:'high',   band:'6-7', synonyms:['control','govern','oversee','manage'],            example:'Without bodies to regulate the internet, misinformation spreads unchecked.' },
    { word:'perceive',      phonetic:'/pəˈsiːv/',          meaning:'感知；认为',        freq:'high',   band:'6-8', synonyms:['view','regard','consider','observe'],             example:'Cities are increasingly perceived as centres of innovation and opportunity.' },
    { word:'inequality',    phonetic:'/ˌɪnɪˈkwɒlɪti/',   meaning:'不平等；差距',      freq:'high',   band:'6-8', synonyms:['disparity','imbalance','gap','divide'],           example:'Income inequality has widened considerably over the last three decades.' },
    { word:'consumption',   phonetic:'/kənˈsʌmpʃən/',     meaning:'消费；消耗',        freq:'high',   band:'6-7', synonyms:['use','expenditure','intake','demand'],            example:'Reducing energy consumption is essential for meeting climate targets.' },
    { word:'urban',         phonetic:'/ˈɜːbən/',           meaning:'城市的；都市的',    freq:'high',   band:'5-7', synonyms:['city','metropolitan','municipal','civic'],        example:'Urban populations are expected to double by 2050 according to recent estimates.' },
    { word:'innovation',    phonetic:'/ˌɪnəˈveɪʃən/',    meaning:'创新；革新',        freq:'high',   band:'6-8', synonyms:['invention','breakthrough','advancement','novelty'],example:'Technological innovation is transforming industries at an unprecedented rate.' },
  ],

  academic: [
    { word:'proliferate',   phonetic:'/prəˈlɪfəreɪt/',   meaning:'激增；大量扩散',    freq:'medium', band:'7-9', synonyms:['multiply','spread','expand','burgeon'],           example:'Online learning platforms have proliferated since the pandemic.' },
    { word:'exacerbate',    phonetic:'/ɪɡˈzæsəbeɪt/',   meaning:'加剧；使恶化',      freq:'medium', band:'7-9', synonyms:['worsen','aggravate','intensify','compound'],      example:'Rising temperatures will exacerbate the already severe water shortage.' },
    { word:'mitigate',      phonetic:'/ˈmɪtɪɡeɪt/',     meaning:'减轻；缓解',        freq:'medium', band:'7-9', synonyms:['alleviate','lessen','reduce','minimise'],         example:'Planting urban trees can help mitigate the effects of the heat island effect.' },
    { word:'profound',      phonetic:'/prəˈfaʊnd/',      meaning:'深刻的；重大的',    freq:'medium', band:'7-9', synonyms:['deep','far-reaching','significant','substantial'], example:'The internet has had a profound effect on how we communicate and consume information.' },
    { word:'undermine',     phonetic:'/ˌʌndəˈmaɪn/',    meaning:'削弱；动摇',        freq:'medium', band:'7-9', synonyms:['weaken','erode','sabotage','compromise'],         example:'Corruption can undermine public trust in democratic institutions.' },
    { word:'paramount',     phonetic:'/ˈpærəmaʊnt/',    meaning:'至关重要的；首要的', freq:'medium', band:'7-9', synonyms:['crucial','vital','essential','foremost'],         example:'Ensuring the safety of citizens is paramount in any democratic society.' },
    { word:'contentious',   phonetic:'/kənˈtenʃəs/',    meaning:'有争议的',          freq:'medium', band:'7-9', synonyms:['controversial','disputed','debatable','divisive'], example:'Immigration remains one of the most contentious political issues of our time.' },
    { word:'inevitable',    phonetic:'/ɪnˈevɪtəbl/',    meaning:'不可避免的',        freq:'medium', band:'7-8', synonyms:['unavoidable','certain','inescapable','inexorable'],example:'Technological displacement of certain jobs appears inevitable in the near future.' },
    { word:'perpetuate',    phonetic:'/pəˈpetʃueɪt/',   meaning:'使永久；延续',      freq:'medium', band:'7-9', synonyms:['sustain','maintain','preserve','prolong'],         example:'Stereotypes in media can perpetuate harmful attitudes across generations.' },
    { word:'disparity',     phonetic:'/dɪˈspærɪti/',    meaning:'差距；悬殊',        freq:'medium', band:'7-9', synonyms:['inequality','gap','difference','imbalance'],       example:'The wealth disparity between developed and developing nations continues to grow.' },
    { word:'alleviate',     phonetic:'/əˈliːvieɪt/',    meaning:'减轻；缓和',        freq:'medium', band:'7-8', synonyms:['ease','relieve','lessen','mitigate'],              example:'Investment in mental health services can alleviate pressure on emergency care.' },
    { word:'facilitate',    phonetic:'/fəˈsɪlɪteɪt/',   meaning:'促进；便利化',      freq:'medium', band:'7-8', synonyms:['enable','assist','support','expedite'],           example:'Good infrastructure facilitates trade and drives economic growth.' },
    { word:'scrutinise',    phonetic:'/ˈskruːtɪnaɪz/', meaning:'仔细审查；检视',    freq:'medium', band:'7-9', synonyms:['examine','inspect','analyse','probe'],            example:'Journalists have a duty to scrutinise those in positions of power.' },
    { word:'empirical',     phonetic:'/ɪmˈpɪrɪkl/',     meaning:'基于实证的',        freq:'medium', band:'7-9', synonyms:['evidence-based','data-driven','observed','measurable'],example:'Policy decisions should be guided by empirical evidence rather than ideology.' },
    { word:'polarise',      phonetic:'/ˈpəʊlɪraɪz/',   meaning:'使两极分化',        freq:'medium', band:'7-9', synonyms:['divide','split','alienate','separate'],           example:'Social media algorithms tend to polarise public opinion on complex issues.' },
    { word:'pragmatic',     phonetic:'/præɡˈmætɪk/',    meaning:'务实的；实用主义的', freq:'medium', band:'7-9', synonyms:['practical','realistic','sensible','rational'],    example:'A pragmatic approach to climate policy balances ambition with economic realism.' },
    { word:'culminate',     phonetic:'/ˈkʌlmɪneɪt/',   meaning:'以…告终；达到顶点', freq:'medium', band:'7-9', synonyms:['end in','result in','conclude','climax'],         example:'Decades of research culminated in the development of the first mRNA vaccine.' },
    { word:'cohesive',      phonetic:'/kəʊˈhiːsɪv/',   meaning:'有凝聚力的',        freq:'medium', band:'7-9', synonyms:['unified','integrated','harmonious','solid'],      example:'A cohesive community is better equipped to respond to social challenges.' },
    { word:'deteriorate',   phonetic:'/dɪˈtɪərɪəreɪt/',meaning:'恶化；变质',        freq:'medium', band:'7-8', synonyms:['worsen','decline','degrade','crumble'],           example:'Without proper maintenance, urban infrastructure will rapidly deteriorate.' },
    { word:'ambiguous',     phonetic:'/æmˈbɪɡjuəs/',   meaning:'模棱两可的；含糊的', freq:'medium', band:'7-9', synonyms:['unclear','vague','equivocal','uncertain'],        example:'The wording of the new law was ambiguous and led to conflicting interpretations.' },
  ],
}
