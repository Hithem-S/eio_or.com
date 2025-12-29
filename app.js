// هذا كود تجريبي للبداية فقط
// سنعدله لاحقاً ليتصل بـ Supabase

console.log("✅ جاهز للعمل!");

// دالة لعرض رسالة
function loadContacts() {
    const customerSelect = document.getElementById('customerSelect');
    if (!customerSelect.value) {
        alert("⚠️ اختر عميل أولاً");
        return;
    }
    
    // بيانات تجريبية
    const contacts = [
        { name: "د. أحمد محمد", job: "طبيب", phone: "01001234567", status: "نشط" },
        { name: "سارة عبدالله", job: "ممرضة", phone: "01112223344", status: "نشط" }
    ];
    
    const tableBody = document.getElementById('contactsBody');
    tableBody.innerHTML = '';
    
    contacts.forEach(contact => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${contact.name}</td>
            <td>${contact.job}</td>
            <td>${contact.phone}</td>
            <td>${contact.status}</td>
        `;
        tableBody.appendChild(row);
    });
    
    document.getElementById('contactsTable').style.display = 'block';
}

// دالة لإضافة عميل (تجريبية)
function addCustomer() {
    const name = document.getElementById('hospitalName').value;
    const type = document.getElementById('customerType').value;
    
    if (!name) {
        alert("⚠️ ادخل اسم العميل");
        return;
    }
    
    alert(`✅ تم إضافة العميل: ${name} (${type})`);
    
    // إضافة للقائمة المنسدلة (تجريبي)
    const select = document.getElementById('customerSelect');
    const option = document.createElement('option');
    option.value = name;
    option.textContent = `${name} - ${type}`;
    select.appendChild(option);
    
    // تفريغ الحقل
    document.getElementById('hospitalName').value = '';
}

// عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', function() {
    console.log("🚀 الصفحة محملة بنجاح");
});
