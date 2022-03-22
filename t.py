import requests 
import codecs

boc = "b5ee9c72410203010001000002df8800f05c4ef4fe3a4d7b0af9f3af47f743c2753ec42d15f76bb4a60efb5690cb04241198852069be99a97bb5b2d3d203cc55094f0e830a74e43186760716c2c214c80bf8a972e1b310e40fbdd73248ae9fa14f9215cb3f26a8d24c0e4d8478d972c521400000001fffffffe000000010010200c0ff0020dd2082014c97ba9730ed44d0d70b1fe0a4f2608308d71820d31fd31fd31ff82313bbf263ed44d0d31fd31fd3ffd15132baf2a15144baf2a204f901541055f910f2a3f8009320d74a96d307d402fb00e8d101a4c8cb1fcb1fcbffc9ed54005000000000000000001e389af9518e66330c58edbde7bcce782256346697dac1fb3f3cc2e6f5024f5a8c8f25a8"

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