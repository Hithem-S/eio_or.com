// ======================
// 1. تهيئة Supabase
// ======================
const supabaseUrl = 'https://pbddasxuabdcbdwbymih.supabase.co';
const supabaseKey = 'sb_publishable_77vLiH4WXqwUxf_nMI4syA_dF8CabA1';
const supabase = window.supabase.createClient(supabaseUrl, supabaseKey);

console.log('✅ تم الاتصال بـ Supabase');

// ======================
// 2. دوال للعمل مع العملاء (Customers)
// ======================

// دالة لجلب جميع العملاء من Supabase
async function loadCustomers() {
    console.log('🔄 جاري جلب العملاء من قاعدة البيانات...');
    
    try {
        const { data, error } = await supabase
            .from('customers')           // اسم الجدول عندك
            .select('id, hospital, customer_type')
            .order('hospital');          // ترتيب حسب الاسم
        
        if (error) {
            console.error('❌ خطأ في جلب العملاء:', error);
            alert('حدث خطأ في جلب البيانات: ' + error.message);
            return [];
        }
        
        console.log(`✅ تم جلب ${data.length} عميل`);
        return data;
        
    } catch (err) {
        console.error('❌ خطأ غير متوقع:', err);
        return [];
    }
}

// دالة لعرض العملاء في القائمة المنسدلة
async function displayCustomersInSelect() {
    const selectElement = document.getElementById('customerSelect');
    
    // مسح الخيارات القديمة
    selectElement.innerHTML = '<option value="">-- اختر عميل --</option>';
    
    // جلب العملاء من Supabase
    const customers = await loadCustomers();
    
    // إضافة كل عميل للقائمة
    customers.forEach(customer => {
        const option = document.createElement('option');
        option.value = customer.id;  // استخدم ID، مش الاسم
        option.textContent = customer.hospital + (customer.customer_type ? ` (${customer.customer_type})` : '');
        selectElement.appendChild(option);
    });
}

// دالة لإضافة عميل جديد إلى Supabase
async function addCustomer() {
    const hospitalName = document.getElementById('hospitalName').value;
    const customerType = document.getElementById('customerType').value;
    
    if (!hospitalName) {
        alert('⚠️ الرجاء إدخال اسم المستشفى/العميل');
        return;
    }
    
    try {
        const { data, error } = await supabase
            .from('customers')
            .insert([
                {
                    hospital: hospitalName,
                    customer_type: customerType
                }
            ])
            .select();  // يرجع البيانات المدخلة
        
        if (error) {
            console.error('❌ خطأ في إضافة العميل:', error);
            alert('فشلت الإضافة: ' + error.message);
            return;
        }
        
        console.log('✅ تم إضافة العميل:', data);
        alert(`✅ تم إضافة العميل: ${hospitalName}`);
        
        // تفريغ الحقل
        document.getElementById('hospitalName').value = '';
        
        // تحديث قائمة العملاء
        await displayCustomersInSelect();
        
    } catch (err) {
        console.error('❌ خطأ غير متوقع:', err);
        alert('حدث خطأ غير متوقع');
    }
}

// ======================
// 3. دوال للعمل مع جهات الاتصال (Customer Contacts)
// ======================

// دالة لجلب جهات اتصال عميل معين
async function loadContacts() {
    const customerId = document.getElementById('customerSelect').value;
    
    if (!customerId) {
        alert('⚠️ الرجاء اختيار عميل أولاً');
        return;
    }
    
    console.log(`🔄 جاري جلب جهات اتصال العميل: ${customerId}`);
    
    try {
        const { data, error } = await supabase
            .from('customer_contacts')    // اسم الجدول عندك
            .select('*')
            .eq('customer_id', customerId)  // البحث بـ customer_id
            .order('name');
        
        if (error) {
            console.error('❌ خطأ في جلب جهات الاتصال:', error);
            alert('حدث خطأ في جلب الجهات: ' + error.message);
            return;
        }
        
        console.log(`✅ تم جلب ${data.length} جهة اتصال`);
        displayContacts(data);
        
    } catch (err) {
        console.error('❌ خطأ غير متوقع:', err);
    }
}

// دالة لعرض جهات الاتصال في الجدول
function displayContacts(contacts) {
    const tableBody = document.getElementById('contactsBody');
    const contactsTable = document.getElementById('contactsTable');
    
    // مسح الجدول القديم
    tableBody.innerHTML = '';
    
    if (!contacts || contacts.length === 0) {
        tableBody.innerHTML = `
            <tr>
                <td colspan="4" style="text-align: center; padding: 20px;">
                    📭 لا توجد جهات اتصال لهذا العميل
                </td>
            </tr>
        `;
        contactsTable.style.display = 'block';
        return;
    }
    
    // إضافة كل جهة اتصال للجدول
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
    
    // إظهار الجدول
    contactsTable.style.display = 'block';
}

// دالة لإضافة جهة اتصال جديدة
async function addContact() {
    // سنضيفها لاحقاً - الآن ركز على العرض
    alert('👷 سنضيف هذه الخاصية في الخطوة القادمة');
}

// ======================
// 4. عند تحميل الصفحة
// ======================
document.addEventListener('DOMContentLoaded', async function() {
    console.log('🚀 الصفحة جاهزة، جاري تحميل العملاء...');
    
    // عرض العملاء عند فتح الصفحة
    await displayCustomersInSelect();
    
    // جعل الأزرار تعمل
    document.getElementById('loadContactsBtn').onclick = loadContacts;
    document.getElementById('addCustomerBtn').onclick = addCustomer;
});
