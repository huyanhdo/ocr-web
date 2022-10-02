import os
import json
f = open('./test.json',encoding='utf-8')
data = json.load(f)
f.close()

g = open('./test_line_annotation.txt','w',encoding = 'utf-8')
g.writelines(['train/'+key+'\t'+value+'\n' for key,value in data.items()])
g.close()


