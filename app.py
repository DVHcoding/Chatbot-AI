from flask import Flask, jsonify, request
import json
import random
from flask_cors import CORS
from unidecode import unidecode

app = Flask(__name__) # Khởi tạo ứng dụng Flask
CORS(app)  # Enable CORS

# Tải dữ liệu các mẫu ý định từ tệp intents.json
with open('intents.json', encoding='utf-8') as file:
    data = json.load(file)

# Lấy danh sách các ý định từ dữ liệu đã tải
intents = data['intents']


# Định nghĩa hàm xử lý đầu vào từ người dùng và tạo ra phản hồi
def process_input(input_text):
    # Loại bỏ dấu tiếng Việt
    input_text_cleaned = unidecode(input_text.lower())
    
    for intent in intents:
        for pattern in intent['patterns']:
            # Loại bỏ dấu tiếng Việt
            pattern_cleaned = unidecode(pattern.lower())
            # Khởi tạo biến đếm từ khớp
            match_count = 0
            # So sánh từng từ trong câu với từ khóa
            words = pattern_cleaned.split()
            for word in words:
                if word in input_text_cleaned.split():
                    match_count += 1
            # Kiểm tra số từ khớp, chỉ trả lời nếu có ít nhất 2 từ khớp
            if match_count >= 2:
                # Trả về một câu trả lời ngẫu nhiên từ danh sách câu trả lời của ý định tương ứng
                return random.choice(intent['responses'])
    # Gợi ý người dùng chọn một vài câu hỏi từ danh sách intents
    suggestions = [
        "Xin lỗi, tôi không hiểu câu hỏi của bạn. Bạn có thể đặt câu hỏi như: ",
    ]
    # Lấy ngẫu nhiên một vài câu hỏi từ các intents để gợi ý cho người dùng
    random_intents = random.sample(intents, min(3, len(intents)))
    for intent in random_intents:
        suggestions.append(random.choice(intent['patterns']))
    return ", ".join(suggestions)


# Định nghĩa route để dự đoán phản hồi
@app.route('/predict', methods=['POST'])
def predict():
    # Nhận dữ liệu JSON từ yêu cầu POST
    message = request.get_json(force=True)
    # Gọi hàm process_input để xử lý thông điệp nhận được và tạo ra phản hồi tương ứng
    response = process_input(message['message'])
    # Trả về phản hồi dưới dạng JSON
    return jsonify({'response': response})

# Khởi chạy ứng dụng Flask khi chạy tập lệnh
if __name__ == '__main__':
    app.run(debug=True) # Chạy ứng dụng Flask ở chế độ debug
