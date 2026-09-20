"""Publish the six user-approved CG V3 campaigns and verify self-exclusion."""
from pathlib import Path
import json,sys,uuid,datetime
exec(Path('/opt/in-house-ads/data/cg-campaigns-v3/provision_inhouse.py').read_text().split("\ncsrf=request('/api/auth/login'")[0])
csrf=request('/api/auth/login',{'email':env['ADMIN_EMAIL'],'password':env['ADMIN_PASSWORD']})['csrfToken']
try:
 report=json.loads((ASSETS/'published-drafts.json').read_text());ids={c['id'] for c in report['campaigns']}
 apps=items('apps');cg=next(x for x in apps if x['slug']=='cultura-general');appmap={x['id']:x for x in apps}
 placements=items('placements');pmap={x['id']:x for x in placements};cs={x['id']:x for x in items('creatives')};ds={x['id']:x for x in items('destinations')}
 campaigns=[c for c in items('campaigns') if c['id'] in ids];assert len(campaigns)==6
 settings=request('/api/admin/settings')
 for c in campaigns:
  assert c['appIds'] and cg['id'] not in c['appIds']
  assert c['placementIds'] and all(pmap[p]['appId']!=cg['id'] and pmap[p]['appId'] in c['appIds'] for p in c['placementIds'])
  assert all(appmap[a]['enabled'] for a in c['appIds'])
  assert all(pmap[p]['enabled'] for p in c['placementIds'])
  for cid in c['creativeIds']:
   cr=cs[cid];assert cr['promotedAppId']==cg['id'] and ds[cr['destinationId']]['approved'] and ds[cr['destinationId']]['url']==cg['storeUrl']
 print(json.dumps({'globalEnabled':settings['globalEnabled'],'apps':[{'name':a['name'],'enabled':a['enabled']} for a in apps],'campaigns':[{'name':c['name'],'status':c['status'],'enabled':c['enabled']} for c in campaigns],'selfExclusion':'validated'},ensure_ascii=False),flush=True)
 if '--inspect' in sys.argv:sys.exit(0)
 assert settings['globalEnabled'],'Global delivery is disabled; review scope before enabling unrelated inventory.'
 for c in campaigns:
  if c['status']!='active' or not c['enabled']:
   note=c.get('notes','').replace('Cargada como borrador para revisión editorial; no modifica la entrega activa.','Activación autorizada por el usuario; Cultura General excluida de receptores y por promotedAppId.')
   c=request('/api/admin/campaigns/'+c['id'],{'enabled':True,'notes':note},method='PATCH')['item']
   for status,action in [('draft','submit'),('pending_review','approve'),('approved','publish')]:
    if c['status']==status:c=request('/api/admin/campaigns/'+c['id']+'/'+action,{})['item']
  assert c['status']=='active' and c['enabled'];print('ACTIVE '+c['name'],flush=True)
 actual=[c for c in items('campaigns') if c['id'] in ids]
 assert len(actual)==6 and all(c['enabled'] and c['status']=='active' for c in actual)
 checks=[]
 for p in placements:
  if not p['enabled']:continue
  receiving=any(p['id'] in c['placementIds'] for c in actual)
  if p['appId']!=cg['id'] and not receiving:continue
  ctx={'appId':p['appId'],'placementId':p['id'],'sessionId':str(uuid.uuid4()),'ageBracket':'adult','isPremium':False,'platform':'ios','locale':'es','appVersion':'cg-v3-publication-check','testMode':True}
  manifest=request('/api/v1/manifest',ctx);ads=[a for a in manifest['ads'] if a['campaignId'] in ids]
  if p['appId']==cg['id']:
   assert not ads,'CG self-promotion detected'
   assert all(cs.get(a['creativeId'],{}).get('promotedAppId')!=cg['id'] for a in manifest['ads'])
  else:assert {a['campaignId'] for a in ads}==ids,(p['key'],len(ads))
  checks.append({'app':appmap[p['appId']]['name'],'placement':p['key'],'format':p['format'],'cgCampaignsAvailable':len(ads)})
 result={'activatedAt':datetime.datetime.now(datetime.timezone.utc).isoformat(),'globalEnabled':settings['globalEnabled'],'receivingApps':sorted({appmap[a]['name'] for c in actual for a in c['appIds']}),'excludedApp':cg['name'],'promotedAppId':cg['id'],'campaigns':actual,'manifestChecks':checks}
 (ASSETS/'activation-report.json').write_text(json.dumps(result,ensure_ascii=False,indent=2))
 print(json.dumps({'activeCampaigns':len(actual),'receivingApps':result['receivingApps'],'checkedPlacements':len(checks),'selfExclusion':'passed'},ensure_ascii=False))
finally:request('/api/auth/logout',{})
