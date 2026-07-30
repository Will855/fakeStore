import { NextResponse } from 'next/server';
import { fetchCurrentBCVRate } from '@/lib/bcvRate';

export async function GET(request) {
  // Validar Token Bearer opcional para Vercel Cron
  const authHeader = request.headers.get('authorization');
  if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Acceso no autorizado' }, { status: 401 });
  }

  try {
    const rate = await fetchCurrentBCVRate();
    
    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      bcvRate: rate,
      message: 'Tasa BCV revalidada con éxito.'
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
