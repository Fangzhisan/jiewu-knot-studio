import { createServer } from 'vite'
import { fileURLToPath } from 'node:url'
import assert from 'node:assert/strict'
const root = fileURLToPath(new URL('..', import.meta.url))
const server = await createServer({ root, configFile: false, appType:'custom', optimizeDeps:{noDiscovery:true,include:[]}, server:{middlewareMode:true,hmr:false,ws:false,watch:null} })
const failures=[]
const unique=items=>new Set(items).size===items.length
try {
  const {GUIDES}=await server.ssrLoadModule('/src/guides/catalog.ts')
  const {COURSES,CATEGORIES}=await server.ssrLoadModule('/src/lessons/catalog.ts')
  const {SCENARIOS}=await server.ssrLoadModule('/src/courseScenarios.ts')
  const {LIBRARY_ENTRIES,filterLibrary,EMPTY_FILTERS}=await server.ssrLoadModule('/src/library.ts')
  const ids=new Set([...GUIDES,...COURSES].map(item=>item.id))
  assert.equal(ids.size,GUIDES.length+COURSES.length,'IDs must be unique across all course types')
  assert.equal(GUIDES.length,69,'Expected 20 foundation guides + 49 projects')
  for (const category of CATEGORIES) {
    assert.equal(GUIDES.filter(g=>g.category===category.id&&g.kind==='project').length,category.id==='knots'?17:16)
    assert.equal(GUIDES.filter(g=>g.category===category.id&&g.kind==='foundation').length,category.id==='beads'?6:7)
  }
  for (const g of GUIDES) {
    const check=(ok,message)=>{if(!ok)failures.push(`${g.id}: ${message}`)}
    check(['foundation','project'].includes(g.kind),'unknown kind')
    check(CATEGORIES.some(c=>c.id===g.category),'unknown category')
    for(const field of ['title','subtitle','outcome','overview'])check(typeof g[field]==='string'&&g[field].trim().length>0,`missing ${field}`)
    check(Number.isFinite(g.minutes)&&g.minutes>0,'invalid minutes')
    check(g.materials.length>=1&&g.materials.every(m=>m.name&&m.amount&&m.note),'incomplete materials')
    check(g.preparation.length>=2&&g.preparation.every(Boolean),'preparation needs 2 checks')
    check(g.steps.length>=6&&g.steps.every(s=>s.title&&s.instruction&&s.check),'incomplete sequence')
    check(unique(g.steps.map(s=>s.title)),'duplicate step title')
    check(g.finishChecks.length>=3,'finishing needs 3 checks')
    check(g.troubleshooting.length>=2&&g.troubleshooting.every(t=>t.problem&&t.fix),'incomplete troubleshooting')
    check(g.scenarios.length&&unique(g.scenarios)&&g.scenarios.every(id=>SCENARIOS.some(s=>s.id===id)),'unknown or duplicate scenario')
    check(!g.scenarios.some(id=>['climbing','mountaineering','rescue'].includes(id))||!!g.boundary,'missing high-risk scope')
    check(unique(g.techniqueIds),'duplicate techniques')
    if(g.kind==='project')check(g.techniqueIds.length>=2,'project needs combined techniques')
    const links=[...g.techniqueIds,...(g.relatedGuideIds??[]),...g.steps.flatMap(s=>s.techniqueIds??[])]
    check(links.every(id=>ids.has(id)&&id!==g.id),'dangling/self course link: '+links.filter(id=>!ids.has(id)||id===g.id).join(','))
    check(g.sources.length>0&&g.sources.every(s=>s.title&&/^https:\/\//.test(s.url)),'missing primary references')
    check(g.diagram?.caption&&g.diagram?.kind,'missing diagram description')
    if(g.diagram?.pattern)check(g.diagram.pattern.length>0&&g.diagram.pattern.every(row=>row.length===g.diagram.pattern[0].length),'nonrectangular pattern')
    check(filterLibrary({...EMPTY_FILTERS,query:g.title}).some(e=>e.id===g.id),'title not searchable')
    if(g.kind==='foundation')check(GUIDES.some(p=>p.kind==='project'&&p.techniqueIds.includes(g.id)),'foundation has no project application')
  }
  assert.equal(LIBRARY_ENTRIES.length,112)
  for(const kind of ['interactive','foundation','project'])assert.equal(filterLibrary({...EMPTY_FILTERS,kind}).length,kind==='interactive'?43:kind==='foundation'?20:49)
  assert.equal(filterLibrary({...EMPTY_FILTERS,query:'不存在的课程xyz'}).length,0)
  assert.equal(new Set(GUIDES.map(g=>g.steps.map(s=>s.instruction).join('|'))).size,GUIDES.length,'duplicate content')
  if(failures.length)throw Error(failures.join('\n'))
  console.log(JSON.stringify({status:'passed',interactive:COURSES.length,foundations:20,projects:49,total:LIBRARY_ENTRIES.length,steps:GUIDES.reduce((n,g)=>n+g.steps.length,0),uniqueSourceUrls:new Set(GUIDES.flatMap(g=>g.sources.map(s=>s.url))).size,scope:'Structure, references, scene taxonomy, discovery; not physical craft verification.'},null,2))
} finally {await server.close()}
