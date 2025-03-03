# QA Webhook API Endpoint

This API endpoint receives webhook data from external call tracking systems and stores it in the Supabase database.

## Endpoint URL

```
POST /api/webhook/qa
GET /api/webhook/qa
```

## Authentication

The endpoint requires an API key for authentication. You can provide the API key in one of two ways:

1. As a header: `x-api-key: your-api-key`
2. As a query parameter: `?api_key=your-api-key`

## Request Methods

The endpoint supports both POST and GET methods:

- **POST**: Send data as JSON in the request body
- **GET**: Send data as query parameters in the URL

## Required Parameters

At minimum, you must provide one of the following:

- `inbound_call_id`: The unique identifier for the call
- `call_uuid`: Alternative identifier for the call

## Optional Parameters

The following parameters are optional:

- `campaign_id`: Campaign identifier
- `campaign` or `campaign_name`: Name of the campaign
- `platform`: Platform where the call originated (defaults to "Web")
- `call_date` or `call_start_time`: Date and time of the call (ISO format)
- `caller_id`: Phone number of the caller
- `customer`: Customer name
- `end_call_source` or `hung_up_by`: Who ended the call
- `publisher` or `publisher_company`: Publisher name
- `target` or `buyer_name`: Target/agent name
- `duration` or `call_duration`: Call duration in seconds
- `revenue`: Revenue amount
- `payout`: Payout amount
- `recording` or `call_recording_url`: URL to the call recording
- `transcript`: Call transcript
- `status`: Call status (defaults to "Completed")
- `qa_score` or `rating`: QA score (0-100, random if not provided)
- `tags`: Array of tags
- `ai_analysis`: AI analysis of the call

## Response Format

The endpoint returns a JSON response with the following structure:

```json
{
  "success": true|false,
  "message": "Description of the result",
  "call_id": "UUID of the created call record (on success)",
  "error": "Error message (on failure)"
}
```

## Status Codes

- `200 OK`: Request successful
- `400 Bad Request`: Missing required fields
- `401 Unauthorized`: Invalid or missing API key
- `405 Method Not Allowed`: Unsupported HTTP method
- `500 Internal Server Error`: Server-side error

## Examples

### Example POST Request

```bash
curl -X POST https://yourdomain.com/api/webhook/qa \
  -H "Content-Type: application/json" \
  -H "x-api-key: your-api-key" \
  -d '{
    "inbound_call_id": "call-12345",
    "call_date": "2023-06-15T12:00:00Z",
    "caller_id": "+15551234567",
    "end_call_source": "Customer",
    "publisher": "Google",
    "campaign": "Summer Campaign",
    "target": "John Smith",
    "duration": "120",
    "revenue": "75.00",
    "payout": "25.00",
    "recording": "https://example.com/recording.mp3"
  }'
```

### Example GET Request

```
https://yourdomain.com/api/webhook/qa?api_key=your-api-key&inbound_call_id=call-12345&call_date=2023-06-15T12:00:00Z&caller_id=+15551234567&end_call_source=Customer&publisher=Google&campaign=Summer%20Campaign&target=John%20Smith&duration=120&revenue=75.00&payout=25.00&recording=https://example.com/recording.mp3
```

## Testing with Postman

1. Create a new request in Postman
2. Set the request type to POST or GET
3. Enter the endpoint URL
4. Add the API key as a header or query parameter
5. For POST requests, add the JSON payload in the Body tab (raw, JSON)
6. For GET requests, add the parameters in the Params tab
7. Send the request and check the response

## Security Considerations

- In production, use a strong, randomly generated API key
- Store the API key in environment variables
- Consider implementing rate limiting
- Use HTTPS for all requests
- Consider implementing webhook signature validation for additional security 