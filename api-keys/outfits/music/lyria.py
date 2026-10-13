import base64,json,subprocess,os,sys,urllib.request
P="project-cb3b1428-cbd7-41cd-bb8"
tok=subprocess.check_output([os.path.expanduser("~/google-cloud-sdk/bin/gcloud"),"auth","application-default","print-access-token"],text=True).strip()
name,prompt,neg=sys.argv[1],sys.argv[2],sys.argv[3]
body={"instances":[{"prompt":prompt,"negative_prompt":neg}],"parameters":{"sample_count":1}}
req=urllib.request.Request(f"https://us-central1-aiplatform.googleapis.com/v1/projects/{P}/locations/us-central1/publishers/google/models/lyria-002:predict",json.dumps(body).encode(),
 {"Authorization":"Bearer "+tok,"X-Goog-User-Project":P,"Content-Type":"application/json"})
r=json.load(urllib.request.urlopen(req,timeout=300))
open(name,"wb").write(base64.b64decode(r["predictions"][0]["bytesBase64Encoded"])); print("saved",name)
