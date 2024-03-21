import { useAppStore } from "./stores/app";

export function setUserFromLocalStorage() {
    const store = useAppStore();
    const user = JSON.parse(localStorage.getItem("user"));

    if (user) {
        store.setUser(user.id, user.email, user.name, user.group, user.token);
    }
}