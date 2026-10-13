#!/bin/zsh
# Motion-graphics Reel: storyboard.base.json + design.html + design.js -> storyboard.json -> public/index.html
# Copy into videos/<project>/ and run ./build.sh after every edit.
cd "${0:A:h}"
python3 -c "
import json;s=json.load(open('storyboard.base.json'))
s['raw_html']=open('design.html').read();s['raw_js']=open('design.js').read()
json.dump(s,open('storyboard.json','w'),ensure_ascii=False,indent=1)"
python3 ../../.claude/skills/reel-edit/scripts/reel-compose.py --spec storyboard.json --out public
