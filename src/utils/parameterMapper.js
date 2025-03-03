/**
 * Maps parameters from incoming webhook to n8n expected format
 * @param {Object} payload - The original webhook payload
 * @param {Array<string>} selectedParameters - Parameters that are selected to be processed
 * @returns {Object} - The mapped payload
 */
function mapParameters(payload, selectedParameters) {
  const mappedPayload = {};
  
  // Copy only the selected parameters to prevent sending unwanted data
  for (const param of selectedParameters) {
    if (payload[param] !== undefined) {
      mappedPayload[param] = payload[param];
    }
  }
  
  // Add any transformation logic here if needed
  // For example, renaming fields to match n8n expectations:
  
  // Map campaign_name to n8n's expected format if needed
  if (mappedPayload.campaign_name) {
    mappedPayload.n8n_campaign_name = mappedPayload.campaign_name;
  }
  
  // Add metadata
  mappedPayload.metadata = {
    processed_at: new Date().toISOString(),
    source: 'lum_webhook_api'
  };
  
  return mappedPayload;
}

module.exports = {
  mapParameters
}; 