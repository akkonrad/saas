import { dataAccessSupabase } from './data-access-supabase';

describe('dataAccessSupabase', () => {
  it('should work', () => {
    expect(dataAccessSupabase()).toEqual('data-access-supabase');
  });
});
