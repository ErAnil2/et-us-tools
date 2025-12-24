import { NextRequest, NextResponse } from 'next/server';
import { getAllScripts, getScript, saveScript, deleteScript } from '@/lib/firebase';

// Default scripts
const defaultScripts = {
  headerScripts: [
    {
      id: 'gtm-head',
      name: 'Google Tag Manager (Head)',
      enabled: false,
      script: `<!-- Google Tag Manager -->
<script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-XXXXXXX');</script>
<!-- End Google Tag Manager -->`,
      location: 'header' as const
    },
    {
      id: 'ga4',
      name: 'Google Analytics 4',
      enabled: false,
      script: `<!-- Google Analytics 4 -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-XXXXXXXXXX');
</script>`,
      location: 'header' as const
    }
  ],
  bodyScripts: [
    {
      id: 'gtm-body',
      name: 'Google Tag Manager (Body - noscript)',
      enabled: false,
      script: `<!-- Google Tag Manager (noscript) -->
<noscript><iframe src="https://www.googletagmanager.com/ns.html?id=GTM-XXXXXXX"
height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>
<!-- End Google Tag Manager (noscript) -->`,
      location: 'body' as const
    }
  ]
};

// GET - Fetch all scripts
export async function GET() {
  try {
    const firebaseScripts = await getAllScripts();

    // If Firebase has data, use it; otherwise use defaults
    if (firebaseScripts.headerScripts.length > 0 || firebaseScripts.bodyScripts.length > 0) {
      return NextResponse.json(firebaseScripts);
    }

    return NextResponse.json(defaultScripts);
  } catch (error) {
    console.error('Error fetching scripts:', error);
    return NextResponse.json(defaultScripts);
  }
}

// POST - Add or update script
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, name, enabled, script, location } = body;

    if (!id || !location) {
      return NextResponse.json({ error: 'Script ID and location are required' }, { status: 400 });
    }

    if (location !== 'header' && location !== 'body') {
      return NextResponse.json({ error: 'Location must be "header" or "body"' }, { status: 400 });
    }

    const success = await saveScript(id, {
      name: name || id,
      enabled: enabled !== undefined ? enabled : false,
      script: script || '',
      location
    });

    if (success) {
      const savedScript = await getScript(id);
      return NextResponse.json({ success: true, data: savedScript });
    } else {
      return NextResponse.json({ error: 'Failed to save script' }, { status: 500 });
    }
  } catch (error) {
    console.error('Error saving script:', error);
    return NextResponse.json({ error: 'Failed to save script' }, { status: 500 });
  }
}

// DELETE - Remove script
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const scriptId = searchParams.get('id');
    const location = searchParams.get('location');

    if (!scriptId) {
      return NextResponse.json({ error: 'Script ID is required' }, { status: 400 });
    }

    const success = await deleteScript(scriptId);

    if (success) {
      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json({ error: 'Failed to delete script' }, { status: 500 });
    }
  } catch (error) {
    console.error('Error deleting script:', error);
    return NextResponse.json({ error: 'Failed to delete script' }, { status: 500 });
  }
}
