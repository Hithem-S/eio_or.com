// ============================================
// نظام إدارة العملاء - إصدار 1.0
// ============================================

console.log("🎯 بدأ تشغيل النظام");

// 1. تهيئة Supabase - مرة واحدة فقط في الملف
const supabaseUrl = 'https://pbddasxuabdcbdwbymih.supabase.co';
const supabaseKey = 'sb_publishable_77vLiH4WXqwUxf_nMI4syA_dF8CabA1';

// ⚠️ هذا هو السطر الوحيد الذي يعرف supabase
const supabase = window.supabase.createClient(supabaseUrl, supabaseKey);
console.log("✅ تم الاتصال بـ Supabase");

// ============================================
// 2. دوال النظام
// ============================================

// دالة لجلب العملاء من قاعدة البيانات
async function loadCustomers() {
    console.log("🔍 جاري جلب العملاء...");
    
    const select = document.getElementById('customerSelect');
    select.innerHTML = '<option value="">⏳ جاري التحميل...</option>';
    
    try {
        const { data, error } = await supabase
            .from('customers')
            .select('id, hospital, customer_type')
            .order('hospital');
        
        if (error) throw error;
        
        select.innerHTML = '<option value="">-- اختر عميل --</option>';
        
        data.forEach(customer => {
            const option = document.createElement('option');
            option.value = customer.id;
            option.textContent = customer.hospital + 
                (customer.customer_type ? ` (${customer.customer_type})` : '');
            select.appendChild(option);
        });
        
        console.log(`✅ تم تحميل ${data.length} عميل`);
        return true;
        
    } catch (error) {
        console.error("❌ فشل جلب العملاء:", error);
        select.innerHTML = '<option value="">❌ خطأ في التحميل</option>';
        return false;
    }
}

// دالة لجلب جهات الاتصال
async function loadContacts() {
    const customerId = document.getElementById('customerSelect').value;
    
    if (!customerId) {
        alert("⚠️ الرجاء اختيار عميل أولاً");
        return;
    }
    
    console.log(`🔍 جاري جلب جهات اتصال العميل: ${customerId}`);
    
    try {
        const { data, error } = await supabase
            .from('customer_contacts')
            .select('*')
            .eq('customer_id', customerId);
        
        if (error) throw error;
        
        displayContacts(data);
        
    } catch (error) {
        console.error("❌ فشل جلب جهات الاتصال:", error);
        alert("خطأ: " + error.message);
    }
}

// دالة لعرض جهات الاتصال
function displayContacts(contacts) {
    const tableBody = document.getElementById('contactsBody');
    const tableDiv = document.getElementById('contactsTable');
    
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
                <td>${contact.name || 'غير معروف'}</td>
                <td>${contact.job_description || '-'}</td>
                <td>${contact.mobile_1 || '-'}</td>
                <td>${contact.is_active ? '✅' : '❌'}</td>
            `;
            tableBody.appendChild(row);
        });
    }
    
    tableDiv.style.display = 'block';
}

// دالة لإضافة عميل جديد
async function addCustomer() {
    const name = document.getElementById('hospitalName').value.trim();
    const type = document.getElementById('customerType').value;
    
    if (!name) {
        alert("⚠️ الرجاء إدخال اسم المستشفى");
        return;
    }
    
    try {
        const { data, error } = await supabase
            .from('customers')
            .insert([{ 
                hospital: name, 
                customer_type: type 
            }]);
        
        if (error) throw error;
        
        alert(`✅ تم إضافة: ${name}`);
        document.getElementById('hospitalName').value = '';
        
        // إعادة تحميل القائمة
        await loadCustomers();
        
    } catch (error) {
        console.error("❌ فشل إضافة العميل:", error);
        alert("فشل الإضافة: " + error.message);
    }
}

// ============================================
// 3. تهيئة النظام عند تحميل الصفحة
// ============================================
document.addEventListener('DOMContentLoaded', async function() {
    console.log("🚀 الصفحة جاهزة للعمل");
    
    // تحميل العملاء مباشرة
    await loadCustomers();
    
    // ربط الأزرار بالدوال
    document.getElementById('loadContactsBtn').onclick = loadContacts;
    document.getElementById('addCustomerBtn').onclick = addCustomer;
    
    console.log("🎛️ النظام جاهز للاستخدام");
});

// ============================================
// 4. لا شيء بعد هذا السطر
// ============================================
