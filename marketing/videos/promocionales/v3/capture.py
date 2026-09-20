"""Record the real iOS simulator; gestures use source-screen pixel coordinates."""
import subprocess,time,signal,sys
from pathlib import Path
ROOT=Path(__file__).resolve().parent

def run(*args): return subprocess.run(args,check=True,stdout=subprocess.DEVNULL)
def capture(name,route,duration=9,actions=()):
 run('xcrun','simctl','openurl','booted','culturalgeneral://'+route);time.sleep(2)
 run('xcrun','simctl','io','booted','screenshot',str(ROOT/'raw'/f'{name}.png'))
 p=subprocess.Popen(['xcrun','simctl','io','booted','recordVideo','--codec=h264','--force',str(ROOT/'raw'/f'{name}.mp4')],stdout=subprocess.DEVNULL,stderr=subprocess.DEVNULL)
 start=time.monotonic()
 for at,coords in actions:
  time.sleep(max(0,at-(time.monotonic()-start)));run('/tmp/cg-gesture',*[str(c) for c in coords])
 time.sleep(max(0,duration-(time.monotonic()-start)));p.send_signal(signal.SIGINT);p.wait();print(name,flush=True)
if __name__=='__main__':
 capture('learn_catalog','learn',10,[(3,(650,2100,650,1100)),(6,(650,2000,650,1150))])
 capture('adventure_map','adventure',10,[(4,(600,1900,600,1100))])
 capture('friends_modes','friends',10,[(3,(650,2100,650,1200)),(6,(650,2000,650,1100))])
 capture('pro_room','premium',10,[(4,(650,2100,650,1100))])
 capture('daily','daily',9)
 capture('leagues','leagues',9)
 capture('shop','shop',10,[(4,(650,2100,650,1100))])
 capture('stats','stats',10,[(4,(650,2100,650,1100))])
