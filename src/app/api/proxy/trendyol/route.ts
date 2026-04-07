import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { sellerId, apiKey, apiSecret } = body;

    if (!sellerId || !apiKey || !apiSecret) {
      return NextResponse.json({ success: false, error: 'Eksik parametreler' }, { status: 400 });
    }

    // Trendyol Auth: apiKey:apiSecret -> Base64
    const auth = Buffer.from(`${apiKey}:${apiSecret}`).toString('base64');
    const url = `https://api.trendyol.com/sapigw/suppliers/${sellerId}/settlements`;

    const res = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Basic ${auth}`,
        'Content-Type': 'application/json',
        'User-Agent': `${sellerId} - Cekapp`
      },
      cache: 'no-store'
    });

    if (!res.ok) {
      const errorText = await res.text();
      return NextResponse.json({ success: false, error: 'Trendyol API Reddi', detail: errorText }, { status: res.status });
    }

    const data = await res.json();
    
    return NextResponse.json({
      success: true,
      totalPayable: data.totalPayable ?? data.payable ?? 0,
      totalUpcoming: data.totalUpcoming ?? data.upcoming ?? 0
    });

  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}