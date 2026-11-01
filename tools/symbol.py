# App-Symbol „Sajda“: dieselbe Landschaft wie das Hürmet-Symbol (~/projects/Cockpit/tools/icon/icon.py),
# aber zur Morgendämmerung (Fajr) mit Mondsichel statt Sonne. Liefert ein 1024er-Bild.
import math, random
from PIL import Image, ImageDraw, ImageFilter
S=4096; c=S/2
def h(x): x=x.lstrip('#'); return tuple(int(x[i:i+2],16) for i in (0,2,4))
def grad(stops,y0=0,y1=S):
    g=Image.new('RGB',(1,S))
    for y in range(S):
        t=min(1,max(0,(y-y0)/(y1-y0)))
        for (t0,a),(t1,b) in zip(stops,stops[1:]):
            if t<=t1: u=(t-t0)/(t1-t0); break
        g.putpixel((0,y),tuple(int(h(a)[i]*(1-u)+h(b)[i]*u) for i in range(3)))
    return g.resize((S,S))
def glow(img,box,col,r,a):
    m=Image.new('L',(S,S),0); ImageDraw.Draw(m).ellipse(box,fill=a); m=m.filter(ImageFilter.GaussianBlur(r))
    return Image.composite(Image.new('RGB',(S,S),h(col)),img,m)
def ridge(img,base,waves,col,fog=None):
    pts=[(0,S)]
    for i in range(201):
        x=i*S/200; y=base-sum(a*math.sin(x/S*f*math.pi+p) for a,f,p in waves); pts.append((x,y))
    pts.append((S,S))
    if fog:  # Dunst über dem Kamm
        m=Image.new('L',(S,S),0); ImageDraw.Draw(m).polygon(pts,fill=fog); m=m.filter(ImageFilter.GaussianBlur(120))
        img=Image.composite(Image.new('RGB',(S,S),h('#e9c9b8')),img,m)
    ImageDraw.Draw(img).polygon(pts,fill=h(col)); return img
def zeichnen():
    random.seed(7)
    # Himmel: oben Nacht, am Horizont der erste helle Streifen
    im=grad([(0,'#1f2b55'),(0.45,'#5b5a8e'),(0.8,'#c99aa6'),(1,'#f6cfae')],0,2000)
    d=ImageDraw.Draw(im)
    for _ in range(26):  # Sterne, nach unten seltener
        x=random.uniform(150,S-150); y=random.uniform(120,1100)**1
        if abs(x-c)<700 and 900<y<1900: continue
        r=random.uniform(7,16)*(1.2-y/1300); a=int(255*(1-y/1400))
        d.ellipse([x-r,y-r,x+r,y+r],fill=tuple(int(v*a/255+w*(1-a/255)) for v,w in zip(h('#fff6e0'),im.getpixel((int(x),int(y))))))
    moon=(c+80,1350); R=470
    im=glow(im,[moon[0]-1000,moon[1]-1000,moon[0]+1000,moon[1]+1000],'#f3e3d6',360,120)
    m=Image.new('L',(S,S),0); dm=ImageDraw.Draw(m)
    dm.ellipse([moon[0]-R,moon[1]-R,moon[0]+R,moon[1]+R],fill=255)
    dm.ellipse([moon[0]-R+300,moon[1]-R-170,moon[0]+R+300,moon[1]+R-170],fill=0)
    im.paste(h('#fbecc8'),(0,0),m)
    im=ridge(im,1900,[(260,1.3,0.4),(120,3.1,1.2),(60,6,0.3)],'#7f9f95',fog=150)
    im=ridge(im,2250,[(230,1.7,2.2),(110,3.7,0.1),(50,7,1)],'#4c7a68',fog=120)
    im=ridge(im,2620,[(200,1.1,4.0),(130,2.9,2.5),(45,8,2)],'#2c5646',fog=90)
    sea=2860
    sea_img=grad([(0,'#34557a'),(1,'#172f4a')],sea,S)
    m=Image.new('L',(S,S),0); ImageDraw.Draw(m).rectangle([0,sea,S,S],fill=255)
    im=Image.composite(sea_img,im,m); d=ImageDraw.Draw(im)
    # Mondglitzern auf dem Wasser
    for k,y in enumerate(range(sea+90,S-40,120)):
        t=k/9; w=260+t*420
        for _ in range(2):
            x0=c+80+random.uniform(-w,w*0.4); L=random.uniform(0.3,0.7)*w
            col=tuple(int(a*(1-t*0.5)+b*t*0.5) for a,b in zip(h('#f6e6c4'),h('#4d6e8e')))
            d.rounded_rectangle([x0,y,x0+L,y+28+t*14],20,fill=col)
    im=glow(im,[c-800,sea-120,c+900,sea+160],'#e8c9b4',90,110)
    return im.resize((1024,1024),Image.LANCZOS)
if __name__=='__main__':
    import sys; zeichnen().save(sys.argv[1])
