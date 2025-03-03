export const sendQAData = async (qaData) => {
  const { data, error } = await supabase
    .from('QA')
    .insert(qaData);
  
  if (error) throw error;
  return data;
};

export const fetchAllCalls = async () => {
  const { data, error } = await supabase
    .from('QA')
    .select('*')
    .order('callDate', { ascending: false });
  
  if (error) throw error;
  return data;
}; 