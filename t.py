import requests 
import codecs

boc = ""

r = requests.post(
    url="https://testnet.toncenter.com/api/v2/jsonRPC",
    json={
        "jsonrpc": '2.0',
        "method": 'sendBoc',
        "params": {
            "boc": codecs.encode(codecs.decode(boc, 'hex'), 'base64').decode()
        }
    }
)

print(r.text)