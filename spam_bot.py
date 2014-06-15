import requests
import json

num_requests = 150

def sendMessage():
  url = 'http://localhost:9090/api/page/hello/message'
  payload = {'body': 'ggggggg'}
  headers = {'content-type': 'application/json'}
  r = requests.post(url, data=json.dumps(payload), headers=headers)
  print r.text

for i in range(num_requests):
  print 'REQUEST #' + str(i)
  sendMessage()