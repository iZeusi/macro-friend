<script context="module">
    import {goto} from "$app/navigation";

    export const isLoggedIn = async () => {
        const res = await fetch('http://localhost:4000/api/auth/access', {
            method: "GET",
            credentials: "include",
        });
        if (res.status === 401) await goto('/auth/login');
    }

    export const isLoggedOut = async() => {
        const res = await fetch('http://localhost:4000/api/auth/access', {
            method: "GET",
            credentials: "include"
        });
        if (res.status === 200) await goto('/food');
    }
</script>