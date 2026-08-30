const form = document.getElementById('transactionForm');
const textInput = document.getElementById('text');
const amountInput = document.getElementById('amount');
const typeInput = document.getElementById('type');
const categoryInput = document.getElementById('category');
const transactionList = document.getElementById('transactionList');
const totalIncomeEl = document.getElementById('totalIncome');
const totalExpenseEl = document.getElementById('totalExpense');
const netBalanceEl = document.getElementById('netBalance');
const searchInput = document.getElementById('searchInput');
const clearBtn = document.getElementById('clearBtn');

// เก็บข้อมูลธุรกรรมทั้งหมด
let transactions = [];

// ฟังก์ชันเพิ่มรายการเมื่อกด Submit ฟอร์ม
form.addEventListener('submit', function(e) {
    e.preventDefault();

    const newTransaction = {
        id: transactions.length + 1, // โจทย์ที่ 3: มี ID/ลำดับ
        text: textInput.value,
        amount: parseFloat(amountInput.value),
        type: typeInput.value, // 'income' หรือ 'expense'
        category: categoryInput.value // โจทย์ที่ 1: หมวดหมู่
    };

    transactions.push(newTransaction);
    
    // เคลียร์ค่าในฟอร์ม
    textInput.value = '';
    amountInput.value = '';
    categoryInput.selectedIndex = 0;

    init();
});

// ฟังก์ชันเรนเดอร์ข้อมูลแสดงผล (รองรับโจทย์ที่ 2: ค้นหาแบบ Real-time)
function renderTransactions(filterText = '') {
    transactionList.innerHTML = '';

    // กรองข้อมูลตามคำค้นหา (Search)
    const filteredTransactions = transactions.filter(item => 
        item.text.toLowerCase().includes(filterText.toLowerCase())
    );

    if (filteredTransactions.length === 0) {
        transactionList.innerHTML = `<li style="justify-content: center; color: #888;">ไม่พบรายการ</li>`;
        return;
    }

    filteredTransactions.forEach((item, index) => {
        const li = document.createElement('li');
        li.classList.add(item.type === 'income' ? 'income-item' : 'expense-item');

        // โจทย์ที่ 1 & 3: แสดง ID, ประเภท, ชื่อรายการ, หมวดหมู่ และจำนวนเงิน ในแท็ก <li>
        li.innerHTML = `
            <span><strong>#${index + 1}</strong> [${item.type === 'income' ? 'รายรับ' : 'รายจ่าย'}] ${item.text} (${item.category})</span>
            <span class="${item.type === 'income' ? 'income' : 'expense'}">
                ${item.type === 'income' ? '+' : '-'}${item.amount.toFixed(1)} ฿
            </span>
        `;
        transactionList.appendChild(li);
    });
}

// โจทย์ที่ 4: คำนวณสรุปรายงานการเงิน
function updateValues() {
    let income = 0;
    let expense = 0;

    transactions.forEach(item => {
        if (item.type === 'income') {
            income += item.amount;
        } else {
            expense += item.amount;
        }
    });

    const netBalance = income - expense;

    totalIncomeEl.innerText = `฿${income.toFixed(1)}`;
    totalExpenseEl.innerText = `฿${expense.toFixed(1)}`;
    netBalanceEl.innerText = `฿${netBalance.toFixed(1)}`;
}

// โจทย์ที่ 2: ระบบค้นหา Real-time (พิมพ์ปุ๊บ กรองปั๊บ)
searchInput.addEventListener('input', function(e) {
    renderTransactions(e.target.value);
});

// โจทย์ที่ 5: ปุ่มล้างประวัติทั้งหมดด้วย confirm()
clearBtn.addEventListener('click', function() {
    if (confirm('คุณต้องการล้างข้อมูลประวัติทั้งหมดใช่หรือไม่?')) {
        transactions = [];
        init();
    }
});

// ฟังก์ชันหลักสำหรับอัปเดตหน้าจอทั้งหมด
function init() {
    renderTransactions();
    updateValues();
}

// เริ่มต้นเรียกใช้งาน
init();