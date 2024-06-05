// MESSAGE INPUT
const textarea = document.querySelector(".chatbox-message-input"); // Lấy thẻ textarea nhập tin nhắn
const chatboxForm = document.querySelector(".chatbox-message-form"); // Lấy form của hộp chat

textarea.addEventListener("input", function () {
  let line = textarea.value.split("\n").length; // Số dòng trong textarea

  if (textarea.rows < 6 || line < 6) {
    // Điều chỉnh số hàng của textarea dựa trên số dòng
    textarea.rows = line;
  }

  // Điều chỉnh vị trí của form nếu có nhiều hơn một dòng
  if (textarea.rows > 1) {
    chatboxForm.style.alignItems = "flex-end";
  } else {
    chatboxForm.style.alignItems = "center";
  }
});

// TOGGLE CHATBOX
const chatboxToggle = document.querySelector(".chatbox-toggle");
const chatboxMessage = document.querySelector(".chatbox-message-wrapper");

chatboxToggle.addEventListener("click", function () {
  chatboxMessage.classList.toggle("show");
});

// CHATBOX MESSAGE
const chatboxMessageWrapper = document.querySelector(
  ".chatbox-message-content"
);
const chatboxNoMessage = document.querySelector(".chatbox-message-no-message");

chatboxForm.addEventListener("submit", function (e) {
  e.preventDefault();

  if (isValid(textarea.value)) {
    writeMessage();
    autoReply();
  }
});

function addZero(num) {
  return num < 10 ? "0" + num : num;
}

function writeMessage() {
  const today = new Date();
  let message = `
		<div class="chatbox-message-item sent">
			<span class="chatbox-message-item-text">
				${textarea.value.trim().replace(/\n/g, "<br>\n")}
			</span>
			<span class="chatbox-message-item-time">${addZero(today.getHours())}:${addZero(
    today.getMinutes()
  )}</span>
		</div>`;
  chatboxMessageWrapper.insertAdjacentHTML("beforeend", message);
  chatboxForm.style.alignItems = "center";
  textarea.rows = 1;
  textarea.focus();
  chatboxNoMessage.style.display = "none";
  scrollBottom();
}

function autoReply() {
  const today = new Date();

  fetch("http://localhost:5000/predict", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ message: textarea.value }), // Gửi dữ liệu dưới dạng JSON
  })
    .then((response) => response.json()) // Chuyển đổi phản hồi từ máy chủ thành JSON
    .then((data) => {
      // Lấy phản hồi từ bot
      var botResponse = data.response;

      console.log(botResponse);

      let message = `
		<div class="chatbox-message-item received">
			<span class="chatbox-message-item-text">
                ${botResponse}
			</span>
			<span class="chatbox-message-item-time">${addZero(today.getHours())}:${addZero(
        today.getMinutes()
      )}</span>
		</div>
	`;

      chatboxMessageWrapper.insertAdjacentHTML("beforeend", message);
      textarea.value = "";
      scrollBottom();
    });
}

// Cuộn xuống dòng cuối cùng của hộp chatbox
function scrollBottom() {
  chatboxMessageWrapper.scrollTo(0, chatboxMessageWrapper.scrollHeight);
}

function isValid(value) {
  let text = value.replace(/\n/g, "");
  text = text.replace(/\s/g, "");

  return text.length > 0;
}
