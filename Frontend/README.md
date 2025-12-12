# La Reserve - Restaurant Table Booking System
## Complete HTML, Bootstrap 5 & jQuery Implementation

This is a fully functional restaurant table booking system built with **HTML5**, **Bootstrap 5**, and **jQuery**. The system includes admin management, customer booking flow, and payment processing.

---

## 📁 Project Structure

```
/public/
├── index.html                      # Login page (entry point)
├── styles.css                      # Global styles & custom CSS
│
├── Admin Pages
│   ├── admin-dashboard.html        # Admin dashboard with stats
│   ├── admin-tables.html           # Table categories view
│   ├── admin-table-category.html   # Individual table management
│   ├── admin-bookings.html         # Bookings management
│   ├── admin-history.html          # Calendar & booking history
│   ├── admin-resort-message.html   # Resort closure message editor
│   └── table-category.js           # Table management logic
│
└── Customer Pages
    ├── customer-booking.html       # Booking form
    ├── customer-payment.html       # Payment page
    └── customer-confirmation.html  # Booking confirmation
```

---

## 🎨 Features

### 🔐 Login System (index.html)
- **3 User Types**: Admin, Staff, Customer
- **Elegant Design**: Blurred background with gradient overlay
- **Dynamic Resort Message**: Displays closure notices from admin
- **Responsive**: Works on all devices

### 👨‍💼 Admin Panel

#### Dashboard (admin-dashboard.html)
- **Statistics Cards**:
  - Total Tables
  - Today's Bookings
  - Upcoming Bookings
  - Tables Under Maintenance
- **Quick Actions**: Links to main sections
- **Sidebar Navigation**: Persistent across all admin pages

#### Tables Management (admin-tables.html, admin-table-category.html)
- **4 Categories**:
  - 💑 Date Table (2 seats)
  - 👨‍👩‍👧‍👦 Birthday Table (4 seats)
  - 💼 Party Table (15 seats)
  - ✨ Celebration Table (varies)
- **5 Tables per Category**
- **Status Management**:
  - Available (Green)
  - Booked (Red)
  - Under Maintenance (Orange)
- **Side Panel Editor**: Click any table to edit

#### Bookings (admin-bookings.html)
- **Tabbed View**:
  - Today's Bookings
  - Future Bookings
- **Data Table** with customer details
- **Summary Cards**: Confirmed, Pending, Cancelled counts

#### History (admin-history.html)
- **Interactive Calendar**: Full month view
- **Date Selection**: Click to view bookings
- **Booking Details**: Shows all bookings for selected date

#### Resort Message (admin-resort-message.html)
- **Text Editor** for closure messages
- **Live Preview**: See how message will appear
- **Character Counter**
- **Saves to localStorage**: Appears on login page

### 👥 Customer Booking Flow

#### Booking Page (customer-booking.html)
1. **Booking Type Selection**
   - Visual cards with icons
   - Default seating capacity
   - Editable guest count

2. **Date Picker**
   - Minimum date: today
   - Calendar input

3. **Time Slots**
   - Morning: 10 AM - 12 PM (2 slots)
   - Afternoon: 12 PM - 3 PM (3 slots)
   - Evening: 6 PM - 9 PM (3 slots)
   - Pill-style buttons

4. **Customer Details**
   - Full Name (required)
   - Mobile Number (10 digits, numeric only)
   - WhatsApp Number (10 digits, numeric only)
   - Real-time validation

#### Payment Page (customer-payment.html)
- **Booking Summary Sidebar**
  - All booking details
  - Amount breakdown
  - GST calculation (18%)
  - Total amount

- **Payment Methods**:
  1. **UPI**: Google Pay, PhonePe, Paytm
  2. **Debit Card**: Card details form
  3. **Credit Card**: Card details form
  4. **Net Banking**: Bank selection dropdown

- **Dynamic Forms**: Changes based on payment method
- **Processing Animation**: 2-second simulation
- **Data Persistence**: Saves to localStorage

#### Confirmation Page (customer-confirmation.html)
- **Success Animation**: Green checkmark
- **Booking Details Display**:
  - Booking ID
  - Type, Date, Time
  - Guest count
- **Info Alert**: Arrival instructions
- **Return to Home** button

---

## 🎨 Design System

### Color Palette
```css
--gold: #D4AF37          /* Primary accent */
--dark-green: #1B4332    /* Primary dark */
--light-green: #2D6A4F   /* Secondary */
--beige: #F5E6D3         /* Light background */
--cream: #FAF3E0         /* Lightest background */
```

### Components
- **Cards**: Rounded (1rem), shadow on hover
- **Buttons**: Gradient (gold to dark-green)
- **Forms**: Consistent padding, focus states
- **Icons**: Bootstrap Icons library
- **Typography**: Inter/Segoe UI font stack

---

## 💾 Data Management

### localStorage Keys
```javascript
// User session
'userType'           // 'admin', 'staff', or 'customer'

// Admin data
'tables'             // Array of table objects
'bookings'           // Array of booking objects
'resortMessage'      // String for closure message

// Customer flow
'currentBooking'     // Current booking in progress
'lastBooking'        // Last confirmed booking
```

### Data Structures

