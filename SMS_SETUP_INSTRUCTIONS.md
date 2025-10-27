# SMS Alert Setup Instructions

## Overview
The Climate Hub application now includes SMS alert functionality that allows users to send weather alerts directly to phone numbers.

## Current Implementation (Demo Mode)
The current implementation logs SMS details to the console and returns a success response. This is perfect for development and testing.

## Setting Up Twilio for Production

To enable actual SMS sending in production, follow these steps:

### 1. Install Twilio SDK
```bash
cd react_project_1
npm install twilio
```

### 2. Create a Twilio Account
1. Go to [https://www.twilio.com](https://www.twilio.com)
2. Sign up for a free account
3. Verify your phone number
4. Get your credentials from the Twilio Console:
   - Account SID
   - Auth Token
   - Phone Number

### 3. Update Environment Variables
Create or update your `.env` file in the `react_project_1` directory:

```env
TWILIO_ACCOUNT_SID=your_account_sid_here
TWILIO_AUTH_TOKEN=your_auth_token_here
TWILIO_PHONE_NUMBER=your_twilio_phone_number_here
```

### 4. Enable Twilio in Code
Open `routes/smsRoutes.js` and uncomment the Twilio code section (lines 18-33) while commenting out the demo logging section.

### Alternative SMS Services

If you prefer not to use Twilio, here are other options:

#### AWS SNS (Simple Notification Service)
- Pros: Good integration with AWS services
- Cost: $0.00645 per SMS
- Setup: Requires AWS account and credentials

#### Nexmo (Vonage)
- Pros: Global coverage, easy API
- Cost: Varies by country
- Setup: Create account and get API key

#### Firebase Cloud Messaging
- Pros: Free tier available
- Cost: Free for limited usage
- Setup: Requires Google account

## Testing the SMS Feature

### Without Twilio (Demo Mode)
1. Start the backend server
2. Navigate to the Alert page in the Traveller Dashboard
3. Click "Send SMS Alert"
4. Fill in the form and submit
5. Check the server console for logged SMS details

### With Twilio (Production)
1. Complete the setup steps above
2. Use the same testing flow
3. SMS will be sent to the provided phone number
4. Check your Twilio console for delivery status

## API Endpoint

**POST** `/api/sms/send`

### Request Body:
```json
{
  "phone": "+1234567890",
  "message": "Your alert message",
  "alertType": "Severe Weather"
}
```

### Response (Success):
```json
{
  "success": true,
  "message": "SMS sent successfully!",
  "sid": "message_sid"
}
```

### Response (Error):
```json
{
  "success": false,
  "message": "Error description"
}
```

## Features Included

✅ SMS form with phone number validation
✅ Character counter for messages
✅ Alert type selection
✅ Success/error notifications
✅ Interactive UI with animations
✅ Auto-populate message from alert cards
✅ Real-time feedback during sending

## Important Notes

1. **Phone Number Format**: Always use the international format with country code (e.g., +1 for US, +91 for India)
2. **Message Length**: SMS messages are limited to 160 characters for optimal delivery
3. **Testing**: Use Twilio's test credentials for development without charges
4. **Rates**: Check Twilio's pricing before sending large volumes of SMS

## Support

For issues or questions:
- Twilio Support: [https://support.twilio.com](https://support.twilio.com)
- Twilio Documentation: [https://www.twilio.com/docs](https://www.twilio.com/docs)

