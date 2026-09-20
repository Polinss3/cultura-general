"""Reproducible CG campaign renderer. Python/Pillow/numpy + FFmpeg; no stock music."""
from pathlib import Path
import json, subprocess, math, wave, sys
import numpy as np
from PIL import Image, ImageDraw, ImageFont, ImageFilter
ROOT=Path(__file__).resolve().parent
REPO=ROOT.parents[3]
W,H=1080,1920
GOLD='#FFBF54'; WHITE='#FFF9ED'; MUTED='#BAB4C2'; BG='#100F15'
FONT=REPO/'node_modules/@expo-google-fonts/nunito'
def font(n,weight='900Black'):return ImageFont.truetype(str(FONT/weight/f'Nunito_{weight}.ttf'),n)
def run(args):subprocess.run(args,check=True,stdout=subprocess.DEVNULL,stderr=subprocess.PIPE)
def text(d,xy,s,n=80,fill=WHITE,weight='900Black'):
 d.text(xy,s,font=font(n,weight),fill=fill,spacing=0)
def bg(accent=GOLD):
 a=np.zeros((H,W,3),dtype=np.uint8); yy,xx=np.mgrid[0:H,0:W]; rgb=tuple(int(accent[i:i+2],16) for i in (1,3,5))
 glow=np.exp(-((xx-860)**2/(640**2)+(yy-700)**2/(880**2)))*.13
 for c,b in enumerate((16,15,21)):a[:,:,c]=np.clip(b+glow*rgb[c],0,255)
 im=Image.fromarray(a).convert('RGBA');d=ImageDraw.Draw(im)
 for radius in (330,470,620):d.ellipse((790-radius,660-radius,790+radius,660+radius),outline=tuple(int(v*.14+b*.86) for v,b in zip(rgb,(16,15,21))),width=2)
 d.rounded_rectangle((74,137,276,190),radius=25,fill='#27232A')
 text(d,(93,140),'CG TRIVIA',29,GOLD)
 text(d,(73,1768),'CULTURA GENERAL',23,MUTED,'700Bold')
 return im

def fit_lines(d,lines,y,maxsize=90,color=WHITE):
 for line in lines:
  n=maxsize
  while d.textlength(line,font=font(n))>850:n-=1
  text(d,(76,y),line,n,color); y+=n+3
 return y

def card(name,kind,lines=(),tag='',accent=GOLD,sub='',feature=''):
 im=bg(accent);d=ImageDraw.Draw(im)
 if kind=='hook':
  text(d,(78,320),tag.upper(),28,accent,'800ExtraBold')
  y=fit_lines(d,lines,420,112)
  d.rounded_rectangle((80,y+65,900,y+69),radius=2,fill=accent)
  text(d,(80,y+113),sub,36,MUTED,'700Bold')
  # A graphic question disc, not a mocked app screen.
  d.ellipse((290,1040,760,1510),fill='#242027',outline=accent,width=4)
  symbol=feature or '?'
  size=230 if len(symbol)==1 else 150
  sw=d.textlength(symbol,font=font(size))
  if feature=='FLAG':
   flag=Image.open(ROOT/'raw'/'flags_play.png').convert('RGBA').crop((425,670,790,945)).resize((440,332),Image.Resampling.LANCZOS)
   mask=Image.new('L',flag.size);ImageDraw.Draw(mask).rounded_rectangle((0,0,439,331),radius=65,fill=255)
   im.paste(flag,(305,1105),mask)
  else:
   text(d,((1050-sw)/2,1130),symbol,size,accent)
  text(d,(79,1610),'JUEGA. DESCUBRE. REPITE.',29,WHITE,'800ExtraBold')
 elif kind=='cta':
  icon=Image.open(REPO/'assets/icon.png').convert('RGBA').resize((218,218))
  mask=Image.new('L',icon.size);ImageDraw.Draw(mask).rounded_rectangle((0,0,217,217),radius=48,fill=255)
  im.paste(icon,(78,342),mask)
  y=fit_lines(d,lines or ['Tu próxima','respuesta está aquí.'],650,95)
  text(d,(80,y+55),'Cultura General · CG Trivia',37,WHITE,'800ExtraBold')
  text(d,(80,y+116),sub or 'Preguntas, retos y mucho por descubrir.',31,MUTED,'700Bold')
  d.rounded_rectangle((78,1230,896,1362),radius=35,fill=accent)
  text(d,(121,1258),'DESCÁRGALO EN APP STORE',38,'#171116')
  text(d,(82,1403),'Busca «Cultura General»',36,WHITE,'800ExtraBold')
  text(d,(82,1472),'Descarga gratuita · Compras dentro de la app',26,MUTED,'700Bold')
 elif kind=='overlay':
  # The transparent rounded window reveals the real simulator recording.
  text(d,(78,216),tag.upper(),26,accent,'800ExtraBold')
  fit_lines(d,lines,262,72)
  d.rounded_rectangle((159,470,849,1681),radius=39,fill='#4B3D2E')
  d.rounded_rectangle((167,478,841,1673),radius=32,fill=(0,0,0,0))
  if sub:
   d.rounded_rectangle((80,1570,922,1697),radius=25,fill='#211B22',outline='#4D403B',width=2)
   # Up to two lines, constrained to safe right margin.
   words=sub.split(); ls=['']
   for word in words:
    candidate=(ls[-1]+' '+word).strip()
    if d.textlength(candidate,font=font(29,'800ExtraBold'))>770:ls.append(word)
    else:ls[-1]=candidate
   for j,line in enumerate(ls):text(d,(104,1590+j*35),line,29,WHITE,'800ExtraBold')
 im.save(ROOT/'graphics'/f'{name}.png');return ROOT/'graphics'/f'{name}.png'

