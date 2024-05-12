import comManager from "~/communicationManager";

export default async function defineNuxtRouteMiddleware(to, from) {
    // Do nothing if page is SSR
    if(!window) return;

    const userData = JSON.parse(window.localStorage.getItem('user'));
    const isAuthenticated = userData && userData.token;

    // Remove localStorage entry of theme mode
    const storedTheme = window.localStorage.getItem('nuxt-color-mode');
    if (storedTheme && storedTheme === 'light') {
        window.localStorage.removeItem('nuxt-color-mode');
        window.localStorage.setItem('nuxt-color-mode', 'dark');
    }

    if (!isAuthenticated && to.path !== '/' && to.path !== '/auth/callback/google') {
        // Redirect to login page if not authenticated
        return navigateTo('/')
    } else if (isAuthenticated && to.path === '/') {
        if (userData.groups.length > 0) {
            // Redirect to home page if authenticated
            return navigateTo('/llista_propostes')
        } else {
            // Redirect to group selection page if user has no groups
            return navigateTo('/escollirGrup')
        }
    } else if (isAuthenticated && to.path === '/escollirGrup' && userData.groups.length > 0) {
        // Redirect to home page if user has groups
        return navigateTo('/llista_propostes')
    } else if (isAuthenticated && to.path === '/admin') {
        const response = await comManager.getUserInfo(userData.token)
        if(response.role_id !== 1) {
            // Redirect to home page if user is not admin
            return navigateTo('/llista_propostes')
        }
    }
}