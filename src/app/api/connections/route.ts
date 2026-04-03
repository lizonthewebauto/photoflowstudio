import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { data: connections, error } = await supabase
    .from('connected_accounts')
    .select('*')
    .eq('user_id', user.id);

  if (error) {
    console.error('Connections fetch error:', error);
    return NextResponse.json({ error: 'Failed to load connections' }, { status: 500 });
  }
  return NextResponse.json(connections || []);
}
