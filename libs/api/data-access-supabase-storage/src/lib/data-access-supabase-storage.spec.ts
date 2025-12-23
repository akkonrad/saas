import { dataAccessSupabaseStorage } from './data-access-supabase-storage';

describe('dataAccessSupabaseStorage', () => {
  it('should work', () => {
    expect(dataAccessSupabaseStorage()).toEqual('data-access-supabase-storage');
  });
});
