import { useEffect, useState } from 'react'
import { supabase, isSupabaseConfigured } from '../../lib/supabase'

interface TestResult {
  name: string
  status: 'PENDING' | 'SUCCESS' | 'FAILED'
  message?: string
  details?: any
}

export default function AdminDiagnostic() {
  const [results, setResults] = useState<TestResult[]>([])
  const [sessionInfo, setSessionInfo] = useState<any>(null)
  const [envInfo, setEnvInfo] = useState<any>(null)

  useEffect(() => {
    const run = async () => {
      const envResults: TestResult[] = []

      // Env checks
      const url = import.meta.env.VITE_SUPABASE_URL as string
      const key = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as string
      const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string

      setEnvInfo({
        url: url || 'MISSING',
        urlPresent: !!url,
        publishableKeyPresent: !!key,
        anonKeyPresent: !!anonKey,
        keyLength: key ? key.length : 0,
      })

      envResults.push({
        name: 'VITE_SUPABASE_URL present',
        status: url ? 'SUCCESS' : 'FAILED',
        message: url ? `YES — ${url}` : 'NO — Missing, check Vercel env vars',
      })

      envResults.push({
        name: 'VITE_SUPABASE_PUBLISHABLE_KEY present',
        status: key || anonKey ? 'SUCCESS' : 'FAILED',
        message: key || anonKey ? `YES — length ${key?.length || anonKey?.length}` : 'NO — Missing, check Vercel env vars (must be prefixed VITE_)',
      })

      envResults.push({
        name: 'Supabase client created',
        status: isSupabaseConfigured() ? 'SUCCESS' : 'FAILED',
        message: isSupabaseConfigured() ? 'YES' : 'NO — client has empty URL/key',
      })

      setResults([...envResults])

      // Session check
      try {
        const { data: { session }, error: sessionError } = await supabase.auth.getSession()
        if (sessionError) throw sessionError

        setSessionInfo({
          sessionExists: !!session,
          userId: session?.user?.id || 'NO',
          email: session?.user?.email || 'NO',
        })

        envResults.push({
          name: 'supabase.auth.getSession()',
          status: session ? 'SUCCESS' : 'FAILED',
          message: session ? `SESSION EXISTS — User ID: ${session.user.id}, Email: ${session.user.email}` : 'NO SESSION — not logged in',
        })
        setResults([...envResults])

        // Public reads (no auth needed)
        const publicTests = [
          { table: 'categories', name: 'Public SELECT categories' },
          { table: 'collections', name: 'Public SELECT collections' },
          { table: 'products', name: 'Public SELECT products' },
          { table: 'product_images', name: 'Public SELECT product_images' },
          { table: 'product_variants', name: 'Public SELECT product_variants' },
        ]

        for (const test of publicTests) {
          try {
            const { data, error, count } = await supabase.from(test.table).select('*', { count: 'exact' }).limit(1)
            if (error) throw error
            envResults.push({
              name: test.name,
              status: 'SUCCESS',
              message: `SUCCESS — count: ${count}, sample: ${data?.length} rows`,
            })
          } catch (err: any) {
            envResults.push({
              name: test.name,
              status: 'FAILED',
              message: `FAILED — ${err.message}`,
              details: err,
            })
          }
          setResults([...envResults])
        }

        // Admin-specific checks (requires auth)
        if (session?.user) {
          try {
            const { data: adminData, error: adminError } = await supabase
              .from('admin_users')
              .select('*')
              .eq('user_id', session.user.id)
              .maybeSingle()

            if (adminError) throw adminError

            envResults.push({
              name: 'admin_users lookup for current user',
              status: adminData ? 'SUCCESS' : 'FAILED',
              message: adminData ? `ADMIN ROW FOUND — user_id: ${adminData.user_id}` : 'ADMIN ROW NOT FOUND — not in admin_users, insert required',
              details: adminData,
            })
          } catch (err: any) {
            envResults.push({
              name: 'admin_users lookup for current user',
              status: 'FAILED',
              message: `FAILED — code: ${err.code}, message: ${err.message}, details: ${err.details}, hint: ${err.hint}`,
              details: err,
            })
          }
          setResults([...envResults])

          // Test is_admin() via RPC
          try {
            const { data: isAdminData, error: isAdminError } = await supabase.rpc('is_admin')
            if (isAdminError) throw isAdminError
            envResults.push({
              name: 'RPC is_admin()',
              status: isAdminData ? 'SUCCESS' : 'FAILED',
              message: `Result: ${isAdminData} — ${isAdminData ? 'User IS admin' : 'User NOT admin'}`,
              details: isAdminData,
            })
          } catch (err: any) {
            envResults.push({
              name: 'RPC is_admin()',
              status: 'FAILED',
              message: `FAILED — ${err.message} (function may not exist or not granted)`,
              details: err,
            })
          }
          setResults([...envResults])

          // Test admin write with safe disposable product
          const testId = `test-diag-${Date.now().toString().slice(-6)}`
          try {
            const { data: insertData, error: insertError } = await supabase
              .from('products')
              .insert({
                id: testId,
                slug: testId,
                name: 'Diagnostic Test Product',
                price: 1,
                category_id: 'accessories',
                collection_id: 'atelier-archive',
                featured: false,
                is_new: false,
                details: [],
                sizes: ['One size'],
                colors: [{ name: 'Test', hex: '#000000' }],
              })
              .select()
              .single()

            if (insertError) throw insertError

            envResults.push({
              name: 'Admin INSERT products (test)',
              status: 'SUCCESS',
              message: `SUCCESS — inserted ${testId}`,
              details: insertData,
            })

            // Try update
            const { error: updateError } = await supabase.from('products').update({ name: 'Diagnostic Test Product Updated' }).eq('id', testId)
            if (updateError) throw updateError
            envResults.push({
              name: 'Admin UPDATE products (test)',
              status: 'SUCCESS',
              message: 'SUCCESS — updated test product',
            })

            // Try delete
            const { error: deleteError } = await supabase.from('products').delete().eq('id', testId)
            if (deleteError) throw deleteError
            envResults.push({
              name: 'Admin DELETE products (test)',
              status: 'SUCCESS',
              message: 'SUCCESS — deleted test product',
            })
          } catch (err: any) {
            envResults.push({
              name: 'Admin WRITE products (test)',
              status: 'FAILED',
              message: `FAILED — code: ${err.code}, message: ${err.message}, details: ${err.details}, hint: ${err.hint}`,
              details: err,
            })
            // Cleanup if insert succeeded but later failed
            try {
              await supabase.from('products').delete().eq('id', testId)
            } catch {}
          }
          setResults([...envResults])
        }
      } catch (err: any) {
        envResults.push({
          name: 'Diagnostic runtime',
          status: 'FAILED',
          message: `FAILED — ${err.message}`,
          details: err,
        })
        setResults([...envResults])
      }
    }

    run()
  }, [])

  return (
    <div className="flex flex-col gap-8 max-w-[900px]">
      <div>
        <span className="eyebrow mb-2 block">— Admin Diagnostic</span>
        <h1 className="font-display text-3xl tracking-ultra-tight">Supabase Connection Diagnostic</h1>
        <p className="mt-3 text-[12px] text-muted">Real runtime checks in browser — verifies env vars, session, RLS, CRUD. No secrets exposed.</p>
      </div>

      {envInfo && (
        <div className="border border-line p-4 bg-cream">
          <span className="eyebrow mb-3 block">Environment</span>
          <div className="text-[11px] font-mono leading-relaxed">
            <div>SUPABASE URL PRESENT: {envInfo.urlPresent ? 'YES' : 'NO'}</div>
            <div>SUPABASE KEY PRESENT: {envInfo.publishableKeyPresent || envInfo.anonKeyPresent ? 'YES' : 'NO'}</div>
            <div>URL: {envInfo.urlPresent ? envInfo.url : 'MISSING'}</div>
            <div>KEY LENGTH: {envInfo.keyLength || (envInfo.anonKeyPresent ? 'anon present' : '0')}</div>
            <div className="mt-2 text-muted">Vite only exposes VITE_ prefixed vars at build time. Vercel env vars must be VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY (or VITE_SUPABASE_ANON_KEY) and set for Production, then redeploy.</div>
          </div>
        </div>
      )}

      {sessionInfo && (
        <div className="border border-line p-4 bg-cream">
          <span className="eyebrow mb-3 block">Session</span>
          <div className="text-[11px] font-mono">
            <div>SESSION EXISTS: {sessionInfo.sessionExists ? 'YES' : 'NO'}</div>
            <div>USER ID EXISTS: {sessionInfo.userId !== 'NO' ? 'YES' : 'NO'} — {sessionInfo.userId}</div>
            <div>USER EMAIL EXISTS: {sessionInfo.email !== 'NO' ? 'YES' : 'NO'} — {sessionInfo.email}</div>
          </div>
        </div>
      )}

      <div className="flex flex-col gap-3">
        {results.map((r, i) => (
          <div key={i} className={`border p-4 ${r.status === 'SUCCESS' ? 'border-green-700/30 bg-green-700/5' : r.status === 'FAILED' ? 'border-ochre/30 bg-ochre/10' : 'border-line bg-cream'}`}>
            <div className="flex justify-between gap-4">
              <span className="text-[12px] font-medium uppercase tracking-wide-lg">{r.name}</span>
              <span className={`text-[11px] uppercase px-2 py-1 ${r.status === 'SUCCESS' ? 'bg-green-700 text-paper' : r.status === 'FAILED' ? 'bg-ochre text-paper' : 'bg-line'}`}>{r.status}</span>
            </div>
            {r.message && <p className="mt-2 text-[11px] leading-relaxed break-words whitespace-pre-wrap">{r.message}</p>}
            {r.details && (
              <pre className="mt-2 text-[10px] bg-paper border border-line p-2 overflow-auto max-h-[120px]">{JSON.stringify(r.details, null, 2)}</pre>
            )}
          </div>
        ))}
      </div>

      <div className="border-t border-line pt-6 text-[11px] text-muted leading-relaxed">
        <p>— Deployed commit: Check Vercel deployment details or add VITE_COMMIT env var</p>
        <p>— Expected commit: 25f4adb (fix/admin-supabase-connection) + 004_fix_admin_rls.sql</p>
        <p>— If env vars missing: Add VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY in Vercel → Settings → Environment Variables for Production, then redeploy</p>
        <p>— If admin_users lookup fails: Ensure migration 004 ran, and your auth user ID exists in admin_users via SQL: insert into admin_users (user_id, email) values ('&lt;uuid&gt;', 'email');</p>
        <p>— If is_admin() RPC fails: Function may not exist or not granted — check 003 and 004 migrations</p>
        <p>— If INSERT fails with RLS: Check policies use is_admin() security definer, not self-referential EXISTS</p>
      </div>
    </div>
  )
}
