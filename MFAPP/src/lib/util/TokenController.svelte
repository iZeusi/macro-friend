<script context="module">

    let currentAccessToken;
    let currentCSRFToken;
    export const setAccessToken = (newToken) => {
        currentAccessToken = newToken;
    }

    export const getAccessToken = () => {
        return currentAccessToken;
    }

    export const validateAccessToken = async () => {
        try {
            const res = await fetch('http://localhost:4000/api/auth/access', {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${currentAccessToken}`,
                    'X-CSRF-Token': currentCSRFToken
                }
            });
            return res.status === 200;

        } catch (error) {
            return false;
        }
    };

    export const validateCSRFToken = async () => {
        try {
            const res = await fetch('http://localhost:4000/api/auth/csrf', {
               method: 'GET',
               headers: {
                   'X-CSRF-Token': currentCSRFToken
               }
            });

            return res.status === 200;
        } catch (error) {
            return false;
        }
    }

    export const setCSRFToken = (newToken) => {
        currentCSRFToken = newToken;
    }

    export const getCSRFToken = () => {
        return currentCSRFToken;
    }

    export const getTokensFromCookies = () => {
        const cookies = document.cookie.split(';');
        for (const cookie of cookies) {
            const [name, value] = cookie.split('=');
            if (name.trim() === 'jwt') {
                currentAccessToken = value.trim();
            }
            if (name.trim() === 'csrf') {
                currentCSRFToken = value.trim();
            }
        }
    }

</script>