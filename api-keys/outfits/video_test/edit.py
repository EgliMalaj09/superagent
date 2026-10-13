import base64,json,subprocess,os,sys,urllib.request,urllib.error
P="project-cb3b1428-cbd7-41cd-bb8"
tok=subprocess.check_output([os.path.expanduser("~/google-cloud-sdk/bin/gcloud"),"auth","application-default","print-access-token"],text=True).strip()
b=lambda f:base64.b64encode(open(f,"rb").read()).decode()
task=sys.argv[1] if len(sys.argv)>1 else None
prompt=("Edit the input video. Replace ONLY the woman's clothing in every shot with the burgundy two-piece fleece set shown in the reference images: "
"a boxy cropped deep burgundy wine-red crewneck sweatshirt with dropped shoulders, wide balloon sleeves, ribbed cuffs and ribbed hem, a small white two-heart logo at center chest; "
"matching very baggy high-waisted burgundy joggers with a wide elastic waistband, heavy gathered elastic ankle cuffs, small white script 'two little hearts' on the thigh. "
"Remove any hats, jackets, skirts and other garments she wears so she wears only this set. Keep EVERYTHING else identical: same woman, face, black sunglasses, long black hair with bangs, shoes, bag, poses, movement, camera motion, cuts, Berlin street backgrounds, lighting and timing. Do not add people.")
body={"model":"gemini-omni-1.1-flash-preview","input":[
 {"type":"video","data":b("src_6s.mp4"),"mime_type":"video/mp4"},
 {"type":"image","data":b("../genjutsu_refs/burgundy_worn.jpg"),"mime_type":"image/jpeg"},
 {"type":"image","data":b("../out/burgundy_front.png"),"mime_type":"image/png"},
 {"type":"text","text":prompt}],
 "response_format":[{"type":"video","aspect_ratio":"9:16","duration":"6s","resolution":"720p"}]}
if task: body["generation_config"]={"video_config":{"task":task}}
req=urllib.request.Request(f"https://aiplatform.googleapis.com/v1beta1/projects/{P}/locations/global/interactions",json.dumps(body).encode(),
 {"Authorization":"Bearer "+tok,"X-Goog-User-Project":P,"Content-Type":"application/json"})
try: r=json.load(urllib.request.urlopen(req,timeout=900))
except urllib.error.HTTPError as e: sys.exit(f"HTTP {e.code}: {e.read().decode()[:1500]}")
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
out=f"edit_{task or 'default'}.mp4"; open(out,"wb").write(base64.b64decode(d)); print("saved",out)
