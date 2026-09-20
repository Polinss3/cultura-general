"""Probe, decode and produce a scene-by-scene visual review of every export."""
from pathlib import Path
import json,subprocess,hashlib
from concurrent.futures import ThreadPoolExecutor
from PIL import Image,ImageDraw,ImageFont
ROOT=Path(__file__).resolve().parent
plans=json.loads((ROOT/'plans.json').read_text())
def probe(p):return json.loads(subprocess.check_output(['ffprobe','-v','error','-show_streams','-show_format','-of','json',str(p)]))
def check(p):
 info=probe(p);v=next(x for x in info['streams'] if x['codec_type']=='video');a=next(x for x in info['streams'] if x['codec_type']=='audio')
 assert (v['width'],v['height'],v['codec_name'],v['pix_fmt'])==(1080,1920,'h264','yuv420p'),p
 assert v['avg_frame_rate']=='30/1',p
 assert a['codec_name']=='aac' and a['channels']==2 and a['sample_rate']=='48000',p
 expected=6+sum(s[2] for s in next(x for x in plans if x['key']==p.stem)['scenes'])
 assert abs(float(info['format']['duration'])-expected)<.15,(p,info['format']['duration'],expected)
 if p.parent.name=='inhouse':assert float(info['format']['duration'])<=30 and p.stat().st_size<52428800
 r=subprocess.run(['ffmpeg','-v','error','-i',str(p),'-f','null','-'],capture_output=True)
 assert r.returncode==0 and not r.stderr,(p,r.stderr.decode())
 return {'file':str(p.relative_to(ROOT)),'duration':float(info['format']['duration']),'sizeBytes':p.stat().st_size,'sha256':hashlib.sha256(p.read_bytes()).hexdigest(),'decode':'ok','video':'H.264 / 1080x1920 / 30 fps / yuv420p','audio':'AAC / 48 kHz / stereo'}
files=[*sorted((ROOT/'social').glob('*.mp4')),*sorted((ROOT/'inhouse').glob('*.mp4'))]
with ThreadPoolExecutor(max_workers=3) as pool:checks=list(pool.map(check,files))
for p in plans:
 stamps=[(1,'GANCHO')];t=2.5
 for s in p['scenes']:stamps.append((t+min(1.5,s[2]/2),s[4]));t+=s[2]
 stamps.append((t+1.5,'DESCARGA'))
 cols=min(4,len(stamps));rows=(len(stamps)+cols-1)//cols
 sheet=Image.new('RGB',(cols*300,rows*574),'#100F15');draw=ImageDraw.Draw(sheet)
 for i,(sec,label) in enumerate(stamps):
  frame=ROOT/'qa'/f"{p['key']}_{i:02}.jpg"
  subprocess.run(['ffmpeg','-y','-v','error','-ss',str(sec),'-i',str(ROOT/'social'/f"{p['key']}.mp4"),'-frames:v','1',str(frame)],check=True)
  im=Image.open(frame);im.thumbnail((294,523));x=i%cols*300;y=i//cols*574
  sheet.paste(im,(x,y+34));draw.text((x+5,y+6),f'{sec:.1f}s / {label[:32]}',fill='white')
 sheet.save(ROOT/'qa'/f"{p['key']}_contact.jpg",quality=94)
(ROOT/'qa'/'verification.json').write_text(json.dumps(checks,ensure_ascii=False,indent=2))
print(json.dumps({'exports':len(checks),'fullDecode':'passed','specifications':'passed','contactSheets':len(plans)},ensure_ascii=False))
