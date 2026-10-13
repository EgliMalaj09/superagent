import base64,json,subprocess,os,sys,urllib.request,urllib.error,time
P="project-cb3b1428-cbd7-41cd-bb8"
src,setname,out,dur,cuts=sys.argv[1],sys.argv[2],sys.argv[3],sys.argv[4],sys.argv[5]
SETS={"pink":"dusty rose pink","white":"off-white cream","burgundy":"deep burgundy wine-red"}
col=SETS[setname]
tok=subprocess.check_output([os.path.expanduser("~/google-cloud-sdk/bin/gcloud"),"auth","application-default","print-access-token"],text=True).strip()
b=lambda f:base64.b64encode(open(f,"rb").read()).decode()
prompt=f"""VIDEO-TO-VIDEO EDIT, NOT A NEW VIDEO. The first input is the source video. Reproduce it frame by frame: identical shot list, identical cut timings (cuts at {cuts} seconds), identical camera position, framing, lens, camera movement, whip-pans and motion blur, identical poses, gestures, walking and every body movement of the woman, identical timing of every action, identical backgrounds, buildings, passers-by and lighting. Treat the source video as a strict motion and composition guide.
The ONLY change: her clothing. In every shot she wears the {col} two-piece fleece set from the reference images: a boxy cropped {col} crewneck sweatshirt with dropped shoulders, wide balloon sleeves, ribbed cuffs and ribbed hem, a small white two-heart logo at center chest; matching very baggy high-waisted {col} joggers with a wide elastic waistband and heavy gathered elastic ankle cuffs, small "two little hearts" script on the thigh. Remove the jackets, hats, skirts and other garments so only this set is worn; keep her own shoes, bag and black sunglasses.
Keep the same woman: same face, long straight black hair with bangs, black sunglasses. Do not add or remove people. No text overlays. Keep the original ambient sound."""
body={"model":"gemini-omni-1.1-flash-preview","input":[
 {"type":"video","data":b(src),"mime_type":"video/mp4"},
 {"type":"image","data":b(f"../genjutsu_refs/{setname}_worn.jpg"),"mime_type":"image/jpeg"},
 {"type":"image","data":b(f"../out/{setname}_front.png"),"mime_type":"image/png"},
 {"type":"image","data":b(f"../out/{setname}_back.png"),"mime_type":"image/png"},
 {"type":"text","text":prompt}],
 "response_format":[{"type":"video","aspect_ratio":"9:16","resolution":"720p"}]}
req=urllib.request.Request(f"https://aiplatform.googleapis.com/v1beta1/projects/{P}/locations/global/interactions",json.dumps(body).encode(),
 {"Authorization":"Bearer "+tok,"X-Goog-User-Project":P,"Content-Type":"application/json"})
for a in range(5):
  try: r=json.load(urllib.request.urlopen(req,timeout=900)); break
  except urllib.error.HTTPError as e:
    if e.code==429: time.sleep(30*(a+1)); continue
    sys.exit(f"HTTP {e.code}: {e.read().decode()[:1500]}")
def f(x):
  if isinstance(x,dict):
    if x.get("type")=="video" and x.get("data"): return x["data"]
    for v in x.values():
      r=f(v)
      if r: return r
  if isinstance(x,list):
    for v in x:
      r=f(v)
      if r: return r
d=f(r)
if not d: sys.exit("no video: "+json.dumps(r)[:1500])
open(out,"wb").write(base64.b64decode(d)); print("saved",out)
