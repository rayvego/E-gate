# E-gate

# Hackrush 2024: IIT Gandhinagar Gate Entry System - E-Gate

## Problem Statement

The IIT Gandhinagar Gate Entry System currently relies on manual verification, leading to inefficiencies and security vulnerabilities. To address this, Hackrush 2024 aimed to create a web application that streamlines entry processes and enhances security for residents and visitors.

## Features Implemented

### Basic Requirements:

1. **Public Accessibility:** The system is accessible via a website.
2. **User Interfaces:**
   - **Resident Interface:** Residents have a permanent QR Code for streamlined entry.
   - **Visitor Interface:** Visitors can register, generate auto-expiring QR Codes for their visits, and receive notifications upon expiration.
   - **Security Personnel Interface:** Personnel can scan QR Codes, verify details, and receive silent notifications for expired QR Codes.

### Extra Features:

1. **Guest Mode:** One-time visit functionality for quick sign-in.
2. **Visitor Authentication:** Additional layers such as mobile verification for visitor authentication.
3. **Statistics and Visualizations:** Displaying visit frequency through the day for analysis.
   
### Updates May 2024

1. Form client side and server side validation
3. Make routes more consistent - naming, logic
4. Visitor expiry - notification / colored
5. Make proper database again
6. Use moments.js to fix display of time
9. Remove tenure and add exit time/date
10. Error Handling

2. Security - approved under xyz - each security has own password - (update database schema..)
7. Authorization on our own + sessions
8. Cookies


##### UI Updates

1. QR Scanner
2. Security pages showing entries
3. UI for mobile phones (dynamic screen size)
4. React based