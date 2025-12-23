import { dataAccessSupabaseAuth } from './data-access-supabase-auth';

describe('dataAccessSupabaseAuth', () => {
  it('should work', () => {
    expect(dataAccessSupabaseAuth()).toEqual('data-access-supabase-auth');
  });
});
