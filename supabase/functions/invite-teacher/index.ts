// @ts-ignore
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// @ts-ignore: Deno is a global
Deno.serve(async (req: Request) => {
    // Manejo de peticiones preflight (CORS)
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders })
    }

    console.log('--- Nueva petición recibida ---')

    try {
        // @ts-ignore: Deno is a global
        const supabaseUrl = Deno.env.get('SUPABASE_URL')
        // @ts-ignore: Deno is a global
        const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')

        if (!supabaseUrl || !supabaseServiceKey) {
            console.error('ERROR: Faltan variables de entorno SUPABASE_URL o SUPABASE_SERVICE_ROLE_KEY')
            return new Response(JSON.stringify({
                success: false,
                error: 'Error de configuración en el servidor (faltan llaves API).'
            }), {
                headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                status: 200,
            })
        }

        const supabaseClient = createClient(supabaseUrl, supabaseServiceKey)
        const { email, password, name, chair, phone } = await req.json()

        console.log(`Intentando crear usuario: ${email}`)

        // 1. Crear el usuario en Supabase Auth
        const { data: authData, error: authError } = await supabaseClient.auth.admin.createUser({
            email,
            password,
            email_confirm: true,
            user_metadata: { full_name: name, role: 'teacher' }
        })

        if (authError) {
            console.error('Error Auth:', authError.message)
            return new Response(JSON.stringify({ success: false, error: `Error Auth: ${authError.message}` }), {
                headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                status: 200,
            })
        }

        if (!authData?.user) {
            throw new Error('No se pudo obtener la información del usuario creado.')
        }

        // 2. Crear el registro en la tabla 'faculty_members'
        const { error: profileError } = await supabaseClient
            .from('faculty_members')
            .insert([
                {
                    id: authData.user.id,
                    name,
                    email,
                    chair,
                    phone,
                    status: 'Presente'
                }
            ])

        if (profileError) {
            console.error('Error Perfil:', profileError.message)
            // Rollback: borramos el usuario de Auth si el perfil falla
            await supabaseClient.auth.admin.deleteUser(authData.user.id)
            return new Response(JSON.stringify({ success: false, error: `Error Perfil: ${profileError.message}` }), {
                headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                status: 200,
            })
        }

        console.log('Usuario y perfil creados con éxito')
        return new Response(JSON.stringify({
            success: true,
            message: '¡Profesor invitado con éxito!'
        }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 200,
        })

    } catch (err) {
        const error = err as Error
        console.error('Error Fatal:', error.message)
        return new Response(JSON.stringify({ success: false, error: `Error Fatal: ${error.message}` }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 200,
        })
    }
})