**Table Object**:
```javascript
{
  id: 'date-1',
  name: 'D1',
  status: 'available', // 'available' | 'booked' | 'maintenance'
  category: 'date'     // 'date' | 'birthday' | 'party' | 'celebration'
}
```

**Booking Object**:
```javascript
{
  id: '1',
  customerName: 'John Smith',
  tableCategory: 'date',
  tableNumber: 'D2',
  date: '2024-12-09',
  time: '19:00',
  status: 'confirmed'  // 'confirmed' | 'pending' | 'cancelled'
}
```

---

## 🚀 How to Use

### 1. Open the Application
```
Open index.html in your web browser
```

### 2. Login as Admin
- Select "Admin" tab
- Enter any email/password
- Click "Sign In"
- **Default redirect**: admin-dashboard.html

### 3. Login as Customer
- Select "Customer" tab
- Enter any email/password
- Click "Sign In"
- **Default redirect**: customer-booking.html

### 4. Manage Tables (Admin)
1. Go to "Tables" in sidebar
2. Click any category (Date, Birthday, Party, Celebration)
3. Click a table to open side panel
4. Change status
5. Click "Save Changes"

### 5. View Bookings (Admin)
1. Go to "Bookings" in sidebar
2. Switch between "Today's" and "Future" tabs
3. View booking details in table

### 6. Make a Booking (Customer)
1. Select booking type (Date, Family, Meeting, Party)
2. Edit guest count if needed
3. Select date from calendar
4. Choose time slot
5. Fill in customer details
6. Click "Proceed to Payment"
7. Select payment method
8. Fill in payment details
9. Click "Pay Now"
10. See confirmation page

---

## 🔧 Customization

### Change Colors
Edit `/public/styles.css`:
```css
:root {
    --gold: #YOUR_COLOR;
    --dark-green: #YOUR_COLOR;
    /* ... */
}
```

### Add More Tables
Edit `getDefaultTables()` in JavaScript:
```javascript
{ id: 'new-table-1', name: 'NT1', status: 'available', category: 'date' }
```

### Modify Time Slots
Edit in `customer-booking.html`:
```html
<button type="button" class="time-slot" data-time="NEW TIME">NEW TIME</button>
```

### Change Pricing
Edit `displayBookingSummary()` in `customer-payment.html`:
```javascript
const baseRates = { 
  date: 500,    // Change this
  family: 400,  // Change this
  meeting: 350, // Change this
  party: 300    // Change this
};
```

---

## 📱 Responsive Design

- **Mobile**: Single column layout
- **Tablet**: 2-column grid
- **Desktop**: Full multi-column layout
- **Sidebar**: Collapses on mobile

---

## 🔒 Security Notes

⚠️ **Important**: This is a frontend-only demo application.

For production use:
- Add backend API for data persistence
- Implement real authentication
- Add payment gateway integration
- Use HTTPS for secure connections
- Validate all inputs server-side
- Sanitize user data
- Add CSRF protection

---

## 📦 Dependencies

### CDN Links Used
```html
<!-- Bootstrap 5.3.2 -->
<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet">
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js"></script>

<!-- Bootstrap Icons 1.11.1 -->
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.1/font/bootstrap-icons.css">

<!-- jQuery 3.7.1 -->
<script src="https://code.jquery.com/jquery-3.7.1.min.js"></script>
```

---

## ✨ Features Checklist

- [x] Login page with 3 user types
- [x] Admin dashboard with statistics
- [x] Table category selection
- [x] Table status management (Available/Booked/Maintenance)
- [x] Side panel for table editing
- [x] Bookings management with tabs
- [x] Interactive calendar for history
- [x] Resort closure message editor
- [x] Customer booking form with validation
- [x] Payment page with multiple methods
- [x] Booking confirmation page
- [x] localStorage data persistence
- [x] Responsive design
- [x] Modern UI with animations
- [x] Form validation
- [x] Dynamic pricing calculation

---

## 🎯 Page Flow

```
index.html (Login)
    ├─→ Admin Flow
    │   └─→ admin-dashboard.html
    │       ├─→ admin-tables.html
    │       │   └─→ admin-table-category.html
    │       ├─→ admin-bookings.html
    │       ├─→ admin-history.html
    │       └─→ admin-resort-message.html
    │
    └─→ Customer Flow
        └─→ customer-booking.html
            └─→ customer-payment.html
                └─→ customer-confirmation.html
                    └─→ index.html (logout)
```

---

## 🐛 Troubleshooting

**Issue**: Pages redirect to login
- **Solution**: Make sure you're logged in with correct user type

**Issue**: Data not saving
- **Solution**: Check browser localStorage is enabled

**Issue**: Styles not loading
- **Solution**: Ensure `styles.css` is in same directory

**Issue**: Calendar not showing
- **Solution**: Check JavaScript console for errors

---

## 📞 Support

For issues or questions:
1. Check browser console for JavaScript errors
2. Verify all HTML files are in `/public/` directory
3. Ensure CDN links are accessible
4. Clear browser cache and localStorage
5. Test in different browsers

---

## 📄 License

This is a demo project for educational purposes.

---

## 🙏 Credits

- **Framework**: Bootstrap 5
- **Icons**: Bootstrap Icons
- **JavaScript**: jQuery 3
- **Design**: Custom CSS with CSS Variables

---

**Built with ❤️ for restaurant booking management**
