<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">

        <title inertia>{{ config('app.name', 'Laravel') }}</title>

        <!-- Fonts -->
        <link rel="preconnect" href="https://fonts.bunny.net">
        <link href="https://fonts.bunny.net/css?family=figtree:400,500,600&display=swap" rel="stylesheet" />

        <!-- Scripts -->
        @viteReactRefresh
        @vite('resources/js/main.tsx')
    </head>
    <body class="font-sans antialiased">
        <div id="root"></div>
        <script>
(function() {
    var vitePort = 5174;
    var base = window.location.protocol + '//' + window.location.hostname + ':' + vitePort;
    window.addEventListener('error', function(e) {
        var msg = e.error ? (e.error.message || String(e.error)) : e.message;
        var loc = (e.filename || '').split('/').pop() + ':' + (e.lineno || 0) || '';
        fetch(base + '/__fe-error', {method:'POST', body: JSON.stringify({msg:msg, loc:loc, type:'error'}), headers:{'Content-Type':'application/json'}}).catch(function(){});
    });
    window.addEventListener('unhandledrejection', function(e) {
        var msg = (e.reason && e.reason.message) ? e.reason.message : String(e.reason);
        fetch(base + '/__fe-error', {method:'POST', body: JSON.stringify({msg:msg, loc:'', type:'unhandledrejection'}), headers:{'Content-Type':'application/json'}}).catch(function(){});
    });
})();
</script>
    </body>
</html>
