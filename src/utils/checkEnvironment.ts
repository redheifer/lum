import { supabase } from '@/integrations/supabase/client';

export async function checkEnvironment() {
  console.log("Checking environment...");
  
  try {
    // Try a check directly for the user_onboarding table
    const { data, error } = await supabase
      .from('user_onboarding')
      .select('id')
      .limit(1);
    
    if (error) {
      if (error.code === '42P01') {
        console.error("❌ Table 'user_onboarding' doesn't exist in Supabase.");
        console.log("Using local storage for onboarding state.");
      } else {
        console.error("Error connecting to user_onboarding table:", error);
      }
    } else {
      console.log("✅ Connected to Supabase and verified 'user_onboarding' table exists!");
    }
    
  } catch (e) {
    console.error("Failed to check Supabase connection:", e);
  }
} 