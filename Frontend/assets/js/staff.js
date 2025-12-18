
$(document).ready(function () {
    // Initialize
    updateDateTime();
    loadStaffInfo();
    generateTablesGrid();
    loadDashboardData();

    // Update time every second
    setInterval(updateDateTime, 1000);

    // Navigation
    $('.nav-link-custom').on('click', function (e) {
        if ($(this).attr('id') === 'logoutBtn') {
            e.preventDefault();
            handleLogout();
            return;
        }

        e.preventDefault();
        const section = $(this).data('section');

        // Update active nav
        $('.nav-link-custom').removeClass('active');
        $(this).addClass('active');

        // Show section
        $('.content-section').removeClass('active');
        $(`#${section}-section`).addClass('active');

        // Update page title
        updatePageTitle(section);
    });

    // Clear Filters
    $('#clearFiltersBtn').on('click', function () {
        $('#filterDate').val('');
        $('#filterStatus').val('all');
        filterBookings();
    });

    // Filter Bookings
    $('#filterDate, #filterStatus').on('change', filterBookings);

    // Mark Complete
    $(document).on('click', '.mark-complete-btn', function () {
        if (!$(this).prop('disabled')) {
            const row = $(this).closest('tr');
            const customerName = row.find('strong').first().text();
            const bookingId = $(this).data('booking-id');

            if (confirm(`Mark booking for ${customerName} as complete?`)) {
                // Update in localStorage
                updateBookingStatus(bookingId, 'completed');

                // Update UI
                row.find('.status-badge')
                    .removeClass('ongoing confirmed upcoming')
                    .addClass('completed')
                    .text('Completed');
                $(this).replaceWith('<span style="color: var(--gray-medium); font-size: 0.875rem;">Completed</span>');

                // Reload dashboard and bookings
                loadDashboardData();
                loadBookingsTable();
            }
        }
    });

    // Logout
    function handleLogout() {
        if (confirm('Are you sure you want to logout?')) {
            localStorage.removeItem('staffUser');
            window.location.href = '../index.html';
        }
    }

    // Functions
    function updateDateTime() {
        const now = new Date();

        // Time
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const seconds = String(now.getSeconds()).padStart(2, '0');
        $('#currentTime').text(`${hours}:${minutes}:${seconds}`);

        // Date
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        $('#currentDate').text(now.toLocaleDateString('en-US', options));
    }

    function loadStaffInfo() {
        const staffUser = localStorage.getItem('staffUser');
        if (staffUser) {
            try {
                const staff = JSON.parse(staffUser);
                $('#staffName').text(staff.name || 'Staff Member');
                $('#staffAvatar').text((staff.name || 'S').charAt(0).toUpperCase());
            } catch (e) {
                console.error('Error loading staff info:', e);
            }
        }
    }

    function updatePageTitle(section) {
        const titles = {
            dashboard: {
                title: 'Dashboard',
                subtitle: 'Welcome back! Here\'s your overview'
            },
            bookings: {
                title: 'Bookings',
                subtitle: 'Manage all restaurant bookings'
            },
            tables: {
                title: 'Tables',
                subtitle: 'View and manage table status'
            }
        };

        $('#pageTitle').text(titles[section].title);
        $('#pageSubtitle').text(titles[section].subtitle);
    }

    function loadDashboardData() {
        // Get bookings from localStorage
        let bookings = getBookings();

        // Get today's date
        const today = new Date();
        const todayStr = today.toISOString().split('T')[0];

        // Filter today's bookings
        const todayBookings = bookings.filter(b => {
            const bookingDate = new Date(b.date).toISOString().split('T')[0];
            return bookingDate === todayStr;
        });

        // Calculate stats
        const totalTables = 24;
        const confirmedToday = todayBookings.filter(b => b.status === 'confirmed' || b.status === 'ongoing').length;
        const availableTables = totalTables - confirmedToday;
        const totalGuests = todayBookings.reduce((sum, b) => sum + (parseInt(b.guests) || 4), 0);

        // Update KPI cards
        $('#totalTables').text(totalTables);
        $('#availableTables').text(availableTables);
        $('#todayBookings').text(todayBookings.length);
        $('#guestsToday').text(totalGuests);

        // Update reservations list
        updateReservationsList(bookings);

        // Update alerts
        updateAlerts(todayBookings);
    }

    function getBookings() {
        try {
            const bookings = JSON.parse(localStorage.getItem('bookings') || '[]');
            if (bookings.length === 0) {
                return getDefaultBookings();
            }
            return bookings;
        } catch (e) {
            return getDefaultBookings();
        }
    }

    function getDefaultBookings() {
        const today = new Date().toISOString().split('T')[0];
        return [
            {
                id: '1',
                customerName: 'John Anderson',
                customerEmail: 'john@example.com',
                tableCategory: 'date',
                tableNumber: 'Table 5',
                date: today,
                time: '13:30',
                guests: '4',
                status: 'ongoing'
            },
            {
                id: '2',
                customerName: 'Sarah Mitchell',
                customerEmail: 'sarah@example.com',
                tableCategory: 'date',
                tableNumber: 'Table 4',
                date: today,
                time: '14:00',
                guests: '2',
                status: 'confirmed'
            },
            {
                id: '3',
                customerName: 'Michael Roberts',
                customerEmail: 'michael@example.com',
                tableCategory: 'party',
                tableNumber: 'Table 8',
                date: today,
                time: '18:30',
                guests: '6',
                status: 'confirmed'
            },
            {
                id: '4',
                customerName: 'Emma Thompson',
                customerEmail: 'emma@example.com',
                tableCategory: 'celebration',
                tableNumber: 'Table 15',
                date: today,
                time: '19:00',
                guests: '4',
                status: 'confirmed'
            },
            {
                id: '5',
                customerName: 'David Wilson',
                customerEmail: 'david@example.com',
                tableCategory: 'date',
                tableNumber: 'Table 2',
                date: new Date(Date.now() - 86400000).toISOString().split('T')[0],
                time: '19:30',
                guests: '2',
                status: 'completed'
            }
        ];
    }

    function updateReservationsList(bookings) {
        const today = new Date().toISOString().split('T')[0];
        const todayBookings = bookings.filter(b => {
            const bookingDate = new Date(b.date).toISOString().split('T')[0];
            return bookingDate === today && (b.status === 'confirmed' || b.status === 'ongoing');
        });

        const html = todayBookings.slice(0, 4).map(b => {
            const statusBadge = b.status === 'ongoing' ? 'ongoing' : 'upcoming';
            const statusText = b.status === 'ongoing' ? 'Ongoing' : 'Upcoming';

            return `
                        <div class="reservation-item">
                            <div class="reservation-info">
                                <h6>${b.customerName}</h6>
                                <p><i class="bi bi-grid-3x3-gap"></i> ${b.tableNumber} • <i class="bi bi-people"></i> ${b.guests || 4} Guests</p>
                            </div>
                            <div class="reservation-meta">
                                <span class="status-badge ${statusBadge}">${statusText}</span>
                                <p style="margin: 0; font-size: 0.875rem; color: var(--gray-medium);">${b.time}</p>
                            </div>
                        </div>
                    `;
        }).join('');

        $('#reservationsList').html(html || '<p class="text-muted text-center py-3">No reservations for today</p>');
    }

    function updateAlerts(todayBookings) {
        const now = new Date();
        const alerts = [];

        todayBookings.forEach(b => {
            const bookingTime = new Date(`${b.date} ${b.time}`);
            const diffMinutes = Math.floor((bookingTime - now) / 60000);

            if (b.status === 'ongoing') {
                alerts.push({
                    table: b.tableNumber,
                    message: `Occupied since ${b.time}`,
                    badge: 'overdue',
                    badgeText: 'Ongoing'
                });
            } else if (diffMinutes > 0 && diffMinutes <= 120) {
                const timeText = diffMinutes < 60 ? `In ${diffMinutes} min` : `In ${Math.floor(diffMinutes / 60)} hours`;
                alerts.push({
                    table: b.tableNumber,
                    message: `Reserved at ${b.time}`,
                    badge: 'soon',
                    badgeText: timeText
                });
            }
        });

        const html = alerts.slice(0, 3).map(a => `
                    <div class="alert-item">
                        <div>
                            <strong>${a.table}</strong>
                            <p class="mb-0" style="font-size: 0.875rem; color: var(--gray-medium);">${a.message}</p>
                        </div>
                        <span class="alert-badge ${a.badge}">${a.badgeText}</span>
                    </div>
                `).join('');

        $('#alertsList').html(html || '<p class="text-muted text-center py-3">No alerts at this time</p>');
    }

    function filterBookings() {
        const dateFilter = $('#filterDate').val();
        const statusFilter = $('#filterStatus').val();

        $('#bookingsTableBody tr').each(function () {
            let show = true;

            if (dateFilter) {
                const bookingDate = $(this).find('td:eq(2)').text();
                const filterDateObj = new Date(dateFilter);
                const filterDateStr = filterDateObj.toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric'
                });

                if (!bookingDate.includes(filterDateStr)) {
                    show = false;
                }
            }

            if (statusFilter !== 'all') {
                const status = $(this).find('.status-badge').text().toLowerCase();
                if (status !== statusFilter) {
                    show = false;
                }
            }

            $(this).toggle(show);
        });
    }

    function generateTablesGrid() {
        const tablesContainer = $('#tablesGrid');
        tablesContainer.empty();

        const tableStatuses = [
            { number: 1, seats: 2, status: 'available', timestamp: null },
            { number: 2, seats: 4, status: 'available', timestamp: null },
            { number: 3, seats: 2, status: 'available', timestamp: null },
            { number: 4, seats: 2, status: 'reserved', timestamp: 'Reserved at 2:00 PM' },
            { number: 5, seats: 4, status: 'occupied', timestamp: 'Occupied since 1:30 PM' },
            { number: 6, seats: 6, status: 'available', timestamp: null },
            { number: 7, seats: 4, status: 'reserved', timestamp: 'Reserved at 6:30 PM' },
            { number: 8, seats: 6, status: 'available', timestamp: null },
            { number: 9, seats: 2, status: 'available', timestamp: null },
            { number: 10, seats: 4, status: 'available', timestamp: null },
            { number: 11, seats: 2, status: 'available', timestamp: null },
            { number: 12, seats: 4, status: 'occupied', timestamp: 'Occupied since 12:30 PM' },
            { number: 13, seats: 6, status: 'available', timestamp: null },
            { number: 14, seats: 2, status: 'available', timestamp: null },
            { number: 15, seats: 4, status: 'reserved', timestamp: 'Reserved at 7:00 PM' },
            { number: 16, seats: 2, status: 'available', timestamp: null },
            { number: 17, seats: 4, status: 'available', timestamp: null },
            { number: 18, seats: 6, status: 'available', timestamp: null },
            { number: 19, seats: 2, status: 'available', timestamp: null },
            { number: 20, seats: 4, status: 'available', timestamp: null },
            { number: 21, seats: 2, status: 'available', timestamp: null },
            { number: 22, seats: 4, status: 'available', timestamp: null },
            { number: 23, seats: 6, status: 'available', timestamp: null },
            { number: 24, seats: 4, status: 'available', timestamp: null }
        ];

        tableStatuses.forEach(table => {
            const statusText = table.status.charAt(0).toUpperCase() + table.status.slice(1);
            const statusIcon = {
                available: 'bi-check-circle',
                occupied: 'bi-person-fill',
                reserved: 'bi-clock-fill'
            }[table.status];

            const card = `
                        <div class="col-lg-3 col-md-4 col-sm-6 mb-3">
                            <div class="table-card ${table.status}">
                                <h4 class="table-number">
                                    <i class="bi bi-grid-3x3-gap"></i>
                                    Table ${table.number}
                                </h4>
                                <p class="table-seats">
                                    <i class="bi bi-people"></i> ${table.seats}-Seater
                                </p>
                                <div class="table-status ${table.status}">
                                    <i class="${statusIcon}"></i> ${statusText}
                                </div>
                                ${table.timestamp ? `<p class="table-timestamp">${table.timestamp}</p>` : ''}
                            </div>
                        </div>
                    `;

            tablesContainer.append(card);
        });
    }

    function updateBookingStatus(bookingId, newStatus) {
        const bookings = getBookings();
        const bookingIndex = bookings.findIndex(b => b.id === bookingId);
        if (bookingIndex !== -1) {
            bookings[bookingIndex].status = newStatus;
            localStorage.setItem('bookings', JSON.stringify(bookings));
        }
    }

    function loadBookingsTable() {
        const bookings = getBookings();
        const tableBody = $('#bookingsTableBody');
        tableBody.empty();

        bookings.forEach(b => {
            const statusBadge = {
                confirmed: 'confirmed',
                ongoing: 'ongoing',
                upcoming: 'upcoming',
                completed: 'completed',
                cancelled: 'cancelled'
            }[b.status];

            const statusText = {
                confirmed: 'Confirmed',
                ongoing: 'Ongoing',
                upcoming: 'Upcoming',
                completed: 'Completed',
                cancelled: 'Cancelled'
            }[b.status];

            const row = `
                        <tr>
                            <td>
                                <strong>${b.customerName}</strong>
                                <br>
                                <small style="color: var(--gray-medium);">${b.customerEmail}</small>
                            </td>
                            <td>${b.tableNumber}</td>
                            <td>${b.date} • ${b.time}</td>
                            <td><i class="bi bi-people"></i> ${b.guests || 4}</td>
                            <td><span class="status-badge ${statusBadge}">${statusText}</span></td>
                            <td>
                                <button class="btn-primary-custom btn-sm-custom mark-complete-btn" ${b.status === 'ongoing' ? 'data-booking-id="' + b.id + '"' : 'disabled'}>
                                    <i class="bi bi-check-lg"></i> Mark Complete
                                </button>
                            </td>
                        </tr>
                    `;

            tableBody.append(row);
        });
    }
});
