const currencyOneEl = document.getElementById('currency-one');
const amountOneEl = document.getElementById('amount-one');
const currencyTwoEl = document.getElementById('currency-two');
const amountTwoEl = document.getElementById('amount-two');
const rateEl = document.getElementById('rate');
const swapBtn = document.getElementById('swap');
const clearBtn = document.getElementById('clear-btn');
const updateTimeEl = document.getElementById('updateTime');
const historyList = document.getElementById('history-list');
const clearHistoryBtn = document.getElementById('clear-history-btn');

let conversionHistory = [];

// ดึงข้อมูลอัตราแลกเปลี่ยนและคำนวณ (โจทย์ที่ 1 และ 4)
async function calculate(direction = 'forward') {
    const currencyOne = currencyOneEl.value;
    const currencyTwo = currencyTwoEl.value;

    try {
        const res = await fetch(`https://api.exchangerate-api.com/v4/latest/${currencyOne}`);
        const data = await res.json();
        const rate = data.rates[currencyTwo];

        rateEl.innerText = `1 ${currencyOne} = ${rate.toFixed(4)} ${currencyTwo}`;

        // โจทย์ที่ 4: แสดงเวลาที่อัปเดตล่าสุด
        const now = new Date();
        updateTimeEl.innerText = `อัปเดตล่าสุด: ${now.toLocaleDateString('th-TH')} เวลา ${now.toLocaleTimeString('th-TH')}`;

        // โจทย์ที่ 1: คำนวณสองทิศทาง
        if (direction === 'forward') {
            const amount1 = parseFloat(amountOneEl.value) || 0;
            amountTwoEl.value = (amount1 * rate).toFixed(2);
            if (amount1 > 0) {
                addHistory(amount1, currencyOne, amountTwoEl.value, currencyTwo);
            }
        } else if (direction === 'backward') {
            const amount2 = parseFloat(amountTwoEl.value) || 0;
            const calculatedOne = rate > 0 ? amount2 / rate : 0;
            amountOneEl.value = calculatedOne.toFixed(2);
            if (amount2 > 0) {
                addHistory(amountOneEl.value, currencyOne, amount2, currencyTwo);
            }
        }
    } catch (error) {
        rateEl.innerText = 'ไม่สามารถดึงข้อมูลอัตราแลกเปลี่ยนได้';
    }
}

// โจทย์ที่ 2: บันทึกและแสดงประวัติย้อนหลัง 10 รายการ
function addHistory(amt1, curr1, amt2, curr2) {
    const historyText = `${Number(amt1).toLocaleString()} ${curr1} → ${Number(amt2).toLocaleString()} ${curr2}`;
    
    // ป้องกันการบันทึกรายการซ้ำติดๆ กันถ้าค่าเท่าเดิมเป๊ะ
    if (conversionHistory.length > 0 && conversionHistory[0] === historyText) {
        return;
    }

    conversionHistory.unshift(historyText); // เพิ่มเข้าหน้าสุด
    if (conversionHistory.length > 10) {
        conversionHistory.pop(); // ตัดออกให้เหลือแค่ 10 รายการล่าสุด
    }
    renderHistory();
}

function renderHistory() {
    historyList.innerHTML = '';
    conversionHistory.forEach(item => {
        const li = document.createElement('li');
        li.innerText = item;
        historyList.appendChild(li);
    });
}

// โจทย์ที่ 3: ปุ่มล้างข้อมูล
clearBtn.addEventListener('click', () => {
    amountOneEl.value = '1';
    amountTwoEl.value = '';
    currencyOneEl.value = 'USD';
    currencyTwoEl.value = 'THB';
    calculate('forward');
});

// ล้างประวัติการแปลงเงิน
clearHistoryBtn.addEventListener('click', () => {
    conversionHistory = [];
    renderHistory();
});

// Event Listeners
currencyOneEl.addEventListener('change', () => calculate('forward'));
amountOneEl.addEventListener('input', () => calculate('forward'));
currencyTwoEl.addEventListener('change', () => calculate('forward'));

// โจทย์ที่ 1: พิมพ์ช่องปลายทาง คำนวณย้อนกลับมาต้นทาง
amountTwoEl.addEventListener('input', () => calculate('backward'));

swapBtn.addEventListener('click', () => {
    const temp = currencyOneEl.value;
    currencyOneEl.value = currencyTwoEl.value;
    currencyTwoEl.value = temp;
    calculate('forward');
});

// โหลดครั้งแรก
calculate('forward');