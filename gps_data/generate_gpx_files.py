import os

files=os.listdir('.')
files=[x for x in files if x.endswith('.gpx') and x.replace('.gpx','.csv') in files]
files=[x for x in files if x[0]!='.']

print(files)

output=''

for f in files:
    output+=('let ')
    name=f.split('.')[0]
    if name[0].isdigit():
        name='n'+name
    name=name.replace('-','')
    name=name.replace(',','')
    output+=name
    output+='=[\'gps_data/'
    output+=f
    output+=('\',')
    output+=('\'gps_data/')
    output+=(f.replace('gpx','csv'))
    output+=('\']\n')

output+='\n\nlet gpxList=['
for f in files:
    name=f.split('.')[0]
    if name[0].isdigit():
        name='n'+name
    name=name.replace('-','')
    name=name.replace(',','')
    output+=name
    output+=','

output=output[:-1]
output+=']\n\n'

output+='export {gpxList}\n\n'


with open('../js/gpx_files.js','w') as js_file:
    js_file.write(output)


print(output)