def render_card(path,duration,out):
 frames=round(duration*30)
 run(['ffmpeg','-y','-v','error','-loop','1','-framerate','30','-i',str(path),'-vf',f"scale=1188:2112,zoompan=z='1.015+0.025*on/{frames}':x='iw/2-iw/zoom/2':y='ih/2-ih/zoom/2':d=1:s=1080x1920:fps=30,format=yuv420p",'-t',str(duration),'-c:v','libx264','-preset','fast','-crf','19','-an',str(out)])
def render_clip(name,source,start,duration,lines,tag,sub,accent,out):
 graphic=card(name,'overlay',lines,tag,accent,sub)
 # Slightly crop system chrome, preserving the app content; actual screen is 1206x2622.
 filt="[0:v]setpts=PTS-STARTPTS,fps=30,tpad=stop_mode=clone:stop_duration=30,crop=1206:2140:0:160,scale=674:1195:flags=lanczos,setsar=1[v];[1:v][v]overlay=167:478[b];[b][2:v]overlay=0:0,format=yuv420p[o]"
 back=ROOT/'graphics'/'base.png'
 run(['ffmpeg','-y','-v','error','-ss',str(start),'-i',str(ROOT/'raw'/f'{source}.mp4'),'-loop','1','-framerate','30','-i',str(back),'-loop','1','-framerate','30','-i',str(graphic),'-filter_complex',filt,'-map','[o]','-t',str(duration),'-an','-r','30','-video_track_timescale','15360','-c:v','libx264','-preset','fast','-crf','19',str(out)])

