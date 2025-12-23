import { dataAccessSupabaseDatabase } from './data-access-supabase-database';

describe('dataAccessSupabaseDatabase', () => {
  it('should work', () => {
    expect(dataAccessSupabaseDatabase()).toEqual(
      'data-access-supabase-database',
    );
  });
});
