// @ts-ignore
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.0'

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// @ts-ignore: Deno is a global
Deno.serve(async (req: Request) => {
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders })
    }

    try {
        console.log("Function invoked - REAL MODE");

        // @ts-ignore: Deno is a global
        const supabaseUrl = Deno.env.get('SUPABASE_URL')
        // @ts-ignore: Deno is a global
        const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')

        if (!supabaseUrl || !supabaseServiceKey) {
            return new Response(JSON.stringify({
                success: false,
                error: 'Server Misconfiguration: Missing Service Role Key'
            }), {
                headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                status: 200,
            })
        }

        const supabaseClient = createClient(supabaseUrl, supabaseServiceKey)

        let body;
        try {
            body = await req.json();
        } catch (e) {
            return new Response(JSON.stringify({ success: false, error: 'Invalid JSON body' }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 });
        }

        const { userId } = body;

        if (!userId) {
            return new Response(JSON.stringify({ success: false, error: 'Missing userId' }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 });
        }

        console.log(`Deleting user: ${userId}`);

        // 1. DELETE FROM AUTH
        const { error: authError } = await supabaseClient.auth.admin.deleteUser(userId)

        if (authError) {
            console.error('Error Auth:', authError)
            return new Response(JSON.stringify({ success: false, error: `Auth Error: ${authError.message}` }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 });
        }

        // 2. DELETE FROM DB (Explicitly, just in case CASCADE is missing)
        const { error: dbError } = await supabaseClient
            .from('faculty_members')
            .delete()
            .eq('id', userId)

        return new Response(JSON.stringify({
            success: true,
            message: 'User deleted successfully'
        }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 200,
        })

    } catch (err) {
        // @ts-ignore
        const errorMessage = err.message || String(err);
        return new Response(JSON.stringify({ success: false, error: `Fatal: ${errorMessage}` }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 });
    }
})
