import socket
import json
import time
import hashlib
import threading
import logging

logging.basicConfig(level=logging.DEBUG, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

class StratumClient:
    def __init__(self, username, password, server_address, server_port):
        self.username = username
        self.password = password
        self.server_address = server_address
        self.server_port = server_port
        self.sock = None
        self.job = None
        self.extranonce1 = None
        self.extranonce2_size = None
        self.difficulty = 1000000
        self.used_nonces = set()
        self.max_nonces = 2**32-1
        self.nonce_threshold = int(self.max_nonces * 0.75)
        self.nonce_counter = 0

    def n(self, nonce, length=2):
        if nonce not in self.used_nonces:
            self.used_nonces.add(nonce)
        while True:
            midpoint = nonce / length
            incise = abs(nonce - length)
            perimeter = (midpoint * 2) + (incise * 2)
            length = perimeter / 2
            length += round(incise / 2)
            if (int(length) <= 32):
                return int(length)
            nonce += 1
        return 2**32-1

    def find_first_non_zero(self, string):
        i = 0
        for char in string:
            if char.isdigit() and char != '0':
                return i
            i += 1
        return 0

    def calculate_proof_of_work(self, data, check_nonce, difficulty):
        for nonce in range(check_nonce):
            nonce = self.n(nonce, 2)
            hash_attempt = hashlib.sha256(data.encode('utf-8') + nonce.to_bytes(2, 'big')).hexdigest()
            make = self.find_first_non_zero(hash_attempt)
            if hash_attempt.startswith("0"*make):
                return hash_attempt, nonce
        return False, nonce

    def get_unique_nonce(self, nonce):
        if len(self.used_nonces) >= self.nonce_threshold:
            self.used_nonces.clear()
        
        while nonce not in self.used_nonces:
            nonce = self.nonce_counter
            self.nonce_counter += 1
        if self.nonce_counter > 2**32-1:
            self.nonce_counter = 0
        return nonce

    def connect(self):
        self.sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        self.sock.connect((self.server_address, self.server_port))
        logger.info(f"Connected to {self.server_address}:{self.server_port}")

    def send_message(self, message):
        self.sock.sendall(json.dumps(message).encode() + b'\n')
        logger.debug(f"Sent: {message}")

    def receive_message(self):
        buffer = b''
        while True:
            chunk = self.sock.recv(1000000)
            if not chunk:
                raise ConnectionError("Server closed the connection")
            buffer += chunk
            while b'\n' in buffer:
                message, buffer = buffer.split(b'\n', 1)
                if message:
                    try:
                        return json.loads(message.decode())
                    except json.JSONDecodeError:
                        logger.warning(f"Received invalid JSON: {message}")
        return None

    def subscribe(self):
        self.send_message({"id": 1, "method": "mining.subscribe", "params": []})
        response = self.receive_message()
        self.extranonce1 = response['result'][1]
        self.extranonce2_size = response['result'][2]
        logger.info(f"Subscribed with extranonce1: {self.extranonce1}")

    def authorize(self):
        self.send_message({"id": 2, "method": "mining.authorize", "params": [self.username, self.password]})
        response = self.receive_message()
        if response.get('result'):
            logger.info("Authorization successful")
        else:
            raise ValueError("Authorization failed")

    def handle_server_messages(self):
        while True:
            message = self.receive_message()
            if message.get('method') == 'mining.notify':
                self.handle_job(message)
            elif message.get('method') == 'mining.set_difficulty':
                self.handle_difficulty(message)

    def handle_job(self, message):
        params = message['params']
        self.job = {
            'job_id': params[0],
            'prevhash': params[1],
            'coinb1': params[2],
            'coinb2': params[3],
            'merkle_branch': params[4],
            'version': params[5],
            'nbits': params[6],
            'ntime': params[7],
            'clean_jobs': params[8]
        }
        logger.info(f"Received new job: {self.job['job_id']}")

    def handle_difficulty(self, message):
        self.difficulty = message['params'][0]
        logger.info(f"New difficulty set: {self.difficulty}")

    def mine(self):
        nonce = 0
        non = 0
        while True:
            if self.job and self.difficulty:
                non = self.n(nonce)
                extranonce2 = format((non), f'0{self.extranonce2_size*2}x')
                coinbase = self.job['coinb1'] + self.extranonce1 + extranonce2 + self.job['coinb2']
                coinbase_hash = hashlib.sha256(hashlib.sha256(bytes.fromhex(coinbase)).digest()).digest()

                merkle_root = coinbase_hash
                for branch in self.job['merkle_branch']:
                    merkle_root = hashlib.sha256(hashlib.sha256(merkle_root + bytes.fromhex(branch)).digest()).digest()

                header = (
                    self.job['version'] +
                    self.job['prevhash'] +
                    merkle_root.hex() +
                    self.job['ntime'] +
                    self.job['nbits']
                )

                hash_result, found_nonce = self.calculate_proof_of_work(header, (non), self.difficulty)
                if hash_result:
                    logger.info(f"Share found! Nonce: {found_nonce}")
                    self.submit_share(self.job['job_id'], extranonce2, self.job['ntime'], format(found_nonce, '08x'))
                nonce += 1
            time.sleep(5)

    def submit_share(self, job_id, extranonce2, ntime, nonce):
        self.send_message({
            "id": 4,
            "method": "mining.submit",
            "params": [self.username, job_id, extranonce2, ntime, nonce]
        })
        response = self.receive_message()
        if response.get('result'):
            logger.info("Share accepted")
        else:
            logger.warning(f"Share rejected: {response.get('error')}")

    def run(self):
        self.connect()
        self.subscribe()
        self.authorize()
        threading.Thread(target=self.handle_server_messages, daemon=True).start()
        self.mine()


def main():
    client = StratumClient('bitcoinxiv.001', 'x', 'us.ss.btc.com', 3333)
    client.run()

if __name__ == "__main__":
    main()