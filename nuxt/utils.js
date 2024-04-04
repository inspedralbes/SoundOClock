import { useAppStore } from "./stores/app";

export function setUserFromLocalStorage() {
    const store = useAppStore();
    const user = JSON.parse(localStorage.getItem("user"));

    if (user) {
        store.setUser(user.id, user.email, user.name, user.group, user.token);
    }
}

export function formatDate(date) {
    const year = date.substring(0, 4);
    const month = date.substring(5, 7);
    const day = date.substring(8, 10);

    return `${day}-${month}-${year}`;
}