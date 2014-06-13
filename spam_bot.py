import requests
import json

num_requests = 100

def sendMessage():
  url = 'http://localhost:9090/api/page/hello/message'
  payload = {'body': 'data'}
  headers = {'content-type': 'application/json'}
  r = requests.post(url, data=json.dumps(payload), headers=headers)
  print r.text

for i in range(num_requests):
  sendMessage()