// ======================
// 1. تعريف المتغيرات مرة واحدة فقط
// ======================
console.log("🎯 بدأ app.js");

const supabaseUrl = 'https://pbddasxuabdcbdwbymih.supabase.co';
const supabaseKey = 'sb_publishable_77vLiH4WXqwUxf_nMI4syA_dF8CabA1';

// ⚠️ هذي السطر الوحيد لإنشاء supabase
const supabase = window.supabase.createClient(supabaseUrl, supabaseKey);

console.log("✅ تم إنشاء اتصال Supabase");

// ======================
// 2. دوال جلب وعرض العملاء
// ======================
async function loadCustomers() {
    console.log("🔄 جاري جلب العملاء...");
    
    const selectElement = document.getElementById('customerSelect');
    selectElement.innerHTML = '<option value="">⏳ جاري التحميل...</option>';
    
    try {
        const { data, error } = await supabase
            .from('customers')
            .select('id, hospital, customer_type')
            .order('hospital');
        
        if (error) throw error;
        
        console.log(`📊 عدد العملاء: ${data.length}`);
        
        selectElement.innerHTML = '<option value="">-- اختر عميل --</option>';
        
        data.forEach(customer => {
            const option = document.createElement('option');
            option.value = customer.id;
            option.textContent = customer.hospital + 
                (customer.customer_type ? ` (${customer.customer_type})` : '');
            selectElement.appendChild(option);
        });
        
        console.log("✅ تم تحميل العملاء بنجاح");
        
    } catch (error) {
        console.error("❌ خطأ في جلب العملاء:", error);
        selectElement.innerHTML = '<option value="">❌ خطأ في التحميل</option>';
    }
}

// ======================
// 3. دوال جهات الاتصال
// ======================
async function loadContacts() {
    const customerId = document.getElementById('customerSelect').value;
    
    if (!customerId) {
        alert("⚠️ اختر عميل أولاً");
        return;
    }
    
    console.log(`🔄 جاري جلب جهات اتصال العميل: ${customerId}`);
    
    try {
        const { data, error } = await supabase
            .from('customer_contacts')
            .select('*')
            .eq('customer_id', customerId)
            .order('name');
        
        if (error) throw error;
        
        console.log(`📞 عدد جهات الاتصال: ${data.length}`);
        displayContacts(data);
        
    } catch (error) {
        console.error("❌ خطأ في جلب جهات الاتصال:", error);
        alert("خطأ: " + error.message);
    }
}

function displayContacts(contacts) {
    const tableBody = document.getElementById('contactsBody');
    const contactsTable = document.getElementById('contactsTable');
    
    tableBody.innerHTML = '';
    
    if (!contacts || contacts.length === 0) {
        tableBody.innerHTML = `
            <tr>
                <td colspan="4" style="text-align:center; padding:20px;">
                    📭 لا توجد جهات اتصال
                </td>
            </tr>
        `;
    } else {
        contacts.forEach(contact => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${contact.name || 'بدون اسم'}</td>
                <td>${contact.job_description || '-'}</td>
                <td>${contact.mobile_1 || '-'}</td>
                <td>${contact.is_active ? '✅ نشط' : '❌ غير نشط'}</td>
            `;
            tableBody.appendChild(row);
        });
    }
    
    contactsTable.style.display = 'block';
}

async function addCustomer() {
    const name = document.getElementById('hospitalName').value;
    const type = document.getElementById('customerType').value;
    
    if (!name) {
        alert("⚠️ أدخل اسم المستشفى");
        return;
    }
    
    try {
        const { data, error } = await supabase
            .from('customers')
            .insert([{ hospital: name, customer_type: type }])
            .select();
        
        if (error) throw error;
        
        alert(`✅ تم إضافة: ${name}`);
        document.getElementById('hospitalName').value = '';
        
        // تحديث القائمة
        await loadCustomers();
        
    } catch (error) {
        console.error("❌ خطأ في إضافة العميل:", error);
        alert("فشل الإضافة: " + error.message);
    }
}

// ======================
// 4. عند تحميل الصفحة
// ======================
document.addEventListener('DOMContentLoaded', async function() {
    console.log("🚀 الصفحة جاهزة");
    
    // تحميل العملاء مباشرة
    await loadCustomers();
    
    // ربط الأزرار
    document.getElementById('loadContactsBtn').onclick = loadContacts;
    document.getElementById('addCustomerBtn').onclick = addCustomer;
    
    console.log("🎛️ الأزرار جاهزة");
});
