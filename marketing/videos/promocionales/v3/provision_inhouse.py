"""Load reviewed CG assets as new disabled draft campaigns, using the admin API.
Run on bellum. Credentials stay on the server and are never logged.
"""
import json,os,sys,hashlib,urllib.request
from pathlib import Path
BASE=os.environ.get('INHOUSE_API_BASE_URL','http://127.0.0.1:3014')
ORIGIN='https://inhouseads.pablobrasero.com'
ASSETS=Path(os.environ.get('CG_CAMPAIGN_ASSET_DIR','/opt/in-house-ads/data/cg-campaigns-v3'))
env=dict(line.strip().split('=',1) for line in Path('/opt/in-house-ads/.env').read_text().splitlines() if '=' in line and not line.startswith('#'))
cookie='';csrf=''
def request(path,data=None,method=None,raw=None,content_type='application/json'):
 global cookie
 req=urllib.request.Request(BASE+path,data=raw if raw is not None else json.dumps(data).encode() if data is not None else None,method=method,headers={'Content-Type':content_type,'Origin':ORIGIN,'Cookie':cookie,'x-csrf-token':csrf})
 with urllib.request.urlopen(req,timeout=120) as res:
  cookie=res.headers.get('Set-Cookie','').split(';',1)[0] or cookie
  return json.load(res)
def items(kind):return request('/api/admin/'+kind)['items']
def create(kind,data):return request('/api/admin/'+kind,data)['item']
def upload(filename,mime,expected):
 raw=(ASSETS/filename).read_bytes()
 if hashlib.sha256(raw).hexdigest()!=expected:raise RuntimeError('Asset checksum mismatch: '+filename)
 signed=request('/api/admin/uploads',{'filename':Path(filename).name,'contentType':mime,'sizeBytes':len(raw)})
 path=signed['uploadUrl'].removeprefix(ORIGIN)
 return request(path,method='PUT',raw=raw,content_type=mime)
csrf=request('/api/auth/login',{'email':env['ADMIN_EMAIL'],'password':env['ADMIN_PASSWORD']})['csrfToken']
try:
 apps=items('apps'); cg=next(x for x in apps if x['slug']=='cultura-general');app_by_id={x['id']:x for x in apps}
 receiving=[x for x in items('placements') if x['enabled'] and x['appId']!=cg['id'] and app_by_id[x['appId']]['enabled'] and 'ios' in app_by_id[x['appId']]['platforms'] and x['format'] in ['interstitial','rewarded']]
 dest=next(x for x in items('destinations') if x['url']==cg['storeUrl'] and x['approved'])
 campaigns=items('campaigns');creatives=items('creatives'); advertisers=items('advertisers')
 if '--inspect' in sys.argv:
  print(json.dumps({'app':cg['name'],'promotedAppId':cg['id'],'destination':dest,'receivingApps':sorted(set(app_by_id[x['appId']]['name'] for x in receiving)),'placements':len(receiving),'existingCGCampaigns':[{'name':x['name'],'status':x['status'],'id':x['id']} for x in campaigns if 'Cultura' in x['name'] or 'CG ' in x['name']]},ensure_ascii=False));sys.exit(0)
 catalog=json.loads((ASSETS/'catalog.json').read_text())
 advertiser=next(x for x in advertisers if x['name']=='Pablo Brasero — promociones propias')
 by_name={x['name']:x for x in creatives};campaign_names={x['name']:x for x in campaigns};result=[]
 for item in catalog['videos']:
  names={fmt:f"CG V3 — {item['title']} — {fmt} — ES" for fmt in ['interstitial','rewarded']}
  cached=next((by_name[n] for n in names.values() if n in by_name),None)
  if cached:
   media={k:cached[k] for k in ['mediaUrl','posterUrl','width','height','durationSeconds','sizeBytes']}
  else:
   v=upload(item['filename'],'video/mp4',item['sha256']);p=upload(item['posterFilename'],'image/jpeg',item['posterSha256'])
   media={'mediaUrl':v['mediaUrl'],'posterUrl':p['mediaUrl'],'width':v['width'],'height':v['height'],'durationSeconds':v['durationSeconds'],'sizeBytes':v['sizeBytes']}
  ids=[]
  for fmt,name in names.items():
   creative=by_name.get(name)
   if not creative:
    creative=create('creatives',{'name':name,'format':fmt,'mediaType':'video',**media,'altText':item['altText'],'locale':'es','platform':'ios','destinationId':dest['id'],'promotedAppId':cg['id']})
   ids.append(creative['id'])
  name=f"CG V3 — {item['title']} — captación ES"
  campaign=campaign_names.get(name)
  if not campaign:
   campaign=create('campaigns',{'name':name,'advertiserId':advertiser['id'],'appIds':sorted(set(x['appId'] for x in receiving)),'placementIds':[x['id'] for x in receiving],'creativeIds':ids,'status':'draft','priority':100,'weight':0.15,'enabled':False,'notes':item['notes']+' | Grabación real del simulador iOS, 20/09/2026. ES, 1080×1920. Música original generada para esta campaña. Destino: App Store. Exclusión de autopromoción por promotedAppId. Cargada como borrador para revisión editorial; no modifica la entrega activa. SHA256: '+item['sha256']})
  result.append({'id':campaign['id'],'name':campaign['name'],'status':campaign['status'],'enabled':campaign['enabled'],'creativeIds':ids,**media})
 saved=items('campaigns');cs=items('creatives');cmap={x['id']:x for x in cs}
 for entry in result:
  actual=next(x for x in saved if x['id']==entry['id'])
  if actual['status']!='draft' or actual['enabled']:raise RuntimeError('Unexpected campaign delivery state')
  if cg['id'] in actual['appIds']:raise RuntimeError('Self-promotion in receiving apps')
  for cid in actual['creativeIds']:
   c=cmap[cid]
   assert c['promotedAppId']==cg['id'] and c['destinationId']==dest['id'] and c['posterUrl'] and c['durationSeconds']<=30
 report={'destination':dest['url'],'receivingApps':sorted(set(app_by_id[x['appId']]['name'] for x in receiving)),'campaigns':result}
 (ASSETS/'published-drafts.json').write_text(json.dumps(report,ensure_ascii=False,indent=2));print(json.dumps(report,ensure_ascii=False))
finally:
 request('/api/auth/logout',{})