def soundtrack(duration,path):
 sr=48000;n=int(sr*duration);out=np.zeros((n,2),dtype=np.float64); rng=np.random.default_rng(23);beat=60/116
 def add(sig,start,pan=0):
  k=int(start*sr);m=min(len(sig),n-k)
  if m>0:out[k:k+m,0]+=sig[:m]*(1-pan*.35);out[k:k+m,1]+=sig[:m]*(1+pan*.35)
 def note(freq,length,amp,decay=2):
  t=np.arange(int(sr*length))/sr;env=(1-np.exp(-t*90))*np.exp(-t*decay)
  return amp*env*(np.sin(2*np.pi*freq*t)+.25*np.sin(4*np.pi*freq*t)+.1*np.sin(6*np.pi*freq*t))
 chords=[(57,60,64),(53,57,60),(60,64,67),(55,59,62)]
 for b in range(math.ceil(duration/beat)):
  at=b*beat;c=chords[(b//8)%4];t=np.arange(int(sr*.3))/sr
  add(.28*np.sin(2*np.pi*(48*t+3*(1-np.exp(-t*34))))*np.exp(-t*16),at)
  if b%2==1:add(.085*rng.normal(size=len(t))*np.exp(-t*26),at)
  for half in (0,.5):
   z=np.arange(int(sr*.06))/sr;noise=rng.normal(size=len(z));noise=np.diff(noise,prepend=0)
   add(.02*noise*np.exp(-z*65),at+half*beat,(-1)**b*.7)
  add(note(440*2**((c[0]-24-69)/12),beat*.85,.16,6),at)
  for j,midi in enumerate(c):add(note(440*2**((midi+12-69)/12),beat*1.6,.052,3.7),at+j*beat/3,(j-1)*.7)
 # Light rising sweep at the start, and a soft chime at the CTA.
 t=np.arange(int(sr*.38))/sr;add(.035*rng.normal(size=len(t))*np.sin(np.pi*t/.38)**2,0)
 for j,m in enumerate((81,85,88)):add(note(440*2**((m-69)/12),1.3,.06,3),duration-3+j*.10,j*.4)
 out*=np.minimum(1,np.arange(n)/(.025*sr))[:,None];out*=np.minimum(1,(n-1-np.arange(n))/(.7*sr))[:,None]
 out=np.tanh(out*.85)
 with wave.open(str(path),'wb') as f:f.setnchannels(2);f.setsampwidth(2);f.setframerate(sr);f.writeframes((out*32767).astype('<i2').tobytes())

# (source, start, duration, headline lines, label, supporting caption)
CAMPAIGNS=[]
def campaign(key,title,hook,tag,sub,scenes,cta,accent=GOLD):
 CAMPAIGNS.append(dict(key=key,title=title,hook=hook,tag=tag,sub=sub,scenes=scenes,cta=cta,accent=accent))
# Plans are completed after viewing the actual recordings.
if __name__=='__main__':
 plans=json.loads((ROOT/'plans.json').read_text());bg().save(ROOT/'graphics'/'base.png')
 selected=sys.argv[1:]
 for p in plans:
  key=p['key']
  if selected and key not in selected:continue
  work=ROOT/'renders'/key;work.mkdir(parents=True,exist_ok=True)
  segments=[];duration=0;accent=p.get('accent',GOLD)
  hook=card(key+'_hook','hook',p['hook'],p['tag'],accent,p['sub'],p.get('symbol','?'))
  f=work/'00.mp4';render_card(hook,2.5,f);segments.append(f);duration+=2.5
  for i,s in enumerate(p['scenes']):
   source,start,d,lines,tag,sub=s;f=work/f'{i+1:02}.mp4'
   render_clip(key+f'_{i}',source,start,d,lines,tag,sub,accent,f);segments.append(f);duration+=d
  cta=card(key+'_cta','cta',p['cta'],accent=accent,sub=p.get('ctaSub',''))
  f=work/'99.mp4';render_card(cta,3.5,f);segments.append(f);duration+=3.5
  (work/'concat.txt').write_text('\n'.join("file '"+str(f)+"'" for f in segments))
  run(['ffmpeg','-y','-v','error','-f','concat','-safe','0','-i',str(work/'concat.txt'),'-c','copy',str(work/'silent.mp4')])
  soundtrack(duration,work/'music.wav')
  out=ROOT/'social'/f'{key}.mp4'
  run(['ffmpeg','-y','-v','error','-i',str(work/'silent.mp4'),'-i',str(work/'music.wav'),'-map','0:v','-map','1:a','-c:v','copy','-af','loudnorm=I=-16:TP=-1.5:LRA=9','-ar','48000','-c:a','aac','-b:a','192k','-shortest','-movflags','+faststart',str(out)])
  poster=ROOT/'posters'/f'{key}.jpg'
  Image.open(hook).convert('RGB').save(poster,quality=94)
  if duration<=30:
   run(['ffmpeg','-y','-v','error','-i',str(out),'-c:v','libx264','-preset','fast','-crf','23','-maxrate','4000k','-bufsize','8000k','-pix_fmt','yuv420p','-c:a','aac','-b:a','128k','-movflags','+faststart',str(ROOT/'inhouse'/f'{key}.mp4')])
  print(key,duration,flush=True)
