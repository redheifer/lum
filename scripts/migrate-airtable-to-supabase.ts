import { createReadStream } from 'fs';
import { parse } from 'csv-parse';
import { supabase } from '../lib/supabase-admin';

async function migrateAirtableToSupabase(csvFilePath: string) {
  console.log('Starting migration from Airtable to Supabase...');
  
  const records: any[] = [];
  
  // Parse CSV file
  const parser = createReadStream(csvFilePath)
    .pipe(parse({
      columns: true,
      skip_empty_lines: true
    }));
  
  for await (const record of parser) {
    // Map Airtable fields to Supabase structure
    const mappedRecord = {
      caller_id: record.Phone || record['Caller ID'],
      campaign_name: record.Campaign,
      duration: parseInt(record.Duration || '0', 10),
      status: mapStatus(record.Status || record.Disposition),
      recording_url: record['Recording URL'],
      transcript: record.Transcript || record.Notes,
      created_at: parseAirtableDate(record['Created At'] || record.Date),
      qa_score: parseInt(record['QA Score'] || '0', 10),
      workspace_id: process.env.DEFAULT_WORKSPACE_ID // Set your default workspace ID
    };
    
    records.push(mappedRecord);
    
    // Insert in batches of 100 to avoid hitting limits
    if (records.length >= 100) {
      await insertBatch(records);
      records.length = 0; // Clear the array
    }
  }
  
  // Insert any remaining records
  if (records.length > 0) {
    await insertBatch(records);
  }
  
  console.log('Migration completed successfully!');
}

async function insertBatch(records: any[]) {
  const { data, error } = await supabase
    .from('calls')
    .insert(records);
  
  if (error) {
    console.error('Error inserting batch:', error);
    throw error;
  }
  
  console.log(`Inserted ${records.length} records successfully`);
}

// Helper function to map Airtable status to your system's status
function mapStatus(airtableStatus: string): string {
  const statusMap: {[key: string]: string} = {
    'answered': 'Completed',
    'completed': 'Completed',
    'no-answer': 'Missed',
    'missed': 'Missed',
    'busy': 'Missed',
    'voicemail': 'Voicemail'
  };
  
  return statusMap[airtableStatus.toLowerCase()] || 'Completed';
}

// Helper function to parse Airtable date format
function parseAirtableDate(dateString: string): string {
  if (!dateString) return new Date().toISOString();
  
  try {
    return new Date(dateString).toISOString();
  } catch (e) {
    return new Date().toISOString();
  }
}

// Run the migration with the path to your CSV file
migrateAirtableToSupabase('./airtable-export.csv')
  .catch(error => {
    console.error('Migration failed:', error);
    process.exit(1);
  }); 