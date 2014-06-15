import requests
import json

num_requests = 150

def sendMessage():
  url = 'http://pintical.com/api/page/test/message'
  payload = {'body': 'test', 'password': 'coffee'}
  headers = {'content-type': 'application/json'}
  r = requests.post(url, data=json.dumps(payload), headers=headers)
  print r.text

for i in range(num_requests):
  print 'REQUEST #' + str(i)
  sendMessage()

